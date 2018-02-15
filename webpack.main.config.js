const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    context: path.join(__dirname, 'src', 'main'),

    entry: {
      index: './index'
    },
    
    output: {
      path: path.join(__dirname, 'dist', 'main'),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: path.join(__dirname, 'src'),
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig.main.json',
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.jsx', '.js', '.json']
    },

    devtool: env === 'devlopment' ? 'cheap-module-eval-source-map' : 'source-map',

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
};
