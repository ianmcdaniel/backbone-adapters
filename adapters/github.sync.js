// Backbone Adapters - Github API
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
  var GithubSync = function(method, model, options) {

    var 
      base_url = "https://api.github.com",
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
      headers : { 
        "Authorization" : "token " + GithubSync.access_token
      }
    };

    // Ensure that we have a URL.
    if (!options.url) {
      var path = getValue(model, 'url') || urlError();
      params.url = base_url + path.replace(/^\//,'');
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.data = model.toJSON();
    }
    
    params = _.extend(params, options);
    params.data = JSON.stringify(params.data);
    
    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(params);

  };  

  
  // attach it to Backbone namespace
  Backbone.GithubSync = GithubSync;

})();