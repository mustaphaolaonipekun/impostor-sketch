export const PAGE = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#090b1c">
  <title>Impostor Sketch — Mystery Party</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #090b1c;
      --panel: #11152b;
      --panel-2: #191e39;
      --border: #30385f;
      --text: #f4f5ff;
      --muted: #a6adce;
      --cyan: #55e7ff;
      --violet: #a78bfa;
      --coral: #ff8294;
      --green: #63e6a5;
      --red: #ff7185;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(ellipse at 15% 0%, #252052 0, transparent 38%),
        radial-gradient(ellipse at 95% 30%, #102b45 0, transparent 34%),
        var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system,
        BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    button, input { font: inherit; }

    .shell {
      width: min(760px, calc(100% - 32px));
      margin: 0 auto;
      padding: 40px 0 64px;
    }

    .topline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      letter-spacing: -.04em;
      font-size: 19px;
    }

    .brand-mark {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      color: #090b1c;
      background: linear-gradient(135deg, var(--cyan), var(--violet));
      font-weight: 900;
    }

    .eyebrow {
      color: var(--cyan);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .16em;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(34px, 7vw, 56px);
      line-height: 1.02;
      letter-spacing: -.055em;
      margin: 12px 0;
    }

    .gradient {
      background: linear-gradient(90deg, var(--cyan), var(--violet), var(--coral));
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }

    .intro {
      color: var(--muted);
      line-height: 1.65;
      max-width: 570px;
      margin: 0 0 28px;
    }

    .card {
      background: rgba(17, 21, 43, .94);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 22px;
      margin-top: 18px;
      box-shadow: 0 18px 60px rgba(0, 0, 0, .18);
    }

    .card h2 {
      font-size: 17px;
      margin: 0 0 6px;
    }

    .sub {
      font-size: 13px;
      color: var(--muted);
      margin: 0 0 18px;
      line-height: 1.5;
    }

    label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
      margin-bottom: 8px;
    }

    input {
      width: 100%;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: #090d20;
      color: var(--text);
      outline: none;
    }

    input:focus {
      border-color: var(--cyan);
      box-shadow: 0 0 0 3px rgba(85, 231, 255, .12);
    }

    .field { margin-bottom: 15px; }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    button {
      min-height: 46px;
      border: 0;
      border-radius: 12px;
      padding: 11px 16px;
      cursor: pointer;
      font-weight: 800;
      transition: transform .15s ease, opacity .15s ease;
    }

    button:hover { transform: translateY(-1px); }
    button:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .primary {
      color: #080b1c;
      background: linear-gradient(110deg, var(--cyan), #9bdcff);
    }

    .secondary {
      color: var(--text);
      background: var(--panel-2);
      border: 1px solid var(--border);
    }

    .small-button {
      min-height: 34px;
      padding: 7px 11px;
      font-size: 12px;
    }

    .error {
      display: none;
      padding: 12px 14px;
      margin-top: 14px;
      border: 1px solid rgba(255, 113, 133, .45);
      background: rgba(255, 113, 133, .09);
      border-radius: 11px;
      color: #ffb3bf;
      font-size: 13px;
      line-height: 1.5;
    }

    .statusline {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 12px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      background: var(--red);
      flex: 0 0 auto;
    }

    .dot.online { background: var(--green); }
    .dot.waiting { background: #f6c86b; }

    .room-code {
      font-size: clamp(30px, 8vw, 42px);
      font-weight: 900;
      letter-spacing: .2em;
      color: var(--cyan);
      margin: 8px 0;
    }

    .room-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }

    .players {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .player {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 0;
      border-top: 1px solid rgba(166, 173, 206, .13);
    }

    .player:first-child { border-top: 0; }

    .player-main {
      display: flex;
      align-items: center;
      gap: 11px;
      min-width: 0;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      background: #272e54;
      color: var(--cyan);
      font-weight: 900;
    }

    .player-name {
      overflow-wrap: anywhere;
      font-size: 14px;
      font-weight: 700;
    }

    .host {
      display: inline-block;
      margin-left: 7px;
      border: 1px solid rgba(167, 139, 250, .4);
      background: rgba(167, 139, 250, .13);
      color: #c8b8ff;
      padding: 3px 7px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 800;
      vertical-align: 1px;
    }

    .player-status {
      display: flex;
      align-items: center;
      gap: 7px;
      white-space: nowrap;
      color: var(--muted);
      font-size: 11px;
    }

    .share-row {
      display: flex;
      gap: 8px;
      margin-top: 17px;
    }

    .share-row input { min-width: 0; }

    .hidden { display: none !important; }

    .debug {
      margin-top: 16px;
      padding: 14px;
      background: #080b19;
      border: 1px dashed #4d5785;
      border-radius: 12px;
      color: #b6c6ed;
      font: 12px/1.7 ui-monospace, SFMono-Regular, Menlo, monospace;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .footer {
      color: #7e87ac;
      text-align: center;
      font-size: 11px;
      margin-top: 28px;
    }

    @media (max-width: 520px) {
      .shell { padding-top: 24px; }
      .card { padding: 17px; border-radius: 16px; }
      .actions { grid-template-columns: 1fr; }
      .topline { margin-bottom: 25px; }
      .share-row { flex-direction: column; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="topline">
      <div class="brand">
        <div class="brand-mark">I</div>
        <span>IMPOSTOR SKETCH</span>
      </div>
      <div class="statusline">
        <span class="dot" id="connectionDot"></span>
        <span id="connectionText">Not connected</span>
      </div>
    </header>

    <section>
      <div class="eyebrow">A playful mystery party</div>
      <h1>Draw together.<br><span class="gradient">Find the impostor.</span></h1>
      <p class="intro">
        Join your friends in a drawing mystery. One player has a different
        prompt. Can your group figure out who it is?
      </p>
    </section>

    <section id="entryCard" class="card">
      <h2>Enter the lobby</h2>
      <p class="sub">Choose a nickname, then create a room or join your friends.</p>

      <div class="field">
        <label for="nickname">YOUR NICKNAME</label>
        <input id="nickname" maxlength="16" minlength="2"
          autocomplete="nickname" placeholder="e.g. SketchFox">
      </div>

      <div class="field">
        <label for="roomCode">ROOM CODE</label>
        <input id="roomCode" maxlength="4" autocomplete="off"
          autocapitalize="characters" placeholder="ABCD">
      </div>

      <div class="actions">
        <button class="primary" id="createButton">Create a room</button>
        <button class="secondary" id="joinButton">Join a room</button>
      </div>

      <div id="error" class="error" role="alert"></div>
    </section>

    <section id="roomCard" class="card hidden">
      <div class="room-head">
        <div>
          <div class="eyebrow">Your room code</div>
          <div class="room-code" id="displayCode">----</div>
          <div class="statusline">
            <span class="dot waiting" id="roomDot"></span>
            <span id="roomStatus">Connecting to room...</span>
          </div>
        </div>
        <button class="secondary small-button" id="leaveButton">Leave room</button>
      </div>

      <div class="share-row">
        <input id="shareUrl" readonly aria-label="Room share link">
        <button class="secondary small-button" id="copyButton">Copy link</button>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin:25px 0 8px">
        <h2>Players</h2>
        <span class="sub" id="playerCount" style="margin:0">0 players</span>
      </div>

      <ul class="players" id="players"></ul>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px">
        <span class="sub" style="margin:0">Room diagnostics</span>
        <button class="secondary small-button" id="debugToggle">Show debug</button>
      </div>

      <pre class="debug hidden" id="debugPanel"></pre>
      <div id="roomError" class="error" role="alert"></div>
    </section>

    <footer class="footer">
      A Midnight Neon mystery party · Stage 1 lobby preview
    </footer>
  </main>

  <script>
    (() => {
      const $ = (id) => document.getElementById(id);

      const entryCard = $("entryCard");
      const roomCard = $("roomCard");
      const nicknameInput = $("nickname");
      const roomCodeInput = $("roomCode");
      const errorBox = $("error");
      const roomError = $("roomError");
      const playersList = $("players");

      let currentCode = null;
      let currentPlayerId = null;
      let currentToken = null;
      let currentRoom = null;
      let socket = null;
      let reconnectTimer = null;
      let reconnectDelay = 1000;
      let manuallyLeaving = false;

      const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

      function showError(message, target = errorBox) {
        target.textContent = message;
        target.style.display = "block";
      }

      function clearError(target = errorBox) {
        target.textContent = "";
        target.style.display = "none";
      }

      function setConnection(online, message) {
        $("connectionDot").className = online ? "dot online" : "dot";
        $("connectionText").textContent = message;
      }

      function nicknameIsValid(value) {
        const name = value.trim();
        return name.length >= 2 &&
          name.length <= 16 &&
          /^[\p{L}\p{N} _.-]+$/u.test(name);
      }

      function getSavedToken(code) {
        return localStorage.getItem("impostor-token-" + code);
      }

      function saveSession(code, token, nickname) {
        localStorage.setItem("impostor-token-" + code, token);
        localStorage.setItem("impostor-nickname", nickname);
      }

      function clearSession(code) {
        localStorage.removeItem("impostor-token-" + code);
      }

      async function api(path, body) {
        const response = await fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong.");
        }

        return data;
      }

      function renderRoom(room) {
        currentRoom = room;

        $("displayCode").textContent = room.code;
        $("shareUrl").value =
          location.origin + "/r/" + room.code;

        $("playerCount").textContent =
          room.players.length + (room.players.length === 1 ? " player" : " players");

        playersList.replaceChildren();

        for (const player of room.players) {
          const li = document.createElement("li");
          li.className = "player";

          const main = document.createElement("div");
          main.className = "player-main";

          const avatar = document.createElement("div");
          avatar.className = "avatar";
          avatar.textContent = player.nickname.charAt(0).toUpperCase();

          const name = document.createElement("div");
          name.className = "player-name";
          name.textContent = player.nickname;

          if (player.isHost) {
            const badge = document.createElement("span");
            badge.className = "host";
            badge.textContent = "HOST";
            name.appendChild(badge);
          }

          main.append(avatar, name);

          const status = document.createElement("div");
          status.className = "player-status";

          const dot = document.createElement("span");
          dot.className = player.online ? "dot online" : "dot";

          const statusText = document.createElement("span");
          statusText.textContent = player.online ? "Online" : "Offline";

          status.append(dot, statusText);
          li.append(main, status);
          playersList.appendChild(li);
        }

        const me = room.players.find((player) => player.id === currentPlayerId);

        if (me) {
          $("roomStatus").textContent = me.online
            ? "You are connected"
            : "Reconnecting...";
        }

        $("debugPanel").textContent = [
          "Room code: " + room.code,
          "Your player ID: " + (currentPlayerId || "unknown"),
          "Host player ID: " + (room.hostId || "none"),
          "Phase: " + room.phase,
          "Connection: " + (socket && socket.readyState === WebSocket.OPEN
            ? "connected"
            : "disconnected"),
          "",
          "Players:",
          ...room.players.map((p) =>
            p.id + " | " + p.nickname + " | " +
            (p.online ? "online" : "offline") +
            (p.isHost ? " | HOST" : "")
          )
        ].join("\n");
      }

      function connectSocket() {
        if (!currentCode || !currentToken || manuallyLeaving) return;

        if (socket &&
            (socket.readyState === WebSocket.OPEN ||
             socket.readyState === WebSocket.CONNECTING)) {
          return;
        }

        clearTimeout(reconnectTimer);

        const protocol = location.protocol === "https:" ? "wss:" : "ws:";
        const url = protocol + "//" + location.host +
          "/ws/" + currentCode +
          "?token=" + encodeURIComponent(currentToken);

        socket = new WebSocket(url);

        socket.addEventListener("open", () => {
          reconnectDelay = 1000;
          setConnection(true, "Connected");
          $("roomDot").className = "dot online";
          $("roomStatus").textContent = "Connected to room";
        });

        socket.addEventListener("message", (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.type === "snapshot") {
              renderRoom(message.room);
            }

            if (message.type === "connected") {
              currentPlayerId = message.playerId;
            }

            if (message.type === "error") {
              showError(message.error, roomError);
            }
          } catch {
            // Ignore malformed messages.
          }
        });

        socket.addEventListener("close", () => {
          setConnection(false, "Reconnecting");
          $("roomDot").className = "dot";
          $("roomStatus").textContent = "Connection lost. Reconnecting...";

          if (!manuallyLeaving) {
            reconnectTimer = setTimeout(() => {
              connectSocket();
            }, reconnectDelay);

            reconnectDelay = Math.min(reconnectDelay * 2, 10000);
          }
        });

        socket.addEventListener("error", () => {
          setConnection(false, "Connection issue");
        });
      }

      async function enterRoom(code, nickname, token = null) {
        clearError();
        clearError(roomError);

        const data = await api(
          "/api/rooms/" + code + "/join",
          { nickname, token }
        );

        currentCode = code;
        currentPlayerId = data.playerId;
        currentToken = data.token;
        manuallyLeaving = false;

        saveSession(code, data.token, nickname);

        entryCard.classList.add("hidden");
        roomCard.classList.remove("hidden");

        renderRoom(data.room);
        setConnection(false, "Connecting");

        connectSocket();
      }

      $("createButton").addEventListener("click", async () => {
        const nickname = nicknameInput.value.trim();

        if (!nicknameIsValid(nickname)) {
          return showError("Use a nickname with 2–16 letters, numbers, spaces, dots, underscores or hyphens.");
        }

        $("createButton").disabled = true;

        try {
          const data = await api("/api/rooms", { nickname });

          currentCode = data.room.code;
          currentPlayerId = data.playerId;
          currentToken = data.token;
          manuallyLeaving = false;

          saveSession(currentCode, currentToken, nickname);

          entryCard.classList.add("hidden");
          roomCard.classList.remove("hidden");

          renderRoom(data.room);
          setConnection(false, "Connecting");
          connectSocket();
        } catch (error) {
          showError(error.message);
        } finally {
          $("createButton").disabled = false;
        }
      });

      $("joinButton").addEventListener("click", async () => {
        const nickname = nicknameInput.value.trim();
        const code = roomCodeInput.value.trim().toUpperCase();

        if (!nicknameIsValid(nickname)) {
          return showError("Use a nickname with 2–16 valid characters.");
        }

        if (!/^[A-HJ-NP-Z2-9]{4}$/.test(code)) {
          return showError("Enter a valid four-letter room code.");
        }

        $("joinButton").disabled = true;

        try {
          await enterRoom(code, nickname, getSavedToken(code));
        } catch (error) {
          showError(error.message);
        } finally {
          $("joinButton").disabled = false;
        }
      });

      $("copyButton").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText($("shareUrl").value);
          $("copyButton").textContent = "Copied!";
          setTimeout(() => $("copyButton").textContent = "Copy link", 1500);
        } catch {
          $("shareUrl").select();
          showError("Copy was unavailable. Select and copy the link manually.", roomError);
        }
      });

      $("leaveButton").addEventListener("click", () => {
        manuallyLeaving = true;
        clearTimeout(reconnectTimer);

        if (socket) {
          socket.close(1000, "Player left");
        }

        if (currentCode) {
          clearSession(currentCode);
        }

        currentCode = null;
        currentPlayerId = null;
        currentToken = null;
        currentRoom = null;
        socket = null;

        roomCard.classList.add("hidden");
        entryCard.classList.remove("hidden");
        setConnection(false, "Not connected");
      });

      $("debugToggle").addEventListener("click", () => {
        const panel = $("debugPanel");
        panel.classList.toggle("hidden");

        $("debugToggle").textContent =
          panel.classList.contains("hidden") ? "Show debug" : "Hide debug";
      });

      // Share links use /r/ABCD. The room code is prefilled.
      const pathMatch = location.pathname.match(/^\/r\/([A-HJ-NP-Z2-9]{4})$/);

      const queryCode = new URLSearchParams(location.search).get("room");
      const incomingCode = pathMatch ? pathMatch[1] : queryCode;

      if (incomingCode && /^[A-HJ-NP-Z2-9]{4}$/i.test(incomingCode)) {
        roomCodeInput.value = incomingCode.toUpperCase();
      }

      const savedNickname = localStorage.getItem("impostor-nickname");

      if (savedNickname) {
        nicknameInput.value = savedNickname;
      }

      // Reconnect automatically if this browser already owns a room session.
      if (incomingCode) {
        const code = incomingCode.toUpperCase();
        const savedToken = getSavedToken(code);

        if (savedToken && savedNickname) {
          enterRoom(code, savedNickname, savedToken).catch((error) => {
            showError(error.message);
          });
        }
      }
    })();
  </script>
</body>
</html>`;