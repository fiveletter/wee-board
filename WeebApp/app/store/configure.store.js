import * as redux from 'redux';
import thunk from 'redux-thunk';
import {bleStatusReducer, 
        bleDeviceReducer, 
        bleDeviceListReducer,
        boardRxReducer} from '../reducers/reducers.js';

let reducer = redux.combineReducers({
    bleConnected: bleStatusReducer,
    device: bleDeviceReducer,
    deviceList: bleDeviceListReducer,
    boardData: boardRxReducer,
  });

  let store = redux.createStore(reducer, redux.compose(
    redux.applyMiddleware(thunk)));

export default store;