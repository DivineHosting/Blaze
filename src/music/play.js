export const name = "play";
export const description = "Play a song (YouTube/Spotify/SoundCloud or search)";

export async function execute(message, args, client) {
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) return message.reply("You must be in a voice channel to play music.");
  const query = args.join(' ');
  if (!query) return message.reply("Provide a song name or URL.");

  try {
    const songs = await client.musicManager.enqueue(message.guild.id, voiceChannel, query);
    await message.channel.send(`✅ Added to queue — ${songs[0].title || 'Unknown'}`);
  } catch (err) {
    console.error(err);
    await message.channel.send('No results or failed to play the track.');
  }
}
