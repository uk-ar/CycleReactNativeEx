import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  ListView
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import util from 'util';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import {BookCell} from '../../BookCell';
import {AnimView} from '../../AnimView';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

function VerticalCenterView(style, ...props) {
  return (
    <View
      {...props}
      style={[{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#F5FCFF',
        },style]}/>
  );
}

function withDebug(MyComponent){
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { index:0 }
      this.root
    }
    render(){
      //this.props.data.length
      return (
        <View>
          <Text onPress={()=>{
              if(1 < this.props.data.length){
                this.setState(
                  {index:(this.state.index+1) % this.props.data.length })
              }
              this.props.onPress &&
              this.props.onPress(this.props.data[this.state.index],this.root)
            }}>
            pressMe
          </Text>
          <MyComponent
            ref={c => this.root = c}
            {...this.props.data[this.state.index]}
            children={this.props.children}
          />
        </View>
        )
      //              {...this.props.data[this.state.index]}
    }
  }
}

class TestListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
    this.data = ['row 0', 'row 1'];
  }
  componentWillMount(){
    this.setState({ds:this.state.ds.cloneWithRows(this.data)})
  }
  render(){
    //console.log(this.state.ds._dataBlob.s1)
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              //const [head,...rest]= this.data
              [head,...this.data]= this.data
              //console.log("r",rest)
              console.log("r",this.data)
              this.data.push(`row ${Math.random()}`)
              console.log("r",this.data)
              this.setState({ds:this.state.ds.cloneWithRows(this.data)})
            }}>
          pressMe
        </Text>
        { this.props.children(this.state.ds) }
      </View>
    )
  }
}

function debugView(string) {
  return function (props){
    return (
      <View style={{ height: 100, borderWidth:3, borderColor:"yellow", backgroundColor:"green" }}>
        <Text>{string}:{util.inspect(props)}</Text>
      </View>);
  }
}

module.exports = {withDebug,VerticalCenterView,TestListView,debugView}
