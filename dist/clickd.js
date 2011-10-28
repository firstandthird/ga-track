/*!
  * Clickd - a javascript click tracking library for Google Analytics 
  * v0.0.1
  * https://github.com/jgallen23/clickd
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('clickd', function() {

var clickd = {
  _debug: false,
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
      }, 100);
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


return clickd;
});
