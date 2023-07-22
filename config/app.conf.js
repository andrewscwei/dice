/**
 * @file Configuration for both client and server environments.
 */

module.exports = {
  // App preferences.
  preferences: {
    // Default dice type.
    defaultDiceType: 'd6',

    // Default number of dice.
    defaultDiceCount: 5,

    // Default roll method.
    defaultRollMethod: 'tapAndShake',

    // Default sound enabled.
    defaultSoundEnabled: true,

    // Maximum number of dice allowed.
    maxDiceCount: 23,
  },

  // HTML metadata.
  meta: {
    // Title of the app.
    title: 'Dice',

    // Short description of the app.
    description: 'Web-based dice rolling app supporting 5 different dice types including D6, D8, D10, D12 and D20',

    // App URL.
    url: 'https://dice.andr.mu',
  },

  // Google Analytics ID (i.e. UA-XXXXXXXX-1)
  ga: process.env.GOOGLE_ANALYTICS_ID,

  // Port.
  port: process.env.PORT || 8080,

  // Config options specific to the `build` task.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || '/',

    // Dev server port.
    port: process.env.PORT || '8080',
  },
};
