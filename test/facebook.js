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
    sync:Backbone.FacebookSync
  })

  var Friends = Backbone.Collection.extend({
    url : "me/friends",
    model: Friend,
    sync:Backbone.FacebookSync
  });

  var Message = Backbone.Model.extend({
    sync:Backbone.FacebookSync
  })

  var Feed = Backbone.Collection.extend({
    url : "me/feed",
    model:Message,
    sync:Backbone.FacebookSync
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
  
  test("exists", function() {
    ok(!!Backbone.FacebookSync);
  });
  

  test("read model", function() {
    friend.fetch();
    equal(lastRequest.url, 'me');
    equal(lastRequest.type, null);
    ok(_.isObject(lastRequest.data));
    ok(_.isFunction(lastRequest.callback));
  });

  test("read collection", function() {
    friends.fetch();
    equal(lastRequest.url, 'me/friends');
    equal(lastRequest.type, null);
    ok(_.isObject(lastRequest.data));
    ok(_.isFunction(lastRequest.callback));
  });

  test("passing data", function() {
    var data = {a:'a',one:1}
    friends.fetch({data:data});
    equal(lastRequest.url, 'me/friends');
    equal(lastRequest.data.a, 'a');
    equal(lastRequest.data.one, 1);
  });
  
  
  test("create", function() {
    feed.create({message:'hello'}).save();
    equal(lastRequest.url, 'me/feed');
    equal(lastRequest.type, 'post');
    equal(lastRequest.data.message, 'hello');
    ok(_.isFunction(lastRequest.callback));
    ok(false)

  });

  test("update", function() {
    feed.first().save({message: 'world'});
    equal(lastRequest.url, '123');
    equal(lastRequest.type, 'post');
    equal(lastRequest.data.message, 'world');
    ok(_.isFunction(lastRequest.callback));
  });


  test("destroy", function() {
    feed.first().destroy({wait: true});
    equal(lastRequest.url, '123');
    equal(lastRequest.type, 'delete');
    ok(_.isObject(lastRequest.data));
    ok(_.isFunction(lastRequest.callback));
  });


  test("url error", function() {
    var model = new (Backbone.Model.extend({
      sync:Backbone.FacebookSync
    }));
    raises(function() {
      model.fetch();
    });
    model.fetch({url: '/one/two'});
    equal(lastRequest.url, '/one/two');
  });


  
  

});