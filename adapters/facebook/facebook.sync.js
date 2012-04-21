// Backbone Adapters - Facebook API
// https://github.com/ianmcdaniel/Backbone-Adapters

  FacebookSync = function(method, model, options) {
    var callback, type, params = {};
    type = {
      'create': 'post',
      'update': 'post',
      'delete': 'delete',
      'read':   'get'
    }[method];

    options || (options = {});

    if(model && model.url) {
      params.url = (_.isFunction(model.url)) ? model.url(method) : model.url;
    } else if (!options.url) {
      throw new Error('A "url" property or function must be specified');
    }

    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.data = JSON.stringify(model);
    }
    
    params = _.extend(params, options);
    
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
      return FB.api(params.url,params,callback)
    } else {
      return FB.api(params.url,type,params,callback)
    }
    
  };
