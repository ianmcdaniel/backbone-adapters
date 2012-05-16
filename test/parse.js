$(document).ready(function(){

  var
    _ajax = $.ajax,
    lastRequest = {};

  var Friend = Backbone.Model.extend({
    urlRoot : "classes/friends",
    sync:Backbone.ParseSync
  })

  var Friends = Backbone.Collection.extend({
    url : "classes/friends",
    model: Friend,
    sync:Backbone.ParseSync
  });

  var Message = Backbone.Model.extend({
    sync:Backbone.ParseSync
  })

  var Feed = Backbone.Collection.extend({
    url : "classes/messages",
    model:Message,
    sync:Backbone.ParseSync
  });
  
  Backbone.ParseSync.application_id   = "12345";
  Backbone.ParseSync.rest_api_key     = "67890";

  module("ParseSync", {

    setup : function() {
      $.ajax = function(obj) {lastRequest = obj};
    
      friend = new Friend({id:'123'});
      friends = new Friends();
      feed = new Feed();
      message = new Message({id:'456'});
      feed.add(message);
    },
    
    teardown: function() {
      $.ajax = _ajax;
    }

  });
  
  test("exists", function() {
    ok(!!Backbone.ParseSync);
  });
  

  test("read model", function() {
    friend.fetch();
    equal(lastRequest.url, 'https://api.parse.com/1/classes/friends/123');
    equal(lastRequest.type, 'GET');
    ok(_.isUndefined(lastRequest.data));
    ok(_.isFunction(lastRequest.success));
    ok(_.isFunction(lastRequest.error));
  });



  test("read collection", function() {
    friends.fetch();
    equal(lastRequest.url, 'https://api.parse.com/1/classes/friends');
    equal(lastRequest.type, 'GET');
    ok(_.isUndefined(lastRequest.data));
    ok(_.isFunction(lastRequest.success));
    ok(_.isFunction(lastRequest.error));
  });



  test("passing data", function() {
    var data = {a:'a',one:1}
    friends.fetch({'data':data});
    equal(lastRequest.type, 'GET');
    equal(lastRequest.url, 'https://api.parse.com/1/classes/friends');
    equal(JSON.parse(lastRequest.data).a, 'a');
    equal(JSON.parse(lastRequest.data).one, 1);
  });
  
  
  test("create", function() {
    feed.create({message:'hello'}).save();
    equal(lastRequest.url, 'https://api.parse.com/1/classes/messages');
    equal(lastRequest.type, 'POST');
    equal(JSON.parse(lastRequest.data).message, 'hello');
    ok(_.isFunction(lastRequest.success));
  });


  test("update", function() {
    feed.first().save({message: 'world'});
    equal(lastRequest.url, 'https://api.parse.com/1/classes/messages/456');
    equal(lastRequest.type, 'PUT');
    equal(JSON.parse(lastRequest.data).message, 'world');
    ok(_.isFunction(lastRequest.success));
  });


  test("destroy", function() {
    feed.first().destroy({wait: true});
    equal(lastRequest.url, 'https://api.parse.com/1/classes/messages/456');
    equal(lastRequest.type, 'DELETE');
    ok(_.isUndefined(lastRequest.data));
    ok(_.isFunction(lastRequest.success));
  });


  test("url error", function() {
    var model = new (Backbone.Model.extend({
      sync:Backbone.ParseSync
    }));
    raises(function() {
      model.fetch();
    });
    model.fetch({url: '/one/two'});
    equal(lastRequest.url, '/one/two');
  });



});