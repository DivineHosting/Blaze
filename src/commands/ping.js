export default {
  name: "ping",
  description: "Replies with Pong!",
  async execute(message) {
    await message.reply("🏓 Pong!");
  }
};
