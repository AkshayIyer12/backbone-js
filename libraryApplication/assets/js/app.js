const compose = (f, g) => x => g(f(x))
let LibraryStore = Backbone.Model.extend({
  defaults () {
    return {
      title: '',
      author: '',
      id: 0
    }
  }
})
let LibraryList = Backbone.Collection.extend({
  model: LibraryStore
})
let libList = new LibraryList()

let App = Backbone.View.extend({
  el: $('#app'),
  events: {
    'click #submit': 'valueEntered'
  },
  initialize () {
    this.title = this.$('#title')
    this.author = this.$('#author')
    this.id = ''
    this.render()
  },
  valueEntered () {
    this.id = uuidv4()
    let modelArray = [this.title.val(), this.author.val(), this.id].map(a => a)
    let val = compose(compose(this.createModel, this.addToCollection), this.display)(modelArray)
  },
  createModel ([title, author, id]) {
    return new LibraryStore({
      title: title,
      author: author,
      id: id
    })
  },
  addToCollection (obj) {
    return libList.add(obj).attributes
  },
  render () {
    this.$('#display').html(`
    <table id="tid">
      <thead>
        <tr>
          <td>Title</td>
          <td>Author</td>
        </tr>
      </thead>
    </table>`)
  },
  display ({title, author, id}) {
    return this.$(`#tid`).append(`
    <tbody>
      <tr id="${id}">
        <td>${title}</td>
        <td>${author}</td>
      </tr>
    </tbody>`)
  }
})
let appView = new App()
