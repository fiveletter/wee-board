import React, { Component } from 'react';
import {View, Text, NativeAppEventEmitter} from 'react-native';
import {Route, Redirect} from 'react-router-native';
import BleManager from 'react-native-ble-manager';

import {Global} from './styles/global.js';
import Navigation from './components/Navigation.js';
import Controller from './components/Controller.js';
import Bluetooth from './components/Bluetooth.js';


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
      <View style={Global.container}>
        <Navigation/>
        <Route exact path='/' render={() => <Redirect to="/control"/>}/>
        <Route path='/bluetooth' component={Bluetooth}/>
        <Route path='/control' component={Controller}/>
      </View>
    )
  }
}

export default App;