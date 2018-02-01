const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const HtmlHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const port = 8144;
const publicPath = `http://localhost:${port}/`;

module.exports = (env) => {
  const pages = ['index', 'sub'];
  const pageDir = (baseDir) => path.join(baseDir, 'renderer');

  const entry = {};
  pages.forEach((page) => {
    entry[`${page}/${page}`] = ['react-hot-loader/patch', `./${page}/${page}`];
  });

  const htmls = pages.map(
    (page) =>
      new HtmlPlugin({
        filename: `${page}/${page}.html`,
        template: `./${page}/${page}.html`,
        chunks: [`${page}/${page}`],
        alwaysWriteToDisk: true,
      }),
  );

  return {
    context: pageDir(srcDir),

    entry,

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
      port,
      publicPath,
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new CheckerPlugin(),
      ...htmls,
      new HtmlHarddiskPlugin(),
    ],
  };
};
