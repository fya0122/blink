// 类似于vue中的中的“mixins”
let classicBehavior = Behavior({
  properties: {
    img: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    }
  }
})
export {
  classicBehavior
}