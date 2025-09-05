export const name = "stop";
export const description = "Stop playback and clear queue";

export async function execute(message, args, client) {
  const ok = client.musicManager.stop(message.guild.id);
  if (ok) await message.channel.send('⏹ Stopped and cleared queue.');
  else await message.channel.send('Nothing was playing.');
}
