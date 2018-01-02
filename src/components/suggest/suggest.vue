<template>
  <scroll ref="suggest" 
          class="suggest" 
          :data="result" 
          :pullup="pullup" 
          @scrollToEnd="loadMore" 
          @beforeScroll="listScroll" 
          :beforeScroll="beforeScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <loading v-show="hasMore" title=""></loading>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import {search} from 'api/searchSelf'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Singer from 'common/js/singerSelf'
import {mapMutations, mapActions} from 'vuex'
const TYPE_SINGER = 'singer'
const PERPAGE = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh()
    },
    listScroll() {
      this.$emit('listScroll')
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: `/search/${item.singermid}`
        })
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    getIconCls(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName(item) {
      return item.type === TYPE_SINGER ? item.singername : `${item.name}-${item.singer}`
    },
    _search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    loadMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || song.curnum + song.curpage * PERPAGE >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalize(data.song.list))
      }
      return ret
    },
    _normalize(list) {
      let ret = []
      list.forEach((item) => {
        if (item.songid && item.albummid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  mounted() {
    this.$watch('query', (newval) => {
      this._search(newval)
    }, {
      immediate: true
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>