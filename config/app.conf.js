/**
 * @file Configuration for both client and server environments.
 */

module.exports = {
  // App preferences.
  preferences: {
    labelColor: 0xaaaaaa,
    diceColor: 0x202020,
    scale: 50,
    ambientLightColor: 0xf0f5fb,
    spotLightColor: 0xefdfd5,
    deskColor: 0xdfdfdf
  },

  // HTML metadata.
  meta: {
    // Title of the app.
    title: `Dice`,

    // Short description of the app.
    description: require(`../package.json`).description,

    // Search keywords.
    keywords: require(`../package.json`).keywords,

    // App URL.
    url: require(`../package.json`).homepage
  },

  // Port.
  port: process.env.PORT || 8080,

  // Supported locales. First locale is the default locale.
  locales: [`en`],

  // Config options specific to the `build` task.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || ``,

    // Specifies whether the linter should run.
    linter: true,

    // Specifies whether JavaScript and CSS source maps should be generated.
    sourceMap: true,

    // Specifies whether a bundle analyzer report should be generated at the end
    // of the build process.
    analyzer: process.env.ANALYZE_BUNDLE === `true` ? true : false
  },

  // Config options specific to the `dev` task.
  dev: {
    // Specifies whether the linter should run.
    linter: false
  }
};