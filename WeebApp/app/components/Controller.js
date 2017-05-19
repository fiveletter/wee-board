import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';

import BoardInfo from './BoardInfo.js';
import BoardControl from './BoardControl.js';

export class Controller extends Component 
{
  constructor(props)
  {
    super(props);
  }
  render () 
  {
    let {bleConnected} = this.props;
    let backgroundColor = '#C8C8C8';
    
    if (!bleConnected)
    {
      backgroundColor = 'red'
    }

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <BoardInfo style={{flex: 1, margin: 10, 
                          backgroundColor: backgroundColor}}/>
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