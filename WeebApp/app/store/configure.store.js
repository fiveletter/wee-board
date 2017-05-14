import * as redux from 'redux';
import thunk from 'redux-thunk';
import {bleStatusReducer, bleDeviceReducer} from '../reducers/reducers.js';

export let configure = () => {
  let reducer = redux.combineReducers({
    bleConnected: bleStatusReducer,
    device: bleDeviceReducer
  });

  let store = redux.createStore(reducer, redux.compose(
    redux.applyMiddleware(thunk)));
  
  return store;
};