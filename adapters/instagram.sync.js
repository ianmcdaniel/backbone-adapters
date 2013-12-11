// Backbone Adapters - Instagram API
// https://github.com/ianmcdaniel/Backbone-Adapters

(function() {

  var getValue = function(object,prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  }
  
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // A Backbone.sync Adapter for the github api
  var InstagramSync = function(method, model, options) {

    var 
      base_url = "https://api.instagram.com/v1/",
      data = {},
      type = {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read':   'GET'
      }[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {
      type: type,
      dataType: 'jsonp',
      contentType: 'application/json',
      data:{}
    };

    // Ensure that we have a URL.
    if (!options.url) {
      var path = getValue(model, 'url') || urlError();
      params.url = base_url + path.replace(/^\//,'');
    }
    
    // if a collection or model's parse method has not been changed then
    // create one that works with instagram data results
    if(model && model.parse) {
      if (model.parse === Backbone.Collection.prototype.parse || model.parse === Backbone.Model.prototype.parse) {
        model.parse = function(resp) {return resp.data}
      }
    }


    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      // Unfortunately, Instagram API does not appear to support POSTing from jsonp
      params.data._method = type;
      params.data = model.toJSON();
    }
    
    params = _.extend(params, options);
    
    params.data.access_token = InstagramSync.access_token;
    //params.data = JSON.stringify(params.data);
    
    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(params);

  };  

  // container for access_token
  InstagramSync.access_token = null;
  
  // attach it to Backbone namespace
  Backbone.InstagramSync = InstagramSync;

})();