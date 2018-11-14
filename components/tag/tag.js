Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持，需设置为true以后，slot才会生效
  },
  externalClasses: ['tag-class'], // 组件外部传递进来的css类名
  properties: {
    text: {
      type: String,
      value: ''
    }
    // num: {
    //   type: Number,
    //   value: 0
    // }
  },
  data: {},
  methods: {
    // 点击标签
    onclicktap(event) {
      let content = event.currentTarget.dataset.content
      this.triggerEvent('onclicktap', {
        content: content
      }, {})
    }
  }
})