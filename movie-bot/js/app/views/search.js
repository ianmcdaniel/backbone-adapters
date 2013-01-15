app.Views.SearchView = Backbone.View.extend({  

  
  initialize:function() {
    this.collection.on('reset',this.render,this);
    this.collection.search({
      'key'             : this.options.key,
      'search_keywords' : this.options.search_keywords
    })    
  },
  
  render:function() {
    console.log('d')
    if(this.collection.any()) {
        console.log('e')
      var html = "<ul style='list-style-type: none;text-align: center'>";
      this.collection.each(function(m){
        html += [
          "<li style='float:left;margin:10px;width:165px;height:255px'>",
          "  <a href='#watch/"+m.id+"' style='display:block'>",
          "    <img src='" + m.get('img') + "' />",
          "    <br>"+ m.get('title'),
          "  </a>",
          "</li>"
        ].join('')
      })
      html += "</ul>";
      this.$el.html(html);

    } else {
      this.$el.html('loading...');
    }
    return this;
  
  }
  

})