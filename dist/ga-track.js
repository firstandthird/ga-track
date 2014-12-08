/*!
 * ga-track - Click tracking for Google Analytics
 * v0.4.0
 * https://github.com/firstandthird/ga-track
 * copyright First+Third 2014
 * MIT License
*/

(function($) {
  $.gaTrack = function(category, action, label) {
    if ($.gaTrack.debug) {
      return console.log('GA TRACK', category, action, label);
    }
    if (typeof _gaq === 'undefined' && typeof ga === 'undefined') {
      return this;
    }

    if(typeof _gaq !== 'undefined') {
      _gaq.push(['_trackEvent', category, action, label, null, false]);
    } else {
      ga('send', 'event', category, action, label);
    }
  };

  $.gaTrack.debug = false;

  $.gaTrackScroll = function() {
    var $body = $('body');
    var scrollPercent = 0;
    var lastPos = 0;
    var scrollTriggers = {
      'scroll': false,
      '25': false,
      '50': false,
      '75': false,
      '100': false
    };

    var scrollCheck = function() {
      scrollPercent = ~~(5*Math.round((window.scrollY/($body.height()-window.innerHeight)*100)/5));

      if (lastPos !== scrollPercent) {
        lastPos = scrollPercent;
      }

      if (!scrollTriggers.scroll) {
        scrollTriggers.scroll = true;
        $.gaTrack('scroll', document.location.toString(), 'Scrolled');
      }

      switch(scrollPercent) {
        case 25:
          if (scrollTriggers['25']) break;
          $.gaTrack('scroll', document.location.toString(), 'Scrolled 25%');
          scrollTriggers['25'] = true;
          break;
        case 50:
          if (scrollTriggers['50']) break;
          $.gaTrack('scroll', document.location.toString(), 'Scrolled 50%');
          scrollTriggers['50'] = true;
          break;
        case 75:
          if (scrollTriggers['75']) break;
          $.gaTrack('scroll', document.location.toString(), 'Scrolled 75%');
          scrollTriggers['75'] = true;
          break;
        case 100:
          if (scrollTriggers['100']) break;
          $.gaTrack('scroll', document.location.toString(), 'Scrolled 100%');
          scrollTriggers['100'] = true;
          break;
      }
    };

    $(window).on('scroll', scrollCheck);
  };

  $.fn.gaTrack = function(opt) {
    var delay = 100;

    if (!opt) {
      opt = {};
    }

    return this.each(function() {

      var el = $(this);

      var href = el.attr('href');

      var cat = el.data('ga-track') || opt.category || 'ga-track';
      var label = el.data('ga-track-label') || opt.label || href;
      var action = el.data('ga-track-action') || opt.action || el.text();

      el.on('click', function(e) {
        $.gaTrack(cat, action, label);
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
