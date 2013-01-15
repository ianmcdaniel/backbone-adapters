// Backbone Adapters - Yammer API
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
  var YammerSync = function(method, model, options) {
    var url, data= {}, type, success, error;

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
    
    // Make the request to yammer using the yammer js sdk
    yam.request({
      url     : url,
      method  : type,
      data    : data,
      success : (_.isFunction(options.success) && options.success),
      error   : (_.isFunction(options.error) && options.error)
    });    
    
  };
  
  // attach it to Backbone namespace
  Backbone.YammerSync = YammerSync;

})();