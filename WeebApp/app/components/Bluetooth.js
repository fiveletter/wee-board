import React, {Component} from 'react';
import {View, 
        Text, 
        StyleSheet, 
        TouchableHighlight,
        TextInput, 
        NativeAppEventEmitter,
        Alert} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {connect} from 'react-redux';

import * as actions from '../actions/actions.js';
import * as BleBoard from '../api/BleBoard.js';
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
      hexValue:''
    }

    this._handleConnectDevice = this._handleConnectDevice.bind(this);
    this._handlePressScan = this._handlePressScan.bind(this);
    this._handleStopScanning = this._handleStopScanning.bind(this);
    this._handleDiscoverPeripheral = this._handleDiscoverPeripheral.bind(this);
    this._handlePressSend = this._handlePressSend.bind(this);
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
                      `Scanning... (${this.state.countDown})` : 'Find Device';
    
    return (
      <View style={styles.rootView}>
        
        <TouchableHighlight style={styles.findButton} 
                            onPress={()=> this._handlePressScan()}>

          <Text style={styles.buttonText}> {scanButtonText} </Text>

        </TouchableHighlight>
        <View style={{flexDirection:'row'}}>
          <TouchableHighlight style={styles.sendButton} 
                              onPress={()=> this._handlePressSend()}>
            <Text style={styles.buttonText}> Send value </Text>
          </TouchableHighlight>

          <TextInput
            style={{flex: 2,
                    height: 40, 
                    backgroundColor:"#FFFFFF", 
                    marginHorizontal: 10, 
                    marginTop: 10,
                    marginBottom: 10,
                    padding:5}}
            placeholder="Hex value"
            value={this.state.hexValue}
            onChangeText={(hexValue) => this.setState({hexValue})}
            />

        </View> 

        <Text style={styles.headerText}>MY DEVICE</Text>
        <ConnectedDevice style={styles.connectedDevice}></ConnectedDevice>
        
        <Text style={styles.headerText}>OTHER DEVICES</Text>
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

  _handlePressSend()
  {
    console.log("Attempting to send out data")
    let {bleConnected} = this.props;
    if (!bleConnected)
    {
      Alert.alert(
        'Error',
        'Device not connected!',
        [
          {text: 'OK'}
        ]);

      return;
    }

    let hexIntValue = parseInt(this.state.hexValue);
    if (isNaN(hexIntValue))
    {
      Alert.alert(
        'Error',
        'Invalid Hex Value!',
        [
          {text: 'OK'}
        ]);

      return;
    }

    BleBoard.sendTxData(device.id, device.service, device.characteristic, hexIntValue, 16);
    this.setState({
      hexValue:''
    });
  }

  _handlePressScan ()
  {
    if (this.state.scanning)
    {
      return;
    }
    
    let {dispatch} = this.props;
    
    dispatch(actions.clearDeviceList());
    
    let timeout = 10;
    BleManager.scan([], timeout, false).then(()=>{
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
      // Do not add duplicate devices to the list
      return;
    }

    dispatch(actions.addDeviceToList(data));
  }
}

const styles = StyleSheet.create({
  rootView: {
    padding: 10, 
    flex: 1, 
    flexDirection: 'column', 
    backgroundColor: '#d4d4d4'
  },
  findButton: {
    height: 40, 
    marginHorizontal: 10, 
    marginTop: 30,
    marginBottom: 10, 
    backgroundColor: '#66CCCC',
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.3
  },
  sendButton: {
    height: 40, 
    flex: 1,
    width:100,
    marginHorizontal: 10, 
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#66CCCC',
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.3
  },
  buttonText: {
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
    marginBottom: 30, 
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
    deviceList: state.deviceList,
    bleConnected: state.bleConnected
  }
})(Bluetooth);