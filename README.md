# Blaze Bot (moderation + music)

## What this project contains
- Dynamic presence: `Playing in X servers | !help`
- Moderation commands: `!kick`, `!ban`, `!unban`, `!clear`
- Music commands (YouTube / Spotify / SoundCloud): `!play`, `!skip`, `!stop`, `!queue`, `!pause`, `!resume`
- Uses `discord.js` v14, `@discordjs/voice` and `play-dl`

## Quick start
1. Install Node.js 18+
2. Unzip this project
3. Run:
   ```bash
   npm install
   cp .env.example .env
   # paste your bot token into .env (DISCORD_TOKEN=...)
   npm start
   ```

Notes:
- For Spotify support, add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to `.env` if you run into resolution issues.
- Invite the bot with the correct intents and the `Message Content Intent` enabled in the Developer Portal.
