import React, { Component } from 'react';
import {connect} from 'react-redux';
import Swiper from 'react-native-swiper';

import Bluetooth from './Bluetooth.js';


export class Root extends Component 
{
  constructor(props)
  {
    super(props);
  }

  render ()
  {
    let {bleConnected} = this.props;

    return (
      <Swiper
        loop={false}
        showsPagination={false}
        index={1}>
        <Bluetooth/>
      </Swiper>
    )
  }
}

export default connect((state) => {
  return {
    bleConnected: state.bleConnected
  }
})(Root);