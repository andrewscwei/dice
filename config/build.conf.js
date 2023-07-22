/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

const config = require('./app.conf');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin, DefinePlugin, IgnorePlugin } = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'public');

module.exports = {
  devtool: isDev ? 'source-map' : false,
  entry: {
    bundle: path.join(inputDir, 'index.jsx'),
  },
  infrastructureLogging: {
    level: 'error',
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.p?css$/,
      use: (function() {
        const t = [{
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[hash:6]',
            },
            sourceMap: isDev ? true : config.build.sourceMap,
            importLoaders: 1,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: isDev ? true : config.build.sourceMap,
            postcssOptions: {
              ident: 'postcss',
              plugins: [
                'precss',
                'postcss-hexrgba',
                'postlude',
                'autoprefixer',
                'cssnano',
              ],
            },
          },
        }];

        return [isDev ? 'style-loader' : MiniCSSExtractPlugin.loader].concat(t);
      })(),
    }, {
      test: /\.svg$/,
      include: /assets\/svgs/,
      type: 'asset/source',
    }, {
      test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
      include: /assets\/images/,
      type: 'asset',
      generator: {
        filename: `assets/images/${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      include: /assets\/media/,
      type: 'asset',
      generator: {
        filename: `assets/media/${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      include: /assets\/fonts/,
      type: 'asset',
      generator: {
        filename: `assets/fonts/${isDev ? '[name]' : '[name].[hash:base64]'}[ext]`,
      },
    }],
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
    path: outputDir,
    publicPath: config.build.publicPath,
    sourceMapFilename: '[file].map',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: path.join(inputDir, 'static'),
        to: outputDir,
      }],
    }),
    new EnvironmentPlugin({ NODE_ENV: 'production' }),
    new DefinePlugin({ $APP_CONFIG: JSON.stringify(config) }),
    new HTMLPlugin({
      appConfig: config,
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      template: path.join(inputDir, 'templates', 'index.html'),
    }),
    ...isDev ? [] : [
      new IgnorePlugin({ resourceRegExp: /^.*\/config\/.*$/ }),
      new MiniCSSExtractPlugin({ filename: 'bundle.[chunkhash:8].css' }),
    ],
  ],
  target: 'web',
  ...isDev ? {
    devServer: {
      host: '0.0.0.0',
      hot: true,
      port: config.build.port,
      static: {
        publicPath: config.build.publicPath,
      },
    },
  } : {},
};
