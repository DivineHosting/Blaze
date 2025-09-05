import { EmbedBuilder } from 'discord.js';

export const name = "help";
export const description = "List available commands";
export async function execute(message) {
  const embed = new EmbedBuilder()
    .setTitle("Blaze — Help")
    .setDescription("Prefix commands (default: !).")
    .addFields(
      { name: "Moderation", value: "`!kick @user [reason]`\n`!ban @user [reason]`\n`!unban <userID>`\n`!clear <amount>`" },
      { name: "Music", value: "`!play <song or url>`\n`!skip` `!stop` `!pause` `!resume` `!queue`" },
      { name: "Other", value: "`!ping` `!userinfo` `!server`" },
    )
    .setFooter({ text: "Build your own features from here 🔥" });
  await message.channel.send({ embeds: [embed] });
}
