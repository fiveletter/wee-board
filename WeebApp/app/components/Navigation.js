import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Link} from 'react-router-native';
import {Nav} from '../styles/nav.js';

export class Navigation extends Component 
{
  constructor()
  {
    super();
  }

  render () 
  {
    return (
      <View style={Nav.nav}>
        <Link to="/bluetooth" underlayColor='#f0f4f7' style={Nav.navItem}>
          <Text>Bluetooth</Text>
        </Link>
        <Link to="/control" underlayColor='#f0f4f7' style={Nav.navItem}>
          <Text>Controller</Text>
        </Link>
      </View>
    );
  }
}

export default Navigation;