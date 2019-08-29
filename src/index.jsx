import React from 'react';
import { hydrate, render } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes';

const markup = (r) => (
  <BrowserRouter>
    {renderRoutes(r)}
  </BrowserRouter>
);

if (process.env.NODE_ENV === 'development') {
  render(markup(routes), document.getElementById('app'));
}
else {
  hydrate(markup(routes), document.getElementById('app'));
}
