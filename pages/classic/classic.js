import {
  config
} from './../../util/config.js'
Page({
  data: {
    classic: {},
    latest: true,
    first: false,
    fav_nums: 0, // 喜欢的数
    like_status: false // 状态
  },
  onLoad(options) {
    // 请求classic数据（最新一期
    this._getClassicData()
  },
  // 请求classic数据（最新一期
  _getClassicData() {
    wx.showLoading({
      title: '请稍等....'
    })
    wx.request({
      url: config.api_base_url + '/classic/latest',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data.content) {
          this.setData({
            classic: res.data
          }, () => { // 等上面更新完毕以后，再度
            this._setLatestIndex(this.data.classic.index) // 保存最新一期的index
            this.setData({
              latest: this.isLatest(res.data.index),
              first: this.isFirst(res.data.index),
              fav_nums: res.data.fav_nums,
              like_status: res.data.like_status
            })
            wx.setStorageSync(this._getKey(res.data.index), JSON.stringify(res.data))
            // this._getLikeStatus(res.data.id, res.data.type) // 单独的获取点赞和取消点赞，为的就是解决缓存带来的冲突
          })
        }
      }),
      complete: (() => {
        wx.hideLoading()
      })
    })
  },
  // like-components子组件向父组件传递的方法
  switchlike(event) {
    let likestatus = event.detail.likestatus
    let url = ''
    if (likestatus === 'yes') {
      url = config.api_base_url + '/like'
    } else if (likestatus === 'no') {
      url = config.api_base_url + '/like/cancel'
    }
    wx.request({
      url: url,
      header: {
        'appkey': config.appkey
      },
      data: {
        art_id: this.data.classic.id,
        type: this.data.classic.type
      },
      method: 'POST',
      success: ((res) => {})
    })
  },
  // navi-components子组件向父组件传递的方法
  onleft(event) {
    let index = this.data.classic.index
    let key = this._getKey(index + 1)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      wx.request({
        url: config.api_base_url + '/classic/' + index + '/next',
        header: {
          'appkey': config.appkey
        },
        success: ((res) => {
          if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
            this.setData({
              classic: res.data,
              latest: this.isLatest(res.data.index),
              first: this.isFirst(res.data.index)
            }, () => {
              wx.setStorageSync(this._getKey(res.data.index), JSON.stringify(res.data))
              this._getLikeStatus(res.data.id, res.data.type) // 单独的获取点赞和取消点赞，为的就是解决缓存带来的冲突
            })
          }
        })
      })
    } else {
      this.setData({
        classic: JSON.parse(classic)
      }, () => {
        this.setData({
          latest: this.isLatest(this.data.classic.index),
          first: this.isFirst(this.data.classic.index)
        }, () => {
          this._getLikeStatus(this.data.classic.id, this.data.classic.type) // 单独的获取点赞和取消点赞，为的就是解决缓存带来的冲突
        })
      })
    }
  },
  // navi-components子组件向父组件传递的方法
  onright(event) {
    let index = this.data.classic.index
    let key = this._getKey(index - 1)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      wx.request({
        url: config.api_base_url + '/classic/' + index + '/previous',
        header: {
          'appkey': config.appkey
        },
        success: ((res) => {
          if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
            this.setData({
              classic: res.data,
              latest: this.isLatest(res.data.index),
              first: this.isFirst(res.data.index)
            }, () => {
              wx.setStorageSync(this._getKey(res.data.index), JSON.stringify(res.data))
              this._getLikeStatus(res.data.id, res.data.type) // 单独的获取点赞和取消点赞，为的就是解决缓存带来的冲突
            })
          }
        })
      })
    } else {
      this.setData({
        classic: JSON.parse(classic)
      }, () => {
        this.setData({
          latest: this.isLatest(this.data.classic.index),
          first: this.isFirst(this.data.classic.index)
        }, () => {
          this._getLikeStatus(this.data.classic.id, this.data.classic.type) // 单独的获取点赞和取消点赞，为的就是解决缓存带来的冲突
        })
      })
    }
  },
  // 得到点赞的数据
  _getLikeStatus(artID, category) {
    wx.request({
      url: config.api_base_url + '/classic/' + category + '/' + artID + '/favor',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            fav_nums: res.data.fav_nums,
            like_status: res.data.like_status
          })
        }
      })
    })
  },
  // 保存最新一期的index
  _setLatestIndex(index) {
    wx.setStorageSync('latest_index', index)
  },
  // 判断是不是第一期
  isFirst(index) {
    return index === 1 ? true : false
  },
  // 判断是不是最新的一期
  isLatest(index) {
    let latest_index = this._getLatestIndex()
    return index === latest_index ? true : false
  },
  // 读取最新一期的index
  _getLatestIndex() {
    let latest_index = wx.getStorageSync('latest_index')
    return latest_index
  },
  // 得到key，实际上是为缓存所有的期刊做准备的
  _getKey(index) {
    let key = 'classic-' + index
    return key
  }
})