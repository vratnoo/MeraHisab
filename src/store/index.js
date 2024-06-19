import { createStore, combineReducers, applyMiddleware } from 'redux';

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { transactionReducer } from './reducers/transactionReducer';
import { categoryReducer } from './reducers/categoryReducer';
import { accountReducer } from './reducers/accountReducer';
import { monthReducer } from './reducers/monthReducer';

// import {
//       persistStore,
//       persistReducer,
//       FLUSH,
//       REHYDRATE,
//       PAUSE,
//       PERSIST,
//       PURGE,
//       REGISTER,
//     } from 'redux-persist'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer } from './reducers/authReducer';

// const persistConfig = {
//       key: 'root',
//       storage: AsyncStorage,
    
// };

const rootReducer = combineReducers({
      categories:categoryReducer,
      transactions:transactionReducer,
      accounts:accountReducer,
      month:monthReducer,
      auth:authReducer
})

// const persistedReducer = persistReducer(persistConfig, rootReducer);







export const store = configureStore({
      reducer: rootReducer,
//       middleware: (getDefaultMiddleware) =>
//             getDefaultMiddleware({
//               serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//               },
//             }),
    });


// export const persistor = persistStore(store);

export default store;


