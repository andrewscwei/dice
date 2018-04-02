/**
 * @file Client app root.
 */

import './App.pcss';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { PureComponent } from 'react';

export default class App extends PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired,
  }

  render() {
    return renderRoutes(this.props.route.routes);
  }
}
