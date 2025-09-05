export const name = "kick";
export const description = "Kick a member";

export async function execute(message, args) {
  if (!message.member.permissions.has('KickMembers')) return message.reply("You don't have permission to kick.");
  const member = message.mentions.members.first();
  if (!member) return message.reply("Mention a user to kick.");
  const reason = args.slice(1).join(' ') || 'No reason provided';
  try {
    await member.kick(reason);
    await message.channel.send(`✅ Kicked ${member.user.tag} — ${reason}`);
  } catch (err) {
    console.error(err);
    await message.channel.send('Failed to kick user.');
  }
}
