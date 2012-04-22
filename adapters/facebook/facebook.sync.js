// Backbone Adapters - Facebook API
// https://github.com/ianmcdaniel/Backbone-Adapters

  FacebookSync = function(method, model, options) {
    var url, data= {}, type, callback, getValue;
    console.log(method)
    type = {
      'create': 'post',
      'update': 'post',
      'delete': 'delete',
      'read':   'get'
    }[method];

    options || (options = {});
    
    getValue = function(object,prop) {
      if (!(object && object[prop])) return null;
      return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    }
    
    
        
    if(!options.url) {    
      if(getValue(model.attributes, 'id') && model.url === Backbone.Model.prototype.url) {
        // if we have an id, we dont need a url
        url = getValue(model.attributes, 'id'); 
      } else {
        url = getValue(model,'url');
        if(!url) {
          throw new Error('A "url" property or "id" must be specified');
        }
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
