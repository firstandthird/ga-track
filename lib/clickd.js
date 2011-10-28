var clickd = {
  _debug: false,
  clickDelay: 100,
  label: window.location.href,
  log: function(msg) {
    if (this._debug)
      console.log("CLICKD", arguments);
  },
  track: function(name, selector) {
    var self = this;
    this.log("tracking", name, selector);
    this._trackImpression(name);
    selector.find("a").bind("click", function() {
      var href = this.getAttribute('href');
      self._trackClick(name, href);
      setTimeout(function() {
        window.location = href;
      }, self.clickDelay);
      return false;
    });
  },
  _trackImpression: function(name) {
    this.log("impression", name);
    _gaq.push(['_trackEvent', name, this.label, 'impression']);
  },
  _trackClick: function(name, href) {
    this.log("click", name, href);
    _gaq.push(['_trackEvent', name, this.label, 'click:' + href]);
  }
};

