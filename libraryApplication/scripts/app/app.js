define(function (require) {
  let [libList, LibraryStore] = require('../model/model')
  let App  = require('../view/view')
  let appView = new App(libList, LibraryStore)
})

