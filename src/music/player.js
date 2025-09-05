import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } from '@discordjs/voice';
import playdl from 'play-dl';

// Simple music manager storing queues per guild
class MusicManager {
  constructor() {
    this.queues = new Map(); // guildId -> { connection, player, songs: [], playing: boolean }
  }

  getQueue(guildId) {
    if (!this.queues.has(guildId)) {
      this.queues.set(guildId, { connection: null, player: createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } }), songs: [], playing: false });
    }
    return this.queues.get(guildId);
  }

  async connectToChannel(voiceChannel) {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    return connection;
  }

  async playSong(guildId) {
    const q = this.getQueue(guildId);
    if (!q.songs.length) {
      q.playing = false;
      return;
    }
    const song = q.songs[0];
    q.playing = true;

    // Prepare stream with play-dl
    let stream;
    if (song.source === 'yt' || song.source === 'search') {
      stream = await playdl.stream(song.url, { quality: 2 });
    } else {
      // for spotify/soundcloud/play-dl handles resolution to stream usable url
      stream = await playdl.stream(song.url);
    }

    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    q.player.play(resource);

    q.player.once(AudioPlayerStatus.Idle, () => {
      q.songs.shift();
      if (q.songs.length) {
        this.playSong(guildId);
      } else {
        q.playing = false;
      }
    });
  }

  async enqueue(guildId, voiceChannel, query) {
    const q = this.getQueue(guildId);
    // if no connection, connect and subscribe player
    if (!q.connection) {
      q.connection = await this.connectToChannel(voiceChannel);
      q.connection.subscribe(q.player);
    }

    // Resolve query (supports URLs + search)
    let info;
    if (playdl.yt_validate(query) === 'video') {
      info = await playdl.video_info(query);
      q.songs.push({ title: info.video_details.title, url: info.video_details.url, source: 'yt' });
    } else if (playdl.sp_validate(query)) {
      // Spotify track/playlist/album
      const r = await playdl.sp_track(query).catch(()=>null) || await playdl.spotify(query).catch(()=>null);
      if (r && r.name) {
        // single track
        const search = await playdl.search(`${r.name} ${r.artists?.map(a=>a.name).join(' ')}`, { limit: 1 });
        const first = search[0];
        if (first) q.songs.push({ title: first.title, url: first.url, source: 'search' });
      } else {
        // fallback: search by query
        const search = await playdl.search(query, { limit: 1 });
        if (search[0]) q.songs.push({ title: search[0].title, url: search[0].url, source: 'search' });
      }
    } else {
      // generic search (YouTube, SoundCloud)
      const search = await playdl.search(query, { limit: 1 });
      if (search.length) {
        q.songs.push({ title: search[0].title, url: search[0].url, source: 'search' });
      } else {
        throw new Error('No results');
      }
    }

    // If not playing, start
    if (!q.playing) {
      await this.playSong(guildId);
    }
    return q.songs;
  }

  skip(guildId) {
    const q = this.getQueue(guildId);
    if (!q || !q.songs.length) return false;
    q.player.stop();
    return true;
  }

  stop(guildId) {
    const q = this.getQueue(guildId);
    if (!q) return false;
    q.songs = [];
    q.player.stop();
    if (q.connection) {
      try { q.connection.destroy(); } catch(e) {}
      q.connection = null;
    }
    q.playing = false;
    return true;
  }

  pause(guildId) {
    const q = this.getQueue(guildId);
    if (!q) return false;
    q.player.pause();
    return true;
  }

  resume(guildId) {
    const q = this.getQueue(guildId);
    if (!q) return false;
    q.player.unpause();
    return true;
  }

  getQueueList(guildId) {
    const q = this.getQueue(guildId);
    return q.songs.map(s => s.title);
  }
}

export const musicManager = new MusicManager();
