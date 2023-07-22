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
                'postcss-import',
                'precss',
                'postcss-hexrgba',
                'postcss-calc',
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
      test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
      use: `url-loader?limit=10000&esModule=false&name=assets/images/[name]${isDev ? '' : '.[hash:6]'}.[ext]`,
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=10000&esModule=false&name=assets/media/[name]${isDev ? '' : '.[hash:6]'}.[ext]`,
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=10000&esModule=false&name=assets/fonts/[name]${isDev ? '' : '.[hash:6]'}.[ext]`,
    }]
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
    new EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new DefinePlugin({
      $APP_CONFIG: JSON.stringify(config),
    }),
    new HTMLPlugin({
      appConfig: config,
      template: path.join(inputDir, 'templates', 'index.html'),
      filename: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    ...isDev ? [] : [
      new IgnorePlugin({
        resourceRegExp: /^.*\/config\/.*$/,
      }),
      new MiniCSSExtractPlugin({
        filename: 'bundle.[chunkhash:8].css',
      }),
    ],
  ],
  ...isDev ? {
    devServer: {
      client: {
        logging: 'error',
      },
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,HEAD,PUT,POST,DELETE,PATCH',
        'Access-Control-Allow-Origin': `http://localhost:${config.build.port}`,
      },
      historyApiFallback: true,
      host: '0.0.0.0',
      hot: true,
      port: config.build.port,
      static: {
        publicPath: config.build.publicPath,
      },
    },
  } : {},
  target: 'web',
};
