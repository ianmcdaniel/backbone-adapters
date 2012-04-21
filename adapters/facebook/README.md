Backbone Adapters - Facebook API
===

Friend Model
---
    window.Friend = Backbone.Model.extend({
      sync:FacebookSync
    });

 Friends Collection
---
    var FriendList = Backbone.Collection.extend({

      url:'me/friends',

      sync:FacebookSync,
  
      parse: function(resp) {
        // facebook returns friends in a 'data' array
        return resp.data;
      }

    });
