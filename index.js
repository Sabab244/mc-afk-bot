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

const AUTHME_PASSWORD = "Xk9#mQ72vLpZ";

async function startBot() {
  const config = {
    host: "chutiaSMP.aternos.me",
    port: 47465,
    username: "Wrenlock_9",
    version: "1.21.11",
    auth: "offline",
  };
  console.log(
    `Connecting to ${config.host}:${config.port} with version ${config.version}...`,
  );
  const bot = mineflayer.createBot(config);
  let antiAfkInterval = null;

  bot.on("login", () => {
    console.log("✅ Bot logged in successfully");
  });

  bot.on("spawn", () => {
    console.log("✅ Bot spawned in world");

    // Try registering first (harmless if already registered — AuthMe just
    // replies with an error, which we ignore), then log in.
    setTimeout(() => {
      bot.chat(`/register ${AUTHME_PASSWORD} ${AUTHME_PASSWORD}`);
      console.log("🔐 Sent AuthMe register command");
    }, 1000);

    setTimeout(() => {
      bot.chat(`/login ${AUTHME_PASSWORD}`);
      console.log("🔐 Sent AuthMe login command");
    }, 2500);

    // Clear any old interval just in case (e.g. respawn after death)
    if (antiAfkInterval) clearInterval(antiAfkInterval);

    // Jump immediately on spawn
    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 200);

    // Then keep jumping periodically to avoid AFK kick
    antiAfkInterval = setInterval(() => {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 200);
    }, 10000); // every 10 seconds — adjust as needed
  });

  bot.on("error", (err) => {
    console.error("❌ Bot Error:", err.message);
    if (err.message.includes("unsupported/unknown protocol version")) {
      console.log("Trying to fallback to auto-versioning...");
    }
  });

  bot.on("kicked", (reason) => {
    console.log("❌ Kicked from server:", JSON.stringify(reason));
  });

  bot.on("end", () => {
    if (antiAfkInterval) clearInterval(antiAfkInterval);
    console.log("🔴 Connection ended. Reconnecting in 5 seconds...");
    setTimeout(startBot, 5000);
  });
}

startBot();
