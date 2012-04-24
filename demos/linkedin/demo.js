// An example Backbone application  
// This demo uses the LinkedIn Backbone Adapter
// Based off the backbone todos app by [JÃ©rÃ´me Gravel-Niquet](http://jgn.me/). 


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Contact Model
  // ----------

  // Basic **Contact** model has 'name', and 'id' attributes.
  window.Contact = Backbone.Model.extend({
    defaults:{
      firstName:"",
      lastName:"",
      headline:"",
      pictureUrl:"images/icon_no_photo_40x40.png",
      siteStandardProfileRequest:{
        url:""
      }
    },

    // Use LinkedIn Sync extension
    sync:Backbone.LinkedInSync
  });

  // Conatcts Collection
  // ---------------

  // The collection of contacts
  var ContactList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Contact,
    
    // path to connections api
    url:'people/~/connections',
  
    // Use LinkedIn Sync extension
    sync:Backbone.LinkedInSync,
    
    // sort contacts alphabetically
    comparator:function(contact) {
      return contact.get("firstName");
    }

  });

  // Create a collection of **Connections**.
  var Contacts = new ContactList;

  // Contact View
  // --------------

  // The DOM element for a contact...
  var ContactView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single contact.
    template: _.template($('#contact-template').html()),

    // render the names of the contact.
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
    el: $("#contactsapp"),

    // Our template for the count at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // At initialization we bind to the relevant events on the `Contacts`
    // collection. 
    initialize: function() {
    
      this.footer = this.$('footer');
      this.main = $('#main');
      this.login = $('#login-btn')
      
      Contacts.bind('all', this.render, this);
      Contacts.bind('reset', this.addAll, this);


      // Listen to see if the users authentication changes 
      IN.Event.on(IN, "auth", this.handleAuthResponse);
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      if (Contacts.length) {
        this.main.show();
        this.footer.show();
        this.login.hide();
        this.footer.html(this.statsTemplate({count: Contacts.length}));
      }
    },
    
    addOne: function(contact) {
      var view = new ContactView({model: contact});
      this.$("#contacts-list").append(view.render().el);
    },

    // Add all items in the **Contacts** collection at once.
    addAll: function() {
      Contacts.each(this.addOne);
    },
    
    // handle the auth response we get from linkedin
    handleAuthResponse: function(resp) {
      // if user is logged in and has approved the app then fetch their connections
      Contacts.fetch();
    }

  });


  // Create the app view
  var App = new AppView;


});








