import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';

const markup = () => (
  <App/>
);

render(markup(), document.getElementById('app'));
