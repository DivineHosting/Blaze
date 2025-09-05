export const name = "resume";
export const description = "Resume playback";

export async function execute(message, args, client) {
  const ok = client.musicManager.resume(message.guild.id);
  if (ok) await message.channel.send('▶️ Resumed.');
  else await message.channel.send('Nothing is paused.');
}
