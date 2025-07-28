import { configureStore, combineReducers } from '@reduxjs/toolkit';
import jobsReducer from './slices/jobsSlice';
import userReducer from './slices/userSlice';

import storage from 'redux-persist/lib/storage';
import { persistReducer ,persistStore } from 'redux-persist';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['jobs' ,'user'],
};

const rootReducer = combineReducers({
  jobs: jobsReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

});

export const persistor = persistStore(store);