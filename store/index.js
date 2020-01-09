import { createStore } from '../libs/rematch';
import counter from '../models/counter';

const store = createStore({
  models: {
    counter
  }
});
export default store;
