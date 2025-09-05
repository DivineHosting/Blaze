export const name = "unban";
export const description = "Unban a user by ID";

export async function execute(message, args) {
  if (!message.member.permissions.has('BanMembers')) return message.reply("You don't have permission to unban.");
  const id = args[0];
  if (!id) return message.reply("Provide a user ID to unban.");
  try {
    await message.guild.bans.remove(id);
    await message.channel.send(`✅ Unbanned user ID ${id}`);
  } catch (err) {
    console.error(err);
    await message.channel.send('Failed to unban. Make sure the ID is correct.');
  }
}
