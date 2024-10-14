# add-promise-listener

<sup>**Social Media Photo by [Europeana](https://unsplash.com/@europeanaeu) on [Unsplash](https://unsplash.com/)**</sup>

Using promises as generic event listener.

```js
import addPromiseListener from 'https://esm.run/add-promise-listener';

const button = document.getElementById('test-button');
const ac = new AbortController;
addPromiseListener(
  button,
  'click',
  {
    // this is optionally needed to be sure the operation is performed
    // when it's needed and not during the next tick:
    // stopPropagation: true
    // stopImmediatePropagation: true
    preventDefault: true,
    // optional signal to eventually catch rejections
    signal: ac.signal
    // other standard options are allowed as well
    // capture: true
    // passive: true
  }
).then(
  event => {
    console.log(`${event.type}ed 🥳`);
    console.assert(event.currentTarget === button, 'currentTarget');
    console.assert(event.defaultPrevented, 'defaultPrevented');
  },
  event => {
    console.assert(event.currentTarget === button, 'currentTarget');
    console.error(event.target.reason);
  }
);

// simulate a rejection in 5 seconds
setTimeout(() => ac.abort('timeout!'), 5000);
```
