import { assert } from 'chai';

import { substitute, encodeServerVariable } from '../src/index.js';

describe('substitute', function () {
  it('should substitute server URL (absolute URI) template with parameter', function () {
    const result = substitute('http{secure}://{username}.gigantic-server.com:{port}/{basePath}', {
      secure: 's',
      username: 'char0n',
      port: 8080,
      basePath: 'v1',
    });

    assert.equal(result, 'https://char0n.gigantic-server.com:8080/v1');
  });

  it('should substitute server URL (relative URI Reference) template with parameter', function () {
    const result = substitute('/pets/{petId}', { petId: '123' });

    assert.equal(result, '/pets/123');
  });

  it('should substitute multiple server variables with the same name', function () {
    const result = substitute('/pets/{petId}/{petId}', { petId: '123' });

    assert.equal(result, '/pets/123/123');
  });

  it('should encode characters using encodeServerVariable', function () {
    const result = substitute('/pets/{petId}', { petId: '/?#' });

    assert.equal(result, '/pets/%2F%3F%23');
  });

  it('should encode "generic syntax" characters described by RFC6570', function () {
    const result = substitute('/pets/{petId}', { petId: '/?#' });

    assert.equal(result, '/pets/%2F%3F%23');
  });

  it('should avoid encoding "[" and "]" characters using encodeURIComponent', function () {
    const result = substitute('/pets/{petId}', { petId: '[]' });

    assert.equal(result, '/pets/[]');
  });

  it('should substitute server variable with empty value', function () {
    const result = substitute('/pets/{petId}/test', { petId: '' });

    assert.equal(result, '/pets//test');
  });

  it('should do nothing on missing parameter', function () {
    const result = substitute('/pets/{petId}?limit={limit}', {});

    assert.equal(result, '/pets/{petId}?limit={limit}');
  });

  it('should substitute server variable with non-string value', function () {
    const result = substitute('/pets/{petId}', { petId: 1 });

    assert.equal(result, '/pets/1');
  });

  it('should substitute in query string', function () {
    const result = substitute('/pets?offset={offset}&limit={limit}', { offset: 0, limit: 10 });

    assert.equal(result, '/pets?offset=0&limit=10');
  });

  it('should substitute in URL fragment', function () {
    const result = substitute('/pets#{fragment}', { fragment: 'value' });

    assert.equal(result, '/pets#value');
  });

  it('should accept custom encoding function', function () {
    const result = substitute(
      '/pets/{petId}',
      { petId: '/?#' },
      {
        encoder: (serverVariable) => serverVariable,
      },
    );

    assert.equal(result, '/pets//?#');
  });

  it('should export encodeServerVariable function', function () {
    assert.isFunction(encodeServerVariable);
  });
});
