
import React, { Component } from 'react';
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');
var Emoji = require('react-native-emoji');

import { RadioButtons,SegmentedControls } from 'react-native-radio-buttons'
var _ = require('lodash');

import {
  TouchableOpacity,
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  LayoutAnimation,
  // cell
  PixelRatio,
  // searchBar
  TextInput,
  ToolbarAndroid,
  Navigator,
  NavigatorIOS,
  Animated,
  ScrollView,
  PanResponder,
  ToastAndroid,
} from 'react-native';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

let {SwipeableRow,} = require('./SwipeableRow');

var LeftButton  = React.createClass({
  render: function(){
    var text = this.props.text ?
               <Text style={{margin:10,marginLeft:0}}>
                 {this.props.text}</Text> : null;
    return(
      <View {...this.props}>
        <FAIcon name={this.props.icon} size={20}
                style={{margin:10,marginRight:5}} />
        {text}
      </View>
    )}
});

var RightButton  = React.createClass({
  render: function(){
    var text = this.props.text ?
               <Text style = {{margin:10, marginRight:0}}>
                 {this.props.text}</Text> : null;
    return(
      <View {...this.props}>
        {text}
        <FAIcon name={this.props.icon} size={20}
                style = {{margin:10, marginLeft:5}} />
      </View>
    )}
});

var BookCell = React.createClass({
  render: function(){
    var leftButtons=[
      <LeftButton onRelease={()=> console.log("1")}
                  close={false}
                  backgroundColor='rgb(158, 158, 158)'
                  icon="heart-o"
      />,
      <LeftButton onRelease={()=> console.log("2")}
                  close={true}
                  backgroundColor='rgb(33,150,243)'
                  icon="heart-o"
                  text="読みたい"
      />,
      <LeftButton onRelease={()=> console.log("3")}
                  close={true}
                  backgroundColor='rgb(76, 175, 80)'
                  icon="inbox"
                  text="Inbox"
      />
    ];
    var rightButtons=[
      <RightButton onRelease={()=> console.log("r1")}
                   backgroundColor='rgb(158, 158, 158)'
                   close={false}
                   icon="check-square-o"
      />,
      <RightButton onRelease={()=> console.log("r2")}
                   backgroundColor='#9C27B0'
                   close={true}
                   icon="check-square-o"
                   text="読んだ"
      />,
    ];
    return(
      <SwipeableRow
          style={[styles.rowCenter,{
              backgroundColor:"green",
              borderWidth: 2,
            }]}
          leftButtons={leftButtons}
          rightButtons={rightButtons}
      >
        <Text>
          {'main!'}
        </Text>
        <FAIcon name="rocket" size={30}/>
      </SwipeableRow>
    )
  }
})

var styles = StyleSheet.create({
  //application & lib
  rowCenter:{
    flexDirection:"row",
    //justifyContent:"center",
    alignItems:"center",
  },
  //for new swipe
  /* container: {
     flex: 1,
     flexDirection: 'column'
     },
     outerScroll: {
     flex: 1,
     flexDirection: 'column'
     },
     row: {
     flex: 1
     }, */
  container: {
    flex: 1,
    //backgroundColor: 'white',
  },
  //for cell
  row: {
    //alignItems: 'center',
    //backgroundColor: 'white',
    flexDirection: 'row',
    //padding: 5,
  },
  textContainer: {
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  cellImage: {
    //backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    //backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  segmented:{
    flex: 1,
    //backgroundColor: 'black',
  },
  icon:{
    //width: 50
  },
  toolbarButton:{
    //width: 50,            //Step 2
    //textAlign:'center',
    flex:1                //Step 3
  },
  toolbarTitle:{
    //alignItems: 'center',
    textAlign:'center',
    fontWeight:'bold',
    flex:1                //Step 3
  },
  separator: {
    height: 1,
    //backgroundColor: '#CCCCCC',
  },
  Text: {
    color:'#FFFFFF',
    //width:30,
    //textAlignVertical:"bottom",//not working?
    //textAlign:'center',//ok
    //biblio
    //padding:5,//expand width for flex
    //margin:5,//actual space for flex
    //textAlign:"center",
  }
});

module.exports = {BookCell};
