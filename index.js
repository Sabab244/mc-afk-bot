import express from "express";
import mineflayer from "mineflayer";

const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send(
    "<h1>Minecraft Bot Status</h1><p>The bot is attempting to connect to 1.21.x server.</p>",
  );
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Web preview available at http://0.0.0.0:${port}`);
});

async function startBot() {
  const config = {
    host: "9644Nahid.aternos.me",
    port: 39992,
    username: "247_bot",
    version: "1.21.11", // Attempting 1.21.1 as it's the most stable 1.21 subversion
    auth: "offline",
  };

  console.log(
    `Connecting to ${config.host}:${config.port} with version ${config.version}...`,
  );

  const bot = mineflayer.createBot(config);

  bot.on("login", () => {
    console.log("✅ Bot logged in successfully");
  });

  bot.on("spawn", () => {
    console.log("✅ Bot spawned in world");
  });

  bot.on("error", (err) => {
    console.error("❌ Bot Error:", err.message);
    if (err.message.includes("unsupported/unknown protocol version")) {
      console.log("Trying to fallback to auto-versioning...");
    }
  });

  bot.on("kicked", (reason) => {
    console.log("❌ Kicked from server:", reason);
  });

  bot.on("end", () => {
    console.log("🔴 Connection ended. Reconnecting in 5 seconds...");
    setTimeout(startBot, 5000);
  });
}

startBot();
