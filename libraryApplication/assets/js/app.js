let App = Backbone.View.extend({
  el: '#app',
  initialize () {
    console.log('Initialized')
    this.render()
  },
  render () {
    this.$el.html('Hello World')
  }
})
let app = new App()
