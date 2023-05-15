/* global window */

class GATrack {
  static prefix = null;
  static debug = false;
  static trackerName = '';
  static force = null;


  static async sendEventOldGA(action, category, label) {
    if (this.prefix) {
      category = `${this.prefix}-${category}`;
    }

    return new Promise(resolve => {

      if (!this.isEnabled()) {
        this.log('sendEvent', 'ga-track disabled');
        return resolve();
      }

      let payload = {}
        if (typeof action !== 'string') {
          console.error("action has to be of type string");
          return;
        }

        if(action === '' || action === null) {
          console.error("action is required");
          return;
        }
        payload = {
          events: {
            name: action,
            params: {
              event_category: category || '',
              event_label: label || ''
            }
        }
      }
        this.sendData(payload);
    });
  }

  static async sendEvent(name, params) {

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

    if (this.prefix) {
      name = `${this.prefix}-${name}`;
    }


    return new Promise(resolve => {

      if (!this.isEnabled()) {
        this.log('sendEvent', 'ga-track disabled');
        return resolve();
      }

      let payload = {}

        payload = {
          events: {
            name,
            params
        }
      }
        this.sendData(payload);
    });
  }

  static send(...args) {
    console.log(args);

    return this.sendData(...args);
  }

  static sendData(...args) {
    if (!this.isEnabled()) {
      this.log('sendData', 'ga-track disabled');
      return;
    }

      window.dataLayer = window.dataLayer || [];
      if (usesOldGA) {
        window.dataLayer.push({
          'event': `${args[0].events.name}`,
          'event_category': [args[0].events.params.event_category],
          'event_label': [args[0].events.params.event_label],
        });
      } else {
        window.dataLayer.push({
          'event': `${args[0].events.name}`,
          'event_params': [args[0].events.params]
        });
      }

  }

static usesOldGA(...args) {
  return args[0].events.params.event_category || args[0].events.params.event_label;
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
