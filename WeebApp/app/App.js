import React, { Component } from 'react';
import {View, Text, NativeAppEventEmitter} from 'react-native';
import {Route, Redirect} from 'react-router-native';
import BleManager from 'react-native-ble-manager';
import {Provider, connect} from 'react-redux';
import Swiper from 'react-native-swiper';

import Root from './components/Root.js';
import store from './store/configure.store.js'
// Configure redux store 
// const store = require('./store/configure.store.js').configure();

// For debug purposes, printing out state on change
store.subscribe(()=> {
  console.log("New State", store.getState());
});

export class App extends Component 
{
  constructor(props)
  {
    super(props);
  }

  componentDidMount()
  {
    BleManager.start({showAlert: false});
  }

  render ()
  { 
    return (
      <Provider store={store}>
        <Root/>
      </Provider>
    )
  }
}

export default App;