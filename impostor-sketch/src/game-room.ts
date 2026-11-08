import { DurableObject } from "cloudflare:workers";

export interface Env {
  GAME_ROOM: DurableObjectNamespace<GameRoom>;
}

interface Player {
  id: string;
  nickname: string;
  tokenHash: string;
  joinedAt: number;
  online: boolean;
}

interface RoomState {
  code: string;
  createdAt: number;
  updatedAt: number;
  phase: "lobby";
  hostId: string | null;
  players: Player[];
}

interface SocketAttachment {
  playerId: string;
}

const CODE_PATTERN = /^[A-HJ-NP-Z2-9]{4}$/;
const NICKNAME_PATTERN = /^[\p{L}\p{N} _.-]{2,16}$/u;

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function makeId(): string {
  return crypto.randomUUID();
}

function makeToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function validNickname(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const nickname = value.trim();

  if (!NICKNAME_PATTERN.test(nickname)) return null;

  return nickname;
}

export class GameRoom extends DurableObject<Env> {
//   private ctx: DurableObjectState;
//   private env: Env;

//   constructor(ctx: DurableObjectState, env: Env) {
//     super(ctx, env);
//     this.ctx = ctx;
//     this.env = env;
//   }

  private async getRoom(): Promise<RoomState | null> {
    return (await this.ctx.storage.get<RoomState>("room")) ?? null;
  }

  private async saveRoom(room: RoomState): Promise<void> {
    room.updatedAt = Date.now();
    await this.ctx.storage.put("room", room);
  }

  private publicRoom(room: RoomState) {
    return {
      code: room.code,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      phase: room.phase,
      hostId: room.hostId,
      players: room.players.map((player) => ({
        id: player.id,
        nickname: player.nickname,
        online: player.online,
        isHost: player.id === room.hostId,
        joinedAt: player.joinedAt
      }))
    };
  }

  private send(ws: WebSocket, message: unknown): void {
    try {
      ws.send(JSON.stringify(message));
    } catch {
      // A socket may close while a broadcast is being sent.
    }
  }

  private broadcast(room: RoomState): void {
    const message = {
      type: "snapshot",
      room: this.publicRoom(room)
    };

    for (const ws of this.ctx.getWebSockets()) {
      this.send(ws, message);
    }
  }

  private chooseHost(room: RoomState): void {
    const onlinePlayers = room.players
      .filter((player) => player.online)
      .sort((a, b) => {
        if (a.joinedAt !== b.joinedAt) {
          return a.joinedAt - b.joinedAt;
        }

        return a.id.localeCompare(b.id);
      });

    room.hostId = onlinePlayers[0]?.id ?? null;
  }

  private async createRoom(request: Request): Promise<Response> {
    const existing = await this.getRoom();

    if (existing) {
      return json({ error: "This room code is already in use." }, 409);
    }

    const body = await request.json<{
      code?: string;
      nickname?: string;
    }>();

    const code = body.code?.toUpperCase() ?? "";
    const nickname = validNickname(body.nickname);

    if (!CODE_PATTERN.test(code)) {
      return json({ error: "Invalid room code." }, 400);
    }

    if (!nickname) {
      return json(
        { error: "Nickname must be 2–16 characters." },
        400
      );
    }

    const token = makeToken();

    const player: Player = {
      id: makeId(),
      nickname,
      tokenHash: await hashToken(token),
      joinedAt: Date.now(),
      online: false
    };

    const room: RoomState = {
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      phase: "lobby",
      hostId: player.id,
      players: [player]
    };

    await this.saveRoom(room);

    return json({
      token,
      playerId: player.id,
      room: this.publicRoom(room)
    });
  }

  private async joinRoom(request: Request): Promise<Response> {
    const room = await this.getRoom();

    if (!room) {
      return json(
        { error: "Room not found, check the code." },
        404
      );
    }

    const body = await request.json<{
      nickname?: string;
      token?: string;
    }>();

    // Existing token: reconnect to the original player identity.
    if (typeof body.token === "string" && body.token.length > 0) {
      const suppliedHash = await hashToken(body.token);

      const existingPlayer = room.players.find(
        (player) => player.tokenHash === suppliedHash
      );

      if (!existingPlayer) {
        return json(
          { error: "Your reconnect session is invalid. Join again." },
          401
        );
      }

      return json({
        token: body.token,
        playerId: existingPlayer.id,
        room: this.publicRoom(room)
      });
    }

    const nickname = validNickname(body.nickname);

    if (!nickname) {
      return json(
        { error: "Nickname must be 2–16 characters." },
        400
      );
    }

    const duplicate = room.players.some(
      (player) =>
        player.nickname.toLocaleLowerCase() ===
        nickname.toLocaleLowerCase()
    );

    if (duplicate) {
      return json(
        { error: "That nickname is already taken in this room." },
        409
      );
    }

    const token = makeToken();

    const player: Player = {
      id: makeId(),
      nickname,
      tokenHash: await hashToken(token),
      joinedAt: Date.now(),
      online: false
    };

    room.players.push(player);

    if (!room.hostId) {
      room.hostId = player.id;
    }

    await this.saveRoom(room);

    return json({
      token,
      playerId: player.id,
      room: this.publicRoom(room)
    });
  }

  private async connectSocket(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return json({ error: "Missing reconnect token." }, 401);
    }

    const room = await this.getRoom();

    if (!room) {
      return json({ error: "Room not found." }, 404);
    }

    const tokenHash = await hashToken(token);

    const player = room.players.find(
      (candidate) => candidate.tokenHash === tokenHash
    );

    if (!player) {
      return json({ error: "Invalid reconnect token." }, 401);
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    server.serializeAttachment({
      playerId: player.id
    } satisfies SocketAttachment);

    this.ctx.acceptWebSocket(server);

    player.online = true;

    if (!room.hostId) {
      this.chooseHost(room);
    }

    await this.saveRoom(room);

    this.send(server, {
      type: "connected",
      playerId: player.id
    });

    this.broadcast(room);

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/create" && request.method === "POST") {
      return this.createRoom(request);
    }

    if (url.pathname === "/join" && request.method === "POST") {
      return this.joinRoom(request);
    }

    if (url.pathname === "/ws" && request.headers.get("Upgrade") === "websocket") {
      return this.connectSocket(request);
    }

    if (url.pathname === "/snapshot" && request.method === "GET") {
      const room = await this.getRoom();

      if (!room) {
        return json({ error: "Room not found." }, 404);
      }

      return json({ room: this.publicRoom(room) });
    }

    return json({ error: "Not found." }, 404);
  }

  async webSocketMessage(
    ws: WebSocket,
    message: string | ArrayBuffer
  ): Promise<void> {
    // Stage 1 only needs a lightweight connection check.
    if (message === "ping") {
      this.send(ws, "pong");
    }
  }

  async webSocketClose(
    ws: WebSocket,
    _code: number,
    _reason: string,
    _wasClean: boolean
  ): Promise<void> {
    const attachment = ws.deserializeAttachment() as
      | SocketAttachment
      | null;

    if (!attachment?.playerId) return;

    const room = await this.getRoom();

    if (!room) return;

    const player = room.players.find(
      (candidate) => candidate.id === attachment.playerId
    );

    if (!player) return;

    // Do not mark a player offline if another socket for that player
    // is still connected.
    // const stillConnected = this.ctx
    //   .getWebSockets()
    //   .some((socket) => {
    //     const data = socket.deserializeAttachment() as
    //       | SocketAttachment
    //       | null;

    //     return data?.playerId === player.id;
    //   });
        const stillConnected = this.ctx
      .getWebSockets()
      .some((socket) => {
        if (socket === ws || socket.readyState !== 1) return false;

        const data = socket.deserializeAttachment() as
          | SocketAttachment
          | null;

        return data?.playerId === player.id;
      });

    if (stillConnected) return;

    player.online = false;

    if (room.hostId === player.id) {
      this.chooseHost(room);
    }

    await this.saveRoom(room);
    this.broadcast(room);
  }

  async webSocketError(
    ws: WebSocket,
    _error: unknown
  ): Promise<void> {
    await this.webSocketClose(ws, 0, "Socket error", false);
  }
}