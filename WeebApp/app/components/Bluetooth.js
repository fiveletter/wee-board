import React, {Component} from 'react';
import {View, 
        Text, 
        StyleSheet, 
        TouchableHighlight, 
        NativeAppEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {connect} from 'react-redux';
import {Link} from 'react-router-native';
let Base64 = require('base64-js');

import * as actions from '../actions/actions.js';
import * as BleBoard from '../api/BleBoard.js';
import BluetoothDeviceList from './BluetoothDeviceList.js';

export class Bluetooth extends Component 
{
  constructor()
  {
    super();
    
    this.state = {
      bleDevices: [],
      scanning: false,
      countDown: undefined,
      countDownInterval: undefined,
    }

    this._handleConnectDevice = this._handleConnectDevice.bind(this);
    this._handlePressScan = this._handlePressScan.bind(this);
    this._handleStopScanning = this._handleStopScanning.bind(this);
    this._handleDiscoverPeripheral = this._handleDiscoverPeripheral.bind(this);
  }

  componentDidMount()
  {
    NativeAppEventEmitter.addListener('BleManagerStopScan',
      this._handleStopScanning);
    NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral',
      this._handleDiscoverPeripheral);
  }

  componentWillUnmount()
  {
    BleManager.stopScan().then(()=> console.log('Scan Stopped'));

    if (this.state.scanning)
    {
      this._handleStopScanning();
    }
  }

  render () 
  {
    let scanButtonText = this.state.scanning ? 
                      `Scanning... (${this.state.countDown})` : 'Find Wee-Board';
    
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        
        <TouchableHighlight style={{height: 40, margin: 10, backgroundColor:'#f5f5f5'}}
                            onPress={()=> this._handlePressScan()}>
          <Text style={{flex: 1, padding: 10, textAlign: 'center'}}>
            {scanButtonText}
          </Text>
        </TouchableHighlight>
        
        <BluetoothDeviceList style={{flex: 2, marginTop: 10, marginHorizontal: 10, backgroundColor: '#C8C8C8'}} 
                            bleDevices={this.state.bleDevices}
                            onConnect={this._handleConnectDevice}/>
      </View>
    );
  }

  _handleConnectDevice(deviceId)
  {
    console.log('Attempting to connect to device with id', deviceId);

    this._handleStopScanning();
    BleManager.connect(deviceId).then((peripheralInfo)=> {
      // Grab dispatch object to update connected State
      console.log('Connected');
      let {dispatch} = this.props;

      // Change app state to BLE connected
      dispatch(actions.setBLEConnected());
      
      let boardInfoCharacteristic = peripheralInfo.characteristics[0];

      // Setup notification for specific service/characteristic
      BleManager.startNotification(peripheralInfo.id, 
                                  boardInfoCharacteristic.service,
                                  boardInfoCharacteristic.characteristic)
      .then(() => {
        // Success code
        console.log('Notification started');
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });

      // Setup handler for on data change
      NativeAppEventEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', 
        ({peripheral, characteristic, service, value}) => {
          console.log("Value:", BleBoard.decodeRxData(value));
      });

      let device = {
        id: peripheralInfo.id,
        service: peripheralInfo.characteristics[0].service,
        characteristic: peripheralInfo.characteristics[0].characteristic
      };
      console.log("Sending device through dispatch", device);
      
      dispatch(actions.addDevice(device));
      return;
    }).catch((error)=> {
      console.log('Could not connect to device');
      console.log(error);
    });
  }

  _handlePressScan ()
  {
    if (this.state.scanning)
    {
      return;
    }

    console.log('Lets look for a Wee-Board!!!');
    
    let timeout = 10;
    BleManager.scan(['FFE0'], timeout, false).then(()=>{
      console.log('Starting scan...');
      
      this.setState({
        countDown: timeout,
        countDownInterval: setInterval(()=>{
          this.setState({
            countDown: this.state.countDown - 1
          })
        }, 1000)

      })
    });

    this.setState({
      timeout,
      scanning: true,
      bleDevices: [],
    });
  }

  _handleStopScanning()
  {
    clearInterval(this.state.countDownInterval);

    this.setState({
      scanning: false,
      countDown: undefined,
      countDownInterval: undefined
    })
  }

  _handleDiscoverPeripheral(data)
  {
    if (!this.state.scanning)
    {
      return;
    }

    if (this.state.bleDevices.findIndex((el, index, array)=> el.id === data.id) !== -1)
    {
      console.log("found duplicate!", data.name, data.id)
      return;
    }

    console.log('Got BLE data', data);
    this.setState({
      bleDevices: [...this.state.bleDevices, data]
    });
  }
}

export default connect()(Bluetooth);