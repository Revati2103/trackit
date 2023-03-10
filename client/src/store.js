

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};
const middleware = [thunk];

const store = configureStore({
  reducer: rootReducer,
  initialState,
  middleware,
  devTools: true
});

export default store;
