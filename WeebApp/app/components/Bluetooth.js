import React, {Component} from 'react';
import {View, 
        Text, 
        StyleSheet, 
        TouchableHighlight, 
        NativeAppEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {connect} from 'react-redux';

import * as actions from '../actions/actions.js';
import BluetoothDeviceList from './BluetoothDeviceList.js';
import ConnectedDevice from './ConnectedDevice.js';

export class Bluetooth extends Component 
{
  constructor()
  {
    super();
    
    this.state = {
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
    let {dispatch} = this.props;

    /* BLE Manager Event Emitters */
    NativeAppEventEmitter.addListener('BleManagerStopScan',
      this._handleStopScanning);
    NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral',
      this._handleDiscoverPeripheral);
    NativeAppEventEmitter.addListener('BleManagerConnectPeripheral',
      ()=>{dispatch(actions.setBLEConnected())});
    NativeAppEventEmitter.addListener('BleManagerDisconnectPeripheral',
      ()=>{dispatch(actions.setBLEDisconnected())});
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
      <View style={styles.rootView}>
        
        <TouchableHighlight style={styles.findButton} 
                            onPress={()=> this._handlePressScan()}>

          <Text style={styles.findButtonText}> {scanButtonText} </Text>

        </TouchableHighlight>

        <Text style={styles.headerText}>MY BOARD</Text>
        <ConnectedDevice style={styles.connectedDevice}></ConnectedDevice>
        
        <Text style={styles.headerText}>OTHER BOARDS</Text>
        <BluetoothDeviceList style={styles.bluetoothDeviceList} 
                            onConnect={this._handleConnectDevice}/>

      </View>
    );
  }

  _handleConnectDevice(deviceId)
  {
    console.log('Attempting to connect to device with id', deviceId);
    
    let {dispatch} = this.props;
    this._handleStopScanning();
    dispatch(actions.startAddDevice(deviceId));
  }

  _handlePressScan ()
  {
    if (this.state.scanning)
    {
      return;
    }

    console.log('Lets look for a Wee-Board!!!');
    
    let {dispatch} = this.props;
    
    dispatch(actions.clearDeviceList());
    
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
    let {dispatch, deviceList} = this.props;
    if (!this.state.scanning)
    {
      return;
    }

    if (deviceList.findIndex((el, index, array)=> el.id === data.id) !== -1)
    {
      console.log("found duplicate!", data.name, data.id);
      return;
    }

    console.log('Got BLE data', data);
    dispatch(actions.addDeviceToList(data));
  }
}

const styles = StyleSheet.create({
  rootView: {
    padding: 10, 
    flex: 1, 
    flexDirection: 'column', 
    backgroundColor: '#42cbec'
  },
  findButton: {
    height: 40, 
    marginHorizontal: 10, 
    marginVertical: 20, 
    backgroundColor: '#FFFF00',
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.3
  },
  findButtonText: {
    flex: 1, 
    padding: 10, 
    textAlign: 'center', 
    color: '#212121'
  },
  headerText: {
    marginLeft: 10, 
    marginBottom: 5, 
    fontSize: 15, 
    color: "#212121"
  },
  connectedDevice: {
    marginBottom: 20, 
    paddingTop: 20, 
    paddingBottom: 20, 
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.3
  },
  bluetoothDeviceList: {
    flex: 2, 
    backgroundColor: 'white', 
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.3
  }
});

export default connect((state) => {
  return {
    deviceList: state.deviceList
  }
})(Bluetooth);