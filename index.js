/* eslint-env browser */
/* global _gaq, ga */
import { on, find } from 'domassist';
import aug from 'aug';

const GATrack = {
  sendEvent(category, action, label) {
    if (GATrack.prefix) {
      category = `${GATrack.prefix}-${category}`;
    }

    GATrack.log(category, action, label);

    if (typeof window._gaq === 'undefined' && typeof window.ga === 'undefined') { // eslint-disable-line no-underscore-dangle
      return GATrack;
    }

    if (typeof window._gaq !== 'undefined') { // eslint-disable-line no-underscore-dangle
      _gaq.push(['_trackEvent', category, action, label, null, false]);
    } else {
      ga('send', 'event', category, action, label);
    }
  },

  getData(element, options = {}) {
    const href = element.dataset.gaTrackHref || element.getAttribute('href');
    const category = element.dataset.gaTrack || options.category || 'ga-track';
    const label = element.dataset.gaTrackLabel || options.label || href;
    const action = element.dataset.gaTrackAction || options.action || element.textContent.trim();

    return { href, category, label, action };
  },

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

    element.dataset.gaTrackInitialised = true;

    options = aug({}, GATrack.defaults, options);

    on(element, 'click', event => {
      GATrack.onTrackedClick(element, event, options);
    });
  },

  onTrackedClick(element, event, options) {
    const data = GATrack.getData(element, options);
    const target = element.getAttribute('target');

    GATrack.sendEvent(data.category, data.action, data.label);

    if (element.dataset.gaTrackHref === 'false') {
      event.preventDefault();
    } else if (data.href && !event.metaKey && event.which === 1 && target !== '_blank') {
      event.preventDefault();
      setTimeout(() => { window.location = data.href; }, options.delay);
    }
  },

  autotrack() {
    const elements = find('[data-ga-track]');

    elements.forEach(element => {
      GATrack.track(element);
    });
  },

  log(...args) {
    if (GATrack.debug) {
      console.log(`[GATRACK] ${args}`); //eslint-disable-line no-console
    }
  },

  debug: (typeof window.localStorage === 'object' && window.localStorage.getItem('GATrackDebug')),
  prefix: null,
  defaults: {
    delay: 200
  }
};

GATrack.debug = (typeof window.localStorage === 'object' && window.localStorage.getItem('GATrackDebug'));
GATrack.autotrack();

export default GATrack;
