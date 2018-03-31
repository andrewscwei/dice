import * as reducers from '@/reducers';
import { createStore, combineReducers } from 'redux';

const store = createStore(combineReducers(reducers), {});

export default store;