const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = (env) => {
  const port = 8144;
  const publicPath = `http://localhost:${port}/`;

  const pages = fs.readdirSync(path.join(__dirname, 'src', 'renderer'));

  const entry = pages.reduce((entry, page) => {
    entry[`${page}/${page}`] = ['react-hot-loader/patch', `./${page}/${page}`];
    return entry;
  }, {});

  const htmlPlugins = pages.map(
    (page) =>
      new HtmlPlugin({
        filename: `${page}/${page}.html`,
        template: `./${page}/${page}.html`,
        chunks: [`${page}/${page}`],
        alwaysWriteToDisk: true,
      }),
  );

  return {
    context: path.join(__dirname, 'src', 'renderer'),

    entry,

    output: {
      path: path.join(__dirname, 'dist', 'renderer'),
      filename: '[name].js',
      ...(env === 'development' ? { publicPath } : {}),
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: path.join(__dirname, 'src'),
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
        env === 'development'
          ? {
              test: /\.css$/,
              include: path.join(__dirname, 'src'),
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            }
          : {
              test: /\.css$/,
              include: path.join(__dirname, 'src'),
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              }),
            },
      ],
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },

    devtool: env === 'development' ? 'inline-source-map' : 'source-map',

    devServer:
      env === 'development'
        ? {
            hot: true,
            contentBase: path.join(__dirname, 'dist', 'renderer'),
            port,
            publicPath,
          }
        : {},

    target: 'electron-renderer',

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      ...htmlPlugins,
      new HtmlHarddiskPlugin(),
      new ExtractTextPlugin('[name].css'),
    ],
  };
};
