let app = app || {}
app.Todo = Backbone.Model.extends({
  defaults: {
    title: '',
    completed: false
  },
  toggle () {
    this.save({
      completed: !this.get('completed')
    })
  }
})
