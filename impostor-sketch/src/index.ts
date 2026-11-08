// import { GameRoom, type Env } from "./game-room";
// import { PAGE } from "./page";

// export { GameRoom };

// const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// function json(data: unknown, status = 200): Response {
//   return Response.json(data, { status });
// }

// function html(): Response {
//   return new Response(PAGE, {
//     headers: {
//       "Content-Type": "text/html; charset=UTF-8",
//       "Cache-Control": "no-store",
//       "X-Content-Type-Options": "nosniff",
//       "Referrer-Policy": "strict-origin-when-cross-origin"
//     }
//   });
// }

// function generateRoomCode(): string {
//   const bytes = new Uint8Array(4);
//   crypto.getRandomValues(bytes);

//   return Array.from(bytes)
//     .map((byte) => ROOM_ALPHABET[byte % ROOM_ALPHABET.length])
//     .join("");
// }

// async function createRoom(
//   request: Request,
//   env: Env
// ): Promise<Response> {
//   let body: { nickname?: string };

//   try {
//     body = await request.json();
//   } catch {
//     return json({ error: "Invalid request body." }, 400);
//   }

//   if (typeof body.nickname !== "string") {
//     return json({ error: "Please enter a nickname." }, 400);
//   }

//   for (let attempt = 0; attempt < 8; attempt++) {
//     const code = generateRoomCode();
//     const id = env.GAME_ROOM.idFromName(code);
//     const stub = env.GAME_ROOM.get(id);

//     const response = await stub.fetch(
//       new Request("https://room.internal/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           code,
//           nickname: body.nickname
//         })
//       })
//     );

//     if (response.status === 409) continue;

//     return response;
//   }

//   return json(
//     { error: "Could not create a room. Please try again." },
//     503
//   );
// }

// async function joinRoom(
//   request: Request,
//   code: string,
//   env: Env
// ): Promise<Response> {
//   const id = env.GAME_ROOM.idFromName(code);
//   const stub = env.GAME_ROOM.get(id);

//   return stub.fetch(
//     new Request("https://room.internal/join", request)
//   );
// }

// async function connectRoom(
//   request: Request,
//   code: string,
//   env: Env
// ): Promise<Response> {
//   const id = env.GAME_ROOM.idFromName(code);
//   const stub = env.GAME_ROOM.get(id);

//   const incomingUrl = new URL(request.url);
//   const internalUrl = new URL("https://room.internal/ws");
//   internalUrl.search = incomingUrl.search;

//   return stub.fetch(new Request(internalUrl, request));
// }

// export default {
//   async fetch(
//     request: Request,
//     env: Env
//   ): Promise<Response> {
//     const url = new URL(request.url);
//     const path = url.pathname;

//     if (request.method === "GET" && path === "/health") {
//       return json({
//         status: "ok",
//         application: "impostor-sketch",
//         stage: 1
//       });
//     }

//     if (request.method === "POST" && path === "/api/rooms") {
//       return createRoom(request, env);
//     }

//     const joinMatch = path.match(
//       /^\/api\/rooms\/([A-HJ-NP-Z2-9]{4})\/join$/i
//     );

//     if (request.method === "POST" && joinMatch) {
//       return joinRoom(request, joinMatch[1].toUpperCase(), env);
//     }

//     const socketMatch = path.match(
//       /^\/ws\/([A-HJ-NP-Z2-9]{4})$/i
//     );

//     if (
//       request.method === "GET" &&
//       socketMatch &&
//       request.headers.get("Upgrade")?.toLowerCase() === "websocket"
//     ) {
//       return connectRoom(request, socketMatch[1].toUpperCase(), env);
//     }

//     if (
//       request.method === "GET" &&
//       (path === "/" || /^\/r\/[A-HJ-NP-Z2-9]{4}$/i.test(path))
//     ) {
//       return html();
//     }

//     return json({ error: "Page not found." }, 404);
//   }
// };

import { GameRoom, type Env } from "./game-room";
import { PAGE } from "./page";

export { GameRoom };

const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function html(): Response {
  return new Response(PAGE, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  });
}

function generateRoomCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((byte) => ROOM_ALPHABET[byte % ROOM_ALPHABET.length])
    .join("");
}

async function createRoom(request: Request, env: Env): Promise<Response> {
  let body: { nickname?: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (typeof body.nickname !== "string") {
    return json({ error: "Please enter a nickname." }, 400);
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateRoomCode();
    const id = env.GAME_ROOM.idFromName(code);
    const stub = env.GAME_ROOM.get(id);

    const response = await stub.fetch(
      new Request("https://room.internal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nickname: body.nickname })
      })
    );

    if (response.status === 409) continue;

    return response;
  }

  return json({ error: "Could not create a room. Please try again." }, 503);
}

async function joinRoom(
  request: Request,
  code: string,
  env: Env
): Promise<Response> {
  const id = env.GAME_ROOM.idFromName(code);
  const stub = env.GAME_ROOM.get(id);

  return stub.fetch(new Request("https://room.internal/join", request));
}

async function connectRoom(
  request: Request,
  code: string,
  env: Env
): Promise<Response> {
  const id = env.GAME_ROOM.idFromName(code);
  const stub = env.GAME_ROOM.get(id);

  const incomingUrl = new URL(request.url);
  const internalUrl = new URL("https://room.internal/ws");
  internalUrl.search = incomingUrl.search;

  return stub.fetch(new Request(internalUrl, request));
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "GET" && path === "/health") {
      return json({ status: "ok", application: "impostor-sketch", stage: 1 });
    }

    if (request.method === "POST" && path === "/api/rooms") {
      return createRoom(request, env);
    }

    const joinMatch = path.match(/^\/api\/rooms\/([A-HJ-NP-Z2-9]{4})\/join$/i);

    if (request.method === "POST" && joinMatch) {
      return joinRoom(request, joinMatch[1].toUpperCase(), env);
    }

    const socketMatch = path.match(/^\/ws\/([A-HJ-NP-Z2-9]{4})$/i);

    if (
      request.method === "GET" &&
      socketMatch &&
      request.headers.get("Upgrade")?.toLowerCase() === "websocket"
    ) {
      return connectRoom(request, socketMatch[1].toUpperCase(), env);
    }

    if (
      request.method === "GET" &&
      (path === "/" || /^\/r\/[A-HJ-NP-Z2-9]{4}$/i.test(path))
    ) {
      return html();
    }

    return json({ error: "Page not found." }, 404);
  }
};