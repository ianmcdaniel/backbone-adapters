# Backbone Facebook Adapter

## Usage

Include facebook.sync.js after your backbone.js file and facebook javascript SDK file:

```html
<script src="backbone.js"></script>
<script src="http://connect.facebook.net/en_US/all.js"></script>
<script src="facebook.sync.js"></script>
```

##### Create your models:

```javascript
var Friend = Backbone.Model.extend({
  
  sync: Backbone.FacebookSync
    
});
```

##### and your collections:

```javascript
var FriendList = Backbone.Collection.extend({

  url:'me/friends',

  sync:Backbone.FacebookSync

});
```



## Licensed

This project is released under the MIT license

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.