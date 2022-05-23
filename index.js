/* global window */

class GATrack {
  static prefix = null;
  static debug = false;
  static trackerName = '';
  static force = null;
  static V4 = false;

  static async sendEventV4(event_name, event_params) {
    if (GATrack.V4 === false) {
      console.error('to use sendEventV4 change GATrack.V4 to true')
      return;
    }

    if (typeof event_name !== 'string') {
      console.error("event_name has to be of type string");
      return;
    }

    if(event_name === '' || event_name === null) {
      console.error("event name is required");
      return;
    }

    if (event_params.length > 25) {
      console.error("can't send more than 25 event params")
      return;
    }


    if(GATrack.V4) {
      const payload = {
        events:[{
          name: event_name,
          params: event_params
        }],
      }

      return new Promise(resolve => {
        this.log(payload);
        this.log(this.isEnabled());
        if (!this.isEnabled()) {
          this.log('sendEventV4', 'ga-track disabled');
          return resolve();
        }
        this.sendData(payload);
      })
    }
    return;
  }

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
      gtag("event", `${args[0].events.name}`, args[0].events.params);
      return;
    } else if (this.isGA()) {
      if (this.trackerName) {
        args[0] = `${this.trackerName}.${args[0]}`;
      }
      console.log(window.ga.apply(null, args));
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
