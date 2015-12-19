/* global window,_gaq,ga,jQuery */

($ => {
  $.gaTrack = function gaTrack(category, action, label) {
    if ($.gaTrack.debug) {
      console.log('GA TRACK', category, action, label);
    }

    if (typeof window._gaq === 'undefined' && typeof window.ga === 'undefined') {
      return this;
    }

    if (typeof window._gaq !== 'undefined') {
      _gaq.push(['_trackEvent', category, action, label, null, false]);
    } else {
      ga('send', 'event', category, action, label);
    }
  };

  $.gaTrack.debug = false;

  $.gaTrackScroll = () => {
    const $body = $('body');
    const scrollTriggers = {
      'scroll': false,
      '25': false,
      '50': false,
      '75': false,
      '100': false
    };

    let scrollPercent = 0;
    let lastPos = 0;

    const scrollCheck = () => {
      scrollPercent = ~~(5 * Math.round((window.scrollY / ($body.height() - window.innerHeight) * 100) / 5));

      if (lastPos !== scrollPercent) {
        lastPos = scrollPercent;
      }

      if (!scrollTriggers.scroll) {
        scrollTriggers.scroll = true;
        $.gaTrack('scroll', document.location.toString(), 'Scrolled');
      }

      switch (scrollPercent) {
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

  $.fn.gaTrack = function gaTrackPlugin(options) {
    const opt = $.extend({}, $.gaTrack.defaults, options);

    $('body').off('click.gatrack', this.selector).on('click.gatrack', this.selector, e => {
      console.log(e);
      const el = $(e.currentTarget);
      const href = el.data('ga-track-href') || el.attr('href');
      const target = el.attr('target');
      const cat = el.data('ga-track') || opt.category || 'ga-track';
      const label = el.data('ga-track-label') || opt.label || href;
      const action = el.data('ga-track-action') || opt.action || el.text();

      $.gaTrack(cat, action, label);
      if (el.data('ga-track-href') === false) {
        e.preventDefault();
      } else if (href && !e.metaKey && e.which === 1 && target !== '_blank') {
        e.preventDefault();
        setTimeout(() => {
          window.location = href;
        }, opt.delay);
      }
    });

    return this;
  };

  $.gaTrack.defaults = {
    delay: 200
  };

  // data-api
  $(() => {
    $('[data-ga-track]').gaTrack();
  });
})(jQuery);
