import * as reducers from '@/reducers';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';

const store = createStore(combineReducers(reducers), {}, applyMiddleware(thunk));

export default store;