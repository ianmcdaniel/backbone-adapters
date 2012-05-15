// Backbone Adapters - Parse API
// https://github.com/ianmcdaniel/Backbone-Adapters

(function() {

  var getValue = function(object,prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  }
  
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // A Backbone.sync Adapter for the parse api
  var ParseSync = function(method, model, options) {

    var 
      base_url = "https://api.parse.com/1/",
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
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        "X-Parse-Application-Id"  : Backbone.ParseSync.application_id,
        "X-Parse-REST-API-Key"    : Backbone.ParseSync.rest_api_key
      }
    };

    // Ensure that we have a URL.
    if (!options.url) {
      var path = getValue(model, 'url') || urlError();
      params.url = base_url + path.replace(/^\//,'');
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      data = model.toJSON();
      delete data.createdAt;
      delete data.updatedAt;      
    }
    params.data = JSON.stringify(data);

    // if a collection's parse method has not been changed then
    // create one that works with facebook data results
    if(model && model.parse && model.parse === Backbone.Collection.prototype.parse) {
      model.parse = function(resp) {return resp.results}
    }


    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };  

  // containers for credentials
  _.extend(ParseSync,{
    application_id:null,
    rest_api_key:null
  })
  
  // attach it to Backbone namespace
  Backbone.ParseSync = ParseSync;

})();