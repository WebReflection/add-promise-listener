# add-promise-listener

Using promises as generic event listener.

```js
import addPromiseListener from 'https://esm.run/add-promise-listener';

const button = document.getElementById('test-button');
const ac = new AbortController;
addPromiseListener(
  button,
  'click',
  {
    // optional: stopPropagation, stopImmediatePropagation or ...
    preventDefault: true,
    // optional signal to eventually catch rejections
    signal: ac.signal
  }
).then(
  event => {
    console.log(`${event.type}ed 🥳`);
    console.assert(event.currentTarget === button, 'currentTarget');
    console.assert(event.defaultPrevented, 'defaultPrevented');
  },
  event => {
    console.error(event.target.reason);
  }
);

// simulate a rejection in 5 seconds
setTimeout(() => ac.abort('timeout!'), 5000);
```
