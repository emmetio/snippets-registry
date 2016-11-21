'use strict';

import Snippet from './snippet';

export default class SnippetsStorage {
    constructor(data) {
        this._string = new Map();
        this._regexp = new Map();
        this._disabled = false;

        this.load(data);
    }

    get disabled() {
        return this._disabled;
    }

    /**
     * Disables current store. A disabled store always returns `undefined`
     * on `get()` method
     */
    disable() {
        this._disabled = true;
    }

    /**
     * Enables current store.
     */
    enable() {
        this._disabled = false;
    }

    /**
     * Registers a new snippet item
     * @param {String|Regexp} key
     * @param {String|Function} value
     */
    set(key, value) {
        if (typeof key === 'string') {
            key.split('|').forEach(k => this._string.set(k, new Snippet(k, value)));
        } else if (key instanceof RegExp) {
            this._regexp.set(key, new Snippet(key, value));
        } else {
            throw new Error('Unknow snippet key: ' + key);
        }

        return this;
    }

    /**
     * Returns a snippet matching given key. It first tries to find snippet
     * exact match in a string key map, then tries to match one with regexp key
     * @param {String} key
     * @return {Snippet}
     */
    get(key) {
        if (this.disabled) {
            return undefined;
        }

        if (this._string.has(key)) {
            return this._string.get(key);
        }

        const keys = Array.from(this._regexp.keys());
        for (let i = 0, il = keys.length; i < il; i++) {
            if (keys[i].test(key)) {
                return this._regexp.get(keys[i]);
            }
        }
    }

    /**
     * Batch load of snippets data
     * @param {Object|Map} data
     */
    load(data) {
        this.reset();
        if (data instanceof Map) {
            data.forEach((value, key) => this.set(key, value));
        } else if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => this.set(key, data[key]));
        }
    }

    /**
     * Clears all stored snippets
     */
    reset() {
        this._string.clear();
        this._regexp.clear();
    }

    /**
     * Returns all available snippets from given store
     */
    values() {
        if (this.disabled) {
            return [];
        }
        
        const string = Array.from(this._string.values());
        const regexp = Array.from(this._regexp.values());
        return string.concat(regexp);
    }
}
