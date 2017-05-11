import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Link} from 'react-router-native';
import {Global} from '../styles/global.js';

import BoardInfo from './BoardInfo.js';
import BoardControl from './BoardControl.js';

export class Controller extends Component 
{
  constructor(props)
  {
    super(props);
    this.state = {
      batteryVoltage: 100,
      speed: 100
    }
  }
  render () 
  {
    let {speed, batteryVoltage} = this.state;
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <BoardInfo style={{flex: 1, margin: 10, 
                          backgroundColor: '#C8C8C8'}}
                    batteryVoltage={batteryVoltage} speed={speed}/>
        <BoardControl style={{flex: 1, margin: 10, justifyContent: 'center'}}/>
      </View>
    );
  }
}

export default Controller;