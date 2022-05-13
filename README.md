# GA-Track

Google Analytics Tracking helper with support for GTag, ga and _gaq.

## V3+ Note

To support a wider range of front-end layout systems (WordPress/Shopify/React) we've removed some features. Legacy sites should stick to v2.

  - Autotrack (`[data-ga-track]`) has been removed. We recommend binding clicks to the `sendEvent()` method.
  - Outline mode has been removed to reduce dependencies.
  - `sendEvent()` no longer accepts the callback and timeout arguments.
  - `getData()` has been removed.
  - The method to enable debug mode has changed. See docs below.
  - The method to change the tracker name has changed. See docs below.

## Installation

```sh
// npm
npm install ga-track

// yarn
yarn add ga-track
```

## Usage

```js
import GATrack from 'ga-track';
```

## Methods

### sendEvent(action, label)

Manually sends an event to Google Analytics. Returns a promise.

#### Parameters:


`action` - {string} - Event's action.

`label` - {string} - Event's label.

### sendEventV4(name, event_params)

`name` - {string}

`event_params` - {Array of strings} - custom or [recommend](https://support.google.com/analytics/answer/9267735) event params ([25 max](https://support.google.com/analytics/answer/9267744?hl=en)).
V4
```javascript
GaTrack.G4 = true;
```
```javascript
GATrack.sendData('read_article',[{name: 'author', value: 'David Mitchell'}, {name: 'title', value: 'Cloud Atlas'}]);
```

### sendData()

Safely pass data to Google Analytics:

```javascript
GATrack.sendData('set', 'dimension2', 'member');
```

## Options

### V4
```js
import GATrack from 'ga-track';

GATrack.V4 = true;
```
Allows you to use the [V4](#sendeventv4) version of sendEvent()

### Debug Mode

```js
import GATrack from 'ga-track';

GATrack.debug = true;
```

### Changing Tracker Name

```js
import GATrack from 'ga-track';

GATrack.trackerName = 'SomeTrackerName';
```

### Forcing a provider

Supported values: `''`, `'ga'`, `'gaq'`, `'gtag'`

This is useful if you have multiple tags on the same page but only want to use one of them.

```js
import GATrack from 'ga-track';

GATrack.force = 'ga';
```

### Category Prefix

```js
import GATrack from 'ga-track';

GATrack.prefix = 'SiteName'; // category becomes SiteName-categoryvalue
```
