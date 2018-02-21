const compose = (f, g) => x => g(f(x))
const capitalizeHead = a => {
    let val = a.split('')
    val[0] = val[0].toUpperCase()
    return val.join('')
  }
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
    'click #addBook': 'valueEntered',
    'click #delete': 'deleteEntry',
    'click #selectall': 'selectAllCheckbox',
    'click #edit': 'editEntry',
    'click #editBook': 'updateEntry',
    'click .addEdit': 'setupForm'
  },
  initialize () {
    this.title = this.$('#title')
    this.author = this.$('#author')
    this.id = ''
    this.render()
    let arr = [['Account Book Solution', 'Manoj Mangal Pandey', 123], ['Monopoly Book Tactical', 'Anil Dhirubai Ambani ', 223], ['Uno Book Guide', 'Mahesh Tripathi', 332], ['JavaScript Allonge', 'Paul Braithwaite', 345]]
    arr.map(v => this.composeCollection(v))
  },
  valueEntered () {
    this.id = uuidv4()
    let modelArray = [this.title.val(), this.author.val(), this.id]
    this.composeCollection(modelArray)
  },
  composeCollection (model) {
    return compose(compose(this.createModel, this.addToCollection), this.display)(model)
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
    this.$('#display').append(`
    <table>
      <thead>
        <tr>
          <th id="selectalltd"><input type="checkbox" id="selectall"/></td>
          <th id="titlehead">Title</th>
          <th id="authorhead""">Author</th>
        </tr>
      </thead>
      <tbody id="t01"></tbody>
    </table>`)
  },
  display ({title, author, id}) {
    return this.$('tbody').append(`
      <tr id="${id}">
        <td class="checklist"><input type="checkbox"/></td>
        <td>${title}</td>
        <td>${author}</td>
      </tr>`)
  },
  deleteEntry () {
    $('input[type="checkbox"]').each(function (e) {
      if ($(this).is(':checked') && e !== 0) {
        let parent = $(this)[0].parentNode.parentNode
        libList.remove({id: parent.id})
        parent.remove()
      }
    })
  },
  selectAllCheckbox () {
    $('#selectall').change(function () {
      let val = $(this).prop('checked')
      $('input:checkbox').prop('checked', val)
    })
  },
  editEntry () {
    let flag = 0
    let self = this.$el
    self.find('input[type="checkbox"]').each(function (e) {
      if (this.checked && e !== 0 && flag === 0) {
        flag += 1
        let id = this.parentNode.parentNode.id
        let {title, author} = libList.get(id).attributes
        let titleElem = self.find('#title')[0]
        titleElem.setAttribute('value', title)
        let authorElem = self.find('#author')[0]
        authorElem.setAttribute('value', author)
      }
    })
  },
  setupForm (e) {
    let {id} = e.currentTarget
    this.setAttrAndText(id)
  },
  setAttrAndText (id) {
    let node = this.$el.find('#input')[0].children
    let submitNode = node[2]
    submitNode.setAttribute('id', `${id}Book`)
    submitNode.innerHTML = `${capitalizeHead(id)} Book`
    if (id === 'add') {
      [...node].map((a, i) => {
        if (i !== 2) {
          a.removeAttribute('value')
        }
      })
    }
  }
})
let appView = new App()
