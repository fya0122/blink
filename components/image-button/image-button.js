Component({
  options: {
    multipleSlots: true
  },
  properties: {
    opentype: {
      type: String,
      value: ''
    }
  },
  data: {},
  methods: {
    onGetUserInfo(event) {
      this.triggerEvent('getuserinfo', event, {})
    }
  }
})