import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';

const PREFIX = process.env.PREFIX || '!';
const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_WHITELIST = (process.env.GUILD_WHITELIST || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

if (!TOKEN) {
  console.error('Missing DISCORD_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Dynamic command loader
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs';
const commandsPath = path.join(__dirname, 'commands');
const walk = (dir) => {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.lstatSync(full).isDirectory()) {
      walk(full);
    } else if (file.endsWith('.js')) {
      const cmd = await import(full);
      if (cmd.name && cmd.execute) client.commands.set(cmd.name, cmd);
    }
  }
};
await walk(commandsPath);

// Simple in-memory music queues handled in src/music/player.js
import { musicManager } from './music/player.js';
client.musicManager = musicManager;

client.once('ready', () => {
  console.log(`🔥 Logged in as ${client.user.tag}`);

  function updatePresence() {
    const count = client.guilds.cache.size;
    client.user.setPresence({
      activities: [{ name: `in ${count} servers | !help`, type: 0 }], // Playing
      status: 'online'
    });
  }

  updatePresence();
  client.on('guildCreate', updatePresence);
  client.on('guildDelete', updatePresence);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  if (GUILD_WHITELIST.length && !GUILD_WHITELIST.includes(message.guild?.id)) {
    return; // Ignore messages from non-whitelisted guilds
  }

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    await message.reply('⚠️ There was an error executing that command.');
  }
});

client.login(TOKEN);
