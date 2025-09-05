export const name = "clear";
export const description = "Bulk delete messages";

export async function execute(message, args) {
  if (!message.member.permissions.has('ManageMessages')) return message.reply("You don't have permission to manage messages.");
  const amount = parseInt(args[0], 10);
  if (!amount || amount < 1 || amount > 100) return message.reply("Provide an amount between 1 and 100.");
  try {
    const deleted = await message.channel.bulkDelete(amount, true);
    await message.channel.send(`🧹 Deleted ${deleted.size} messages`).then(m => setTimeout(()=>m.delete(), 5000));
  } catch (err) {
    console.error(err);
    await message.channel.send('Failed to delete messages.');
  }
}
