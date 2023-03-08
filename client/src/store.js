import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';

const initialState = {};
const middleware = [...getDefaultMiddleware(), thunkMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  preloadedState: initialState,
  devTools: true,
});

export default store;
