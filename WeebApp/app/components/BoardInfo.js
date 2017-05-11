import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Link} from 'react-router-native';

export class BoardInfo extends Component 
{
  constructor(props)
  {
    super(props);
  }

  render () 
  {
    let {style, batteryVoltage, speed} = this.props;

    return (
      <View style={style}>
        <Text style={{fontSize:20, margin: 10}}>Speedo:</Text>
        <Text style={{fontSize: 50, textAlign: 'center', margin: 10}}>{speed}</Text>
        <Text style={{fontSize:20, margin: 10}}>Paowa Rebel:</Text>
        <Text style={{fontSize: 50, textAlign: 'center', margin: 10}}>{batteryVoltage}</Text>
      </View>
    );
  }
}

export default BoardInfo;