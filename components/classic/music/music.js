import {
  classicBehavior
} from './../classic-behavior.js'
let mMgr = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [classicBehavior],
  properties: {
    src: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },
  data: {
    playing: false
  },
  created() {}, // 需要注意的是，在子组件components中，是没办法调用this.setData的
  attached() {
    this._recoverPlaying()
    this._monitorSwitch()
  },
  detached() {}, // wx:if才会走整个生命周期，是的，hidden是不会走的，同样的，hidden是不会走销毁生命周期的
  methods: {
    onPlay(event) { // 点击按钮
      if (!this.data.playing) {
        this.setData({
          playing: true,
        })
        if (mMgr.src == this.properties.src) {
          mMgr.play()
        } else {
          mMgr.src = this.properties.src
        }
        mMgr.title = this.properties.title
      } else {
        this.setData({
          playing: false,
        })
        mMgr.pause()
      }
    },
    _recoverPlaying() {
      if (mMgr.paused) {
        this.setData({
          playing: false
        })
        return
      }
      if (mMgr.src == this.properties.src) {
        if (!mMgr.paused) {
          this.setData({
            playing: true
          })
        }
      }
    },
    // 音乐的切换控制等
    _monitorSwitch() {
      mMgr.onPlay(() => { // 播放一首音乐
        this._recoverPlaying()
      })
      mMgr.onPause(() => { // 暂停
        this._recoverPlaying()
      })
      mMgr.onStop(() => { // 直接在总开关的时候，把音乐播放器给关掉
        this._recoverPlaying()
      })
      mMgr.onEnded(() => { // 让一首音乐自然播放完成
        this._recoverPlaying()
      })
    }
  }
})