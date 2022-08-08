/* global window */

class GATrack {
  static prefix = null;
  static debug = false;
  static trackerName = '';
  static force = null;

  static async sendEvent(category, action, label) {
    if (GATrack.prefix) {
      category = `${GATrack.prefix}-${category}`;
    }

    return new Promise(resolve => {
      GATrack.log(category, action, label);

      if (!GATrack.isEnabled()) {
        GATrack.log('sendEvent', 'ga-track disabled');
        return resolve();
      }

      if (GATrack.isGAQ()) {
        window._gaq.push(['_trackEvent', category, action, label, null, false]);
        window._gaq.push(resolve);
      } else if (GATrack.isGTag()) {
        // Gtag check needs to go before since gtag creates a ga variable
        const payload = {
          event_category: category,
          event_label: label,
          event_callback: resolve
        };

        GATrack.sendData('event', action, payload);
      } else if (GATrack.isGA()) {
        const options = {
          transport: 'beacon',
          hitCallback: resolve
        };

        GATrack.sendData('send', 'event', category, action, label, options);
      }
    });
  }

  // GATrack now does literally nothing but
  // call sendData with the same args
  // it is kept here for now to be consistent
  // with how we previously did it in leanin-web and optionb /web
  static send(...args) {
    console.log(args);
    return GATrack.sendData(...args);
  }

  static sendData(...args) {
    if (!GATrack.isEnabled()) {
      console.log('sendData', 'ga-track disabled');
      return;
    }

    if (GATrack.isGTag()) {
      console.log('sendData', 'gtag', ...args); //eslint-disable-line no-console
      window.gtag.apply(null, args);
    } else if (GATrack.isGA()) {
      if (GATrack.trackerName) {
        args[0] = `${GATrack.trackerName}.${args[0]}`;
      }
      console.log('sendData', 'ga', ...args); //eslint-disable-line no-console
      window.ga.apply(null, args);
    }
    console.log('sendData', 'failed'); //eslint-disable-line no-console
  }

  static isNullOrEnforced(provider) {
    return GATrack.force === null || GATrack.force === provider;
  }

  static isGAQ() {
    // eslint-disable-line no-underscore-dangle
    return (typeof window._gaq !== 'undefined') && GATrack.isNullOrEnforced('gaq');
  }

  static isGTag() {
    return (typeof window.gtag !== 'undefined') && GATrack.isNullOrEnforced('gtag');
  }

  static isGA() {
    return (typeof window.ga !== 'undefined') && GATrack.isNullOrEnforced('ga');
  }

  static isEnabled() {
    return GATrack.isGA || GATrack.isGTag || GATrack.isGAQ;
  }

  static log(...args) {
    if (GATrack.debug) {
      console.log('GATRACK', ...args); //eslint-disable-line no-console
    }
  }
}

export default GATrack;
