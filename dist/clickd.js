/*!
 * clickd - Click tracking for Google Analytics
 * v0.1.0
 * https://github.com/jgallen23/clickd
 * copyright Greg Allen 2013
 * MIT License
*/
(function($) {
  $.fn.clickd = function(opt) {
    var delay = 100;

    if (!opt) {
      opt = {};
    }

    if (typeof _gaq === 'undefined') {
      return this;
    }

    var trackEvent = function(category, action, label) {
      _gaq.push(['_trackEvent', category, action, label, null, false]);
    };

    return this.each(function() {

      var el = $(this);

      var href = el.attr('href');

      var cat = el.data('clickd') || opt.category || 'clickd';
      var label = el.data('clickd-label') || opt.label || href;
      var action = el.data('clickd-action') || opt.action || el.text();

      el.on('click', function() {
        trackEvent(cat, action, label);
        setTimeout(function() {
          window.location = href;
        }, delay);
      });

    });
  };

  //data-api
  $(function() {
    $('[data-clickd]').clickd();
  });


})(jQuery);
