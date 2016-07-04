(function() {
  this.GiphyFeed = function(options, appContainer) {
    this.appContainer = appContainer;
    this.apiKey = options.apiKey || 'dc6zaTOxFJmzC';
    this.photoMargin = options.photoMargin || 20;
    this.minColumnWidth = options.minColumnWidth || 300;
    this.infiniteScroll = options.infiniteScroll;
    this.giphyApiOptions = options.giphyApiOptions;
    this.searchTerm = options.searchTerm;
    this.photoData = [];
    this.columns = {
      elements: [],
      heightRatios: [],
      count: 0
    };
    this.isLoadingImages = false;
    this.appendedPhotos = 0;
    this.initializeWindowEventHandlers();
    this.renderUI(true);
  };

  this.GiphyFeed.prototype.renderUI = function(newSearch) {
    this.columns.heightRatios = [];
    this.columns.elements = [];
    this.appendedPhotos = 0;
    this.clearElements();
    this.makeSearchFormElement();
    this.makeColumnElements();
    if (newSearch) {
      this.photoData = [];
      this.getPhotos();
    }
  };

  this.GiphyFeed.prototype.makeSearchFormElement = function() {
    var form = document.createElement('form');
    var input = document.createElement('input');
    var button = document.createElement('button');
    form.className = 'giphy-search-form';
    form.style.marginLeft = this.photoMargin / 2 + 'px';
    form.style.marginRight = this.photoMargin / 2 + 'px';
    input.type = 'text';
    button.className = 'giphy-search-button';

    button.appendChild(document.createTextNode('search'));
    form.appendChild(input);
    form.appendChild(button);
    input.value = this.giphyApiOptions.q;
    this.appContainer.appendChild(form);

    form.onsubmit = function(e) {
      if (this.giphyApiOptions.q !== input.value) {
        this.giphyApiOptions.q = input.value;
        this.renderUI(true);
      }
      return false;
    }.bind(this);
  };

  this.GiphyFeed.prototype.makeColumnElements = function() {
    this.columns.count = Math.floor(this.appContainer.offsetWidth / this.minColumnWidth);
    for (var i = 0; i < this.columns.count; i++) {
      var div = document.createElement('div');
      div.className = 'column';
      div.style.width = 100 / this.columns.count + '%';
      this.columns.elements.push(div);
      this.columns.heightRatios.push(0);
      this.appContainer.appendChild(div);
    }
  };

  this.GiphyFeed.prototype.makePhotoElement = function(photoData, columnIndex) {
    var imageThumbnail = photoData.images.original_still;
    var imageFull = photoData.images.original;
    var caption = extractHashTagsFromSlug(photoData.slug);
    var div = document.createElement('div');
    var a = document.createElement('a');
    var img = document.createElement('img');

    div.className = 'photo-container';
    div.appendChild(a);
    div.style.margin = '0 ' + this.photoMargin / 2 + 'px ' + this.photoMargin + 'px ' + this.photoMargin / 2 + 'px';
    a.href = imageFull.url;
    a.title = caption;
    a.className = 'pure-box';
    a.setAttribute('data-index', this.appendedPhotos++);
    a.appendChild(img);
    img.src = imageThumbnail.url;
    img.height = imageThumbnail.height;
    img.width = imageThumbnail.width;

    this.columns.heightRatios[columnIndex] += parseInt(imageThumbnail.height, 10) / parseInt(imageThumbnail.width, 10);
    this.columns.elements[columnIndex].appendChild(div);
  };

  this.GiphyFeed.prototype.getPhotos = function() {
    this.isLoadingImages = true;
    var giphyURl = buildGiphyUrl(this.apiKey, this.giphyApiOptions, this.appendedPhotos);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        var data = JSON.parse(xmlHttp.responseText).data;
        this.displayPhotos(data);
      }
      if (xmlHttp.readyState === 4) {
        this.isLoadingImages = false;
      }
    }.bind(this);
    xmlHttp.open("GET", giphyURl, true); // true for asynchronous
    xmlHttp.send(null);
  };

  this.GiphyFeed.prototype.displayPhotos = function(data) {
    if (data) {
      this.photoData = this.photoData.concat(data);
    }
    for (var i = this.appendedPhotos; i < this.photoData.length; i++) {
      var smallestColumnIndex = this.columns.heightRatios.indexOf(Math.min.apply(Math, this.columns.heightRatios));
      this.makePhotoElement(this.photoData[i], smallestColumnIndex);
    }
  };

  this.GiphyFeed.prototype.clearElements = function() {
    while (this.appContainer.firstChild) {
      this.appContainer.removeChild(this.appContainer.firstChild);
    }
  };

  this.GiphyFeed.prototype.initializeWindowEventHandlers = function() {
    window.onresize = function() {
      var numberOfColumns = Math.floor(this.appContainer.offsetWidth / this.minColumnWidth);
      if (this.columns.count !== numberOfColumns) {
        this.renderUI();
        var yOffset = window.pageYOffset;
        this.columns.count = numberOfColumns;
        this.displayPhotos();
        window.scrollTo(0, yOffset);
      }
    }.bind(this);

    if (this.infiniteScroll) {
      window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && !this.isLoadingImages) {
          this.getPhotos(this.appendedPhotos);
        }
      }.bind(this);
    }
  };

  // Helpers
  function extractHashTagsFromSlug(slug) {
    var tags = slug.split('-');
    tags = tags.slice(0, tags.length - 1);
    return tags.map(function(tag) {
      return '#' + tag;
    }).join(' ');
  }

  function buildGiphyUrl(apiKey, options, offset) {
    var url = 'http://api.giphy.com/v1/gifs/search?api_key=' + apiKey;
    for (var key in options) {
      var value = options[key];
      if (key === 'q') {
        value = value ?
          options.q.split(' ').join('+') :
          '';
      }
      url += '&' + key + '=' + value;
    }
    url += '&offset=' + offset;
    return url;
  }
}());
