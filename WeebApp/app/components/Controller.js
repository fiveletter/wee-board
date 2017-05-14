import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Link} from 'react-router-native';
import {connect} from 'react-redux';

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
    let {bleConnected} = this.props;
    let {speed, batteryVoltage} = this.state;
    let backgroundColor = '#C8C8C8';
    if (!bleConnected)
    {
      backgroundColor = 'red'
    }

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <BoardInfo style={{flex: 1, margin: 10, 
                          backgroundColor: backgroundColor}}
                    batteryVoltage={batteryVoltage} speed={speed}/>
        <BoardControl style={{flex: 1, margin: 10, justifyContent: 'center'}}/>
      </View>
    );
  }
}

export default connect((state)=>{
  return {
    bleConnected: state.bleConnected
  };
})(Controller);