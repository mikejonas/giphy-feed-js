(function () {

  this.PureBox = function(options, appContainer) {
    this.appContainer = appContainer || document.body;
    this.ClickHandlerInit();
    this.photos = [];
    this.currentPhotoIndex;
  }

  this.PureBox.prototype.ClickHandlerInit = function() {
    this.appContainer.onclick = function(e) {
      e.preventDefault()
      var element = e.target;
      while(!element.matches('.pure-box') && element !== this.appContainer && element) {
        element = element.parentElement;
      }
      if(element && element.matches('.pure-box')) {
        this.openLightBox(element);
      }
    }.bind(this);
  }

  this.PureBox.prototype.openLightBox = function(element) {
    this.createLightBoxElement(element.href, element.title);
    this.photos = this.appContainer.getElementsByClassName('pure-box');
    this.currentPhotoIndex = Array.prototype.indexOf.call(this.photos, element);
  }

  this.PureBox.prototype.closeLightBox = function(element) {
    element.parentElement.removeChild(element);
    document.onkeydown = null
  }

  this.PureBox.prototype.createLightBoxElement = function(imageUrl, title) {
    var overlayDiv = document.createElement('div')
    var overlayInnerDiv = document.createElement('div')
    var img = document.createElement('div')
    var captionDiv = document.createElement('div')
    var captionText = document.createTextNode(title);
    overlayDiv.className = 'pure-box-overlay';
    overlayInnerDiv.className = 'pure-box-overlay-inner';
    img.className = 'pure-box-image'
    img.style.backgroundImage = "url('"+ imageUrl +"')"
    captionDiv.className = 'pure-box-caption';
    captionDiv.appendChild(captionText);
    overlayDiv.appendChild(overlayInnerDiv);
    overlayDiv.appendChild(captionDiv);

    overlayInnerDiv.appendChild(img);
    document.body.insertBefore(overlayDiv, document.body.firstChild);
    this.displayNextAndPreviousButtons(overlayInnerDiv);
    this.lightBoxClickHandler(overlayDiv)
  }

  this.PureBox.prototype.displayNextAndPreviousButtons = function(lightBoxElement) {
    this.createNextPrevButton(lightBoxElement, '❬', 'prev');
    this.createNextPrevButton(lightBoxElement, '❭', 'next');
  }

  this.PureBox.prototype.createNextPrevButton = function(lightBoxElement, arrowText, className) {
    var arrowButton = document.createElement('a');
    var arrowButtonInner = document.createElement('span');
    arrowButtonInner.appendChild(document.createTextNode(arrowText));
    arrowButton.className = 'next-prev ' + className;
    arrowButtonInner.className = className;
    arrowButton.appendChild(arrowButtonInner);
    lightBoxElement.appendChild(arrowButton);
  }

  this.PureBox.prototype.lightBoxClickHandler = function(overlayDiv) {
    overlayDiv.onclick = function(e) {
      if(e.target.matches('.pure-box-overlay') || e.target.matches('.pure-box-image')) {
        this.closeLightBox(overlayDiv);
      }
      if(e.target.matches('.next') || e.target.matches('.prev')) {
        this.navigateToImage(overlayDiv, e.target.matches('.next'));
      } else {

      }
    }.bind(this);

    document.onkeydown = function(e) {
      e.preventDefault()
      if (e.keyCode == '37') { this.navigateToImage(overlayDiv, false); }
      if (e.keyCode == '39') { this.navigateToImage(overlayDiv, true); }
      if (e.keyCode == '27') { this.closeLightBox(overlayDiv); }
    }.bind(this);
  }

  this.PureBox.prototype.navigateToImage = function(overlayDiv, goForward) {
    goForward ? this.currentPhotoIndex++ : this.currentPhotoIndex--

    if(this.currentPhotoIndex > this.photos.length - 1) { this.currentPhotoIndex = 0; }
    if(this.currentPhotoIndex < 0) { this.currentPhotoIndex = this.photos.length - 1; }

    var nextImage = this.photos[this.currentPhotoIndex];
    var image = overlayDiv.getElementsByClassName('pure-box-image')[0];
    var caption = overlayDiv.getElementsByClassName('pure-box-caption')[0]
    image.style.backgroundImage = "url('"+ nextImage.href +"')"
    caption.innerText = nextImage.title;
  }

}());
