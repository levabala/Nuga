/* eslint-disable */

function Reactor() {
    this.events = {};

    this.registerEvent = function (eventName) {
        const event = new Event(eventName);
        this.events[eventName] = event;
        return this;
    };

    this.dispatchEvent = function (eventName, eventArgs) {
        for (const c in this.events[eventName].callbacks)
            this.events[eventName].callbacks[c](eventArgs);
        return this;
    };

    this.addEventListener = function (eventName, callback) {
        this.events[eventName].registerCallback(callback);
        return this;
    };

    this.removeEventListeners = function (eventName) {
        delete this.events[eventName];
        return this;
    };
}

function Event(name) {
    this.name = name;
    this.callbacks = [];
}

Event.prototype.registerCallback = function (callback) {
    this.callbacks.push(callback);
};

export default Reactor;