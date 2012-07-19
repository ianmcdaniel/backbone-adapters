// An example Backbone application  
// This demo uses the Instagram Backbone Adapter
// Based off the backbone todos app by [JÃ©rÃ´me Gravel-Niquet](http://jgn.me/). 


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Friend Model
  // ----------

  // Basic **Friend** model has 'name', and 'id' attributes.
  window.Media = Backbone.Model.extend({

    // Use Facebook Sync extension
    sync:Backbone.InstagramSync
  });

  // Friends Collection
  // ---------------

  // The collection of friends
  var MediaList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Media,
    
    // path to friends api
    url:'users/self/feed',
  
    // Use Facebook Sync extension
    sync:Backbone.InstagramSync,
    
    parse:function(resp) {
      return resp.data
    }

  });

  // Create a collection of Images.
  var Images = new MediaList;

  // Friend View
  // --------------

  // The DOM element for a friend...
  var MediaView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single friend.
    template: _.template($('#media-template').html()),

    // render the names of the friends.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#instagramapp"),

    // Our template for the count at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // At initialization we bind to the relevant events on the `Friends`
    // collection. 
    initialize: function() {
    
      this.footer = this.$('footer');
      this.main = $('#main');
      this.login = $('#login-btn')
      
      Images.bind('all', this.render, this);
      Images.bind('reset', this.addAll, this);

      Images.fetch();

    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      if (Images.length) {
        this.main.show();
        this.footer.show();
        this.login.hide();
        this.footer.html(this.statsTemplate({count: Images.length}));
      }
    },
    
    addOne: function(media) {
      var view = new MediaView({model: media});
      this.$("#media-list").append(view.render().el);
    },

    // Add all items in the **Friends** collection at once.
    addAll: function() {
      Images.each(this.addOne);
    }


  });



function getHashVars() {
    var vars = {};
    var parts = window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var params = getHashVars();
if(params.access_token) {
  $('#login-btn').hide();
  Backbone.InstagramSync.access_token = params.access_token;
  
  // Create the app view
  var App = new AppView;
  
} else {
  $('#login-btn').show()
}






});








