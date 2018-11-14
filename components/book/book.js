Component({
  properties: {
    book: {
      type: Object,
      value: {}
    }
  },
  data: {},
  methods: {
    // 传递上去
    navigatetobookdetail(event) {
      let id = event.currentTarget.dataset.id
      this.triggerEvent('navigatetobookdetail', {
        id: id
      }, {})
    }
  }
})