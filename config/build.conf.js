/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

const config = require('./app.conf');
const path = require('path');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const NodeJsInputFileSystem = require('enhanced-resolve/lib/NodeJsInputFileSystem');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { EnvironmentPlugin, DefinePlugin, IgnorePlugin } = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const cwd = path.join(__dirname, '../');
const inputDir = path.join(cwd, 'src');
const outputDir = path.join(cwd, 'public');

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'web',
  devtool: isDev ? 'eval-source-map' : (config.build.sourceMap ? 'source-map' : false),
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true,
  },
  entry: {
    bundle: path.join(inputDir, 'index.jsx'),
  },
  output: {
    path: outputDir,
    publicPath: isDev ? '/' : config.build.publicPath,
    filename: isDev ? '[name].js' : '[name].[chunkhash].js',
    sourceMapFilename: '[file].map',
  },
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
            ident: 'postcss',
            sourceMap: isDev ? true : config.build.sourceMap,
            plugins: () => [
              require('postcss-import')({
                resolve(id, basedir) {
                  return ResolverFactory.createResolver({
                    alias: {
                      '@': inputDir,
                    },
                    extensions: ['.css', '.pcss'],
                    useSyncFileSystemCalls: true,
                    fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000),
                  }).resolveSync({}, basedir, id);
                },
              }),
              require('precss')(),
              require('postcss-hexrgba')(),
              require('postcss-calc')(),
              require('postlude')(),
              require('autoprefixer')(),
              require('cssnano')(),
            ],
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
      .concat((isDev ? config.dev.linter : config.build.linter) ? [{
        test: /\.jsx?$/,
        include: [inputDir],
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter'),
          },
        },
      }] : []),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': inputDir,
    },
  },
  plugins: [
    new CopyPlugin([{
      from: path.join(inputDir, 'static'),
      to: outputDir,
      ignore: ['.*'],
    }]),
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
  ]
    .concat(isDev ? [] : [
      new IgnorePlugin(/^.*\/config\/.*$/),
      new MiniCSSExtractPlugin({
        filename: 'bundle.[chunkhash:8].css',
      }),
    ])
    .concat((isDev && config.dev.linter) || (!isDev && config.build.linter) ? [
      new StyleLintPlugin({
        files: ['**/*.css', '**/*.pcss'],
        failOnError: false,
        quiet: false,
      }),
    ] : [])
    .concat((!isDev && config.build.analyzer) ? [
      new BundleAnalyzerPlugin(),
    ] : []),
};