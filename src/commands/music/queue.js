export const name = "queue";
export const description = "Show the current queue";

export async function execute(message, args, client) {
  const list = client.musicManager.getQueueList(message.guild.id);
  if (!list.length) return message.channel.send('Queue is empty.');
  const lines = list.map((t,i) => `${i+1}. ${t}`).join('\n');
  await message.channel.send(`🎶 Queue:\n${lines}`);
}
