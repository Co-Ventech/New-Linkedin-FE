// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import jobsReducer from './slices/jobsSlice';
// import userReducer from './slices/userSlice';

// import storage from 'redux-persist/lib/storage';
// import { persistReducer ,persistStore } from 'redux-persist';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['jobs' ,'user'],
// };

// const rootReducer = combineReducers({
//   jobs: jobsReducer,
//   user: userReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,

// });

// export const persistor = persistStore(store);

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import jobsReducer from './slices/jobsSlice';
import userReducer from './slices/userSlice';

import storage from 'redux-persist/lib/storage';
// import { persistReducer, persistStore } from 'redux-persist';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['jobs'], // Exclude the large 'jobs' slice to avoid quota issues
  whitelist: ['user'], // Only persist 'user' if needed
};

const rootReducer = combineReducers({
  jobs: jobsReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
// });
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore redux-persist actions
      },
    }),
  });

export const persistor = persistStore(store);