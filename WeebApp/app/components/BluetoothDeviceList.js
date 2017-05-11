import React, {Component} from 'react';
import {View, ListView, Text, TouchableHighlight} from 'react-native';
import BleManager from 'react-native-ble-manager'

export class BluetoothDeviceList extends Component
{
  constructor(props)
  {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    let bluetoothDevices = this.props.bleDevices;

    this.state = {
      bluetoothDevices,
      dataSource: ds.cloneWithRows(bluetoothDevices)
    };

    this._onPressRow = this._onPressRow.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps)
  {
    let {bleDevices} = nextProps;
    this.setState({
      bluetoothDevices: bleDevices,
      dataSource: this.state.dataSource.cloneWithRows(bleDevices)
    });
  }

  render() 
  {
    let {style} = this.props;

    if (this.state.bluetoothDevices.length <= 0)
    {
      return (
        <View style={style}>
          <Text style={{textAlign: 'center', padding: 10}}>No devices found</Text>
        </View>
      );
    }
    return (
      <View style={style}>
        <ListView dataSource={this.state.dataSource} 
                renderRow={this._renderRow}
                enableEmptySections={true}/> 
      </View>
    );
  }

  _onPressRow(rowID)
  {

    let {onConnect} = this.props;
    /* Handle coloring of pressed item */
    let newArray = this.state.bluetoothDevices.slice();
    newArray[rowID] = {
      ...this.state.bluetoothDevices[rowID],
      connected: !this.state.bluetoothDevices[rowID].connected
    }

    onConnect(this.state.bluetoothDevices[rowID].id);
    
    this.setState({
      bluetoothDevices: newArray,
      dataSource: this.state.dataSource.cloneWithRows(newArray)
    })
  }

  _renderRow(rowData, sectionID, rowID) 
  {
    let rowColor = rowData.connected ? '#ff1493' : '#F6F6F6';
    let name = rowData.name ? rowData.name : 'Undefined' ;
    
    return (
      <TouchableHighlight style={{borderWidth: 1, borderColor: 'black'}} onPress={() => this._onPressRow(rowID)}>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10,
          backgroundColor: rowColor
        }}>
          <Text>Name: {name}</Text>
          <Text>ID: {rowData.id}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default BluetoothDeviceList;