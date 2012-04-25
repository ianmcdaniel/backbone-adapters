$(document).ready(function(){

  var lastRequest = {};

  IN = {
    API:{
      Raw:function(url){
        lastRequest = {};
        lastRequest.url = url;
        return IN.API
      },
      method:function(type){
        lastRequest.type = type;
        return IN.API
      },
      body:function(data){
        lastRequest.data = data;
        return IN.API
      },
      result:function(callback){
        lastRequest.callback = callback;
        return IN.API
      }
    }
  }  
  

  var Contact = Backbone.Model.extend({
    urlRoot:"people/",
    sync:Backbone.LinkedInSync
  })

  var Contacts = Backbone.Collection.extend({
    url : "people/~/connections",
    model: Contact,
    sync:Backbone.LinkedInSync
  });
  
  
  var Comment = Backbone.Model.extend({
    sync:Backbone.LinkedInSync
  })

  var Comments = Backbone.Collection.extend({
    url : "/people/~/network/updates/update-comments",
    model:Comment,
    sync:Backbone.LinkedInSync
  });


  module("LinkedInSync", {

    setup : function() {
      contact = new Contact({id:'~'});
      contacts = new Contacts();
      contacts.add(contact);
      comments = new Comments();
      comment = new Comment({id:'123'});
      comments.add(comment);
    }

  });
  
  test("sync: exists", function() {
    ok(!!Backbone.LinkedInSync);
  });
  

  test("sync: read model", function() {
    var contact = contacts.create({id: '123'});
    contact.fetch(lastRequest.url);
    equal(lastRequest.url, 'people/123');
    equal(lastRequest.type, 'GET');
    ok(_.isEmpty(JSON.parse(lastRequest.data)));
    ok(_.isFunction(lastRequest.callback));
  });

  test("sync: read collection", function() {
    contacts.fetch();
    equal(lastRequest.url, 'people/~/connections');
    equal(lastRequest.type, 'GET');
    ok(_.isEmpty(JSON.parse(lastRequest.data)));
    ok(_.isFunction(lastRequest.callback));
  });

  test("sync: passing data", function() {
    var data = {a:'a',one:1}
    contacts.fetch({data:data});
    equal(lastRequest.url, 'people/~/connections?a=a&one=1');
    ok(_.isEmpty(JSON.parse(lastRequest.data)));
    ok(_.isFunction(lastRequest.callback));
  });
  
  test("sync: passing fields", function() {
    var fields = "id,firstName";
    var data = {a:'a',one:1}
    contacts.fetch({fields:fields, data:data});
    equal(lastRequest.url, 'people/~/connections:(id,firstName)?a=a&one=1');
    ok(_.isEmpty(JSON.parse(lastRequest.data)));
    ok(_.isFunction(lastRequest.callback));
  });
  
  test("sync: create", function() {
    comments.create({comment:'hello'}).save();
    equal(lastRequest.url, '/people/~/network/updates/update-comments');
    equal(lastRequest.type, 'POST');
    equal(JSON.parse(lastRequest.data).comment, 'hello');
    ok(_.isFunction(lastRequest.callback));

  });

  test("sync: update", function() {
    // LinkedIn API doesn't actually allow editing comments
    comments.first().save({comment: 'world'});
    equal(lastRequest.url, '/people/~/network/updates/update-comments/123');
    equal(lastRequest.type, 'PUT');
    equal(JSON.parse(lastRequest.data).comment, 'world');
    ok(_.isFunction(lastRequest.callback));
  });


  test("sync: destroy", function() {
    comments.first().destroy({wait: true});
    equal(lastRequest.url, '/people/~/network/updates/update-comments/123');
    equal(lastRequest.type, 'DELETE');
    ok(_.isEmpty(JSON.parse(lastRequest.data)));
    ok(_.isFunction(lastRequest.callback));
  });


  test("sync: urlError", function() {
    var model = new (Backbone.Model.extend({
      sync:Backbone.LinkedInSync
    }));
    raises(function() {
      model.fetch();
    });
    model.fetch({url: '/one/two'});
    equal(lastRequest.url, '/one/two');
  });

});