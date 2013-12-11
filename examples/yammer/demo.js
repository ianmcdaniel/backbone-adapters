// An example Backbone application  
// This demo uses the Yammer Backbone Adapter
// Based off the backbone todos app by [JÃ©rÃ´me Gravel-Niquet](http://jgn.me/). 


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Friend Model
  // ----------

  // Basic Coworker model has 'name', and 'id' attributes.
  window.Coworker = Backbone.Model.extend({

    // Use Yammer Sync extension
    sync:Backbone.YammerSync
  });

  // Coworkers Collection
  // ---------------

  // The collection of coworkers
  var CoworkerList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Coworker,
    
    // path to users api
    url:'https://www.yammer.com/api/v1/users.json',
  
    // Use Yammer Sync extension
    sync:Backbone.YammerSync,
    
    // sort friends alphabetically
    comparator:function(coworker) {
      return coworker.get("name");
    }

  });

  // Create a collection of **Friends**.
  window.Coworkers = new CoworkerList;

  // Coworker View
  // --------------

  // The DOM element for a coworker...
  var CoworkerView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single friend.
    template: _.template($('#item-template').html()),

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
    el: $("#app"),

    // Our template for the count at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // At initialization we bind to the relevant events on the `Friends`
    // collection. 
    initialize: function() {
    
      this.footer = this.$('footer');
      this.main = $('#main');
      this.login = $('#yammer-login')
      
      Coworkers.bind('all', this.render, this);
      Coworkers.bind('reset', this.addAll, this);

      // Check yammer login status to see if the user is already logged in 
      // and approved
      _.bindAll(this,"handleAuthResponse")
      yam.connect.loginButton(this.login, this.handleAuthResponse);
  
      // Listen to see if the users authentication changes 
      //FB.Event.subscribe('auth.authResponseChange', this.handleAuthResponse);
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      if (Coworkers.length) {
        this.main.show();
        this.footer.show();
        this.login.hide();
        this.footer.html(this.statsTemplate({count: Coworkers.length}));
      }
    },
    
    addOne: function(coworker) {
      var view = new CoworkerView({model: coworker});
      this.$("#list").append(view.render().el);
    },

    // Add all items in the **Friends** collection at once.
    addAll: function() {
      Coworkers.each(this.addOne);
    },
    
    // handle the auth response we get from facebook
    handleAuthResponse: function(resp) {
      // if user is logged in and has approved the app then fetch their friends
      if (resp.authResponse) {
        this.login.html('Welcome!');
        Coworkers.fetch();
      }
    }


  });



  // Create the app view
  var App = new AppView;


});








