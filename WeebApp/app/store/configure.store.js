import * as redux from 'redux';
import thunk from 'redux-thunk';
import {bleStatusReducer} from '../reducers/reducers.js';

export let configure = () => {
  let reducer = redux.combineReducers({
    bleConnected: bleStatusReducer
  });

  let store = redux.createStore(reducer, redux.compose(
    redux.applyMiddleware(thunk)));
  
  return store;
};