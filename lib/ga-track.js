(function($) {
  $.fn.gaTrack = function(opt) {
    var delay = 100;
    var ver = 1;

    if (!opt) {
      opt = {};
    }

    if (typeof _gaq === 'undefined' && typeof ga === 'undefined') {
      return this;
    }

    if(typeof _gaq === 'undefined') {
      ver = 2;
    }

    var trackEvent = function(category, action, label) {
      if(ver === 1) {
        _gaq.push(['_trackEvent', category, action, label, null, false]);
      } else {
        ga('send', 'event', category, action, label);
      }
    };

    return this.each(function() {

      var el = $(this);

      var href = el.attr('href');

      var cat = el.data('ga-track') || opt.category || 'ga-track';
      var label = el.data('ga-track-label') || opt.label || href;
      var action = el.data('ga-track-action') || opt.action || el.text();

      el.on('click', function(e) {
        trackEvent(cat, action, label);
        if (!e.metaKey && e.which === 1) {
          e.preventDefault();
          setTimeout(function() {
            window.location = href;
          }, delay);
        }
      });

    });
  };

  //data-api
  $(function() {
    $('[data-ga-track]').gaTrack();
  });


})(jQuery);
