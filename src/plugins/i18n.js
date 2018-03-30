import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Set up i18n.
const i18n = i18next
  .use(LanguageDetector)
  .init({
    ns: [`common`],
    defaultNS: `common`,
    lng: $APP_CONFIG.locales[0],
    interpolation: { escapeValue: false },
    react: { wait: true }
  });

if (process.env.NODE_ENV === `development`) {
  // Require context for all locale translation files and apply them to i18next
  // so that they can be watched by Webpack.
  const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
  localeReq.keys().forEach((path) => {
    const locale = path.replace(`./`, ``).replace(`.json`, ``);
    if (!~$APP_CONFIG.locales.indexOf(locale)) return;
    i18n.addResourceBundle(locale, `common`, localeReq(path), true);
  });
}
else {
  for (const locale in $TRANSLATIONS) {
    i18n.addResourceBundle(locale, `common`, $TRANSLATIONS[locale], true);
  }
}

export default i18n;