import BleManager from 'react-native-ble-manager';
let Base64 = require('base64-js');

export let sendDutyCycle = function (id, service, characteristic, duty)
{
  let byte_array = new Uint8Array(4);
  byte_array[0] = '$'.charCodeAt(0);
  byte_array[1] = (duty & 0xFF00) >> 8;
  byte_array[2] = (duty & 0xFF);
  byte_array[3] = '~'.charCodeAt(0);

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

export let decodeRxData = function (hex) 
{
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    var v = parseInt(hex.substr(i, 2), 16);
    if (v) str += String.fromCharCode(v);
  }
  return str;
};