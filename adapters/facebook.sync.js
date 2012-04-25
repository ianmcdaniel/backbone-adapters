// Backbone Adapters - Facebook API
// https://github.com/ianmcdaniel/Backbone-Adapters

(function() {

  var getValue = function(object,prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  }
  
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // A Backbone.sync Adapter for the facebook graph api
  var FacebookSync = function(method, model, options) {
    var url, data= {}, type, callback;

    options || (options = {});
    type = {
      'create': 'post',
      'update': 'post',
      'delete': 'delete',
      'read':   'get'
    }[method];

    if(options.type) {
      type = options.type
    }
        
    if(!options.url) {    
      if(getValue(model.attributes, 'id') && model.url === Backbone.Model.prototype.url) {
        // if we have an id, we dont need a url
        url = getValue(model.attributes, 'id'); 
      } else {
        url = getValue(model, 'url') || urlError();
      }
    } else {
      url = options.url;
    }
    
    // if a collection's parse method has not been changed then
    // create one that works with facebook data results
    if(model && model.parse && model.parse === Backbone.Collection.prototype.parse) {
      model.parse = function(resp) {return resp.data}
    }

    if (!options.data && model && (method == 'create' || method == 'update')) {
      data = model.toJSON();
    }
    _.extend(data, options.data);

    // make sure error and success functions get called
    callback = function(res) {
      if (!res) return;
      if (res.error) {
        if (options.error && _.isFunction(options.error)) {
          return options.error(res);
        }
      } else {
        if (options.success && _.isFunction(options.success)) {
          return options.success(res);
        }
      }
    };
    
    // Make the request to facebook using the facebook js sdk
    if(type == 'get') {
      return FB.api(url,data,callback)
    } else {
      return FB.api(url,type,data,callback)
    }
    
  };
  
  // attach it to Backbone namespace
  Backbone.FacebookSync = FacebookSync;

})();