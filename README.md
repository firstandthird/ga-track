# GA-Track

[![Build Status](https://travis-ci.org/firstandthird/ga-track.svg?branch=master)](https://travis-ci.org/firstandthird/ga-track)
<span class="ga-track-npmversion"><a href="https://npmjs.org/package/ga-track" title="View this project on NPM"><img src="https://img.shields.io/npm/v/ga-track.svg" alt="NPM version" /></a></span>

Google Analytics Tracking helper with support for GTag, ga and _gaq.

## Installation

```sh
npm install ga-track
```

## Usage

> Make sure you also include your Google Analytics script as shown [in the example](./example/index.html#L7).

```js
import 'ga-track';
// or
import GATrack from 'ga-track';
```

Any element with `data-ga-track` as an attribute, will be tracked on click. Here's a quick reference:

|  Attribute             | Description  | Default  | 
|------------------------|-----------------------|---|
| `data-ga-track`        | Needed for autotracking. If a value is given it serves as category. | `ga-track`  | 
| `data-ga-track-label`  | Label of the event. |  Element's `href` |
| `data-ga-track-action` | Action of the event. |  Element's `textContent` |
| `data-ga-track-href`   | Should this be `false` the link **won't** be navigated to. Otherwise `ga-track` will wait till the track happens and then navigates.  |  Element's `href` |


## Methods

GATrack exposes a few method being the following two the most importants. It is a safe call so if Google Analytics gets blocked by an adblocker it won't throw any exceptions due to not being present.

### sendEvent(category, action, label, callback, timeout)

Manually sends an event to Google Analytics.

#### Parameters:

`category` - {string} - Event's category.

`action` - {string} - Event's action.

`label` - {string} - Event's label.

`[callback]` - {Function} - Callback to be called once the event has been tracked.

`[timeout=1000]` - Timeout after which the callback will be called if it didn't finish.

### sendData()

Safely pass data to Google Analytics:

```javascript
GATrack.sendData('set', 'dimension2', 'member');
```

## Example

See the [complete example](./example/index.html).

```html
<html>

  ...

  </body>

    ...
    
    <span>Click</span>
    <span>Me</span>
    <span>One</span>
    <span>Time</span>

    <a data-ga-track href="http://www.firstandthird.com">Link</a>
    <a data-ga-track href="http://www.firstandthird.com" target="_blank">External link</a>

    <script>
      GaTrack.track([
        {
          element: 'span',
          category: 'span',
          label: 'click'
        }
      ])
    </script>
  </body>
</html>
```
