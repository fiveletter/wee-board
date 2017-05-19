import React, {Component} from 'react';
import {View, ListView, Text, TouchableHighlight} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {connect} from 'react-redux';

export class BluetoothDeviceList extends Component
{
  constructor(props)
  {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    this._onPressRow = this._onPressRow.bind(this);
    this._renderRow = this._renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps)
  {
    let {deviceList} = nextProps;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(deviceList)
    });
  }

  render() 
  {
    let {style, deviceList} = this.props;

    if (deviceList.length <= 0)
    {
      return (
        <View style={[style, {flex: 0}]}>
          <Text style={{textAlign: 'center', padding: 10}}>No devices found</Text>
        </View>
      );
    }
    return (
      <View style={[style, {flex: 0}]}>
        <ListView dataSource={this.state.dataSource} 
                renderRow={this._renderRow}
                enableEmptySections={true}/> 
      </View>
    );
  }

  _onPressRow(rowID)
  {
    let {onConnect, deviceList} = this.props;
    onConnect(deviceList[rowID].id);
  }

  _renderRow(rowData, sectionID, rowID) 
  {
    let name = rowData.name ? rowData.name : 'Undefined' ;
    
    return (
      <TouchableHighlight style={{borderWidth: 1, borderColor: 'black'}} onPress={() => this._onPressRow(rowID)}>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 10
        }}>
          <Text>Name: {name}</Text>
          <Text>ID: {rowData.id}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default connect((state) => {
  return {
    deviceList: state.deviceList
  }
})(BluetoothDeviceList);