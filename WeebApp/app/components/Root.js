import React, { Component } from 'react';
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';

import Controller from './Controller.js';
import Bluetooth from './Bluetooth.js';
import ErrorComponent from './ErrorComponent.js';


export class Root extends Component 
{
  constructor(props)
  {
    super(props);
  }

  render ()
  {
    let {bleConnected} = this.props;
    let controller = <Controller/>
    
    if (!bleConnected)
    {
      controller= <ErrorComponent 
                  label="Device not connected" 
                  subText="Swipe someplace to connect to device"/>
    }

    return (
      <Swiper
        loop={false}
        showsPagination={false}
        index={1}>
        <Bluetooth/>
        {controller}
      </Swiper>
    )
  }
}

export default connect((state) => {
  return {
    bleConnected: state.bleConnected
  }
})(Root);