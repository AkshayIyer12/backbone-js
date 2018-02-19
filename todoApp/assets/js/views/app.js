let app = app || {}
app.AppView = Backbone.View.extend({
  el: '#todoapp',
  statsTemplate: _.template($('#stats-template').html()),
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },
  initialize () {
    this.allCheckbox = this.$('#toggle-all')[0]
    this.$input = this.$('#new-todo')
    this.$footer = this.$('#footer')
    this.$main = this.$('#main')
    [['add', this.addOne], ['reset', this.addAll], ['change:completed', this.filterOne], ['filter', this.filterAll], ['all', this.render]].forEach(this.bindListenTo)
    app.Todos.fetch()
  },
  bindListenTo ([event, elem]) {
    console.log(event, elem)
    this.listenTo(app.Todos, event, elem)
  },
  render () {
    let completed = app.Todos.completed().length
    let remaining = app.Todos.remaining().length
    if (app.Todos.length) {
      this.$main.show()
      this.$footer.show()
      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }))
      this.$('#filters li a')
        .removeClass('selected')
        .filter(`[href="#/${app.TodoFilter || ''}"]`)
        .addClass('selected')
    } else {
      this.$main.hide()
      this.$footer.hide()
    }
    this.allCheckbox.checked = !remaining
  },
  addOne (todo) {
    let view = new app.TodoView({model: todo})
    $('#todo-list').append(view.render().el)
  },
  addAll () {
    this.$('#todo-list').html()
    app.Todos.each(this.addOne, this)
  },
  filterOne (todo) {
    todo.trigger('visible')
  },
  filterAll () {
    app.Todos.each(this.filterOne, this)
  },
  newAttributes () {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    }
  },
  createOnEnter (event) {
    if (event.which !== ENTER_KEY || this.$input.val().trim()) {
      return
    }
    app.Todos.create(this.newAttributes())
    this.$input.val('')
  },
  clearCompleted () {
    _.invoke(app.Todos.completed(), 'destroy')
    return false
  },
  toggleComplete () {
    let completed = this.allCheckbox.checked
    app.Todos.each(todo => todo.save({'completed': completed}))
  }
})
