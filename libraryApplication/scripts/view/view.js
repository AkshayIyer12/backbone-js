define(function (require) {
  const $ = require('jquery')
  const Backbone = require('backbone')
  const Bootstrap = require('bootstrap')
  const uuidv4 = require('uuid-v4')
  const _ = require('underscore')
  const dust = require('dust')
  const jqGrid = require('jqGrid')
  const buttonsTemplate = require('text!templates/buttons.dust')
  const modalTemplate = require('text!templates/modal.dust')
  const tableTemplate = require('text!templates/table.dust')
  const rowTemplate = require('text!templates/row.dust')
  const warningTemplate = require('text!templates/warning.dust')
  const capitalizeHead = a => {
    let arr = a.split('')
    let head = _.first(arr, [1]).map(a => a.toUpperCase())
    let rem = _.rest(arr, 1)
    return [...head, ...rem].join('')
  }
  let App = Backbone.View.extend({
    el: $('#app'),
    events: {
      'click #addBook': 'addBook',
      'click #delete': 'deleteBook',
      'click #selectall': 'selectAllCheckbox',
      'click .addEdit': 'resetForm',
      'click #edit': 'showModal',
      'click #add': 'addBookModal',
      'click #editBook': 'updateBook'
    },
    initialize (Collection, Model) {
      this.title = ''
      this.author = ''
      this.id = ''
      this.render()
      this.LibraryStore = Model
      this.libList = new Collection()
      let arr = [['Account Book Solution', 'Manoj Mangal Pandey', 123], ['Monopoly Book Tactical', 'Anil Dhirubai Ambani ', 223], ['Uno Book Guide', 'Mahesh Tripathi', 332], ['JavaScript Allonge', 'Paul Braithwaite', 345]]
      let self = this
      let reducer = _.reduce(arr, function (accum , v) {
        let obj = {
          Title: v[0],
          Author: v[1],
          id: v[2]
        }
        accum.push(obj)
        return accum
      }, [])
     _.map(reducer, v => this.createAndDisplayModel(v))
    },
    render () {
      let self = this.$el
      let obj = [{
          'id': 'add',
          'class': 'addEdit',
          'data-toggle': 'modal',
          'data-target': '#myModal',
          'value': 'Add Book'
        },
        {
          'id': 'delete',
          'value': 'Delete Book'
        },
        {
          'id': 'edit',
          'class': 'addEdit',
          'data-toggle': 'modal',
          'value': 'Update Book'
        }]
      dust.renderSource(modalTemplate, {}, function (err, res) {
        if (err) console.error(err)
        self.find('#buttons').after(res)
      })
      dust.renderSource(buttonsTemplate, {'button': obj}, function (err, res) {
        if (err) console.error(err)
        self.find('#buttons').append(res)
      })
      dust.renderSource(tableTemplate, {}, function (err, res) {
        if (err) console.error(err)
        self.find('#display2').jqGrid({
          colModel: [
            {name: 'Title', width: 160},
            {name: 'Author', width: 160}
          ],
          data: [],
          multiselect: true,
          guiStyle: 'bootstrap',
          iconSet: 'fontAwesome'
        })
      })
    },
    addBook () {
      this.id = uuidv4()
      this.title = this.$el.find('#title')[0]
      this.author = this.$el.find('#author')[0]
      let obj = {
        Title: this.title.value,
        Author: this.author.value,
        id: this.id
      }
      this.createAndDisplayModel(obj)
      this.$el.find('form').trigger('reset')
    },
    createAndDisplayModel (obj) {
      let libStoreObj = new this.LibraryStore(obj)
      this.libList.add(libStoreObj)
      let self = this.$el
      self.find('#display2').jqGrid('addRowData', obj.id, obj)
    },
    deleteBook () {
      let self = this
      this.$el.find('input[type="checkbox"]').each(function (e) {
        if (this.checked && e !== 0) {
          let parent = this.parentNode.parentNode
          self.libList.remove({id: parent.id})
          parent.remove()
        }
      })
    },
    addBookModal () {
      let self = this.$el
      self.find('#title')[0].value = ''
      self.find('#author')[0].value = ''
    },
    showModal () {
      let self = this.$el
      let popUp = self.find('#popup')[0]
      let val = self.find('#display2').jqGrid('getGridParam', 'selarrrow')
      let length = val === null ? 0 : val.length
      this.modalAttribute(length)
      if (length > 1) this.showCheckBoxError(popUp, true)
      else (length === 1) ? this.fillFormData(val) : this.showCheckBoxError(popUp, false)
    },
    showCheckBoxError (popUp, length) {
      dust.renderSource(warningTemplate, {"len": length}, (err, res) => {
        popUp.innerHTML = res
        setTimeout(() => {
          popUp.innerHTML = ''
          return popUp
        }, 1200)
      })
    },
    modalAttribute (length) {
      let modalSet = this.$el.find('#edit')[0]
      return (length === 1) ? modalSet.setAttribute('data-target', '#myModal') : modalSet.setAttribute('data-target', '')
    },
    fillFormData ([id]) {
      let self = this.$el
      self.find('#edit')[0].setAttribute('data-target', '#myModal')
      self.find('#input')[0].parentElement.setAttribute('class', id)
      let {Title, Author} = this.libList.get(id).attributes
      let obj = {
        '#title': Title,
        '#author': Author
      }
      _.each(_.keys(obj), a => self.find(a)[0].setAttribute('value', obj[a]))
    },
    resetForm (e) {
      let {id} = e.currentTarget
      let self = this.$el
      let node = self.find('.modal-footer')[0].children[0]
      self.find('form').trigger('reset')
      node.setAttribute('id', `${id}Book`)
      node.innerHTML = `${capitalizeHead(id)} Book`
    },
    updateBook () {
      let self = this.$el
      let [title, author] = [self.find('#title')[0].value, self.find('#author')[0].value]
      let id = self.find('#input')[0].parentElement.className
      let model = this.libList.get(id)
      model.set({Title: title, Author: author})
      this.libList.set({model}, {remove: false})
      let localRowData = self.find('#display2').jqGrid('getLocalRow', id)
      localRowData['Title'] = title
      localRowData['Author'] = author
      self.find('#display2').jqGrid('setRowData', id, localRowData)
    }
  })
  return App
})
