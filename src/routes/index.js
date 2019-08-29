import App from '@/containers/App';
import Home from '@/containers/Home';

export default [{
  component: App,
  routes: [{
    path: '/',
    exact: true,
    component: Home,
  }],
}];
