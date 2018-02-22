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
    'click #addBook': 'addBook',
    'click #delete': 'deleteBook',
    'click #selectall': 'selectAllCheckbox',
    'click .addEdit': 'resetForm',
    'click #edit': 'showModal',
    'click #editBook': 'updateBook'
  },
  initialize () {
    this.title = this.$el.find('#title')[0]
    this.author = this.$el.find('#author')[0]
    this.id = ''
    this.render()
    let arr = [['Account Book Solution', 'Manoj Mangal Pandey', 123], ['Monopoly Book Tactical', 'Anil Dhirubai Ambani ', 223], ['Uno Book Guide', 'Mahesh Tripathi', 332], ['JavaScript Allonge', 'Paul Braithwaite', 345]]
    arr.map(v => this.createAndDisplayModel(v))
  },
  addBook () {
    this.id = uuidv4()
    let modelArray = [this.title.value, this.author.value, this.id]
    this.createAndDisplayModel(modelArray)
  },
  createAndDisplayModel (arr) {
    let obj = new LibraryStore({
      title: arr[0],
      author: arr[1],
      id: arr[2]
    })
    let {title, author, id} = libList.add(obj).attributes
    this.$el.find('tbody').append(`
    <tr id="${id}">
      <td class="checklist"><input type="checkbox" class="tableCheck"/></td>
      <td>${title}</td>
      <td>${author}</td>
    </tr>`)
  },
  render () {
    this.$el.find('#display').append(`
    <table>
      <thead>
        <tr>
          <th id="selectalltd"><input type="checkbox" id="selectall"/></td>
          <th id="titlehead">Title</th>
          <th id="authorhead">Author</th>
        </tr>
      </thead>
      <tbody id="t01"></tbody>
    </table>`)
  },
  deleteBook () {
    this.$el.find('input[type="checkbox"]').each(function (e) {
      if (this.checked && e !== 0) {
        let parent = this.parentNode.parentNode
        libList.remove({id: parent.id})
        parent.remove()
      }
    })
  },
  selectAllCheckbox () {
    let self = this.$el
    self.find('#selectall').change(function () {
      let val = this.checked
      self.find('input:checkbox').prop('checked', val)
    })
  },
  showModal () {
    let self = this.$el
    let checkedItem = self.find('.tableCheck:checked')
    let popUp = self.find('#popup')[0]
    let length = checkedItem.length
    this.modalAttribute(length)
    if (length > 1) this.showCheckBoxError(popUp, length)
    else (checkedItem.length === 1) ? this.fillFormData(checkedItem[0].parentElement.parentElement) : this.showCheckBoxError(popUp, length)
  },
  showCheckBoxError (popUp, length) {
    popUp.innerHTML = (length > 1) ? `<h3>You cannot select more than one book
for editing</h3>` : `<h3>No book has been selected for edit`
    setTimeout(() => popUp.innerHTML = '', 1200)
  }
  ,
  modalAttribute (length) {
    let modalSet = this.$el.find('#edit')[0]
    return (length === 1) ? modalSet.setAttribute('data-target', '#myModal') : modalSet.setAttribute('data-target', '')
  },
  fillFormData ({id}) {
    let self = this.$el
    self.find('#edit')[0].setAttribute('data-target', '#myModal')
    self.find('#input')[0].parentElement.setAttribute('class', id)
    let {title, author} = libList.get(id).attributes
    let obj = {
      '#title': title,
      '#author': author
    }
    let arr = ['#title', '#author'].map(a => self.find(a)[0].setAttribute('value', obj[a]))
  }
  ,
  resetForm (e) {
    let {id} = e.currentTarget
    let self = this.$el
    let node = self.find('#input')[0].children
    self.find('form').trigger('reset')
    let arr = [...node].filter((v, i) => i === 2 ? v : null).map(a => {
        a.setAttribute('id', `${id}Book`)
        a.innerHTML = `${capitalizeHead(id)} Book`
    })
  },
  updateBook () {
    let self = this.$el
    let [title, author] = [this.title.value, this.author.value]
    let id = self.find('#input')[0].parentElement.className
    let model = libList.get(id)
    model.set({title: title, author: author})
    libList.set({model}, {remove: false})
    let arr = [...self.find(`#${id}`)[0].children]
    let num = arr.filter((a, i) => i !== 0 ? a : null).map((a, i) => (i === 0) ? `${a.innerHTML = title}` : `${a.innerHTML = author}`)
    self.find('#title')[0].removeAttribute('value')
  }
})
let appView = new App()
