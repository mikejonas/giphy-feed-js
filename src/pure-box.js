(function () {

  this.PureBox = function(options, appContainer) {
    this.appContainer = appContainer || document.body;
    this.ClickHandlerInit();
    this.photos = [];
    this.currentPhoto;
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
  }

  this.PureBox.prototype.createLightBoxElement = function(imageUrl, title) {
    var overlayDiv = document.createElement('div')
    var overlayInnerDiv = document.createElement('div')
    var img = document.createElement('img')
    var captionDiv = document.createElement('div')
    var captionText = document.createTextNode(title);
    overlayDiv.className = 'pure-box-overlay';
    overlayInnerDiv.className = 'pure-box-overlay-inner';
    img.src = imageUrl
    captionDiv.className = 'pure-box-caption';
    captionDiv.appendChild(captionText);
    overlayDiv.appendChild(overlayInnerDiv);
    overlayInnerDiv.appendChild(img);
    overlayInnerDiv.appendChild(captionDiv);
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
    arrowButton.onClick = function(e) {

    }
  }

  this.PureBox.prototype.lightBoxClickHandler = function(overlayDiv) {
    overlayDiv.onclick = function(e) {
      console.log(e.target);
      if(e.target.matches('.pure-box-overlay')) {
        this.closeLightBox(overlayDiv);
      }
      if(e.target.matches('.pure-box-overlay')) {
        this.closeLightBox(overlayDiv);
      }
      if(e.target.matches('.pure-box-overlay')) {
        this.closeLightBox(overlayDiv);
      }
    }.bind(this);
  }

}());
