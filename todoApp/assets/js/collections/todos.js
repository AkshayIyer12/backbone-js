let app = app || {}
let TodoList = Backbone.Collection.extend({
  model: app.Todo,
  localStorage: new Backbone.LocalStorage('todos-backbone'),
  completed () {
    return this.filter(todo => todo.get('completed'))
  },
  remaining () {
    return this.without.apply(this, this.completed())
  },
  nextOrder () {
    return !this.length ? 1 : this.last().get('order') + 1
  },
  comparator (todo) => todo.get('order')
})
app.Todos = new TodoList()
