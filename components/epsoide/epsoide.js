Component({
  properties: {
    index: {
      type: String,
      value: 0,
      observer(newVal, oldVal, changedPath) {
        let lastVal = newVal < 10 ? '0' + newVal : newVal
        this.setData({
          _index: lastVal
        })
      }
      // observer: ((newVal, oldVal, changedPath) => { // 使用observer的时候一定要注意防止内存泄漏
      //   let lastVal = newVal < 10 ? '0' + newVal : newVal
      //   this.setData({
      //     _index: lastVal
      //   })
      // })
    }
  },
  data: {
    year: 0,
    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    _index: ''
  },
  attached() {
    console.error('components >>> epsoide >>> attached')
    let data = new Date()
    let year = data.getFullYear()
    let month = data.getMonth()
    this.setData({
      year: year,
      month: this.data.month[month]
    })
  },
  // attached: (() => {
  //   console.error('components >>> epsoide >>> attached')
  //   let data = new Date()
  //   let year = data.getFullYear()
  //   let month = data.getMonth()
  //   console.log(year, month)
  //   this.setData({
  //     year: year,
  //     month: month
  //   })
  // }),
  methods: {}
})