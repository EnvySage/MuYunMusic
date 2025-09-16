// src/stores/songList.js
import { defineStore } from "pinia";
import avatar from "@/image/avatar.png"

export const useSongListStore = defineStore("songList", {
  state: () => ({
    songList: {
      id: 0,
      name: "安想感伤代偿联盟",
      author: "DECO*27 / 初音ミク",
      authorAvatar: avatar,
      cover: avatar,
      description: "这是一张充满情感的音乐专辑，收录了多首经典曲目。",
      date: "2023-05-05",
      songs: [
        {
          id: 1,
          name: "安想感傷代償連盟（安想感伤代偿联盟）",
          singer: "DECO*27 / 初音ミク",
          album: "GHOST",
          duration: "04:30",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 2,
          name: "いつのまに（不知不觉）",
          singer: "DAZBEE",
          album: "いつのまに",
          duration: "03:28",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 3,
          name: "アディオス（再见）",
          singer: "DAZBEE",
          album: "アディオス",
          duration: "03:20",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 4,
          name: "未だ知られぬ物語 ~ Anticipated Dream（还未知晓的物语 ~ 悄然期待的梦）",
          singer: "洞叶棕",
          album: "薦",
          duration: "04:14",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 5,
          name: "Grad Erlija",
          singer: "Grand Thaw",
          album: "Fyra Varlden",
          duration: "03:51",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 6,
          name: "ほろよい（微醺）",
          singer: "さんひ",
          album: "ほろよい",
          duration: "03:23",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 7,
          name: "愛じゃない（这不是爱）",
          singer: "DAZBEE",
          album: "愛じゃない",
          duration: "02:15",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        },
        {
          id: 8,
          name: "ねえねえねえ（呐呐呐）",
          singer: "未知歌手",
          album: "未知专辑",
          duration: "03:29",
          url: "https://music.163.com/song/media/outer/url?id=138573.mp3",
          lyric: "默认歌词",
          icon: avatar
        }
      ],
    }
  }),
  getters: {
    getSongList: (state) => state.songList,
  },
  actions: {
    setSongList(songList) {
      this.songList = songList;
    },
  },
})