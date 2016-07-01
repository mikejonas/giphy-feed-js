(function () {

  this.PureBox = function(options, appContainer) {
    this.appContainer = appContainer || document.body;
    this.ClickHandlerInit();
  }

  this.PureBox.prototype.ClickHandlerInit = function() {
    this.appContainer.onclick = function(e) {
      e.preventDefault()
      var element = e.target;
      while(!element.matches('.pure-box') && element !== this.appContainer && element) {
        element = element.parentElement;
      }
      if(element && element.matches('.pure-box')) {
        this.launchLightBox(element.href, element.title);
      }
    }.bind(this);
  }

  this.PureBox.prototype.launchLightBox = function(imageUrl, title) {
    this.createLightBoxElement(imageUrl, title);
  }

  this.PureBox.prototype.createLightBoxElement = function(imageUrl, title) {
    var overlayDiv = document.createElement('div')
    var overlayInnerDiv = document.createElement('div')
    var img = document.createElement('img')
    overlayDiv.className = 'pure-box-overlay';
    overlayInnerDiv.className = 'pure-box-overlay-inner';
    img.src = imageUrl
    overlayDiv.appendChild(overlayInnerDiv);
    overlayInnerDiv.appendChild(img);
    document.body.appendChild(overlayDiv);
    this.lightBoxClickHandler(overlayDiv)
  }

  this.PureBox.prototype.lightBoxClickHandler = function(overlayDiv) {
    overlayDiv.onclick = function(e) {
      var element = e.target;
      if(element.matches('.pure-box-overlay')) {
        this.parentElement.removeChild(this);
      }
    };
  }

}());
