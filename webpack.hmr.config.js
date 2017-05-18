const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const pageDir = (baseDir) => path.join(baseDir, 'renderer', 'pages');
const publicPath = `http://localhost:8080/`;

const forPage = (page) => {
  return {
    context: pageDir(srcDir),

    entry: {
      [`${page}`]: [
        'react-hot-loader/patch',
        `./${page}`,
      ],
    },

    output: {
      path: pageDir(distDir),
      filename: '[name].js',
      publicPath,
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: srcDir,
          use: [
            'react-hot-loader/webpack',
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig.renderer.json',
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: srcDir,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },

    devtool: 'inline-source-map',

    target: 'electron-renderer',

    devServer: {
      hot: true,
      contentBase: pageDir(distDir),
      publicPath,
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new CheckerPlugin(),
      new HtmlPlugin({
        filename: `${page}.html`,
        template: `./${page}.html`,
        alwaysWriteToDisk: true,
      }),
      new HtmlHarddiskPlugin(),
    ],
  };
};

module.exports = (env) => {
  return forPage('index');
};
