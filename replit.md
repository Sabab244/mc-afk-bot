# Replit.md

## Overview

This project is a Minecraft AFK bot built using the `aterbot` npm package. It connects to a specified Minecraft server and keeps a bot online, with features like auto-reconnect, auto-login/register, and night skipping. A minimal Express web server runs alongside the bot to keep the Replit process alive and provide a basic health-check page.

The primary purpose is to maintain a persistent presence on a Minecraft server (specifically configured for `chutiasmp.falix.gg`), commonly used to keep chunks loaded or maintain server activity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Project Structure
- **`index.js`** - Entry point. Starts an Express web server on port 5000 and launches the aterbot Minecraft bot.
- **`config.json`** - Configuration for the Minecraft bot (server IP, port, bot name, login credentials, auto-reconnect settings).
- **`package.json`** - Uses ES modules (`"type": "module"`). Minimal dependencies.
- **`launcher_accounts.json`** - Empty JSON file, likely used by the Minecraft authentication layer (msal/Microsoft auth) for caching accounts.

### Runtime Architecture
- **Web Server**: A simple Express server serves a single HTML status page at `/`. Its main purpose is to keep the Replit alive (Replit stops processes without an active web server). Runs on port 5000, bound to `0.0.0.0`.
- **Bot Process**: `aterbot()` is called directly after the server starts. It reads `config.json` for connection details and behavior settings. The bot runs in the same Node.js process as the web server.

### Configuration (`config.json`)
| Field | Purpose |
|---|---|
| `ip` | Minecraft server address |
| `port` | Minecraft server port |
| `name` | Bot's in-game username |
| `auto-reconnect` | Whether the bot reconnects after disconnection |
| `login-enabled` | Whether the bot runs login/register commands on join |
| `register-cmd` | Command sent to register on auth plugins |
| `login-cmd` | Command sent to log in on auth plugins |

### Design Decisions
- **Single process**: Both the web server and bot run in one process for simplicity. No worker threads or separate services.
- **ES Modules**: The project uses `"type": "module"` with `import` syntax rather than CommonJS `require`.
- **Express 5**: Uses Express v5 (currently in beta/latest), though only for a trivial single-route server.
- **No database**: No persistent storage beyond the JSON config files.

## External Dependencies

### NPM Packages
- **`aterbot` (^2.2.1)** - The core Minecraft bot library. Handles connecting to the server, staying online, auto-reconnecting, and executing login commands. Built on top of `mineflayer` (Minecraft protocol library).
- **`express` (^5.2.1)** - Minimal web framework used solely to keep the Replit process alive with an HTTP endpoint.

### Transitive Dependencies (Notable)
- **`@azure/msal-node`** - Microsoft Authentication Library, used for Minecraft account authentication (Microsoft/Xbox Live login flow).
- **`mineflayer`** (via aterbot) - Low-level Minecraft protocol client.
- **`socket.io`** (via aterbot) - Likely used for real-time communication features within aterbot.

### External Services
- **Minecraft Server** (`chutiasmp.falix.gg:25565`) - The target Minecraft server the bot connects to. Configured in `config.json`.
- **Falix Hosting** - The Minecraft server appears to be hosted on Falix, a free Minecraft server hosting platform.
- **Microsoft/Xbox Live Auth** - The presence of `@azure/msal-node` and `launcher_accounts.json` indicates Microsoft account authentication is supported for premium Minecraft accounts, though this bot appears to use offline/cracked mode with a custom login plugin.

### No Database
This project does not use any database. All configuration is stored in `config.json`.