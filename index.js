const { get } = Reflect;

const methods = [
  'preventDefault',
  'stopPropagation',
  'stopImmediatePropagation',
];

class Handler {
  #currentTarget;
  constructor(currentTarget) {
    this.#currentTarget = currentTarget;
  }
  get(e, name) {
    // Did you know? event.currentTarget disappears from events on
    // next tick, which is why this proxy handler needs to exist.
    return name === 'currentTarget' ? this.#currentTarget : get(e, name);
  }
}

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
