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


### sendEvent(name, event_params)

#### Parameters:

`name` - {string}

`event_params` - {Array of strings} - custom or [recommend](https://support.google.com/analytics/answer/9267735) event params ([25 max](https://support.google.com/analytics/answer/9267744?hl=en)).
V4

```
GATrack.sendEvent('read_article',[{name: 'author', value: 'David Mitchell'}, {name: 'title', value: 'Cloud Atlas'}]);
```


### sendEventOldGA(action, category, label)
if you want to create a custom event using the old GA events structure you can use this method

the event will be send using this structure:
```
events: {
  name: action
  params: {
    event_category: category
    event_label: label
  }
}
```

#### Parameters:

`action` - {string}

`category` - {string}

`label` - {string}

```
GATrack.sendEventOldGA('click', 'books', 'sci-fi' );
```


## Options


### Debug Mode

```
import GATrack from 'ga-track';

GATrack.debug = true;
```

### Changing Tracker Name

```js
import GATrack from 'ga-track';

GATrack.trackerName = 'SomeTrackerName';
```


### Category Prefix

```js
import GATrack from 'ga-track';

GATrack.prefix = 'SiteName'; // category becomes SiteName-categoryvalue
```
