import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import play from "play-dl";

export default {
  name: "play",
  description: "Play music from YouTube",
  async execute(message, args) {
    if (!args.length) return message.reply("❌ You need to provide a YouTube link!");

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) return message.reply("❌ You need to be in a voice channel!");

    const ytInfo = await play.stream(args[0]);
    const player = createAudioPlayer();
    const resource = createAudioResource(ytInfo.stream, { inputType: ytInfo.type });

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    }).subscribe(player);

    player.play(resource);

    player.on(AudioPlayerStatus.Playing, () => {
      message.reply(`🎶 Now playing: ${args[0]}`);
    });

    player.on("error", error => {
      console.error(error);
      message.reply("❌ Error playing the track.");
    });
  }
};
