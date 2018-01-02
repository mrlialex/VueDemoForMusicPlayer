<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongListII} from 'api/recommend'
  import {createSong} from 'common/js/song'
  // import {ERR_OK} from 'api/config'
  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.back()
          return
        }
        getSongListII(this.disc.dissid).then((res) => {
          console.log(res)
          var matches = res.replace(/^\w+\(/, '').replace(/\)$/, '')
          let ret = JSON.parse(matches)
          this.songs = this._normalizeSong(ret.cdlist[0].songlist)
          console.log(this.songs)
        })
      },
      _normalizeSong(list) {
        let res = []
        list.forEach((item) => {
          if (item.albummid && item.songid) {
            res.push(createSong(item))
          }
        })
        return res
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>