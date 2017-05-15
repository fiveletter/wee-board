import React, { Component } from 'react';
import {View, Text, NativeAppEventEmitter} from 'react-native';
import {Route, Redirect} from 'react-router-native';
import BleManager from 'react-native-ble-manager';
import {Provider} from 'react-redux';

import {Global} from './styles/global.js';
import Navigation from './components/Navigation.js';
import Controller from './components/Controller.js';
import Bluetooth from './components/Bluetooth.js';
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
      <View style={Global.container}>
        <Navigation/>
        <Route exact path='/' render={() => <Redirect to="/control"/>}/>
        <Route path='/bluetooth' component={Bluetooth}/>
        <Route path='/control' component={Controller}/>
      </View>
      </Provider>
    )
  }
}

export default App;