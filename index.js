const { get } = Reflect;

const methods = [
  'preventDefault',
  'stopPropagation',
  'stopImmediatePropagation',
];

// avoid event.preventDefault throwing due illegal Proxy invocation
const bound = (e, value) => typeof value === 'function' ? value.bind(e) : value;

// traps the `event.currentTarget` to be sure it's available later on
class Handler {
  #currentTarget;
  constructor(currentTarget) {
    this.#currentTarget = currentTarget;
  }
  get(e, name) {
    // Did you know? event.currentTarget disappears from events on
    // next tick, which is why this proxy handler needs to exist.
    return name === 'currentTarget' ? this.#currentTarget : bound(e, get(e, name));
  }
}

/**
 * Add a listener that result as a Promise, fulfilled when the event happens once or rejected if the optional provided signal is aborted.
 * @param {Element} element
 * @param {string} type
 * @param {{ signal?:AbortSignal, capture?:boolean, passive?:boolean, preventDefault?:boolean, stopPropagation?:boolean, stopImmediatePropagation?:boolean }?} options
 * @returns {Promise<Event,Event>}
 */
export default (element, type, options = null) => new Promise(
  (resolve, reject) => {
    if (options.signal)
      options.signal.addEventListener('abort', reject);
    element.addEventListener(
      type,
      (event) => {
        for (const method of methods) {
          if (options[method]) event[method]();
        }
        resolve(new Proxy(event, new Handler(element)));
      },
      { ...options, once: true }
    );
  }
);
