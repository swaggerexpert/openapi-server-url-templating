import parse from './parse/index.js';

const isEncoded = (serverVariable) => {
  try {
    return (
      typeof serverVariable === 'string' && decodeURIComponent(serverVariable) !== serverVariable
    );
  } catch {
    return false;
  }
};

export const encodeServerVariable = (serverVariable) => {
  if (isEncoded(serverVariable)) {
    return serverVariable;
  }

  return encodeURIComponent(serverVariable).replace(/%5B/g, '[').replace(/%5D/g, ']');
};

const significantTypes = ['literals', 'server-variable-name'];

const substitute = (serverURLTemplate, serverVariables, options = {}) => {
  const defaultOptions = { encoder: encodeServerVariable };
  const mergedOptions = { ...defaultOptions, ...options };
  const parseResult = parse(serverURLTemplate);

  if (!parseResult.result.success) return serverURLTemplate;

  const parts = [];

  parseResult.ast.translate(parts);

  const substitutedParts = parts
    .filter(([type]) => significantTypes.includes(type))
    .map(([type, value]) => {
      if (type === 'server-variable-name') {
        return Object.hasOwn(serverVariables, value)
          ? mergedOptions.encoder(serverVariables[value], value)
          : `{${value}}`;
      }

      return value;
    });

  return substitutedParts.join('');
};

export default substitute;
