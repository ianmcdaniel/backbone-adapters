app.Collections.Movies = Backbone.Collection.extend({

  model         : app.Models.Movie,
  
  params        : {sort:'views'},
  
  url:function() {
    var 
      yurl    = "http://query.yahooapis.com/v1/public/yql",
      url     = "http://www.1channel.ch/?" + $.param(this.params),
      xpaths  = [
        "//div[@class='index_container']//div[@class='index_item index_item_ie']//a[@title]",
        "//form[@id='searchform']/fieldset/input[@name='key']"
      ],
      query   = "SELECT * FROM html WHERE url=\""+url+"\" AND (xpath=\"" + xpaths.join("\" OR xpath=\"") + "\")",
      format  = "json";
      
    return (yurl + "?q=" + encodeURIComponent(query) + "&format=" + format);
  },
  
  parse: function(resp) {
    var 
      data = resp.query.results,    
      movies = _.map(data.a,function(a) {
        return {
          'id'    : a.href.match(/^\/watch-(\d+)-/)[1],
          'title' : a.title.replace(/^watch | \(\d+\)$/ig,''),
          'img'   : (a.img && a.img.src)
        }
      });
    this.key = data.input.value;
    return _.uniq(movies,function(m){return m.id});
  },
  
  search:function(params) {
    this.params = params;
    this.fetch();
  },
  
  fetch: function(options) {
    options || (options = {});
    options.dataType = 'jsonp'
    options.parse = false;  
    return Backbone.Collection.prototype.fetch.call(this, options);
  }

});



