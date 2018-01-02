<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" 
            @touchstart.prevent="touchStart"
            @touchmove.prevent="touchMove"
            @touchend="touchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/domSelf'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  methods: {
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._setOffSetWidth(offsetWidth)
      // this._setOffSetWidth(e.offsetX)
      // offsetX为到出发元素内距离，在圆点内失效
      this._percentChange()
    },
    _setOffSetWidth(width) {
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style[transform] = `translateX(${width}px)`
    },
    touchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const xDiff = e.touches[0].pageX - this.touch.startX
      const xMove = Math.min((this.$refs.progressBar.clientWidth - progressBtnWidth), Math.max(0, this.touch.left + xDiff))
      this._setOffSetWidth(xMove)
    },
    touchEnd(e) {
      this.touch.initiated = false
      this._percentChange()
    },
    _percentChange() {
      const totalWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / totalWidth
      this.$emit('percentChange', percent)
    }
  },
  created() {
    this.touch = {}
  },
  watch: {
    percent(newVal) {
      const progressBar = this.$refs.progressBar
      let totalWidth = progressBar.clientWidth - progressBtnWidth
      if (newVal > 0) {
        let widthMove = newVal * totalWidth
        this._setOffSetWidth(widthMove)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>