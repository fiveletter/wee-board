import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image, Alert} from 'react-native';
import {Link} from 'react-router-native';
import Sound from 'react-native-sound';
import {connect} from 'react-redux';
import BleManager from 'react-native-ble-manager';
let Base64 = require('base64-js');
import * as BleBoard from '../api/BleBoard.js';

let image1 = require('../resources/goku-1-gif/goku-1-transparent.png');
let image2 = require('../resources/goku-2-gif/goku-2-transparent.png');
let image3 = require('../resources/goku-3-gif/goku-3-transparent.png');

let image1Gif = require('../resources/goku-1-gif/goku-1-transparent.gif');
let image2Gif = require('../resources/goku-2-gif/goku-2-transparent.gif');
let image3Gif = require('../resources/goku-3-gif/goku-3-transparent.gif');

export class BoardControl extends Component 
{
  constructor(props)
  {
    super(props);

    this.state = {
      currentSpeed: 0,
      sound1: new Sound ('goku-scream-1.wav', Sound.MAIN_BUNDLE, (error)=> {
        if (error)
        {
          console.log('failed to load sound file', error);
          return;
        }
      }),
      sound2: new Sound ('goku-scream-2.wav', Sound.MAIN_BUNDLE, (error)=> {
        if (error)
        {
          console.log('failed to load sound file', error);
          return;
        }
      }),
      sound3: new Sound ('goku-scream-3.wav', Sound.MAIN_BUNDLE, (error)=> {
        if (error)
        {
          console.log('failed to load sound file', error);
          return;
        }
      }),
    }


    this._handleControl = this._handleControl.bind(this);
    this._control1 = this._control1.bind(this);
    this._control2 = this._control2.bind(this);
    this._control3 = this._control3.bind(this);
    this._control4 = this._control4.bind(this);
  }

  render () 
  {
    let {style} = this.props;
    let {currentSpeed} = this.state;

    return (
      <View style={style}>
        <View style={{flex: 1, flexDirection: 'row'}}>

          <TouchableHighlight style={{flex: 1, backgroundColor:'#f5f5f5', 
                                      justifyContent: 'center', 
                                      borderColor: 'black',
                                      borderWidth: 1,}}
                            onPress={()=> this._handleControl(1)}>
            <Image  style={{flex: 1, 
                          width: undefined, 
                          height: undefined, 
                          resizeMode:Image.resizeMode.contain}} 
                    source={currentSpeed === 1 ? image1Gif :image1} 
            />
          </TouchableHighlight>

          <TouchableHighlight style={{flex: 1, backgroundColor:'#f5f5f5', 
                                      justifyContent: 'center', 
                                      borderColor: 'black',
                                      borderWidth: 1,}}
                            onPress={()=> this._handleControl(2)}>
            <Image  style={{flex: 1, 
                          width: undefined, 
                          height: undefined, 
                          resizeMode:Image.resizeMode.contain}} 
                    source={currentSpeed === 2 ? image2Gif :image2} 
            />
          </TouchableHighlight>
        
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
        
          <TouchableHighlight style={{flex: 1, backgroundColor:'#f5f5f5', 
                                      justifyContent: 'center', 
                                      borderColor: 'black',
                                      borderWidth: 1,}}
                            onPress={()=> this._handleControl(3)}>
            <Image  style={{flex: 1, 
                          width: undefined, 
                          height: undefined, 
                          resizeMode:Image.resizeMode.contain}} 
                    source={currentSpeed === 3 ? image3Gif :image3} 
            />
          </TouchableHighlight>
          
          <TouchableHighlight style={{flex: 1, backgroundColor:'#f5f5f5', 
                                      justifyContent: 'center', 
                                      borderColor: 'black',
                                      borderWidth: 1,}}
                            onPress={()=> this._handleControl(4)}>
            <Text style={{textAlign: 'center'}}>Button 4</Text>
          </TouchableHighlight>
        
        </View>
      </View>
    );
  }

  _handleControl(control)
  {
    let {bleConnected} = this.props;
    if (!bleConnected)
    {
      Alert.alert(
        'Alert Title',
        'Board not connected!',
        [
          {text: 'OK'}
        ]);

      return;
    }

    let currentSpeed = this.state.currentSpeed;
    if (currentSpeed === control)
    {
      return;
    }

    switch(control)
    {
      case 1:
        this._control1(currentSpeed);
        break;
      case 2:
        this._control2(currentSpeed);
        break;
      case 3:
        this._control3(currentSpeed);
        break;
      case 4:
        this._control4(currentSpeed);
        break;
    }

    this.setState({
      currentSpeed: control
    })
  }

  _control1(currentSpeed)
  {
    console.log('Control 1 run');
    
    // Start sound effect
    this._stopAllSounds();
    this.state.sound1.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });

    let {device} = this.props;
    BleBoard.sendDutyCycle(device.id, device.service, device.characteristic, 1600);
  }

  _control2(currentSpeed)
  {
    console.log('Control 2 run');
    
    // Start sound effect
    this._stopAllSounds();
    this.state.sound2.play((success) => {
      if (!success) 
      {
        console.log('playback failed due to audio decoding errors');
      }
    });
    
    let {device} = this.props;
    BleBoard.sendDutyCycle(device.id, device.service, device.characteristic, 1700);
  }

  _control3(currentSpeed)
  {
    console.log('Control 3 run');

    // Start sound effect
    this._stopAllSounds();
    this.state.sound3.play((success) => {
      if (!success) 
      {
        console.log('playback failed due to audio decoding errors');
      }
    });

    let {device} = this.props;
    BleBoard.sendDutyCycle(device.id, device.service, device.characteristic, 1800);
  }

  _control4(currentSpeed)
  {
    console.log('Control 4 run');
    this._stopAllSounds();

    let {device} = this.props;
    BleBoard.sendDutyCycle(device.id, device.service, device.characteristic, 1500);
  }

  _stopAllSounds()
  {
    let {sound1, sound2, sound3} = this.state;
    
    sound1.stop();
    sound2.stop();
    sound3.stop();
  }
}

export default connect((state)=>{
  return {
    bleConnected: state.bleConnected,
    device: state.device
  }
})(BoardControl);