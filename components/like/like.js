Component({
  properties: {
    like: {
      type: Boolean, // 类型
      value: false // 默认值
    },
    count: {
      type: Number,
      value: 999
    },
    readOnly: { // 是否只读
      type: Boolean,
      value: false
    }
  },
  data: {
    yesLikeSrc: './images/like.png',
    noLikeSrc: './images/like@dis.png'
  },
  methods: {
    onlike(event) {
      if (this.properties.readOnly) {
        return
      }
      let like = this.properties.like
      let count = this.properties.count
      if (like === true) {
        count = count - 1
        like = false
      } else {
        count = count + 1
        like = true
      }
      this.setData({
        count,
        like
      })

      // 把这个状态，传递到父组件
      let likestatus = this.properties.like ? 'yes' : 'no'
      this.triggerEvent('switchlike', {
        likestatus: likestatus
      }, {})

    }
  }
})