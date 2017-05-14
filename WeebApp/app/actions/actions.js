export let setBLEConnected = () => {
  return {
    type: 'BLE_CONNECTED'
  }
}; 

export let setBLEDisconnected = () => {
  return {
    type: 'BLE_DISCONNECTED'
  }
}; 

export let addDevice = (device) => {
  return {
    type: 'ADD_DEVICE',
    device
  }
};

export let removeDevice = () => {
  return {
    type: 'REMOVE_DEVICE'
  }
};