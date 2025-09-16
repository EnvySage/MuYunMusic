// src/store/playListStore.js
import { defineStore } from 'pinia'
import avatar from '../image/avatar.png'
export const usePlayListStore = defineStore('playlist', {
  state: () => ({
    list: [
      {
        id: 1,
        cover: avatar,
        title: '眩しいDNAだけ（只是耀眼的D.jdaslkdjkljdlsal）',
        artist: 'ずっと真夜中でいいsldjka;lskd;',
        duration: '03:46',
        vip: true,
        quality: '超清母带',
        mv: false
      },
      {
        id: 2,
        cover: 'https://example.com/cover2.jpg',
        title: '猫リセット（猫重置）',
        artist: 'ずっと真夜中でいい...',
        duration: '04:06',
        vip: true,
        quality: '超清母带',
        mv: true
      },
      {
        id: 3,
        cover: 'https://example.com/cover3.jpg',
        title: '暗く黒く (Twin Piano Live ver.)...',
        artist: 'ずっと真夜中でいい...',
        duration: '04:27',
        vip: false,
        quality: '超清母带',
        mv: false
      }
    ],
    currentId: null // 当前播放的歌曲 ID
  }),

  getters: {
    getCurrentItem: (state) => {
      return state.list.find(item => item.id === state.currentId)
    },
    hasItems: (state) => state.list.length > 0
  },

  actions: {
    addSong(song) {
      this.list.push(song)
    },

    removeSong(id) {
      this.list = this.list.filter(item => item.id !== id)
    },

    clearAll() {
      this.list = []
    },

    playSong(id) {
      this.currentId = id
    },

    toggleFavorite(id) {
      const song = this.list.find(item => item.id === id)
      if (song) {
        song.favorited = !song.favorited
      }
    },

    collectAll() {
      this.list.forEach(item => {
        item.favorited = true
      })
    }
  }
})