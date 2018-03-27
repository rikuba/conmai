const fs = require('fs');
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Common config

const config = ({
  context = path.resolve('src'),
  entry,
  outputPath,
  target = 'electron-renderer',
  tsCompilerOptions,
  plugins = [],
}) => ({
  context,
  entry,
  output: {
    path: outputPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: tsCompilerOptions,
          },
        },
      },
    ],
  },
  resolve: { extensions: ['.tsx', '.ts', '.wasm', '.mjs', '.js', '.json'] },
  target,
  node: { __dirname: false },
  plugins,
});

// Main process

const main = config({
  entry: {
    'main/index': './main/index',
  },
  target: 'electron-main',
});

// Scripts to be injected

const scripts = config({
  entry: Object.assign(
    ...fs.readdirSync(path.resolve('src', 'scripts')).map((filename) => ({
      [`scripts/${path.basename(filename, '.ts')}`]: `./scripts/${filename}`,
    })),
  ),
  tsCompilerOptions: {
    module: 'commonjs',
  },
});

// Renderer process

const entry = {};
const plugins = [new MiniCssExtractPlugin()];

['index', 'sub'].forEach((page) => {
  const chunk = `${page}/${page}`;
  entry[chunk] = `./${page}/${page}`;
  plugins.push(
    new HtmlPlugin({
      title: `conmai - ${page}`,
      filename: `${page}/${page}.html`,
      template: `./${page}/${page}.html`,
      chunks: [chunk],
    }),
  );
});

const renderer = config({
  context: path.resolve('src', 'renderer'),
  entry,
  outputPath: path.resolve('dist', 'renderer'),
  plugins,
});

// Export configurations

module.exports = [main, scripts, renderer];
