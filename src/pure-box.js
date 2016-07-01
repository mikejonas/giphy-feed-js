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
  
  this.PureBox.prototype.launchLightBox = function(url, title) {

  }

}());
