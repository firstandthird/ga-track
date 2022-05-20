/* global window */

class GATrack {
  static prefix = null;
  static debug = false;
  static trackerName = '';
  static force = null;
  static V4 = false;

  static async sendEventV4(api_secret, measurement_id, client_id, event_name, event_params) {

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


    if(GATrack.isGTag() && GATrack.V4) {
      const request = {
        body: {
          api_secret: api_secret,
          measurement_id: measurement_id,
        },
        payload: {
          client_id: client_id,
          events:[{
            name: event_name,
            params: event_params
          }],
        }
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

    if (this.isGTag()) {
      window.gtag.apply(null, args);
      return;
    } else if (this.isGA()) {
      if (this.trackerName) {
        args[0] = `${this.trackerName}.${args[0]}`;
      }
      if (GATrack.V4) {
        console.log(args[0])
        console.log(args)
        fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${args[0].measurement_id}&api_secret=${args[0].api_secret}`, {
          method: "POST",
          body: JSON.stringify({"client_id":"1276658337.1641422557","events":[{"name":"ft_test_ga_v4","params":{"local_test":"testing value2","testing_event_2":"some amazing value"}}]})
        })
        return;
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
