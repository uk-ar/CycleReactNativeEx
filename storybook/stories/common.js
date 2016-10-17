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
import { Stylish} from '../../Stylish';
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
    this.data = [{key:"a1",data:"a1"}, {key:"a2",data:"a2"}];
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRows(
        this.data.reduce((acc,elem)=>{
          acc[elem.key] = elem.data
          return acc
          //{...acc,[elem.key]:elem.data}
        },{})
      )})//return acc
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
              this.data = [{key:`a${i}`,data:`${i}`}, ...this.data]
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
  return function (props){
    return (
      <View style={{ height: 100, borderWidth:3, borderColor:"yellow", backgroundColor:"green" }}>
        <Text>{string}:{util.inspect(props)}</Text>
      </View>);
  }
}

module.exports = {withDebug,VerticalCenterView,TestListView,debugView,TestSectionListView}
