/* global window */

class GATrack {
  static prefix = null;
  static debug = false;
  static trackerName = '';
  static force = null;
  static V4 = false;


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

      let payload = {}
      if (this.V4) {
        if (typeof action !== 'string') {
          console.error("action has to be of type string");
          return;
        }
    
        if(action === '' || action === null) {
          console.error("action is required");
          return;
        }
        payload = {
          events:[{
            name: action,
            params: {
              event_category: category,
              event_label: label
            }
          }],
        }
        this.sendData(payload);
      }

      if (this.isGAQ()) {
        window._gaq.push(['_trackEvent', category, action, label, null, false]);
        window._gaq.push(resolve);
      } else if (this.isGTag()) {
        // Gtag check needs to go before since gtag creates a ga variable
        payload = {
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

  static send(...args) {
    console.log(args);
    if (this.isGA()) {
      args.unshift('send');
    }

    return this.sendData(...args);
  }

  static sendData(...args) {
    if (!this.isEnabled()) {
      this.log('sendData', 'ga-track disabled');
      return;
    }

    if (this.V4) {
      this.log(args[0])
      this.log(args[0].name)
      this.log(args[0].params)
      dataLayer.push({
        'event': `${args[0].name}`,
        'event_category': [args[0].params.event_category],
        'event_label': [args[0].params.event_label],
    });
    } else if (this.isGA()) {
      if (this.trackerName) {
        args[0] = `${this.trackerName}.${args[0]}`;
      }
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
