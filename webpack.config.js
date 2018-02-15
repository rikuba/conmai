const main = require('./webpack.main.config');
const script = require('./webpack.script.config');
const renderer = require('./webpack.renderer.config');

module.exports = (env) => {
  if (env === 'development') {
    // In development mode, renderer config is read by webpack-dev-server,
    // so it is not included here
    return [main(env), script(env)];
  }
  
  return [main(env), script(env), renderer(env)];
};
