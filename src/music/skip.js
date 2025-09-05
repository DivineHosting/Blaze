export const name = "skip";
export const description = "Skip the current song";

export async function execute(message, args, client) {
  const ok = client.musicManager.skip(message.guild.id);
  if (ok) await message.channel.send('⏭ Skipped.');
  else await message.channel.send('Nothing is playing.');
}
