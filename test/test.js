import { assert } from 'chai';

import { test } from '../src/index.js';

describe('test', function () {
  it('should detect as server URL template', function () {
    assert.isTrue(test('https://{username}.gigantic-server.com:{port}/{basePath}'));
    assert.isTrue(test('http://{username}.gigantic-server.com:{port}/{basePath}'));
    assert.isTrue(test('/{path}'));
    assert.isTrue(test('/pets/{petId}'));
    assert.isTrue(test('/{entity}/me'));
    assert.isTrue(test('/books/{id}'));
    assert.isTrue(test('/a{test}'));
    assert.isTrue(test('/{entity}/{another-entity}/me'));
    assert.isTrue(test('/pets?offset=0&limit=10'));
    assert.isTrue(test('/'));
    assert.isTrue(test('1'));
    assert.isTrue(test('{petId}'));
    assert.isTrue(test('/pets?offset={offset}&limit={limit}'));
    assert.isTrue(test('/pets?offset{offset}limit={limit}'));
  });

  context('given server URL template is a valid absolute URL without variables', function () {
    specify('should detect as server URL template', function () {
      assert.isTrue(test('https://gigantic-server.com:8000/basePath'));
      assert.isTrue(test('http://gigantic-server.com:8000/basePath'));
      assert.isTrue(test('https://gigantic-server.com/basePath'));
      assert.isTrue(test('http://gigantic-server.com/basePath'));
    });
  });

  context('given server URL template is an invalid absolute URL without variables', function () {
    specify('should not detect as server URL template', function () {
      assert.isFalse(test('http://[:::1]'));
    });
  });

  context(
    'given server URL template is a valid relative URI Reference without variables',
    function () {
      specify('should detect as server URL template', function () {
        assert.isTrue(test('basePath'));
        assert.isTrue(test('/basePath'));
        assert.isTrue(test('/basePath?query=1'));
        assert.isTrue(test('/basePath#fragment'));
        assert.isTrue(test('/basePath?query=1#fragment'));
      });
    },
  );

  context(
    'given server URL template is an invalid relative URI Reference without variables',
    function () {
      specify('should detect as server URL template', function () {
        assert.isFalse(test('https://'));
      });
    },
  );

  it('should not detect expression', function () {
    assert.isTrue(test('ftp://{username}.gigantic-server.com:{port}/{basePath}'));
    assert.isFalse(test('/pet/{petId'));
    assert.isFalse(test(''));
    assert.isFalse(test(1));
    assert.isFalse(test(null));
    assert.isFalse(test(undefined));
  });

  context('given strict option', function () {
    specify('should detect as server URL template', function () {
      assert.isTrue(
        test('https://{username}.gigantic-server.com:{port}/{basePath}', { strict: true }),
      );
      assert.isTrue(
        test('http://{username}.gigantic-server.com:{port}/{basePath}', { strict: true }),
      );
      assert.isTrue(test('/{path}', { strict: true }));
      assert.isTrue(test('/pets/{petId}', { strict: true }));
      assert.isTrue(test('/{entity}/me', { strict: true }));
      assert.isTrue(test('/books/{id}', { strict: true }));
      assert.isTrue(test('/{entity}/{another-entity}/me', { strict: true }));
      assert.isTrue(test('/pets/{petId}?offset={offset}&limit={limit}', { strict: true }));
      assert.isTrue(test('1'), { strict: true });
      assert.isTrue(test('{petId}'), { strict: true });
    });

    specify('should not detect server URL template', function () {
      assert.isFalse(test('https://gigantic-server.com:8000/basePath', { strict: true }));
      assert.isFalse(test('/', { strict: true }));
      assert.isFalse(test('/pets/mine', { strict: true }));
      assert.isFalse(test('/pets?offset=0&limit=10', { strict: true }));
      assert.isFalse(test(''));
      assert.isFalse(test('/pet/{petId'));
      assert.isFalse(test(1));
      assert.isFalse(test(null));
      assert.isFalse(test(undefined));
    });
  });
});
