# GA-Track

Google Analytics Tracking helper.

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

## Example

See the [complete example](./example/index.html).

```html
<html>

  ...

  </body>

    ...

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
