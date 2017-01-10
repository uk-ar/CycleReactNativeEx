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
import Stylish from 'react-native-stylish';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import {BookCell} from '../../BookCell';
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
      //render(children)
      //              {...this.props.data[this.state.index]}
    }
  }
}

//function withDebug2(MyComponent){
  class Counter extends React.Component {
    constructor(props) {
      super(props);
      //this.state = { index:0 }
      //this.root
      this.index = 0
    }
    render(){
      return (
        <View>
          <Text onPress={()=>{
              this.index = this.index + 1
              this.props.onPress && this.props.onPress()
            }}>
            pressMe
          </Text>
          {this.props.children(this.index,func)}
        </View>
      )
      //render(children)
      //              {...this.props.data[this.state.index]}
    }
  }
//}

class TestListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2})
    };
    this.data = { a1:"a1", a2:"a2"};
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRows(this.data)})
  }
  componentWillMount(){
    this.updateDataSource();
  }
  render(){
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              const i = Math.random()
              const s1 = {...this.data}
              //delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data = {[`r${i}`]:`r${i}`, ...s1 }
              this.updateDataSource()
            }}>
          pressMe
        </Text>
        { this.props.children(this.state.ds) }
      </View>
    )
  }
}

class TestSectionListView extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.data = {
      /* s1:{r1:"r1"},
       * s2:{r3:"r1"},*/
      s1:{r1:"r1",r2:"r2",r6:"r6"},
      s2:{r3:"r1",r4:"r2",r5:"r3"},
    };
    this.state = {
      ds: ds.cloneWithRowsAndSections(this.data)
    };
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRowsAndSections(this.data)})
  }
  render(){
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              const i = Math.random()
              const s1 = {...this.data.s1}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data = {
                s1:{[`r${i}`]:`r${i}`,...s1},
                s2:{r3:"r1"}
              };
              this.updateDataSource()
            }}>
          Press to pop last and push head
        </Text>
        <Text
          onPress={()=>{
              const s1 = {...this.data.s1}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data = {
                s1:{...s1},
                s2:{r3:"r1"}
              };
              this.updateDataSource()
            }}>
          Press to pop last
        </Text>
        { this.props.children(this.state.ds) }
      </View>
    )
  }
}

function debugView(string) {
  //TODO:string,args
  return function (props){
    return (
      <View style={{ height: 100, borderWidth:3, borderColor:"yellow", backgroundColor:"green" }}>
        <Text>{string}:{util.inspect(props)}</Text>
      </View>);
  }
}

function DebugView2(props){
  return (
    <View style={[{
      height: 100, borderWidth:3, borderColor:"yellow", backgroundColor:"green"
    },props.style]}>
      <Text>{util.inspect(props)}</Text>
    </View>);
  //{props.name}:
}

module.exports = {withDebug,VerticalCenterView,TestListView,debugView,TestSectionListView,DebugView2}
