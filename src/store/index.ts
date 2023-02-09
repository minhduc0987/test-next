import { createStore, applyMiddleware } from 'redux';
import { createWrapper, Context } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { persistStore } from 'redux-persist';

import reducer from './reducers';
import persistMiddleware from './middlewares/persistMiddleware';

const bindMiddleware = (middleware: any) => {
  return composeWithDevTools(applyMiddleware(...middleware));
};

const makeStore = (context: Context) => {
  const isServer = typeof window === 'undefined';
  const store: any = createStore(
    reducer,
    bindMiddleware([thunkMiddleware, persistMiddleware]),
  );
  if (isServer) {
    return store;
  }

  store['__persistor'] = persistStore(store); // Nasty hack
  return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });
