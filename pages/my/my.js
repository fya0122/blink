import {
  config
} from './../../util/config.js'
Page({
  data: {
    userisauthorized: false, // 用户是否已经授权?
    userInfo: {},
    bookCount: 0,
    classics: []
  },
  onLoad() {
    this.userAuthorized()
    this._getMyBookCount()
    this._getFavorData()
  },
  // 跟image-button-component配合，获取用户信息
  getuserinfo(event) {
    if (event.detail.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = event.detail.detail.userInfo
      this.setData({
        userisauthorized: true,
        userInfo: userInfo
      })
    } else {
      this.setData({
        userisauthorized: false,
        userInfo: {}
      })
    }
  },
  // 查看用户是否已经授权啊
  userAuthorized() {
    wx.getSetting({ // 查看是否授权api
      success: ((res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: ((res) => {
              this.setData({
                userisauthorized: true,
                userInfo: res.userInfo
              })
            })
          })
        } else {
          this.setData({
            userisauthorized: false,
            userInfo: {}
          })
        }
      })
    })
  },
  // 得到书籍
  _getMyBookCount() {
    wx.request({
      url: config.api_base_url + '/book/favor/count',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            bookCount: res.data.count
          })
        }
      })
    })
  },
  // 得到喜欢的
  _getFavorData() {
    wx.request({
      url: config.api_base_url + '/classic/favor',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            classics: res.data
          })
        }
      })
    })
  },
  // 调到另外一个页面
  onJumpToAbout(event) {
    wx.navigateTo({
      url: './../about/about'
    })
  },
  onStudy(event) {
    wx.navigateTo({
      url: './../course/course'
    })
  }
})