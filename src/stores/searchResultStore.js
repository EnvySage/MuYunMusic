import { defineStore } from "pinia";
import request from "@/utils/http";
export const useSearchResultStore = defineStore("searchResult", {
  state: () => ({
    searchResult: {},
    searchSongs: [],
    searchPlaylists: [],
    searchArtists: [],
    loading:false
  }),
  actions: {
    async getSearchResult(keywords,type="all") {
        this.loading = true;
      try {
        const res = await request.get(`/search/all`, {
          keyword: keywords, 
          type: type
        });
        this.setSearchResult(res.data);
        console.log("搜索结果:", res.data);
        this.searchSongs = res.data.songs || [];
        this.searchPlaylists = res.data.playlists || [];
        this.searchArtists = res.data.artists || [];
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      }finally{
        this.loading = false;
      }
    },
    setSearchResult(data) {
      this.searchResult = data;
    },
  },
});