/* global window */

import { on, find, ready, closest, matches } from 'domassist';
import aug from 'aug';
class GATrack {


  static defaults = {
    debug: (typeof window.localStorage === 'object' && window.localStorage.getItem('GATrackDebug')),
    prefix: null,
    trackerName: '',
    force: null,
    defaults: {
      timeout: 1000
    },
    autotracking: false,
  }


  onTrackedClick(element, event, options) {
    const data = GATrack.getData(element, options);
    const target = element.getAttribute('target');
    if (element.dataset.gaTrackHref === 'false') {
      event.preventDefault();
    } else if (data.href && !event.metaKey && event.which === 1 && target !== '_blank') {
      event.preventDefault();
    }
    if (data.name && data.params) {
      GATrack.sendEvent(data.name, data.params);
    } else if (!data.name && !data.params) {
      GATrack.sendEventOldGA(data.action, data.category, data.label);
    }
  }

  track(element, options = {}) {
    if (Array.isArray(element)) {
      element.forEach(data => {
        find(data.element).forEach(el => {
          GATrack.track(el, data);
        });
      });

      return;
    }

    if (typeof element.dataset.gaTrackInitialised !== 'undefined') {
      return;
    }

    element.dataset.gaTrackInitialised = 'true';

    options = aug({}, GATrack.defaults, options);

    this.log('tracking', element, options);
    on(element, 'click', event => {
      GATrack.onTrackedClick(element, event, options);
    });
  }

  // since we now use {name: string, params: []} instead of action, category, label
  //  I'm defaulting the values of name and params for the autotracking
  getData(element, options = {}) {
    const href = element.dataset.gaTrackHref || element.getAttribute('href');
    const category = element.dataset.gaTrackName || options.category;
    const label = element.dataset.gaTrackParams || options.label;
    const action = element.dataset.gaTrackAction || options.action;
    const params = element.dataset.gaTrackParams || options.params || { name: element.textContent.trim(), value: href };
    const name = element.dataset.gaTrackName || options.name || element.dataset.gaTrack || 'click';


    return { href, category, label, action, params, name };
  }

  autotrack() {
    if (GATrack.autotracking === true) {
      return;
    }

    GATrack.autotracking = true;
    const selector = '[data-ga-track]';

    on(document.body, 'click', event => {
      let element = event.target;

      if (!matches(element, selector)) {
        element = closest(element, selector);
      }

      if (element) {
        GATrack.onTrackedClick(element, event, GATrack.defaults);
      }
    });
  }

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

ready(() => {
  if (!window._GATrack_) {
    window._GATrack_ = GATrack;

    if (typeof window.gaTrackerName_ !== 'undefined') {
      GATrack.trackerName = window.gaTrackerName_;
    }

    GATrack.autotrack();
  }
});

export default GATrack;
