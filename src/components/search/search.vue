<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="chooseBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-if="!currentQuery" ref="shortcutWrapper">
      <scroll class="shortcut"  :data="totalData" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="setquery(item.k)" class="item" v-for="item in hotKey">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-if="currentQuery" ref="searchResult">
      <suggest @select="saveSearch" @listScroll="inputBlur" :query="currentQuery" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否要清空？" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {getHotKey} from 'api/searchSelf'
import {ERR_OK} from 'api/config'
import {mapActions, mapGetters} from 'vuex'
import {searchMixin} from 'common/js/mixinSelf'

export default {
  mixins: [searchMixin],
  watch: {
    currentQuery(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    },
    playList(newVal) {
      setTimeout(() => {
        this.bottomFix(newVal)
      }, 20)
    }
  },
  computed: {
    totalData() {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    bottomFix(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      if (!this.currentQuery) {
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      } else {
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  data() {
    return {
      hotKey: []
    }
  },
  created() {
    this._getHotKey()
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>