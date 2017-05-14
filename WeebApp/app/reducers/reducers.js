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