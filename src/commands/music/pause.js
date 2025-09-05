export const name = "pause";
export const description = "Pause playback";

export async function execute(message, args, client) {
  const ok = client.musicManager.pause(message.guild.id);
  if (ok) await message.channel.send('⏸ Paused.');
  else await message.channel.send('Nothing is playing.');
}
