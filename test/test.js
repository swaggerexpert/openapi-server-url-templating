import { assert } from 'chai';

import { test } from '../src/index.js';

describe('test', function () {
  it('should detect as server URL template', function () {
    assert.isTrue(test('https://{username}.gigantic-server.com:{port}/{basePath}'));
    assert.isTrue(test('http://{username}.gigantic-server.com:{port}/{basePath}'));
    assert.isTrue(test('/{path}'));
    assert.isTrue(test('/{path}/')); // trailing slash is allowed
    assert.isTrue(test('/pets/{petId}'));
    assert.isTrue(test('/{entity}/me'));
    assert.isTrue(test('/books/{id}'));
    assert.isTrue(test('/a{test}'));
    assert.isTrue(test('/{test}a'));
    assert.isTrue(test('/foo/bar/{baz}/test/{foo_id}/baz/{bar_id}'));
    assert.isTrue(test('/range({x},{y})')); // parentheses are allowed
    assert.isTrue(test('/range({x},{y})/secondRange({x},{y})')); // repeated parameter names are allowed
    assert.isTrue(test('/{entity}/{another-entity}/me'));
    // some special characters in literals are allowed
    assert.isTrue(test('/'));
    assert.isTrue(test('/-/'));
    assert.isTrue(test('/~/'));
    assert.isTrue(test('/%20'));
    assert.isTrue(test('/functions/t_Dist_2T'));
    assert.isTrue(test('/❤️'));
    assert.isTrue(test('/users/$count'));
    assert.isTrue(test('/users/delta()'));
    assert.isTrue(test('/directoryObjects/microsoft.graph.user'));
    assert.isTrue(test("/applications(appId='{appId}')"));
    assert.isTrue(test("/com/on/get(meetingOrganizerUserId='@meetingOrganizerUserId')"));
    // some special characters in server variable names are allowed
    assert.isTrue(test('/users/{user-id}'));
    assert.isTrue(test('/{❤️}'));
    assert.isTrue(test('/{%}'));
    assert.isTrue(test('/{foo:}'));
    assert.isTrue(test('/{foo:baz}'));
    assert.isTrue(test('/{=baz}'));
    assert.isTrue(test('/{$baz}'));
    assert.isTrue(test('/{~baz}'));
    assert.isTrue(test('/{#baz}'));
    assert.isTrue(test('/{?baz}'));
    assert.isTrue(test('/{/baz}'));
    assert.isTrue(test('/{foo baz}'));
    assert.isTrue(test('/{|baz}'));
    assert.isTrue(test('/{^baz}'));
    assert.isTrue(test('/{`baz}'));
    // RFC 6570 operators are allowed
    assert.isTrue(test('/{y,x}'));
    assert.isTrue(test('/{count*}'));
    assert.isTrue(test('/{;bar}'));
    assert.isTrue(test('/{&bar}'));
    assert.isTrue(test('/{.bar}'));
    // relative reference, query and fragment are allowed
    assert.isTrue(test('/pets?offset=0&limit=10'));
    assert.isTrue(test('/'));
    assert.isTrue(test('1'));
    assert.isTrue(test('{petId}'));
    assert.isTrue(test('/pets?offset={offset}&limit={limit}'));
    assert.isTrue(test('/pets?offset{offset}limit={limit}'));
    assert.isTrue(test('/pets?offset#{fragment}'));
    // different protocols
    assert.isTrue(test('ftp://{username}.gigantic-server.com:{port}/{basePath}'));
    assert.isTrue(test('postgresql://sally:sallyspassword@dbserver.example:5555/userdata'));
  });

  context('given server URL template is a valid absolute URL without variables', function () {
    specify('should detect as server URL template', function () {
      assert.isTrue(test('https://gigantic-server.com:8000/basePath'));
      assert.isTrue(test('http://gigantic-server.com:8000/basePath'));
      assert.isTrue(test('https://gigantic-server.com/basePath'));
      assert.isTrue(test('http://gigantic-server.com/basePath'));
      assert.isTrue(test('http://gigantic-server.com/basePath/'));
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
        assert.isTrue(test('/basePath/'));
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
    assert.isFalse(test('/pet/{petId'));
    assert.isFalse(test(''));
    assert.isFalse(test('//'));
    assert.isFalse(test('/pet/{petId'));
    // invalid types
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
      assert.isTrue(test('/{path}/', { strict: true })); // trailing slash is allowed
      assert.isTrue(test('/pets/{petId}', { strict: true }));
      assert.isTrue(test('/{entity}/me', { strict: true }));
      assert.isTrue(test('/books/{id}', { strict: true }));
      assert.isTrue(test('/a{test}', { strict: true }));
      assert.isTrue(test('/{test}a', { strict: true }));
      assert.isTrue(test('/foo/bar/{baz}/test/{foo_id}/baz/{bar_id}', { strict: true }));
      assert.isTrue(test('/range({x},{y})', { strict: true })); // parentheses are allowed
      assert.isTrue(test('/range({x},{y})/secondRange({x},{y})', { strict: true })); // repeated parameter names are allowed
      assert.isTrue(test('/{entity}/{another-entity}/me', { strict: true }));
      // some special characters in literals are allowed
      assert.isTrue(test("/applications(appId='{appId}')"), { strict: true });
      // some special characters in server variable names are allowed
      assert.isTrue(test('/users/{user-id}', { strict: true }));
      assert.isTrue(test('/{❤️}', { strict: true }));
      assert.isTrue(test('/{%}', { strict: true }));
      assert.isTrue(test('/{foo:}', { strict: true }));
      assert.isTrue(test('/{foo:baz}', { strict: true }));
      assert.isTrue(test('/{=baz}', { strict: true }));
      assert.isTrue(test('/{$baz}', { strict: true }));
      assert.isTrue(test('/{~baz}', { strict: true }));
      assert.isTrue(test('/{#baz}', { strict: true }));
      assert.isTrue(test('/{?baz}', { strict: true }));
      assert.isTrue(test('/{/baz}', { strict: true }));
      assert.isTrue(test('/{foo baz}', { strict: true }));
      assert.isTrue(test('/{|baz}', { strict: true }));
      assert.isTrue(test('/{^baz}', { strict: true }));
      assert.isTrue(test('/{`baz}', { strict: true }));
      // RFC 6570 operators are allowed
      assert.isTrue(test('/{y,x}', { strict: true }));
      assert.isTrue(test('/{count*}', { strict: true }));
      assert.isTrue(test('/{;bar}', { strict: true }));
      assert.isTrue(test('/{&bar}', { strict: true }));
      assert.isTrue(test('/{.bar}', { strict: true }));
      // relative reference, query and fragment are allowed
      assert.isTrue(test('{petId}', { strict: true }));
      assert.isTrue(test('/pets?offset={offset}&limit={limit}', { strict: true }));
      assert.isTrue(test('/pets?offset{offset}limit={limit}', { strict: true }));
      assert.isTrue(test('/pets?offset#{fragment}', { strict: true }));
      // different protocols
      assert.isTrue(
        test('ftp://{username}.gigantic-server.com:{port}/{basePath}', { strict: true }),
      );
      assert.isTrue(
        test('postgresql://sally:sallyspassword@dbserver.example:{port}/userdata', {
          strict: true,
        }),
      );
    });

    specify('should not detect server URL template', function () {
      // some special characters in literals are allowed
      assert.isTrue(test('/'));
      assert.isTrue(test('/-/'));
      assert.isTrue(test('/~/'));
      assert.isTrue(test('/%20'));
      assert.isTrue(test('/functions/t_Dist_2T'));
      assert.isTrue(test('/❤️'));
      assert.isTrue(test('/users/$count'));
      assert.isTrue(test('/users/delta()'));
      assert.isTrue(test('/directoryObjects/microsoft.graph.user'));
      assert.isTrue(test("/com/on/get(meetingOrganizerUserId='@meetingOrganizerUserId')"));
      // relative reference, query and fragment are allowed
      assert.isTrue(test('/pets?offset=0&limit=10'));
      assert.isTrue(test('/'));
      assert.isTrue(test('1'));
      // different protocols
      assert.isFalse(
        test('postgresql://sally:sallyspassword@dbserver.example:5555/userdata', {
          strict: true,
        }),
      );

      assert.isFalse(test('https://gigantic-server.com:8000/basePath', { strict: true }));
      assert.isFalse(test('/', { strict: true }));
      assert.isFalse(test('/pets/mine', { strict: true }));
      assert.isFalse(test('/pets?offset=0&limit=10', { strict: true }));
      assert.isFalse(test('/pets#fragment', { strict: true }));
      assert.isFalse(test('', { strict: true }));
      assert.isFalse(test('/pet/{petId', { strict: true }));
      assert.isFalse(test(1, { strict: true }));
      assert.isFalse(test(null, { strict: true }));
      assert.isFalse(test(undefined, { strict: true }));
    });
  });
});
