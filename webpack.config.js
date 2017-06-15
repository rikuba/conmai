const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const main = (env, common) => {
  const config = {
    context: path.join(srcDir, 'main'),
    entry: { 'index': './index' },
    output: {
      path: path.join(distDir, 'main'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: srcDir,
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
    devtool: 'source-map',
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

const script = (env, common) => {
  const config = {
    context: path.join(srcDir, 'scripts'),
    entry: {
      'cavetube': './cavetube',
      'twitch': './twitch',
    },
    output: {
      path: path.join(distDir, 'scripts'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: srcDir,
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
    devtool: 'source-map',
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

  return Object.assign({}, common, config);
};

const forPage = (page) => (env, common) => {
  const pageDir = (baseDir) => path.join(baseDir, 'renderer', page);
  
  const config = {
    context: pageDir(srcDir),
    entry: {
      [page]: [
        'react-hot-loader/patch',
        `./${page}`,
      ],
    },
    output: {
      path: pageDir(distDir),
      filename: '[name].js',
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
      ],
    },
    devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'source-map',
    target: 'electron-renderer',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new HtmlPlugin({
        filename: `${page}.html`,
        template: `./${page}.html`,
      }),
    ],
  };

  // Handle CSS
  if (env === 'development') {
    config.module.rules.push(
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
      }
    );
  } else {
    const extractCSS = new ExtractTextPlugin('[name].css');
    config.module.rules.push(
      {
        test: /\.css$/,
        include: srcDir,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        }),
      }
    );
    config.plugins.push(
      extractCSS
    );
  }

  // Make more debuggable
  if (env === 'development') {
    config.plugins.push(new webpack.NamedModulesPlugin());
  }

  return Object.assign({}, common, config);
};

const renderer = (env, common) => {
  const pages = [];
  if (env !== 'development') {
    pages.push('index', 'sub');
  }
  return pages.map((page) => forPage(page)(env, common));
};

module.exports = (env) => {
  const common = {
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
  };

  return [].concat(
    main(env, common),
    script(env, common),
    renderer(env, common)
  );
};
