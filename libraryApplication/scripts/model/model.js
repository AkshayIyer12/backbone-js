define(function (require) {
  let Backbone = require('backbone')
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
  return [LibraryList, LibraryStore]
})
