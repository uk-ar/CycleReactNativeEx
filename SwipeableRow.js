
import React, { Component } from 'react';
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');

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

//variable for debug layout
//var SWIPEABLE_MAIN_WIDTH = 300;
var SWIPEABLE_MAIN_WIDTH = width;

var Expandable = React.createClass({
  getInitialState: function() {
    return {
      index:null,
      width:0.001,
    }
  },
  componentWillMount: function(){
    this.thresholds = [];
    this.setState({width:this.props.width})
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
    //console.log("this.state.width:%O",this.state.width);
    //console.log("this.thresholds.length:%O",this.thresholds.length);
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
        {this.props.components[this.state.index]}
      </View>)
    //return(this.child)
  }
});

var AnimatedExpandable = Animated.createAnimatedComponent(Expandable);

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
//TODO:migrate to AnimatableView
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
         duration: 360,} //TODO:add props
      ).start()
    }
  },
  render: function(){
    return(
      //AnimatableBackGroundColor and children can expose method?
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

//Visible toggle hidden display
var AnimatableView = React.createClass({
  getInitialState: function() {
    return {
      style:this.props.style,
    }
  },
  componentWillMount: function() {
    this.animating=false;
  },
  _onLayout: function({nativeEvent: { layout: {x, y, width, height}}}){
    if(this.animating){return};
    this.contentHeight = height;
    this.contentWidth = width;
  },
  componentWillReceiveProps: function(nextProps) {
    var current = StyleSheet.flatten(this.props.style);
    var next = StyleSheet.flatten(nextProps.style);
    var style= Object.assign({},next);
    var values = Object.keys(StyleSheet.flatten(nextProps.style))
                       .filter((key) => current[key]!==next[key])
                       .filter((key) =>
                         ((typeof current[key] !== "string")||
                          (key==="backgroundColor")))
                       .map((key)=>{
                         if(current[key]){
                           style[key] = new Animated.Value(current[key]);
                         }else if(key==="height" || key==="width"){
                           style[key] = new Animated.Value(this.contentHeight);
                         }
                         return key;
                       }).map((key)=>
                         Animated.timing(
                           style[key],
                           {toValue: next[key],}//TODO:add props duration
                         ));//null
    //console.log("style:%O,%O",current,next);
    //console.log("a:%O,%O",values,style);
    this.setState({style:style});

    if(values.length!==0){
      this.animating = true;
      Animated.parallel(values).start((e)=>{
        this.animating = false;
        //always animated...
        this.props.onAnimationEnd &&
                         this.props.onAnimationEnd();
      });
      //trac for re-render children
    }
  },
  render: function(){
    //drop own props
    var {style, ...props} = this.props;
    return(
      <Animated.View
          {...props}
          style={this.state.style}
          onLayout={this._onLayout}
      >
        {this.props.children}
      </Animated.View>);
  }
});

var SwipeableButtons = React.createClass({
  getInitialState: function() {
    return {
      componentIndex:0,
      width:new Animated.Value(0.001),
      releasing:false,
    }
  },
  componentWillMount: function() {
    this.colors = this.props.buttons.map(
      (elem,i)=> elem.props.backgroundColor);
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.width != this.props.width){
      this.setState({width: new Animated.Value(nextProps.width)});
    }
  },
  //shuld handle in parent?
  release: function(callback){
    //need release listener?
    //Execute button action
    var currentButton = this.props.buttons[this.state.componentIndex];
    var close = currentButton.props.close;
    this.setState({releasing:true});

    return new Promise((resolve,reject) =>{
      Animated.timing(
        this.state.width,
        {toValue: close ? SWIPEABLE_MAIN_WIDTH : 0.001,
         duration: 180,}
      ).start((e)=>{
        //called when animation finished
        resolve(close);
        if(!close){
          this.setState({
            releasing:false,
            componentIndex:0,
          },()=>{
            //delete data
            currentButton.props.onRelease && currentButton.props.onRelease()
          }
          )
        }else{
          this.setState({
            releasing:false,
          },()=>{
            //delete data
            currentButton.props.onRelease && currentButton.props.onRelease()
          }
          )
        }
      })
    });
  },
  render: function(){
    var styles = this.props.direction == "left" ? [{
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"flex-end",
      backgroundColor:null,
      //padding:10,//RN bug:clipped padding
    },{
      flexDirection:"row",
      alignItems:"center",
      width:SWIPEABLE_MAIN_WIDTH/2,
      backgroundColor:null,
    },{
      flexDirection:"row",
      alignItems:"center",
      width:SWIPEABLE_MAIN_WIDTH,
      backgroundColor:null,
    }] : [{
      flexDirection:"row",
      alignItems:"center",
      backgroundColor:null,
      //padding:10,//RN bug:clipped padding
    },{
      width:SWIPEABLE_MAIN_WIDTH/2,
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"flex-end",
      alignSelf:"flex-end",
      backgroundColor:null,
    },{
      width:SWIPEABLE_MAIN_WIDTH,
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"flex-end",
      alignSelf:"flex-end",
      backgroundColor:null,
    }];
    var {width, ...props} = this.props;
    //               colors={this.props.colors}
    //console.log("w:%O", width);
    return(
      <AnimatableBackGroundColor {...props}
               colors={this.colors}
               colorIndex={this.state.componentIndex}>
        <AnimatedExpandable
            width={this.state.width.interpolate({
                inputRange: [0,   0.01,1],
                outputRange:[0.01,0.01,1]
              })}
            lock={this.state.releasing}
            style={{
                //width={this.state.width}
                //width={50}
                //width cannot shrink under padding
                height:50,//TODO:support height centering
                justifyContent:"center",
                //lock={this.releasing}
              }}
            onResize={(i)=>{
                //TODO:shuld call from first time?
                this.setState({componentIndex:i});
              }}
            components={this.props.buttons.map((elem,i)=>{
                return(React.cloneElement(
                  elem,
                  {style:[
                    elem.props.style,
                    styles[i]
                  ]})) //for merge backgroundColor
              })}
        />
      </AnimatableBackGroundColor>)
  },
});

var SwipeableRow = React.createClass({
  componentWillMount: function() {
    this._panX = new Animated.Value(0);

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: Animated.event([
        null,
        {dx: this._panX}
      ]),
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        if(0 < this.state.left){
          this.refs.leftButtons.release().then((close)=>{
            //if(close){this.setState({hidden:true})}
          });
        }else{
          this.refs.rightButtons.release().then((close)=>{
            //if(close){this.setState({hidden:true})}
          });
        }
      },

      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
    this._panX.addListener(({value:value}) => {
      this.setState({left: value,})
    });
  },
  getInitialState: function() {
    return {
      left:0.01,//changed when move & release
      componentIndex:0,//TODO:remove?
      hidden:false,//TODO:remove?
      offsetPositive:true,
    }
  },
  render: function(){
    var leftButtons=(
      //cannot convert animatedvalue because of release function
      <SwipeableButtons
          ref="leftButtons"
          direction="left"
          width={this.state.left}
          buttons={this.props.leftButtons}
          style={{justifyContent:"center",//vertical center
            }}
      />);
    //button input color, component, release action
    //close flag is parent props
    var rightButtons=(
      <SwipeableButtons
          ref="rightButtons"
          direction="right"
          width={-this.state.left}
          buttons={this.props.rightButtons}
          style={{justifyContent:"center",
                  overflow:"hidden"}}
      />
    );

    return(
      <AnimatableView
          style={{
            flexDirection:"row",
            //TODO:vertical stretch will fixed in RN 0.28?
            //https://github.com/facebook/react-native/commit/d95757037aef3fbd8bb9064e667ea4fea9e5abc1
            alignItems:"stretch",
            justifyContent: 0 < this.state.left ? "flex-start" : "flex-end",
            overflow:"hidden",
            }}
          {...this._panResponder.panHandlers}
      >
        {leftButtons}
        <View style={[//0 < this.state.left ? {flex:1} : {} ,
            //{alignSelf:"stretch"},
            //{flex:1},
            {width:SWIPEABLE_MAIN_WIDTH},
                      this.props.style,]}>
          {this.props.children}
        </View>
        {rightButtons}
      </AnimatableView>
    )
  },
});

module.exports = {SwipeableRow};
