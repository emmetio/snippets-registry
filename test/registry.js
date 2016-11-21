const assert = require('assert');
require('babel-register');
const main = require('../');
const createRegistry = main.default;
const GLOBAL = main.GLOBAL;
const USER = main.USER;

describe('Snippets Registry', () => {
    it('create and fill', () => {
        const registry = createRegistry();
        const s1 = registry.add(USER, {'a': 'b2', c2: 'd2'});
        const s2 = registry.add({a: 'b', c: 'd'});

        assert(s1);
        assert(s2);

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
        const toDict = map => Array.from(map.keys()).reduce((out, key) => {
            out[key] = map.get(key).value;
            return out;
        }, {});

        const registry = createRegistry();
        const s1 = registry.add(USER, {'a': 'b2', c2: 'd2'});
        const s2 = registry.add({a: 'b', c: 'd'});

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
        const registry = createRegistry();
        registry.add(new Map()
            .set('a', 'b')
            .set('c', 'd')
            .set(/foo/, 'bar')
        );
        const keys = opt => Array.from(registry.all(opt).keys());

        assert.deepEqual(keys(), ['a', 'c', /foo/]);
        assert.deepEqual(keys({type: 'string'}), ['a', 'c']);
        assert.deepEqual(keys({type: 'regexp'}), [/foo/]);
    });
});
