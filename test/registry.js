'use strict';

const assert = require('assert');
require('babel-register');
const SnippetsRegistry = require('../index').default;

const GLOBAL = 0;
const USER = 1;

describe('Snippets Registry', () => {
    it('create and fill', () => {
        const registry = new SnippetsRegistry([
            {a: 'b', c: 'd'},
            {'a': 'b2', c2: 'd2'}
        ]);

        assert.equal(registry.resolve('a').value, 'b2');
        assert.equal(registry.resolve('c').value, 'd');
        assert.equal(registry.resolve('c2').value, 'd2');
        assert.equal(registry.resolve('a2'), undefined);

        // remove store
        registry.remove(GLOBAL);
        assert.equal(registry.resolve('a').value, 'b2');
        assert.equal(registry.resolve('c'), undefined);
        assert.equal(registry.resolve('c2').value, 'd2');
        assert.equal(registry.resolve('a2'), undefined);

        // replace store
        registry.add(USER, {'a2': 'b2', d2: 'e2'});
        assert.equal(registry.resolve('a'), undefined);
        assert.equal(registry.resolve('a2').value, 'b2');
        assert.equal(registry.resolve('c2'), undefined);
        assert.equal(registry.resolve('d2').value, 'e2');
    });

    it('resolve', () => {
		const toDict = allSnippets => allSnippets.reduce((out, snippet) => {
			out[snippet.key] = snippet.value;
			return out;
		}, {});

        const registry = new SnippetsRegistry();
        const s1 = registry.add(USER, {'a': 'b2', c2: 'd2'});
        const s2 = registry.add({a: 'b', c: 'd'});

        assert(s1);
        assert(s2);

        assert.equal(registry.resolve('a').value, 'b2');
        assert.equal(registry.resolve('c').value, 'd');
        assert.equal(registry.resolve('c2').value, 'd2');
        assert.deepEqual(toDict(registry.all()), {a: 'b2', c2: 'd2', c: 'd'});

        // disable store
        s1.disable();
        assert.equal(registry.resolve('a').value, 'b');
        assert.equal(registry.resolve('c').value, 'd');
        assert.equal(registry.resolve('c2'), undefined);
        assert.deepEqual(toDict(registry.all()), {a: 'b', c: 'd'});

        // enable store
        s1.enable();
        assert.equal(registry.resolve('a').value, 'b2');
        assert.equal(registry.resolve('c').value, 'd');
        assert.equal(registry.resolve('c2').value, 'd2');
        assert.deepEqual(toDict(registry.all()), {a: 'b2', c2: 'd2', c: 'd'});
    });

    it('all by type', () => {
        const registry = new SnippetsRegistry();
        registry.add(new Map()
            .set('a', 'b')
            .set('c', 'd')
            .set(/foo/, 'bar')
        );
        const keys = opt => Array.from(registry.all(opt).map(snippet => snippet.key));

        assert.deepEqual(keys(), ['a', 'c', /foo/]);
        assert.deepEqual(keys({type: 'string'}), ['a', 'c']);
        assert.deepEqual(keys({type: 'regexp'}), [/foo/]);
    });
});
