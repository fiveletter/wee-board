import React, { Component } from 'react';
import {View, Text} from 'react-native';
import Controller from './Controller.js';
import Bluetooth from './Bluetooth.js';


export class ErrorComponent extends Component 
{
  constructor(props)
  {
    super(props);
  }

  render ()
  {
    let {label, subText} = this.props;
    if (subText)
    {

    }
    return (
      <View style={{
        flex: 1,
        backgroundColor: "#e74c3c",
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 48, color: 'white' }}>
          {label}
        </Text>
        <Text style={{ padding: 25, fontSize: 20, color: 'white' }}>{subText}</Text>
      </View>
    )
  }
}

export default ErrorComponent;
