export default class EventEmitter {
  constructor() {
    this.listeners = [];
  }

  on(event, callback) {
    this.listeners.push({ event, callback });
    return this.off(event, callback);
  }
  off(event, callback) {
    this.listeners = this.listeners.filter(
      (l) => l.event != event && l.callback != callback
    );
  }
  once(event, callback) {
    function callbackOnce(...args) {
      callback(...args);
      this.off(event, callbackOnce);
    }
    this.on(event, callback);
  }
}

export const bridge = new EventEmitter();
