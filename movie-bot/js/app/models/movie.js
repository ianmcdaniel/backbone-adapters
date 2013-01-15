app.Models.Movie = Backbone.Model.extend({  

  order:[
    "youtube.com",
    "dailymotion.com",
    "putlocker.com",
    "sockshare.com",    
    "videoslasher.com",
    "vidxden.com",
    "vidbux.com",
    "nosvideo.com",
    "nowvideo.eu",  
    "sharesix.com",
    "movreel.com",
    "uploadc.com",    
  ],

  
  url: function() {
    var 
      yurl    = "http://query.yahooapis.com/v1/public/yql",
      url     = "http://www.1channel.ch/watch-"+this.id,
      xpaths  = [
        "//head/meta[@name='description']",     // description & title
        "//div[@class='movie_thumb']/img",      // image
        "//span[@class=\'movie_version_link\']" // links
      ],
      query   = "SELECT * FROM html WHERE url=\""+url+"\" AND (xpath=\"" + xpaths.join("\" OR xpath=\"") + "\")",
      format  = "json";
      
    return (yurl + "?q=" + encodeURIComponent(query) + "&format=" + format);    
  },
  

  parse: function(resp) {
    console.log(resp)
    var 
      data = resp.query.results,
      meta = data.meta.content.match(/^Watch (.+) online - (.+) Download/),
      title = meta[1],
      desc  = meta[2], 
      img   = data.img.src,
      links = this.sortLinks(data.span);
      
    return {
      'title'       : title,
      'description' : desc, 
      'image'       : img,
      'links'       : links
    }
  },
  
  fetch: function(options) {
    options || (options = {});
    options.dataType = 'jsonp'
    return Backbone.Model.prototype.fetch.call(this, options);
  },
  
  embedCode: function(link) {
        console.log(link)
    var 
      embed   = "",
      domain  = link.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1],
      id      = link.replace(/#/g,'').match(/[^\/?#]+$/)[0];

    switch(domain.replace('www.','')) {
      case "youtube.com":
        id = link.match(/v=([^\/?#]+)/)[1];
        embed = "<iframe width='560' height='315' src='http://www.youtube.com/embed/"+id+"' frameborder='0' allowfullscreen></iframe>";
        break;
      case "dailymotion.com":
        id = "";
        embed = "<iframe frameborder='0' width='480' height='276' src='http://www.dailymotion.com/embed/video/"+id+"'></iframe>";
        break;
      case "putlocker.com":
      case "sockshare.com":
      case "videoslasher.com":
        embed = "<iframe src='http://"+domain+"/embed/"+id+"' width='600' height='360' frameborder='0' scrolling='no'></iframe>";
        break;
      case "movreel.com": 
        embed = "<iframe src='http://"+domain+"/embed/"+id+"' width='600' height='470' frameborder='0' scrolling='no'></iframe>";
        break;
      case "vidxden.com":
      case "vidbux.com":
        embed = "<iframe src='http:/"+domain+"/embed-"+id+"-width-600-height-360.html' width='600' height='360' frameborder='0' scrolling='no'></iframe>";
        break;
      case "nowvideo.eu":
        embed = "<iframe src='http:/embed.nowvideo.eu/embed.php?v="+id+"' width='600' height='360' frameborder='0' scrolling='no'></iframe>";
        break;
      case "nosvideo.com":
        id = link.match(/v=([^\/?#]+$)/)[1];
        embed = "<iframe src='http://"+domain+"/embed/"+id+"/640x360' width='640' height='360' frameborder='0' scrolling='no'></iframe>";      
        break;
      case "uploadc.com":
        id = link.match(/\.com\/([^\/?#]+)\//)[1];
        embed = "<iframe src='http://"+domain+"/embed-"+id+".html' width='650' height='369' frameborder='0' scrolling='no'></iframe>";
      case "sharesix.com":
        embed = "<iframe src='http://yourproxyvideo.com/embed/player.php?getvid=http://sharesix.com/"+id+"' width='600' height='450' frameborder='0' scrolling='no'></iframe>";
        break;
      case "sharerepo.com":
      default:
        break;
    }
    return embed;
  },
  
  sortLinks: function(links) {
    var self = this;
    links = _.compact(_.map(links,function(link){
      return (!link.a.href || link.a.href.match(/^http:/i)) ? null : atob(link.a.href.match(/url=([^&#]*)/)[1]);
    }));
    links.sort(function(a,b){
      var 
        regx = (/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i),
        important_a = self.order.indexOf(regx.exec(a)[1].replace('www.',''))+1, 
        important_b = self.order.indexOf(regx.exec(b)[1].replace('www.',''))+1;
      return (
        (important_a && !important_b) ? -1 :
        (important_b && !important_a) ? 1 :
        (important_a && important_b) ? important_a - important_b : 0
      )
    })
    return links;
  }
  
  
})





