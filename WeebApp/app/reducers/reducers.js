export var bleStatusReducer = (state=false, action) => {
  switch(action.type) {
    case 'BLE_CONNECTED':
      return true
    case 'BLE_DISCONNECTED':
      return false
    default:
      return state
  }
};

export var bleDeviceReducer = (state={}, action) => {
  switch(action.type) {
    case 'ADD_DEVICE':
      return action.device
    case 'REMOVE_DEVICE':
      return {}
    default:
      return state
  }
};


export var bleDeviceListReducer = (state=[], action) => {
  switch(action.type) {
    case 'ADD_DEVICE_TO_LIST':
      return [
      ...state, 
      action.device];
    case 'CLEAR_LIST':
      return [];
    default:
      return state
  }
};

let defaultBoardRxState = {
  batteryVoltage: 0,
  speed: 0
};

export var boardRxReducer = (state=defaultBoardRxState, action) => {
  switch(action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        ...action.rxData
      };
    default:
      return state
  }
};