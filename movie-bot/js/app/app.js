(function() {
  
  // namespace
  var app = function(){};
  
  app.prototype = {

    Models       : {},
    Views        : {},
    Collections  : {},
    Routers      : {}, 
    
    boot: function() {                  
      new this.Routers.MainRouter();
      Backbone.history.start();      
    }
    
  } 
  
  // custom events
 _.extend(app.prototype, Backbone.Events);

  // global access
  window.app = new app;
  
}).call(this);







$(function(){app.boot()});