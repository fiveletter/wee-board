import BleManager from 'react-native-ble-manager';
import {NativeAppEventEmitter} from 'react-native';
import * as BleBoard from '../api/BleBoard.js';


/* bleDeviceReducer Actions */
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

export let startAddDevice = (deviceId) => {
  return (dispatch, getState) => {
    return BleManager.connect(deviceId)
      .then((peripheralInfo)=> {
        // Grab dispatch object to update connected State
        console.log('Connected');
        let boardInfoCharacteristic = peripheralInfo.characteristics[0];

        // Setup notification for specific service/characteristic
        BleManager.startNotification(peripheralInfo.id, 
                                    boardInfoCharacteristic.service,
                                    boardInfoCharacteristic.characteristic)
        .then(() => console.log('Notification started'))
        .catch((error) => console.log(error));

        // Setup handler for on data change
        NativeAppEventEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', 
          ({peripheral, characteristic, service, value}) => {
            BleBoard.decodeRxData(value);
        });

        let device = {
          id: peripheralInfo.id,
          service: peripheralInfo.characteristics[0].service,
          characteristic: peripheralInfo.characteristics[0].characteristic
        };
        
        console.log('FIND ME:',peripheralInfo);
        return dispatch(addDevice(device));
      })
      .catch((error)=> {
        console.log('Could not connect to device');
        console.log(error);
      });
  };
};

/* bleStatusReducer Actions */
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

/* bleDeviceListReducer Actions */
export let addDeviceToList = (device) => {
  return {
    type: 'ADD_DEVICE_TO_LIST',
    device
  }
};

export let clearDeviceList = () => {
  return {
    type: 'CLEAR_LIST'
  }
};

/* boardRxReducer Actions */

export let updateData = (rxData) => {
  return {
    type: 'UPDATE_DATA',
    rxData
  }
}