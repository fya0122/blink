import {
  config
} from './../../util/config.js'
Component({
  properties: {
    hotwords: {
      type: Array,
      value: []
    },
    more: {
      type: String,
      observer: 'loadMore' // 意思是，当父组件接收的more发生变化的时候，会执行_load_more这个methods
    }
  },
  data: {
    historywords: [],
    dataAyyay: [],
    showResult: false,
    q: '',
    loading: false,
    totalNum: 0,
    loadingCenter: false,
    noResult: false
  },
  attached() {
    const historywords = this._getHistory() // get all history keyword
    this.setData({
      historywords: historywords
    })
  },
  methods: {
    // 加载更多
    loadMore() {
      if (this.data.q) {
        if (this.data.loading) {
          return
        }
        const length = this.data.dataAyyay.length
        if (length < this.data.totalNum) {
          this.setData({
            loading: true
          })
          this._getSearchData(length, this.data.q).then((res) => {
            const tempArray = this.data.dataAyyay.concat(res.books)
            this.setData({
              dataAyyay: tempArray,
              loading: false
            })
          }, (e) => {
            console.log(e)
            this.setData({
              loading: false
            })
          })
        } else {
          console.log('已经请求完毕了')
        }
      }
    },
    // 隐藏、消失
    searchhide() {
      this.setData({
        noResult: false
      })
      this.triggerEvent('searchhide', {}, {})
    },
    // 输入内容，点击回车
    inputChange(event) { // 这个是需要优化的，比如空格之类的
      this.setData({
        dataAyyay: [], // 置空的目的在于，清空数据
        loadingCenter: true
      })
      const word = event.detail.value || event.detail.content
      if (word !== undefined && word !== null && word !== '') {
        this.setData({
          showResult: true,
          q: word
        })
        // 搜索接口
        this._getSearchData(0, word).then((res) => {
          if (res.books.length > 0) {
            this.setData({
              dataAyyay: res.books,
              totalNum: res.total,
              noResult: false
            })
          } else {
            this.setData({
              dataAyyay: [],
              noResult: true
            })
          }
          this.setData({
            loadingCenter: false
          })
          let jd_keyword = this._getHistory()
          const has = jd_keyword.includes(word)
          if (!has) {
            const keywordlength = jd_keyword.length
            if (keywordlength >= 10) {
              jd_keyword.pop()
            }
            jd_keyword.unshift(word)
            wx.setStorageSync('jd_keyword', JSON.stringify(jd_keyword))
          }
        })
      }
    },
    // 得到历史热门关键词
    _getHistory() {
      const jd_keyword = wx.getStorageSync('jd_keyword')
      if (!jd_keyword) {
        return []
      }
      return JSON.parse(jd_keyword)
    },
    // 搜索接口
    _getSearchData(start, q) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: config.api_base_url + '/book/search',
          data: {
            summary: 1,
            start: start,
            q: q
          },
          header: {
            'appkey': config.appkey
          },
          success: ((res) => {
            if (res.statusCode === 200 && res.errMsg === 'request:ok') {
              resolve(res.data)
            } else {
              resolve('sorry')
            }
          })
        })
      })
    },
    // 点击查查的小箭头之后触发的事情
    deletetxt() {
      this.setData({
        showResult: false,
        q: '',
        noResult: false
      })
    }
  }
})