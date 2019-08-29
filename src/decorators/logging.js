export default function logging(label) {
  if (!window.localStorage.debug) {
    window.localStorage.debug = `${label}`;
  }
  else {
    window.localStorage.debug += `,${label}`;
  }

  return function(constructor) {
    return class extends constructor {
      log() {
        if (process.env.NODE_ENV === 'development') {
          const debug = require('debug');
          debug(label).apply(undefined, arguments);
        }
      }
    };
  };
}