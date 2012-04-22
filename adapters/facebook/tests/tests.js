$(document).ready(function(){


  
  var lastRequest = {};
  FB = {
    api:function(url,type,data,callback) {
			if(typeof type == 'object') {
  			lastRequest = {
  			  url:url,
  			  type:null,
  			  data:type,
  			  callback:data
  			}
			}	else {
  			lastRequest = {
  			  url:url,
  			  type:type,
  			  data:data,
  			  callback:callback
  			}
			}
    }
  }
  

  var Friend = Backbone.Model.extend({
    sync:FacebookSync
  })

  var Friends = Backbone.Collection.extend({
    url : "me/friends",
    model: Friend,
    sync:FacebookSync
  });

  var Message = Backbone.Model.extend({
    sync:FacebookSync
  })

  var Feed = Backbone.Collection.extend({
    url : "me/feed",
    model:Message,
    sync:FacebookSync
  });

  module("FacebookSync", {

    setup : function() {
      friend = new Friend({id:'me'});
      friends = new Friends();
      feed = new Feed();
      message = new Message({id:'123'});
      feed.add(message);
    }

  });
  
  test("sync: FacebookSync exists", function() {
    ok(!!FacebookSync);
  });
  

  test("sync: read model", function() {
    friend.fetch();
    equal(lastRequest.url, 'me');
    equal(lastRequest.type, null);
    ok(_.isObject(lastRequest.data));
    ok(_.isFunction(lastRequest.callback));
  });

  test("sync: read collection", function() {
    friends.fetch();
    equal(lastRequest.url, 'me/friends');
    equal(lastRequest.type, null);
    ok(_.isObject(lastRequest.data));
    ok(_.isFunction(lastRequest.callback));
  });

  test("sync: passing data", function() {
    var data = {a:'a',one:1}
    friends.fetch({data:data});
    equal(lastRequest.url, 'me/friends');
    equal(lastRequest.data.a, 'a');
    equal(lastRequest.data.one, 1);
  });
  

  
  test("sync: create", function() {
    feed.create({message:'hello'}).save();
    equal(lastRequest.url, 'me/feed');
    equal(lastRequest.type, 'post');
    equal(lastRequest.data.message, 'hello');
    ok(_.isFunction(lastRequest.callback));

  });

  test("sync: update", function() {
    feed.first().save({message: 'world'});
    equal(lastRequest.url, '123');
    equal(lastRequest.type, 'post');
    equal(lastRequest.data.message, 'world');
    ok(_.isFunction(lastRequest.callback));
  });


  test("sync: destroy", function() {
    feed.first().destroy({wait: true});
    equal(lastRequest.url, '123');
    equal(lastRequest.type, 'delete');
    ok(_.isObject(lastRequest.data));
    ok(_.isFunction(lastRequest.callback));
  });


  test("sync: urlError", function() {
    var model = new (Backbone.Model.extend({
      sync:FacebookSync
    }));
    raises(function() {
      model.fetch();
    });
    model.fetch({url: '/one/two'});
    equal(lastRequest.url, '/one/two');
  });


  
  

});