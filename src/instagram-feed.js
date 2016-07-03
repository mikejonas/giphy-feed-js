(function () {

  // Used to maintain the correct this context to InstagramFeed
  // in the jsonp callback function
  var InstagramFeedThisContext;

  this.InstagramFeed = function(options, appContainer) {
    InstagramFeedThisContext = this;
    this.appContainer = appContainer;
    this.clientId = options.clientId;
    this.redirectUri = options.redirectUri;
    this.minColumnWidth = options.minColumnWidth;
    this.photoData;
    this.columns = {
      elements: [],
      heights: [],
      count: 0
    };
    this.appendedPhotos = 0;
    this.windowResizeHandler();
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
    if (data) { this.photoData = data; }
    this.makeColumnElements();
    for(var i = 0; i < this.photoData.length; i++) {
      var smallestColumnIndex = this.columns.heights.indexOf(Math.min.apply(Math, this.columns.heights));
      this.makePhotoElement(this.photoData[i], smallestColumnIndex);
    }
  }

  this.InstagramFeed.prototype.makeColumnElements = function() {
    this.columns.heights = [];
    this.columns.elements = [];
    this.appendedPhotos = 0;
    this.clearElements()
    var numberOfColumns = Math.floor(this.appContainer.offsetWidth / this.minColumnWidth);
    for(var i = 0; i < numberOfColumns; i++) {
      var div = document.createElement('div');
      div.className = 'column';
      div.style.width = 100 / numberOfColumns + '%';
      this.columns.elements.push(div);
      this.columns.heights.push(0);
      this.appContainer.appendChild(div);
    }
  }

  this.InstagramFeed.prototype.makePhotoElement = function(photoData, columnIndex) {
    var imageThumbnail = photoData.images.low_resolution;
    var imageFull = photoData.images.standard_resolution;
    var caption = photoData.caption.text;
    var div = document.createElement('div')
    var a = document.createElement('a');
    var img = document.createElement('img');

    div.className='instagram-photo';
    div.appendChild(a);
    a.href = imageFull.url;
    a.title = caption;
    a.className ='pure-box';
    a.setAttribute('data-index', this.appendedPhotos++)
    a.appendChild(img);
    img.src = imageThumbnail.url;

    this.columns.heights[columnIndex] += imageThumbnail.height;
    this.columns.elements[columnIndex].appendChild(div);
  }

  this.getSmallestColumn = function() {

  }

  this.InstagramFeed.prototype.makeLoginButtonElement = function() {
    var loginUrl = 'https://api.instagram.com/oauth/authorize/?client_id=' + this.clientId + '&redirect_uri='+ this.redirectUri + '/&response_type=token&scope=public_content';
    var a = document.createElement('a');
    var linkText = document.createTextNode("Login with Instagram");
    a.appendChild(linkText);
    a.title = "Login with Instagram";
    a.href = loginUrl;
    document.getElementById('instagramFeed').appendChild(a);
  }

  this.InstagramFeed.prototype.clearElements = function() {
    while (this.appContainer.firstChild) {
      this.appContainer.removeChild(this.appContainer.firstChild);
    }
  }

  this.InstagramFeed.prototype.windowResizeHandler = function() {
    window.onresize = function(e) {
      var numberOfColumns = Math.floor(this.appContainer.offsetWidth / this.minColumnWidth);
      if(this.columns.count !== numberOfColumns) {
        this.columns.count = numberOfColumns;
        this.displayPhotos()
      }
    }.bind(this);
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
