/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import {NativeRouter} from 'react-router-native';

import App from './app/App.js';

export default class WeebApp extends Component {
  render() {
    return (
      <NativeRouter>
        <App/>
      </NativeRouter>
    );
  }
}

AppRegistry.registerComponent('WeebApp', () => WeebApp);
