import {
  config
} from './../../util/config.js'
Page({
  data: {
    bookdetail: {},
    like_status: false,
    fav_nums: 0,
    comments: [],
    isShow: false
  },
  onLoad(options) {
    if (options.id) {
      this._getBookDetailData(options.id)
    }
  },
  // 得到详细信息
  _getBookDetailData(id) {
    wx.showLoading({
      title: '请稍等....'
    })
    wx.request({
      url: config.api_base_url + '/book/' + id + '/detail',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            bookdetail: res.data
          })
          // 得到该书籍的喜欢
          this._getBookDetailLikeStatus(id)
        }
      })
    })
  },
  // 得到该书籍的喜欢
  _getBookDetailLikeStatus(id) {
    wx.request({
      url: config.api_base_url + '/book/' + id + '/favor',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            like_status: res.data.like_status,
            fav_nums: res.data.fav_nums
          })
          // 得到该书籍的评论信息
          this._getBookDetailComments(id)
        }
      })
    })
  },
  // 得到该书籍的评论信息
  _getBookDetailComments(id) {
    wx.request({
      url: config.api_base_url + '/book/' + id + '/short_comment',
      header: {
        'appkey': config.appkey
      },
      success: ((res) => {
        if (res.statusCode === 200 && res.errMsg === 'request:ok' && res.data) {
          this.setData({
            comments: res.data.comments
          })
        }
      }),
      complete: (() => {
        wx.hideLoading()
      })
    })
  },
  // 点击心的按钮
  switchlike(event) {
    let likestatus = event.detail.likestatus
    if (likestatus === 'yes') {
      wx.request({
        url: config.api_base_url + '/like',
        method: 'POST',
        data: {
          art_id: this.data.bookdetail.id,
          type: 400
        },
        header: {
          'appkey': config.appkey
        },
        success: ((res) => {
          if (res.statusCode === 201 && res.errMsg === 'request:ok' && res.data.msg === 'ok') {
            console.error('>>> 点赞成功')
          }
        })
      })
    } else if (likestatus === 'no') {
      wx.request({
        url: config.api_base_url + '/like/cancel',
        method: 'POST',
        data: {
          art_id: this.data.bookdetail.id,
          type: 400
        },
        header: {
          'appkey': config.appkey
        },
        success: ((res) => {
          if (res.statusCode === 201 && res.errMsg === 'request:ok' && res.data.msg === 'ok') {
            console.error('>>> 取消成功')
          }
        })
      })
    }
  },
  // 显示input
  showInput() {
    this.setData({
      isShow: true
    })
  },
  // 隐藏input
  hideInput() {
    this.setData({
      isShow: false
    })
  },
  // 点击tag标签触发的事件
  onclicktap(event) {
    let content = event.detail.content || event.detail.value
    if (!content) {
      return
    }
    if (content) {
      if (content.length > 12) {
        wx.showToast({
          title: '短评最多输入12个字',
          icon: 'none'
        })
        return
      }
      wx.request({
        url: config.api_base_url + '/book/add/short_comment',
        method: 'POST',
        header: {
          'appkey': config.appkey
        },
        data: {
          book_id: this.data.bookdetail.id,
          content: content
        },
        success: ((res) => {
          if (res.statusCode === 201 && res.errMsg === 'request:ok' && res.data.error_code === 0) {
            wx.showToast({
              title: '+1',
              icon: 'none'
            })
            this.data.comments.unshift({
              content: content,
              nums: 1
            })
            this.setData({
              comments: this.data.comments,
              isShow: false
            })
          }
        })
      })
    }
  }
})