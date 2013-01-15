app.Views.HomeView = Backbone.View.extend({  

  
  initialize:function() {
    this.collection.on('reset',this.render,this)
  },
  
  render:function() {
    console.log(1,this.collection)
    if(this.collection.any()) {
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