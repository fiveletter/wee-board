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