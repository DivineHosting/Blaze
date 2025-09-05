import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import path from "path";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Store commands in memory
client.commands = new Collection();

// Load all commands dynamically
async function loadCommands() {
  const commandsPath = path.resolve("./src/commands");
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    if (command.default?.name) {
      client.commands.set(command.default.name, command.default);
      console.log(`✅ Loaded command: ${command.default.name}`);
    }
  }
}

client.once("ready", () => {
  console.log(`🤖 Blaze is online as ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: `in ${client.guilds.cache.size} servers`, type: 0 }],
    status: "online"
  });
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("❌ There was an error executing that command!");
  }
});

await loadCommands(); // load commands before login
client.login(process.env.TOKEN);
