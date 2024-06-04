import { assert } from 'chai';

import { parse } from '../src/index.js';

describe('parse', function () {
  context('given valid source string', function () {
    context('https://{username}.gigantic-server.com:{port}/{basePath}', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('https://{username}.gigantic-server.com:{port}/{basePath}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', 'https://{username}.gigantic-server.com:{port}/{basePath}'],
          ['literals', 'https://'],
          ['server-variable', '{username}'],
          ['server-variable-name', 'username'],
          ['literals', '.gigantic-server.com:'],
          ['server-variable', '{port}'],
          ['server-variable-name', 'port'],
          ['literals', '/'],
          ['server-variable', '{basePath}'],
          ['server-variable-name', 'basePath'],
        ]);
      });
    });

    context('h{proto}s://{username}.gigantic-server.com:{port}/{basePath}', function () {
      specify('should parse as relative URI Reference and translate', function () {
        const parseResult = parse('h{proto}s://{username}.gigantic-server.com:{port}/{basePath}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', 'h{proto}s://{username}.gigantic-server.com:{port}/{basePath}'],
          ['literals', 'h'],
          ['server-variable', '{proto}'],
          ['server-variable-name', 'proto'],
          ['literals', 's://'],
          ['server-variable', '{username}'],
          ['server-variable-name', 'username'],
          ['literals', '.gigantic-server.com:'],
          ['server-variable', '{port}'],
          ['server-variable-name', 'port'],
          ['literals', '/'],
          ['server-variable', '{basePath}'],
          ['server-variable-name', 'basePath'],
        ]);
      });
    });

    context('/{basePath}', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/{basePath}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/{basePath}'],
          ['literals', '/'],
          ['server-variable', '{basePath}'],
          ['server-variable-name', 'basePath'],
        ]);
      });
    });

    context('/a{basePath}', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/a{basePath}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/a{basePath}'],
          ['literals', '/a'],
          ['server-variable', '{basePath}'],
          ['server-variable-name', 'basePath'],
        ]);
      });
    });

    context('/pets?offset=0&limit=10', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/pets?offset=0&limit=10');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/pets?offset=0&limit=10'],
          ['literals', '/pets?offset=0&limit=10'],
        ]);
      });
    });

    context('/pets?offset{offset}limit={limit}', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/pets?offset{offset}limit={limit}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/pets?offset{offset}limit={limit}'],
          ['literals', '/pets?offset'],
          ['server-variable', '{offset}'],
          ['server-variable-name', 'offset'],
          ['literals', 'limit='],
          ['server-variable', '{limit}'],
          ['server-variable-name', 'limit'],
        ]);
      });
    });

    context('/pets?offset={offset}&limit={limit}', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/pets?offset={offset}&limit={limit}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/pets?offset={offset}&limit={limit}'],
          ['literals', '/pets?offset='],
          ['server-variable', '{offset}'],
          ['server-variable-name', 'offset'],
          ['literals', '&limit='],
          ['server-variable', '{limit}'],
          ['server-variable-name', 'limit'],
        ]);
      });
    });

    context('/pets#fragment', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/pets#fragment');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/pets#fragment'],
          ['literals', '/pets#fragment'],
        ]);
      });
    });

    context('/pets?offset=0#{fragment}', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/pets?offset=0#{fragment}');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/pets?offset=0#{fragment}'],
          ['literals', '/pets?offset=0#'],
          ['server-variable', '{fragment}'],
          ['server-variable-name', 'fragment'],
        ]);
      });
    });

    context('/pets/mine', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/pets/mine');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/pets/mine'],
          ['literals', '/pets/mine'],
        ]);
      });
    });

    context('/', function () {
      specify('should parse and translate', function () {
        const parseResult = parse('/');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['server-url-template', '/'],
          ['literals', '/'],
        ]);
      });
    });
  });

  context('given empty value for server variable', function () {
    specify('should fail parsing', function () {
      const parseResult = parse('/pets/{}');

      assert.isFalse(parseResult.result.success);
    });
  });

  context('empty string', function () {
    specify('should fail parsing', function () {
      const parseResult = parse('');

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isFalse(parseResult.result.success);
      assert.lengthOf(parts, 0);
    });
  });

  context('relative-uri-reference-without-slash', function () {
    specify('should parse and translate', function () {
      const parseResult = parse('relative-uri-reference-without-slash');

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['server-url-template', 'relative-uri-reference-without-slash'],
        ['literals', 'relative-uri-reference-without-slash'],
      ]);
    });
  });

  context('relative-uri-reference/{var}', function () {
    specify('should parse and translate', function () {
      const parseResult = parse('relative-uri-reference/{var}');

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['server-url-template', 'relative-uri-reference/{var}'],
        ['literals', 'relative-uri-reference/'],
        ['server-variable', '{var}'],
        ['server-variable-name', 'var'],
      ]);
    });
  });

  context('given non-string input', function () {
    specify('should throw error', function () {
      assert.throws(() => parse(1), Error);
      assert.throws(() => parse(null), Error);
      assert.throws(() => parse(undefined), Error);
    });
  });
});
