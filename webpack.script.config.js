const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  const files = fs.readdirSync(path.join(__dirname, 'src', 'scripts'));
  const names = files.map((filename) => path.basename(filename, '.ts'));
  const entry = names.reduce((entry, name) => ({
    ...entry,
    [name]: `./${name}`,
  }), {});

  return {
    context: path.join(__dirname, 'src', 'scripts'),

    entry,

    output: {
      path: path.join(__dirname, 'dist', 'scripts'),
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
                configFileName: 'tsconfig.script.json',
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.jsx', '.js', '.json']
    },

    devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'source-map',

    target: 'electron-renderer',

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
