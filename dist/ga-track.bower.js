/*!
 * ga-track - Click tracking for Google Analytics
 * v0.8.0
 * https://github.com/firstandthird/ga-track
 * copyright First+Third 2015
 * MIT License
*/
/* global window,_gaq,ga */
(function($) {
  $.gaTrack = function(category, action, label) {
    if ($.gaTrack.debug) {
      return console.log('GA TRACK', category, action, label);
    }
    if (typeof window._gaq === 'undefined' && typeof window.ga === 'undefined') {
      return this;
    }

    if(typeof window._gaq !== 'undefined') {
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

  $.fn.gaTrack = function(options) {
    var opt = $.extend({}, $.gaTrack.defaults, options);

    return this.each(function() {

      var el = $(this);

      var href = el.data('ga-track-href') || el.attr('href');
      var target = el.attr('target');

      var cat = el.data('ga-track') || opt.category || 'ga-track';
      var label = el.data('ga-track-label') || opt.label || href;
      var action = el.data('ga-track-action') || opt.action || el.text();

      el.on('click', function(e) {
        $.gaTrack(cat, action, label);
        if (el.data('ga-track-href') === false) {
          e.preventDefault();
        } else if (href && !e.metaKey && e.which === 1 && target != '_blank') {
          e.preventDefault();
          setTimeout(function() {
            window.location = href;
          }, opt.delay);
        }
      });

    });
  };

  $.gaTrack.defaults = {
    delay: 200
  };

  //data-api
  $(function() {
    $('[data-ga-track]').gaTrack();
  });


})(jQuery);
