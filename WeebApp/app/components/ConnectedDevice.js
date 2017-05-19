import React, {Component} from 'react';
import {View, ListView, Text, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';

export class ConnectedDevice extends Component 
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    let {style, device, bleConnected} = this.props;
    
    if (!bleConnected)
    {
      return ( 
        <View style={style}>
          <Text style={{textAlign: 'center'}}>No Device Connected</Text>
        </View>
      );
    }

    return (
      <View style={style}>
        <Text>Device ID: {device.id}</Text>
      </View>
    );
  }
}

export default connect((state)=>{
  return {
    bleConnected: state.bleConnected,
    device: state.device
  }
})(ConnectedDevice);