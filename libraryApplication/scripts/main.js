requirejs.config({
  baseUrl: 'scripts/libs',
  paths: {
    app: '../app',
    model: '../model',
    view: '../view',
  },
  shim: {
    'uuid-v4': {
      exports: 'uuid-v4'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: 'jquery'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  }
});
requirejs(['app/app'], function (App) {

});
