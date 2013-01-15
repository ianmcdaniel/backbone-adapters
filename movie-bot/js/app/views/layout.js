app.Views.LayoutView = Backbone.View.extend({  

  el:'body',
  
  events: {
    "submit #movie-search" : "submitSearch"
  },  
  
  submitSearch:function(e) {
    e.preventDefault();
    e.stopPropagation();
    var keywords = $(e.currentTarget).find('input[name=keywords]').val()
    keywords = keywords.replace(/\s/g,'+')
    Backbone.history.navigate('search/'+keywords,true)
  },
    
  // renders a subview to a region  
  assign:function(selector,view) {
    var el = $(selector)[0];
    if(!el) return;
    if (view) {
      // remove and delete old view
      if(el.view) {
        el.view.remove();
        delete el.view
      }
      el.view = view;
      view.render();
      $(el).html(view.$el);
    }
    return el.view;
  }  

})