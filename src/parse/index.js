import { Ast as AST, Parser } from 'apg-lite';

import Grammar from '../server-url-templating.js';
import serverURLTemplateCallback from './callbacks/server-url-template.js';
import serverVariableCallback from './callbacks/server-variable.js';
import serverVariableNameCallback from './callbacks/server-variable-name.js';
import literalsCallback from './callbacks/literals.js';

const grammar = new Grammar();

const parse = (serverURLTemplate) => {
  const parser = new Parser();

  parser.ast = new AST();
  parser.ast.callbacks['server-url-template'] = serverURLTemplateCallback;
  parser.ast.callbacks['server-variable'] = serverVariableCallback;
  parser.ast.callbacks['server-variable-name'] = serverVariableNameCallback;
  parser.ast.callbacks['literals'] = literalsCallback;

  const result = parser.parse(grammar, 'server-url-template', serverURLTemplate);

  return { result, ast: parser.ast };
};

export default parse;
