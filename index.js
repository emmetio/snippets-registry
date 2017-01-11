'use strict';

import SnippetsStorage from './lib/storage';

/**
 * A snippets registry. Contains snippets, separated by store and sorted by
 * priority: a store with higher priority takes precedence when resolving snippet
 * for given key
 */
export default class SnippetsRegistry {
    /**
     * Creates snippets registry, filled with given `data`
     * @param {Object|Array} data Registry snippets. If array is given, adds items
     * from array in order of precedence, registers global snippets otherwise
     */
    constructor(data) {
        this._registry = [];

        if (Array.isArray(data)) {
            data.forEach((snippets, level) => this.add(level, snippets));
        } else if (typeof data === 'object') {
            this.add(data);
        }
    }

    /**
     * Return store for given level
     * @param {Number} level
     * @return {SnippetsStorage}
     */
    get(level) {
        for (let i = 0; i < this._registry.length; i++) {
            const item = this._registry[i];
            if (item.level === level) {
                return item.store;
            }
        }
    }

    /**
     * Adds new store for given level
     * @param {Number} [level] Store level (priority). Store with higher level
     * takes precedence when resolving snippets
     * @param {Object} [snippets] A snippets data for new store
     * @return {SnipetsStorage}
     */
    add(level, snippets) {
        if (level != null && typeof level === 'object') {
            snippets = level;
            level = 0;
        }

        const store = new SnippetsStorage(snippets);

        // remove previous store from same level
        this.remove(level);

        this._registry.push({level, store});
        this._registry.sort((a, b) => b.level - a.level);

        return store;
    }

    /**
     * Remove registry with given level or store
     * @param {Number|SnippetsStorage} data Either level or snippets store
     */
    remove(data) {
        this._registry = this._registry
        .filter(item => item.level !== data && item.store !== data);
    }

    /**
     * Returns snippet from registry that matches given name
     * @param {String} name
     * @return {Snippet}
     */
    resolve(name) {
        for (let i = 0; i < this._registry.length; i++) {
            const snippet = this._registry[i].store.get(name);
            if (snippet) {
                return snippet;
            }
        }
    }

    /**
     * Returns all snippets from current registry
     * @param {Object} options
     * @param {Object} options.type Return snippets only of given type: 'string'
     * or 'regexp'. Returns all snippets if not defined
     * @return {Map}
     */
    all(options) {
        options = options || {};
        const result = new Map();

        const fillResult = snippet => {
            const type = snippet.key instanceof RegExp ? 'regexp' : 'string';
            if ((!options.type || options.type === type) && !result.has(snippet.key)) {
                result.set(snippet.key, snippet);
            }
        };

        this._registry.forEach(item => {
            item.store.values().forEach(fillResult);
        });

        return result;
    }

    /**
     * Removes all stores from registry
     */
    clear() {
        this._registry.length = 0;
    }
}
