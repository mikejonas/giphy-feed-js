(function () {

  // Used to maintain the correct this context to InstagramFeed
  // in the jsonp callback function
  var InstagramFeedThisContext;

  this.InstagramFeed = function(options, appContianer) {
    InstagramFeedThisContext = this;
    this.appContianer = appContianer;
    this.clientId = options.clientId;
    this.redirectUri = options.redirectUri;
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
    for(var i = 0; i < data.length; i++) {
      this.makePhotoElement(data[i])
    }
  }

  this.InstagramFeed.prototype.makePhotoElement = function(photoData) {
    var imageThumbnail = photoData.images.thumbnail.url;
    var imageFull = photoData.images.standard_resolution.url;
    var caption = photoData.caption.text;

    var a = document.createElement('a');
    var img = document.createElement('img');
    a.href = imageFull;
    a.title = caption;
    a.appendChild(img);
    img.src = imageThumbnail;

    this.appContianer.appendChild(a);
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
    while (this.appContianer.hasChildNodes()) {
      this.appContianer.removeChild(this.appContianer.firstChild);
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
