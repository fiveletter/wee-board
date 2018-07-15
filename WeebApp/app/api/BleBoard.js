import BleManager from 'react-native-ble-manager';
let Base64 = require('base64-js');
import store from '../store/configure.store.js';
import * as actions from '../actions/actions.js';


export let sendTxData = function (id, service, characteristic, duty)
{
  let byte_array = new Uint8Array(3);
  byte_array[0] = (duty & 0xFF0000) >> 16;
  byte_array[1] = (duty & 0xFF00) >> 8;
  byte_array[2] = (duty & 0xFF);

  BleManager.writeWithoutResponse(
    id,
    service,
    characteristic,
    Base64.fromByteArray(byte_array),
    64
  )
  .then(()=> {
    // pass
  })
  .catch((error)=> {
    console.log("Unable to write data");
  });
};

/* DECODE RX DATA FROM BLE DEVICE */
let tempString = "";

export let decodeRxData = function (hex) 
{
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    var v = parseInt(hex.substr(i, 2), 16);
    if (v) str += String.fromCharCode(v);
  }
  tempString += str;

  if (tempString.slice(-1) === '}') 
  {
    let rxData = JSON.parse(tempString);
    
    store.dispatch(actions.updateData(rxData));
    tempString = "";
  }

  return str;
};