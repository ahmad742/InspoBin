import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from '../Reducers/Index';

const preloadedState = {};
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['loadingReducer'],
  
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducers, preloadedState);
export const persistor = persistStore(store);
