'use strict';

const assert = require('assert');
require('babel-register');
const SnippetsStorage = require('../lib/storage').default;

describe('Storage', () => {
    it('create', () => {
        const storage = new SnippetsStorage();

        assert.equal(storage.get('foo'), undefined);

        storage.set('foo', 'bar');
        assert.equal(storage.get('foo').key, 'foo');
        assert.equal(storage.get('foo').value, 'bar');

        storage.set('a1|a2', 'baz');
        assert.equal(storage.get('a1').key, 'a1');
        assert.equal(storage.get('a1').value, 'baz');
        assert.equal(storage.get('a2').key, 'a2');
        assert.equal(storage.get('a2').value, 'baz');

        storage.set(/foo\d+/, 'ban');
        assert.equal(storage.get('foo').value, 'bar');
        assert.equal(storage.get('foo123').value, 'ban');

        assert.equal(storage.values().length, 4);

        storage.reset();
        assert.equal(storage.get('foo'), undefined);
        assert.equal(storage.get('foo123'), undefined);
        assert.equal(storage.values().length, 0);
    });

    it('batch load (object)', () => {
        const storage = new SnippetsStorage({
            'foo': 'bar',
            'a1|a2': 'baz'
        });

        assert.equal(storage.get('foo').key, 'foo');
        assert.equal(storage.get('foo').value, 'bar');
        assert.equal(storage.get('a1').key, 'a1');
        assert.equal(storage.get('a1').value, 'baz');
        assert.equal(storage.get('a2').key, 'a2');
        assert.equal(storage.get('a2').value, 'baz');
    });

    it('batch load (map)', () => {
        const storage = new SnippetsStorage(new Map()
            .set('foo', 'bar')
            .set('a1|a2', 'baz')
            .set(/foo\d+/, 'ban')
        );

        assert.equal(storage.get('foo').key, 'foo');
        assert.equal(storage.get('foo').value, 'bar');
        assert.equal(storage.get('foo123').value, 'ban');
        assert.equal(storage.get('a1').key, 'a1');
        assert.equal(storage.get('a1').value, 'baz');
        assert.equal(storage.get('a2').key, 'a2');
        assert.equal(storage.get('a2').value, 'baz');
    });

    it('enable/disable', () => {
        const storage = new SnippetsStorage({'foo': 'bar'});

        assert.equal(storage.disabled, false);
        assert(storage.get('foo'));

        storage.disable();
        assert.equal(storage.disabled, true);
        assert.equal(storage.get('foo'), undefined);

        storage.enable();
        assert.equal(storage.disabled, false);
        assert(storage.get('foo'));
    });
});
