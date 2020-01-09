import { Provider } from './libs/rematch';
import store from './store';

App(
  Provider(store)({
    onLaunch: function () {
      console.info('App onLaunch');
    }
  })
);
