const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const tsRule = {
  test: /\.[jt]sx?$/,
  include: srcDir,
  use: 'awesome-typescript-loader',
};

const main = (env, common) => {
  const config = {
    context: path.join(srcDir, 'main'),
    entry: { 'index': './index' },
    output: {
      path: path.join(distDir, 'main'),
      filename: '[name].js',
    },
    module: {
      rules: [tsRule],
    },
    target: 'electron-main',
    node: {
      __dirname: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
    ],
  };

  return Object.assign({}, common, config);
};

const renderer = (env, common) => {
  const pageDir = (baseDir, page) => path.join(baseDir, 'renderer', 'pages', page);
  const extractCSS = new ExtractTextPlugin('[name].css');
  
  const config = {
    context: pageDir(srcDir, 'index'),
    entry: { 'index': './index' },
    output: {
      path: pageDir(distDir, 'index'),
      filename: '[name].js',
    },
    module: {
      rules: [
        tsRule,
        {
          test: /\.css$/,
          include: srcDir,
          use: extractCSS.extract({
            fallback: 'style-loader',
            use: {
              loader: 'css-loader',
              options: {
                camelCase: true,
                modules: true,
                sourceMap: true,
              },
            },
          }),
        },
      ],
    },
    target: 'electron-renderer',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new HtmlPlugin({
        filename: 'index.html',
        template: './index.html',
      }),
      extractCSS,
    ],
  };

  if (env === 'development') {
    config.plugins.push(new webpack.NamedModulesPlugin());
  }

  return Object.assign({}, common, config);
};

module.exports = (env) => {
  const common = {
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
    devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
  };

  return [].concat(
    main(env, common),
    renderer(env, common)
  );
};
