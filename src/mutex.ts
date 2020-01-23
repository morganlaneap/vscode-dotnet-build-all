// Source: https://stackoverflow.com/questions/50553186/nodejs-child-process-write-stdout-in-realtime-run-sequentially

class Mutex {
  _queue: any[];

  constructor() {
    this._queue = [];
  }

  lock() {
    return new Promise((resolve, reject) => {
      const allow = () => {
        resolve(this._unlock.bind(this));
      };
      this._queue.push(allow);
      if (this._queue.length === 1) {
        allow();
      }
    });
  }

  _unlock() {
    this._queue.shift();
    const next = this._queue[0];
    if (typeof next === "function") {
      next();
    }
  }
}

export default Mutex;
