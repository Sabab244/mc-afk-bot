import express from "express";
import mineflayer from "mineflayer";

const app = express();
const port = 5000;

let bot = null;
let botStatus = "stopped";

function startBot() {
  if (bot) {
    botStatus = "already running";
    return;
  }

  const config = {
    host: "9644Nahid.aternos.me",
    port: 39992,
    username: "247_bot",
    version: "1.21.1",
    auth: "offline",
  };

  botStatus = "connecting";
  console.log(`Connecting to ${config.host}:${config.port}...`);

  bot = mineflayer.createBot(config);

  bot.on("login", () => {
    botStatus = "online";
    console.log("✅ Bot logged in successfully");
  });

  bot.on("spawn", () => {
    botStatus = "online";
    console.log("✅ Bot spawned in world");
  });

  bot.on("error", (err) => {
    console.error("❌ Bot Error:", err.message);
    botStatus = "error: " + err.message;
    bot = null;
  });

  bot.on("kicked", (reason) => {
    console.log("❌ Kicked:", reason);
    botStatus = "kicked";
    bot = null;
  });

  bot.on("end", () => {
    console.log("🔴 Disconnected. Reconnecting in 5 seconds...");
    botStatus = "reconnecting";
    bot = null;
    setTimeout(startBot, 5000);
  });
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Minecraft Bot</title></head>
      <body style="font-family:sans-serif;text-align:center;margin-top:80px">
        <h1>🤖 Minecraft AFK Bot</h1>
        <p>Status: <strong>${botStatus}</strong></p>
        <a href="/start" style="padding:12px 24px;background:green;color:white;border-radius:6px;text-decoration:none;font-size:18px">▶ Start Bot</a>
        <br/><br/>
        <a href="/stop" style="padding:12px 24px;background:red;color:white;border-radius:6px;text-decoration:none;font-size:18px">⏹ Stop Bot</a>
        <br/><br/>
        <a href="/" style="font-size:14px">🔄 Refresh Status</a>
      </body>
    </html>
  `);
});

app.get("/start", (req, res) => {
  startBot();
  res.redirect("/");
});

app.get("/stop", (req, res) => {
  if (bot) {
    bot.quit();
    bot = null;
    botStatus = "stopped";
  }
  res.redirect("/");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Web preview available at http://0.0.0.0:${port}`);
});
