import { playMode } from 'common/js/configSelf'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { shuffle } from 'common/js/utilSelf'

export const fixBottom = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.bottomFix(this.playList)
  },
  activated() {
    this.bottomFix(this.playList)
  },
  watch: {
    playList(newVal) {
      this.bottomFix(newVal)
    }
  },
  methods: {
    bottomFix() {
      return new Error('component must implement bottomFix method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'currentSong',
      'playing',
      'mode',
      'sequenceList',
      'playList',
      'favoriteList'
    ])
  },
  methods: {
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    favoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((song) => {
        return song.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      'setPlayingState': 'SET_PLAYING',
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setPlayMode': 'SET_MODE',
      'setPlayList': 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      currentQuery: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    inputBlur() {
      this.$refs.chooseBox.blur()
    },
    onQueryChange(newquery) {
      this.currentQuery = newquery
      console.log(this.currentQuery)
    },
    setquery(val) {
      this.$refs.chooseBox.queryChange(val)
    },
    saveSearch() {
      this.saveSearchHistory(this.currentQuery)
    },
    addQuery(item) {
      this.currentQuery = item
      this.$refs.chooseBox.queryChange(item)
    },
    ...mapActions([
      'deleteSearchHistory',
      'saveSearchHistory'
    ])
  }
}
