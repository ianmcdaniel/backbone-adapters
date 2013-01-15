app.Views.MovieView = Backbone.View.extend({  

  
  initialize:function() {
    this.loaded = false;
    this.model.on('change',this.render, this);
    this.model.fetch()
  },
  
  render:function() {
    if(this.loaded) {
      html = [
        "<h1>" + this.model.get('title') + "</h1>",
        "<p>" + this.model.get('description') + "</p>"
      ].join('')
      this.$el.html(html);

      this.$el.append(this.model.embedCode(this.model.get('links')[0]) + "<br>");
      
      this.$el.append(this.model.get('links').join('<br>'));
      
    } else {
      this.loaded = true;
      this.$el.html('loading...');        
    }
    
    return this;
  
  }
  

})