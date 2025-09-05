export const name = "ban";
export const description = "Ban a member";

export async function execute(message, args) {
  if (!message.member.permissions.has('BanMembers')) return message.reply("You don't have permission to ban.");
  const member = message.mentions.members.first();
  if (!member) return message.reply("Mention a user to ban.");
  const reason = args.slice(1).join(' ') || 'No reason provided';
  try {
    await member.ban({ reason });
    await message.channel.send(`✅ Banned ${member.user.tag} — ${reason}`);
  } catch (err) {
    console.error(err);
    await message.channel.send('Failed to ban user.');
  }
}
