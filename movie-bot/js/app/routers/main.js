app.Routers.MainRouter = Backbone.Router.extend({

  routes: {
    ""                  : "index",
    "index"             : "index",
    "watch/:id"         : "watch",    
    "search/:keyword"   : "search",
    "*path"             : "unknown"
  },
  
  initialize:function() {
    this.layout   = new app.Views.LayoutView;    
    
    this.popular  = new app.Collections.Movies;
    this.popular.fetch();
    
    this.popular.on('reset',this._setSearchKey,this);
  },
    
  index:function() {
    var homeview = new app.Views.HomeView({
      'collection'  : this.popular
    });
    this.layout.assign('#movie_list',homeview)
  },
  
  watch: function(id) {
    var 
      mov = new app.Models.Movie({'id':id}),
      movieview = new app.Views.MovieView({
        'model' : mov
      });
    this.layout.assign('#movie_list',movieview)
  },
  
  search: function(keywords) {
    console.log(1,this.key)
    if(!this.key) {
      return this.navigate('index',true);
    }
    var
      search = new app.Collections.Movies,
      searchview  = new app.Views.SearchView({
        'collection'      : search,
        'key'             : this.key,
        'search_keywords' : keywords
      });
    console.log(2)
    this.layout.assign('#movie_list',searchview)
    console.log(3)
  },
  
  unknown:function() {
    this.navigate('',true);
  },
  
  // private
  
  _setSearchKey:function(collection) {
    this.key = collection.key;
  }
  
})