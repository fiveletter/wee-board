import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';

export class BoardInfo extends Component 
{
  constructor(props)
  {
    super(props);
  }

  render () 
  {
    let {style, boardData} = this.props;
    let text = "NO DATA TO SHOW";
    if (boardData)
    {
      text = JSON.stringify(boardData);
    }

    return (
      <View style={style}>
        <Text> {text}</Text>
      </View>
    );
  }
}

export default connect((state) => {
  return {
    boardData: state.boardData
  }
})(BoardInfo);

// <Text style={{fontSize:20, margin: 10}}>Speedo:</Text>
//         <Text style={{fontSize: 50, textAlign: 'center', margin: 10}}>{boardData.speed}</Text>
//         <Text style={{fontSize:20, margin: 10}}>Paowa Rebel:</Text>
//         <Text style={{fontSize: 50, textAlign: 'center', margin: 10}}>{boardData.batteryVoltage}</Text>