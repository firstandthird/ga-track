/* global window */

class GATrack {
  static prefix = null;
  static debug = false;
  static trackerName = '';
  static force = null;

  static async sendEvent(category, action, label) {
    if (this.prefix) {
      category = `${this.prefix}-${category}`;
    }

    return new Promise(resolve => {
      this.log(category, action, label);

      if (!this.isEnabled()) {
        this.log('sendEvent', 'ga-track disabled');
        return resolve();
      }

      if (this.isGAQ()) {
        window._gaq.push(['_trackEvent', category, action, label, null, false]);
        window._gaq.push(resolve);
      } else if (this.isGTag()) {
        // Gtag check needs to go before since gtag creates a ga variable
        const payload = {
          event_category: category,
          event_label: label,
          event_callback: resolve
        };

        this.sendData('event', action, payload);
      } else if (this.isGA()) {
        const options = {
          transport: 'beacon',
          hitCallback: resolve
        };

        this.sendData('send', 'event', category, action, label, options);
      }
    });
  }

  // this now does literally nothing but
  // call sendData with the same args
  // it is kept here for now to be consistent
  // with how we previously did it in leanin-web and optionb /web
  static send(...args) {
    console.log(args);
    return this.sendData(...args);
  }

  static sendData(...args) {
    if (!this.isEnabled()) {
      console.log('sendData', 'ga-track disabled');
      return;
    }

    if (this.isGTag()) {
      console.log('sendData', 'gtag', ...args); //eslint-disable-line no-console
      window.gtag.apply(null, args);
    } else if (this.isGA()) {
      if (this.trackerName) {
        args[0] = `${this.trackerName}.${args[0]}`;
      }
      console.log('sendData', 'ga', ...args); //eslint-disable-line no-console
      window.ga.apply(null, args);
    }
  }

  static isNullOrEnforced(provider) {
    return this.force === null || this.force === provider;
  }

  static isGAQ() {
    // eslint-disable-line no-underscore-dangle
    return (typeof window._gaq !== 'undefined') && this.isNullOrEnforced('gaq');
  }

  static isGTag() {
    return (typeof window.gtag !== 'undefined') && this.isNullOrEnforced('gtag');
  }

  static isGA() {
    return (typeof window.ga !== 'undefined') && this.isNullOrEnforced('ga');
  }

  static isEnabled() {
    return this.isGA || this.isGTag || this.isGAQ;
  }

  static log(...args) {
    if (this.debug) {
      console.log('GATRACK', ...args); //eslint-disable-line no-console
    }
  }
}

export default GATrack;
