define(function (require) {
  const $ = require('jquery')
  const Backbone = require('backbone')
  const Bootstrap = require('bootstrap')
  const uuidv4 = require('uuid-v4')
  const _ = require('underscore')
  const dust = require('dust')
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
          title: v[0],
          author: v[1],
          id: v[2]
        }
        accum.push(obj)
        return accum
      }, [])
      _.map(reducer, v => this.createAndDisplayModel(v))
    },
    render () {
      let self = this.$el
      dust.renderSource(modalTemplate, {}, function (err, res) {
        if (err) console.error(err)
        self.find('#buttons').after(res)
      })
      dust.renderSource(buttonsTemplate, {}, function (err, res) {
        if (err) console.error(err)
        self.find('#buttons').append(res)
      })
      dust.renderSource(tableTemplate, {}, function (err, res) {
        if (err) console.error(err)
        self.find('#display').append(res)
      })
    },
    addBook () {
      this.id = uuidv4()
      this.title = this.$el.find('#title')[0]
      this.author = this.$el.find('#author')[0]
      let obj = {
        title: this.title.value,
        author: this.author.value,
        id: this.id
      }
      this.createAndDisplayModel(obj)
      this.$el.find('form').trigger('reset')
    },
    createAndDisplayModel (obj) {
      let libStoreObj = new this.LibraryStore(obj)
      this.libList.add(libStoreObj)
      let self = this.$el
      dust.renderSource(rowTemplate, {'book': [obj]}, (err, res) => {
        self.find('tbody').append(res)
      })
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
      if (length > 1) this.showCheckBoxError(popUp, true)
      else (checkedItem.length === 1) ? this.fillFormData(checkedItem[0].parentElement.parentElement) : this.showCheckBoxError(popUp, false)
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
    fillFormData ({id}) {
      let self = this.$el
      self.find('#edit')[0].setAttribute('data-target', '#myModal')
      self.find('#input')[0].parentElement.setAttribute('class', id)
      let {title, author} = this.libList.get(id).attributes
      let obj = {
        '#title': title,
        '#author': author
      }
      _.each(_.keys(obj), a => self.find(a)[0].setAttribute('value', obj[a]))
    },
    resetForm (e) {
      let {id} = e.currentTarget
      let self = this.$el
      let node = self.find('#input')[0].children
      self.find('form').trigger('reset')
      let arr = _.filter(_.toArray(node), (v, i) => i === 2 ? v : null)
      _.each(arr, a => {
        a.setAttribute('id', `${id}Book`)
        a.innerHTML = `${capitalizeHead(id)} Book`
        return a
      })
    },
    updateBook () {
      let self = this.$el
      let [title, author] = [this.title.value, this.author.value]
      let id = self.find('#input')[0].parentElement.className
      let model = this.libList.get(id)
      model.set({title: title, author: author})
      this.libList.set({model}, {remove: false})
      let arr = _.toArray(self.find(`#${id}`)[0].children)
      let num = _.filter(arr, (a, i) => i !== 0 ? a : null)
      _.each(num, (a, i) => {
        let val = (i === 0) ? title : author
        a.innerHTML = val
        return a
      })
      self.find('#title')[0].removeAttribute('value')
    }
  })
  return App
})
