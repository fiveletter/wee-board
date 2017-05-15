import * as redux from 'redux';
import thunk from 'redux-thunk';
import {bleStatusReducer, bleDeviceReducer} from '../reducers/reducers.js';

let reducer = redux.combineReducers({
    bleConnected: bleStatusReducer,
    device: bleDeviceReducer
  });

  let store = redux.createStore(reducer, redux.compose(
    redux.applyMiddleware(thunk)));

export default store;