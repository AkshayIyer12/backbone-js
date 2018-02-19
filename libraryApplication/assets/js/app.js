let App = Backbone.View.extend({
  el: $('#app'),
  template: _.template('<h3>Hello <%= who %></h3>'),
  initialize () {
    console.log('Initialized')
    this.render()
  },
  render () {
    this.$el.html(this.template({who: 'world!'}))
  }
})
let app = new App()
