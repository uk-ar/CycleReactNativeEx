
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

var LibraryStatus = React.createClass({
  render: function() {
    var libraryStatus = this.props.libraryStatus || {};

    var text, name, backgroundColor;

    if(libraryStatus.rentable){
      text="貸出可"
      //style={backgroundColor: "#03A9F4"} //light blue
    }else if(libraryStatus.exist){
      text="貸出中"
      //style={backgroundColor: "#FFC107"} //yellow
    }else if(libraryStatus.exist !== undefined){
      text="なし"
      //style={backgroundColor: "#9E9E9E"} //grey
    }else{
      //text="取得中"
    }
    //http://www.google.com/design/spec/style/color.html#color-color-palette
    if(text){
      return (
        <View style={[styles.row]}
        >
          <Text>
            {text}
          </Text>
        </View>
      );
    }else{
      return (
        <View style={[styles.row]}>
          <Text>
            {"蔵書確認中"}
          </Text>
          <GiftedSpinner />
        </View>
      )
    }
  },
});

var BookCell = React.createClass({
  render: function(){
    var leftButtons=[
      <LeftButton onRelease={()=> console.log("1")}
                  close={false}
                  backgroundColor="#E0E0E0"
                  icon="heart-o"
      />,//grey 300
      <LeftButton onRelease={()=> console.log("2")}
                  close={true}
                  backgroundColor="#2196F3"
                  icon="heart-o"
                  text="読みたい"
      />,//light blue "#03A9F4"
      //blue "#2196F3"
      <LeftButton onRelease={()=> console.log("3")}
                  close={true}
                  backgroundColor='rgb(76, 175, 80)'
                  icon="inbox"
                  text="Inbox"
      />,//green
    ];
    var rightButtons=[
      <RightButton onRelease={()=> console.log("r1")}
                   backgroundColor="#E0E0E0"
                   close={false}
                   icon="check-square-o"
      />,//grey 300
      <RightButton onRelease={()=> console.log("r2")}
                   backgroundColor="#FFC107"
                   close={true}
                   icon="check-square-o"
                   text="読んだ"
      />,//amber
    ];
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var book=this.props.movie;
    console.log("b:%O", book)
    return(
      <SwipeableRow style={[styles.row]}
                    leftButtons={leftButtons}
                    rightButtons={rightButtons}>
        <TouchableElement selector="cell"
                          onPress={(e) => console.log("cell action:%O", e)}>
          <View style={[styles.row,{flex:1}]}>
            <Image source={{uri: book.thumbnail}}
                   style={[styles.cellImage,]} />
            <View style={[{flex:1,},{padding:10}]}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.bookYear} numberOfLines={1}>
                {book.author}
              </Text>
              <LibraryStatus libraryStatus={book.libraryStatus}/>
            </View>
          </View>
        </TouchableElement>
      </SwipeableRow>
    )}
});

var styles = StyleSheet.create({
  //application & lib
  rowCenter:{
    flexDirection:"row",
    //justifyContent:"center",
    alignItems:"center",
  },
  row:{
    flexDirection:"row",
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
  bookTitle: {
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
    backgroundColor: '#dddddd',
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
  test:{
    borderWidth:2,
    borderColor:"red",
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
