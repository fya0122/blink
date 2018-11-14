import {
  config,
  random
} from './../../util/config.js'
Page({
  data: {
    books: [],
    searchShow: false,
    hotwords: [],
    more: ''
  },
  onLoad() {
    this._getBookData()
  },
  // 获取热门书籍信息
  _getBookData() {
    wx.request({
      url: config.api_base_url + '/book/hot_list',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            books: res.data
          })
          this._getHotData()
        }
      })
    })
  },
  // 点击跳转
  navigatetobookdetail(event) {
    let id = event.detail.id
    wx.navigateTo({
      url: './../book-detail/book-detail?id=' + id,
    })
  },
  // 显示search
  switchsearch() {
    this.setData({
      searchShow: true
    })
  },
  // 隐藏search
  searchhide() {
    this.setData({
      searchShow: false
    })
  },
  // 得到热门的
  _getHotData() {
    wx.request({
      url: config.api_base_url + '/book/hot_keyword',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            hotwords: res.data.hot
          })
        }
      })
    })
  },
  onReachBottom() {
    this.setData({
      more: random(16)
    })
  }
})