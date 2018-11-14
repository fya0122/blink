Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    first: {
      type: Boolean,
      value: false
    },
    latest: {
      type: Boolean,
      value: false
    }
  },
  data: {},
  methods: {
    // 向左
    onLeft(event) {
      if (!this.properties.latest) { // 不是最新的
        this.triggerEvent('onleft', {}, {})
      }
    },
    // 向右
    onRight(event) {
      if (!this.properties.first) { // 不是最早的
        this.triggerEvent('onright', {}, {})
      }
    }
  }
})