import routes from './routes';
import i18n from '@/plugins/i18n';
import store from '@/plugins/store';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { render, hydrate } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

const markup = (r) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(r)}
      </BrowserRouter>
    </Provider>
  </I18nextProvider>
);

if (process.env.NODE_ENV === `development`) {
  render(markup(routes), document.getElementById(`app`));
}
else {
  hydrate(markup(routes), document.getElementById(`app`));
}
