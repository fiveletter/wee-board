import React, {Component} from 'react';
import {View, ListView, Text, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

let boardClipArt = require('../resources/board.png');

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
        <View style={style, styles.notConnectedView}>
          <Image  style={styles.notConnectedImage} 
            source={boardClipArt}/>
          <Text style={styles.notConnectedText}>No Device Connected</Text>
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

const styles = StyleSheet.create(
  {
    notConnectedView: {
      height: 100, 
      alignItems: 'center', 
      backgroundColor: 'transparent', 
      marginBottom: 25
    },
    notConnectedText: {
      paddingTop: 75, 
      textAlign: 'center', 
      fontSize: 20
    },
    notConnectedImage: {
      width: 100, 
      height: 100, 
      resizeMode:Image.resizeMode.contain, position: 'absolute'
    }
  });

export default connect((state)=>{
  return {
    bleConnected: state.bleConnected,
    device: state.device
  }
})(ConnectedDevice);