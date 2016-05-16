
import React, { Component } from 'react';
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');
var Emoji = require('react-native-emoji');
var Swipeout = require('react-native-swipeout');
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
} from 'react-native';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

//variable for debug layout
var SWIPEABLE_MAIN_WIDTH = 300;
//var SWIPEABLE_MAIN_WIDTH = SCREEN_WIDTH;

var Expandable = React.createClass({
  getInitialState: function() {
    return {
      index:null,
      width:0.01,
    }
  },
  componentWillMount: function(){
    this.thresholds = [];
  },
  componentWillReceiveProps: function(nextProps) {
    //console.log("next:%O",nextProps);
    var width = nextProps.width;
    this.setState({width: width});
    if(this.props.lock){return};
    //this.width = width;
    if((this.state.index < this.props.components.length - 1) &&
       (this.thresholds[this.state.index] < width)){
         this.setState({index: this.state.index + 1});
         //console.log("set+1");
         this.props.onResize &&
         this.props.onResize(this.state.index+1);
    }else if((0 < this.state.index) &&
             (width < this.thresholds[this.state.index - 1] )){
               this.setState({index: this.state.index - 1});
               //console.log("set-1");
               this.props.onResize &&
               this.props.onResize(this.state.index-1);
    }
  },
  render: function(){
    //render method called according to width
    //console.log("this.props:%O", this.props)
    //this.child exposed to parent

    return(
    this.thresholds.length == 0 ?
    //TODO:...this.props
    <View onLayout={()=> this.setState({index:0})}>
        {this.props.components.map((elem,i)=>{
           return (
             <View
                 key={i}
                 style={{position:"absolute"}}
                 onLayout={({nativeEvent:{layout:{width, height}}})=>{
                     //console.log("i:%O,w:%O",i,width);
                     //style={[this.props.style,{position:"absolute"}]}
                     //style={[this.props.style]}
                     //{padding:10,margin:7,position:"absolute"}47,120,220
                     //{padding:10,position:"absolute"}47,120,220
                     //{position:"absolute"}27,100,200
                     this.thresholds[i] = width;
                   }}>
               {elem}
             </View>
           )})}
    </View>
      :
    <View
         style={[this.props.style,{width: this.state.width}]}
     >
      { React.cloneElement(this.props.components[this.state.index],
                           {ref:(c) => {this.child = c }})}
    </View>)
      //return(this.child)
  }
});

/* usage:
<AnimatableBackGroundColor
   colors={colors}
   colorIndex={this.state.left}>
   <Text onPress = {() => {
   this.setState({
   left:this.state.left + 1
   })
   }}>foo</Text>
   </AnimatableBackGroundColor> */

var AnimatableBackGroundColor = React.createClass({
  componentWillMount: function() {
    this.colorIndex = new Animated.Value(this.props.colorIndex);
  },
  componentWillReceiveProps: function(nextProps) {
    //animated
    if(nextProps.colorIndex != this.props.colorIndex){
      Animated.timing(
        this.colorIndex,
        {toValue: nextProps.colorIndex,//interpolate?
         duration: 180,} //TODO:add props
      ).start();
    }
  },
  render: function(){
    return(
      <Animated.View {...this.props} style = {[this.props.style,{
          backgroundColor:this.colorIndex.interpolate({
            inputRange: _.range(this.props.colors.length),
            outputRange: this.props.colors,
          }),
        },
        ]}>
        {this.props.children}
      </Animated.View>)
  }
});

var SwipeableButton = React.createClass({
  getInitialState: function() {
    return {
      componentIndex:0,
      width:0,
      releasing:false,
    }
  },
  componentWillMount: function() {
    //this.releasing = false;
    //Width cannot be animated value, because of children method call.
    //this.width = 0;
    this.closes = [false, true, true];
  },
  componentWillReceiveProps: function(nextProps) {
    //setState(this.props);
    if(nextProps.width != this.props.width){
      this.setState({width: nextProps.width});
    }
  },
  //shuld handle in parent?
  release: function(){
    //this.releasing = true;
    this.setState({releasing:true});
    //anmation
    //this.refs.left.child.props.onRelease()
    this.refs.root.child.props.onRelease();
    //this.releaseTo = this.closes[i] ? SWIPEABLE_MAIN_WIDTH : 0;
    var animatedWidth = new Animated.Value(this.props.width);
    Animated.timing(
      animatedWidth,
      {toValue: this.closes[this.state.componentIndex] ?
       SWIPEABLE_MAIN_WIDTH : 0.01,
       duration: 180,}
    ).start()//(e)=> this.releasing = false);
    animatedWidth.addListener(({value:value}) => {
      //this.setState({left: value,})
      this.setState({width: value});
      //this.width = value;
    });
    
  },
  render: function(){
    //console.log("this",this);
    //
    var {width, ...props} = this.props;
    //{...props}...
    //style={{width:}}
    //console.log("wi:%O", width);
    console.log("re:%O", this.releasing);
    return(
      <AnimatableBackGroundColor {...props}
               colors={[
                 'rgb(158, 158, 158)',//grey
                 'rgb(33,150,243)',//blue
                 'rgb(76, 175, 80)',//green
               ]}
               colorIndex={this.state.componentIndex}>
        <Expandable
            ref="root"
            width={this.state.width}
            style={{
              //width cannot shrink under padding
              //width: 0 < this.state.left ? this.state.left : 0.01,
              height:50,//TODO:support height centering
              justifyContent:"center",
            }}
          lock={this.state.releasing}
          onResize={(i)=>{
              //TODO:shuld call from first time?
              //console.log("onre:%O", i)
              this.setState({componentIndex:i});
            }}
          components={[
            <View onRelease={()=> console.log("1")}
                      style={{
                          flexDirection:"row",
                          justifyContent:"flex-end",
                          //alignSelf:"center",
                          //padding:10,//RN bug:clipped padding
                        }}>
              <Text style={{margin:10,marginRight:5}}>
                          l1:left</Text>
            </View>,
            <View onRelease={()=> console.log("2")}
                      style={{
                          flexDirection:"row",
                          width:SWIPEABLE_MAIN_WIDTH/2,
                        }}>
              <Text style={{margin:10,marginRight:5}}>
                          l1:left</Text>
              <Text style={{margin:10,marginLeft:0}}>
                          l1:right</Text>
            </View>,
            <View onRelease={()=> console.log("3")}
                      style={{
                          flexDirection:"row",
                          width:SWIPEABLE_MAIN_WIDTH,
                        }}>
              <Text style={{margin:10,marginRight:5}}>
                          l2:left</Text>
              <Text style={{margin:10,marginLeft:0}}>
                          l2:right</Text>
            </View>,
          ]}
      />
    </AnimatableBackGroundColor>)
  },
})

var BookCell = React.createClass({
  componentWillMount: function() {
    this._panX = new Animated.Value(0);
    this.releasing = false;
    this.releaseTo = 0;

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      //onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      //onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        //this._panX.setOffset(this._previousLeft);
        //this._panX.setValue(0);
        this.releasing = false;
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this._panX}
      ]),
      //onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        //this._previousLeft += gestureState.dx;
        //this.refs.left.child.props.onRelease();

        //TODO:add swipeout method or props to buttons
        /* Animated.timing(
          this._panX,
          {toValue: this.releaseTo ,
           duration: 180,}
        ).start();*/
        //this.releasing = true;
        this.refs.left.release();
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
    //console.log("created");
    console.log("will m");
    this._panX.addListener(({value:value}) => {
      this.setState({left: value,})
    });
  },
  getInitialState: function() {
    return {
      left:0,//changed when move & release
      componentIndex:0,
    }
  },
  componentDidMount: function(){
    console.log("did m:%O", this);
  },
  render: function(){
    //genButton([a,b,c,d],left)
    var leftButtons=(
      //lock={this.releasing}
      //
      <SwipeableButton ref = "left"
                       width={this.state.left}
                       style={{
                           //width: 0 < this.state.left ? this.state.left : 0.01,
                           //width: this.state.left
                         }}
      />);
    //button input color, component, release action
    //close flag is parent props
    var rightButtons=(
      <AnimatableBackGroundColor
          colors={[
              'rgb(158, 158, 158)',//grey
              '#9C27B0',//purple
              '#F44336',//red
            ]}
          colorIndex={this.state.componentIndex}
          style={{
              //width: this.state.left < 0 ? -this.state.left : 0.01,//width cannot shrink under padding
            }}
      >
        {/* <Expandable
        style={{
        //width: -this.state.left,//width cannot shrink under padding
        //right:0,
        justifyContent:"center",
        }}
        lock={this.releasing}
        onResize={(i)=>{
        console.log("onre:%O", i)
        if(i == 0){
        this.releaseTo = 0;
        }else{
        this.releaseTo = - SWIPEABLE_MAIN_WIDTH;
        }
        this.setState({componentIndex:i})
        }}
        components={[
        <View style={{
        flexDirection:"row",
        //padding:10,//RN bug:clipped padding
        }}>
        <Text style={{margin:10,marginLeft:5}}>
        r1:right</Text>
        </View>,
        <View style={{
        width:SWIPEABLE_MAIN_WIDTH/2,
        flexDirection:"row",
        justifyContent:"flex-end",
        alignSelf:"flex-end",
        }}>
        <Text style={{margin:10,marginRight:0}}>
        r1:left</Text>
        <Text style={{margin:10,marginLeft:5}}>
        r1:right</Text>
        </View>,
        <View style={{
        width:SWIPEABLE_MAIN_WIDTH,
        flexDirection:"row",
        justifyContent:"flex-end",
        alignSelf:"flex-end",
        }}>
        <Text style={{margin:10,marginRight:0}}>
        r2:left</Text>
        <Text style={{margin:10,marginLeft:5}}>
        r2:right</Text>
        </View>,
        ]}
        /> */}
      </AnimatableBackGroundColor>
    );
    return(
      <View style={{
          flexDirection:"row",
          width:SWIPEABLE_MAIN_WIDTH,
          justifyContent: 0 < this.state.left ? "flex-start" : "flex-end",
        }}
            {...this._panResponder.panHandlers}>
        {leftButtons}
        <View
            style={{
                width: SWIPEABLE_MAIN_WIDTH,
              }}>
          <View style={{
              backgroundColor:"blue",
              borderWidth: 2,
              flexDirection: 'column',
              justifyContent:"center",
            }}>
            <Text style={{
              }}
                  numberOfLines={1}
            >
              {'main?'}
            </Text>
          </View>
        </View>
        {rightButtons}
      </View>
    )
},
});

var SwipeableRow = React.createClass({
  _previousLeft: 0,
  getInitialState() {
    return {
    }
  },
  componentWillMount: function() {
    this.height = new Animated.Value(0);

    this._panX = new Animated.Value(0);
    this.leftBackGroundColor = new Animated.Value('rgb(158, 158, 158)');
    this._panX.addListener(({value:value}) => {
      console.log("v:%O",value);
    }
    );

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this._panX.setOffset(this._previousLeft);
        this._panX.setValue(0);
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this._panX}
      ]),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this._previousLeft += gestureState.dx;
        //this._panX.setValue(0);
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  },
  render(){
    var leftButtons = (
      <View/>
    );
    var leftButtonsContainer = (
      <Animated.View style = {
        {//backgroundColor: this.leftBackGroundColor,
          //width: this._panX <= 0 ? 0.01 : this._panX,
         width: 0.01,
         //right & left cannot effect 'mainElement'
         //right: -1 * this._panX,
         //left: this._panX,
         //padding:10,
         //height:this.height,
         //https://js.coach/react-native?sort=popular&filters=android.ios
         flexDirection: 'row',
         alignItems: "center",//vertical
         //padding:10,
        }}
      >
        {/* <Animated.Text numberOfLines={1}>
        right
        </Animated.Text> */}
      </Animated.View>);

    return(
      <MeasurableView style={
        [{
          //width: SCREEN_WIDTH,
          width: SWIPEABLE_MAIN_WIDTH,
          flexDirection:'row',
          justifyContent:"flex-end",
          //backgroundColor:'yellow',
          //alignItems:'flex-end',//vertical
          //alignItems:'stretch',//vertical,
          //justifyContent:'center',//not to affected by left button string change
        },
         {height:this.height,
         }
        ]}
                      onFirstLayout={({nativeEvent:{layout:{width, height}}})=>
                        {this.height.setValue(height)}}
      >
      {/*leftButtonsContainer*/}
      <Text numberOfLines={1}>
      right
      </Text>

        <Animated.View
      ref={'mainElement'}
      style={[
        {
          width: SWIPEABLE_MAIN_WIDTH,
          borderWidth: 2,
        },
        ]}
        >
          {this.props.children}
        </Animated.View>
      </MeasurableView>
    )
  },
})

var styles = StyleSheet.create({
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
