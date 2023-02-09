import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'js-cookie';

import appReducer from './app';

const rootPersistConfig = {
  key: 'root',
  storage: new CookieStorage(Cookies, {
    setCookieOptions: {
      secure: process.env.NODE_ENV !== 'development',
    },
  }),
};

export const rootReducers = combineReducers({
  app: appReducer,
});

export default persistReducer(rootPersistConfig, rootReducers);
