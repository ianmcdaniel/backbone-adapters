// An example Backbone application  
// This demo uses the Facebook Backbone Adapter
// Based off the backbone todos app by [JÃ©rÃ´me Gravel-Niquet](http://jgn.me/). 


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Friend Model
  // ----------

  // Basic **Friend** model has 'name', and 'id' attributes.
  window.Friend = Backbone.Model.extend({

    // Use Facebook Sync extension
    sync:FacebookSync
  });

  // Friends Collection
  // ---------------

  // The collection of friends
  var FriendList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Friend,
    
    // path to friends api
    url:'me/friends',
  
    // Use Facebook Sync extension
    sync:FacebookSync,
    
    // sort friends alphabetically
    comparator:function(friend) {
      return friend.get("name");
    }

  });

  // Create a collection of **Friends**.
  var Friends = new FriendList;

  // Friend View
  // --------------

  // The DOM element for a friend...
  var FriendView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single friend.
    template: _.template($('#friend-template').html()),

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
    el: $("#friendapp"),

    // Our template for the count at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // At initialization we bind to the relevant events on the `Friends`
    // collection. 
    initialize: function() {
    
      this.footer = this.$('footer');
      this.main = $('#main');
      this.login = $('#login-btn')
      
      Friends.bind('all', this.render, this);
      Friends.bind('reset', this.addAll, this);

      // Check facebook login status to see if the user is already logged in 
      // and approved
      FB.getLoginStatus(this.handleAuthResponse);
  
      // Listen to see if the users authentication changes 
      FB.Event.subscribe('auth.authResponseChange', this.handleAuthResponse);
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      if (Friends.length) {
        this.main.show();
        this.footer.show();
        this.login.hide();
        this.footer.html(this.statsTemplate({count: Friends.length}));
      }
    },
    
    addOne: function(friend) {
      var view = new FriendView({model: friend});
      this.$("#friend-list").append(view.render().el);
    },

    // Add all items in the **Friends** collection at once.
    addAll: function() {
      Friends.each(this.addOne);
    },
    
    // handle the auth response we get from facebook
    handleAuthResponse: function(resp) {
      // if user is logged in and has approved the app then fetch their friends
      if (resp.status === 'connected') {
        Friends.fetch();
      }
    }


  });


  // Intitialize Facebook
  FB.init({
    appId   : '249968071767179',
    status  : true,
    cookie  : true,
    xfbml   : true
  });


  // Create the app view
  var App = new AppView;


});








