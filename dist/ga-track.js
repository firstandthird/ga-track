var GaTrack = (function () {
'use strict';

function findOne(selector, el) {
  var found = find(selector, el);

  if (found.length) {
    return found[0];
  }

  return null;
}

function isWindow(obj) {
  return obj != null && obj === obj.window;
}

function find(selector) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (selector instanceof HTMLElement || isWindow(selector)) {
    return [selector];
  } else if (selector instanceof NodeList) {
    return [].slice.call(selector);
  } else if (typeof selector === 'string') {
    var startElement = context ? findOne(context) : document;
    return [].slice.call(startElement.querySelectorAll(selector));
  }
  return [];
}

function on(selector, event, cb) {
  var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (Array.isArray(selector)) {
    selector.forEach(function (item) {
      return on(item, event, cb, capture);
    });
    return;
  }

  var data = {
    cb: cb,
    capture: capture
  };

  if (!window._domassistevents) {
    window._domassistevents = {};
  }

  window._domassistevents['_' + event] = data;
  var el = find(selector);
  if (el.length) {
    el.forEach(function (item) {
      item.addEventListener(event, cb, capture);
    });
  }
}

var SCROLLABLE_CONTAINER = void 0;

function getScrollableContainer() {
  if (SCROLLABLE_CONTAINER) {
    return SCROLLABLE_CONTAINER;
  }

  var documentElement = window.document.documentElement;
  var scrollableContainer = void 0;

  documentElement.scrollTop = 1;

  if (documentElement.scrollTop === 1) {
    documentElement.scrollTop = 0;
    scrollableContainer = documentElement;
  } else {
    scrollableContainer = document.body;
  }

  SCROLLABLE_CONTAINER = scrollableContainer;

  return scrollableContainer;
}

SCROLLABLE_CONTAINER = getScrollableContainer();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var aug = function aug() {
  var args = Array.prototype.slice.call(arguments); //eslint-disable-line prefer-rest-params
  var org = args.shift();
  var type = '';
  if (typeof org === 'string' || typeof org === 'boolean') {
    type = org === true ? 'deep' : org;
    org = args.shift();
    if (type === 'defaults') {
      org = aug({}, org); //clone defaults into new object
      type = 'strict';
    }
  }
  args.forEach(function (prop) {
    for (var propName in prop) {
      //eslint-disable-line
      var propValue = prop[propName];
      // just overwrite arrays:
      if (Array.isArray(propValue)) {
        org[propName] = propValue;
        continue;
      }
      if (type === 'deep' && (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) === 'object' && typeof org[propName] !== 'undefined') {
        if (_typeof(org[propName]) !== 'object') {
          org[propName] = propValue;
          continue;
        }
        aug(type, org[propName], propValue);
      } else if (type !== 'strict' || type === 'strict' && typeof org[propName] !== 'undefined') {
        org[propName] = propValue;
      }
    }
  });
  return org;
};
var index = aug;

/* eslint-env browser */
/* global _gaq, ga */
var GATrack = function () {
  function GATrack() {
    classCallCheck(this, GATrack);
  }

  createClass(GATrack, null, [{
    key: 'sendEvent',
    value: function sendEvent(category, action, label) {
      if (GATrack.prefix) {
        category = GATrack.prefix + '-' + category;
      }

      GATrack.log(category, action, label);

      if (typeof window._gaq === 'undefined' && typeof window.ga === 'undefined') {
        // eslint-disable-line no-underscore-dangle
        return GATrack;
      }

      if (typeof window._gaq !== 'undefined') {
        // eslint-disable-line no-underscore-dangle
        _gaq.push(['_trackEvent', category, action, label, null, false]);
      } else {
        ga('send', 'event', category, action, label);
      }
    }
  }, {
    key: 'getData',
    value: function getData(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var href = element.dataset.gaTrackHref || element.getAttribute('href');
      var category = element.dataset.gaTrack || options.category || 'ga-track';
      var label = element.dataset.gaTrackLabel || options.label || href;
      var action = element.dataset.gaTrackAction || options.action || element.textContent.trim();

      return { href: href, category: category, label: label, action: action };
    }
  }, {
    key: 'track',
    value: function track(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof element.dataset.gaTrackInitialised !== 'undefined') {
        return;
      }

      element.dataset.gaTrackInitialised = true;

      options = index({}, GATrack.defaults, options);

      on(element, 'click', function (event) {
        GATrack.onTrackedClick(element, event, options);
      });
    }
  }, {
    key: 'onTrackedClick',
    value: function onTrackedClick(element, event, options) {
      var data = GATrack.getData(element, options);
      var target = element.getAttribute('target');

      GATrack.sendEvent(data.category, data.action, data.label);

      if (element.dataset.gaTrackHref === 'false') {
        event.preventDefault();
      } else if (data.href && !event.metaKey && event.which === 1 && target !== '_blank') {
        event.preventDefault();
        setTimeout(function () {
          window.location = data.href;
        }, options.delay);
      }
    }
  }, {
    key: 'autotrack',
    value: function autotrack() {
      var elements = find('[data-ga-track]');

      elements.forEach(function (element) {
        GATrack.track(element);
      });
    }
  }, {
    key: 'log',
    value: function log() {
      if (GATrack.debug) {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        console.log('[GATRACK] ' + args); //eslint-disable-line no-console
      }
    }
  }]);
  return GATrack;
}();

GATrack.debug = false;
GATrack.prefix = null;
GATrack.defaults = {
  delay: 200
};

GATrack.debug = _typeof(window.localStorage) === 'object' && window.localStorage.getItem('GATrackDebug');
GATrack.autotrack();

return GATrack;

}());

//# sourceMappingURL=ga-track.js.map