(function () {

  // Used to maintain the correct this context to InstagramFeed
  // in the jsonp callback function
  var InstagramFeedThisContext;

  this.InstagramFeed = function(options, appContainer) {
    InstagramFeedThisContext = this;
    this.appContainer = appContainer;
    this.clientId = options.clientId;
    this.redirectUri = options.redirectUri;
    this.numberOfColumns = options.numberOfColumns || 3;
    this.checkForInstagramToken();
    this.getPhotos();
  }

  this.InstagramFeed.prototype.checkForInstagramToken = function(callback) {
    var instagramToken = getParameterByName('access_token');
    if(instagramToken) {
      localStorage.instagramToken = instagramToken;
      window.location = window.location.href.split('#')[0]
    }
  }

  this.InstagramFeed.prototype.getPhotos = function() {
    var token = localStorage.instagramToken;
    if(localStorage.instagramToken) {
      var script = document.createElement('script');
      script.src = 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + token + '&callback=processJSONPResponse';
      document.querySelector('head').appendChild(script);
    } else {
      this.makeLoginButtonElement()
    }
  }

  this.processJSONPResponse = function(data) {
    if(data.meta.code === 200) {
      InstagramFeedThisContext.displayPhotos(data.data);
    }
  }

  this.InstagramFeed.prototype.displayPhotos = function(data) {
    this.makeColumnElements(function(columns) {
      for(var i = 0; i < data.length; i++) {
        var columnIndex = i % columns.length;
        this.makePhotoElement(data[i], columns[columnIndex])
      }
    }.bind(this));

  }
  this.InstagramFeed.prototype.makeColumnElements = function(callback) {
    var columns = [];
    for(var i = 0; i < this.numberOfColumns; i++) {
      var div = document.createElement('div');
      div.className = 'column';
      columns.push(div)
      this.appContainer.appendChild(div);
    }
    callback(columns);
  }

  this.InstagramFeed.prototype.makePhotoElement = function(photoData, parent) {
    var imageThumbnail = photoData.images.low_resolution.url;
    var imageFull = photoData.images.standard_resolution.url;
    var caption = photoData.caption.text;
    var div = document.createElement('div')
    var a = document.createElement('a');
    var img = document.createElement('img');

    div.className='instagram-photo';
    div.appendChild(a);
    a.href = imageFull;
    a.title = caption;
    a.className ='pure-box';
    a.appendChild(img);
    img.src = imageThumbnail;

    parent.appendChild(div);
  }

  this.InstagramFeed.prototype.makeLoginButtonElement = function() {
    var loginUrl = 'https://api.instagram.com/oauth/authorize/?client_id=' + this.clientId + '&redirect_uri='+ this.redirectUri + '/&response_type=token';
    var a = document.createElement('a');
    var linkText = document.createTextNode("Login with Instagram");
    a.appendChild(linkText);
    a.title = "Login with Instagram";
    a.href = loginUrl;
    document.getElementById('instagramFeed').appendChild(a);
  }

  this.InstagramFeed.prototype.clearElements = function() {
    while (this.appContainer.hasChildNodes()) {
      this.appContainer.removeChild(this.appContainer.firstChild);
    }
  }

  // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }



}());
