// Backbone Adapters - LinkedIn API
// https://github.com/ianmcdaniel/Backbone-Adapters

(function() {


  var getValue = function(object,prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  }
  
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // A Backbone.sync Adapter for the linkedin api
  var LinkedInSync = function(method, model, options) {
    var url, data= {}, type, fields = "", query = "", callback;

    options || (options = {});
    type = {
      'create': 'POST',
      'update': 'PUT',
      'delete': 'DELETE',
      'read':   'GET'
    }[method];

    if(options.type) {
      type = options.type
    }
    
    if (!options.url) {
      url = getValue(model, 'url') || urlError();
    } else {
      url = options.url;
    }
    
    if (options.fields) {
      fields = ":(" + options.fields + ")";
    }
        
    // if a collection's parse method has not been changed then
    // create one that works with linkedin data
    if(model && model.parse && model.parse === Backbone.Collection.prototype.parse) {
      model.parse = function(resp) {return resp.values}
    }

    if (!options.data && model && (method == 'create' || method == 'update')) {
      data = model.toJSON();
    }
    _.extend(data, options.data);
    
    if(type == 'GET' && !_.isEmpty(data)) {
      query = "?" + $.param(data);
      data = {};
    }
    data = JSON.stringify(data);

    // make sure error and success functions get called
    callback = function(res) {
      if (!res) return;
      if (res.errorCode) {
        if (options.error && _.isFunction(options.error)) {
          return options.error(res);
        }
      } else {
        if (options.success && _.isFunction(options.success)) {
          return options.success(res);
        }
      }
    };
    
    // Make the request to linkedin using the linkedin js sdk
    IN.API.Raw(url + fields + query).method(type).body(data).result(callback);
    
  };
  
  // attach it to Backbone namespace
  Backbone.LinkedInSync = LinkedInSync;

})();