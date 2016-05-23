
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
    if(!nextProps.animatable){
      this.setState({style:nextProps.style});
      return;
    }
    var current = StyleSheet.flatten(this.props.style);
    var next = StyleSheet.flatten(nextProps.style);
    var style= Object.assign({},next);
    var values = Object.keys(StyleSheet.flatten(nextProps.style))
                       .filter((key) => current[key]!==next[key])
                       .filter((key) => (typeof current[key] !== "string"))
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
      width:0.01,
    }
  },
  componentWillMount: function() {
    this.releasing = false;
    //Width cannot be animated value, because of children method call.
    this.onRelease = this.props.buttons[0].props.onRelease;
    //this.colors = this.props.buttons.map((elem,i)=> elem.props.backgroundColor);
    this.colors = this.props.buttons.map(
      (elem,i)=> elem.props.backgroundColor);
  },
  componentWillReceiveProps: function(nextProps) {
    //setState(this.props);
    if(nextProps.width != this.props.width){
      this.setState({width: nextProps.width});
    }
  },
  //shuld handle in parent?
  release: function(callback){
    //need release listener?
    //Execute button action
    this.onRelease && this.onRelease();
    var close = this.props.buttons[this.state.componentIndex].props.close;
    this.releasing = true;
    this.setState({width: close ? SWIPEABLE_MAIN_WIDTH : 0.01,});
    //anmation
    /* var animatedWidth = new Animated.Value(this.props.width);
       this.releasing = true;
       var close = this.props.buttons[this.state.componentIndex].props.close;
       Animated.timing(
       animatedWidth,
       {toValue: close ? SWIPEABLE_MAIN_WIDTH : 0.01,
       duration: 180,}
       ).start((e)=> {
       this.releasing = false;
       if(!close){ this.setState({componentIndex:0})};
       callback && callback(close);
       //this.props.onRelease && this.props.onRelease(e)
       });
       animatedWidth.addListener(({value:value}) => {
       this.setState({width: value});
       }); */
  },
  render: function(){
    var styles = this.props.direction == "left" ? [{
      flexDirection:"row",
      justifyContent:"flex-end",
      backgroundColor:null,
      //padding:10,//RN bug:clipped padding
    },{
      flexDirection:"row",
      width:SWIPEABLE_MAIN_WIDTH/2,
      backgroundColor:null,
    },{
      flexDirection:"row",
      width:SWIPEABLE_MAIN_WIDTH,
      backgroundColor:null,
    }] : [{
      flexDirection:"row",
      backgroundColor:null,
      //padding:10,//RN bug:clipped padding
    },{
      width:SWIPEABLE_MAIN_WIDTH/2,
      flexDirection:"row",
      justifyContent:"flex-end",
      alignSelf:"flex-end",
      backgroundColor:null,
    },{
      width:SWIPEABLE_MAIN_WIDTH,
      flexDirection:"row",
      justifyContent:"flex-end",
      alignSelf:"flex-end",
      backgroundColor:null,
    }];
    var {width, ...props} = this.props;
    //               colors={this.props.colors}
    return(
      <AnimatableBackGroundColor {...props}
               colors={this.colors}
               colorIndex={this.state.componentIndex}>
        <AnimatableView style={{width:this.state.width
            //separete width when release and pan
            //props.animate,
            //animatable={this.releasing}
          }}
                        onAnimationEnd={()=>{
                            //ToastAndroid.show('bar', ToastAndroid.SHORT)
                            //console.log("anim end");
                            this.releasing=false;
                          }}
        >
          <Expandable
              width={100}
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
                this.onRelease = this.props.buttons[i].props.onRelease;
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
        </AnimatableView>
      </AnimatableBackGroundColor>)
  },
});

//Visible toggle hidden display
var ToggleView = React.createClass({
  getInitialState: function() {
    return {
      value: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
    }
  },
  componentWillMount: function() {
    this.animating=false;
  },
  _onLayout: function({nativeEvent: { layout: {x, y, width, height}}}){
    if(this.animating || this.props.hidden){return};
    //console.log("onlay:%O,%O",this.animating,height);
    this.contentHeight = height;
    this.contentWidth = width;
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      this.animating = true;

      this.state.value.setValue({x:this.contentWidth,
                                 y:this.contentHeight});
      this.state.opacity.setValue(1);

      Animated.parallel([
        Animated.timing(
          this.state.value,
          {toValue: {x: this.props.horizontal ? 0.01 : this.contentWidth,
                     y: this.props.vertical ? 0.01 : this.contentHeight}}
        ),
        Animated.timing(
          this.state.opacity,
          {toValue: this.props.opacity ? 0 : 1 }
        )
      ]).start((e)=>{
        this.props.onAnimationEnd && this.props.onAnimationEnd(e)
        this.animating=false;
      })
    }
  },
  render: function(){
    //drop own props
    var {hidden, opacity, ...props} = this.props;

    return(
      <Animated.View
      {...props}
      onLayout={this._onLayout}
      style={[this.props.style,
              this.props.horizontal ? {width:this.state.value.x} : null,
              this.props.vertical ? {height:this.state.value.y} : null,
              this.props.opacity ? {opacity:this.state.opacity} :null,
      ]}>
      {this.props.children}
      </Animated.View>
    )
  }
});

var ToggleView2 = React.createClass({
  getInitialState: function() {
    return {
      value: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
    }
  },
  componentWillMount: function() {
    this.animating = false;
    this.hidden = false;
    //this.props.initialstate?
  },
  _onLayout: function({nativeEvent: { layout: {x, y, width, height}}}){
    if(this.animating || this.hidden){return};
    //console.log("onlay:%O,%O",this.animating,height);
    this.contentHeight = height;
    this.contentWidth = width;
  },
  close: function(){
    this.animating = true;

    this.state.value.setValue({x:this.contentWidth,
                               y:this.contentHeight});
    this.state.opacity.setValue(1);

    return new Promise((resolve,reject) =>
      Animated.parallel([
        Animated.timing(
          this.state.value,
          {toValue: {x: this.props.horizontal ? 0.01 : this.contentWidth,
                     y: this.props.vertical ? 0.01 : this.contentHeight}}
        ),
        Animated.timing(
          this.state.opacity,
          {toValue: this.props.opacity ? 0 : 1 }
        )
      ]).start((e)=>{
        //this.props.onAnimationEnd && this.props.onAnimationEnd(e)
        resolve(e);
        this.animating = false;
      })
    );
  },
  render: function(){
    //drop own props
    var {hidden, opacity, ...props} = this.props;

    return(
      <Animated.View
      {...props}
      onLayout={this._onLayout}
      style={[this.props.style,
              this.props.horizontal ? {width:this.state.value.x} : null,
              this.props.vertical ? {height:this.state.value.y} : null,
              this.props.opacity ? {opacity:this.state.opacity} :null,
        ]}>
        {this.props.children}
      </Animated.View>
    )
  }
})

var BookCell = React.createClass({
  componentWillMount: function() {
    this._panX = new Animated.Value(0);

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      //onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      //onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: Animated.event([
        null,
        {dx: this._panX}
      ]),
      //onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.refs.leftButtons.release((close)=>{
          //if(close){this.setState({hidden:true})}
        }
        );
        this.refs.rightButtons.release((close)=>{
          //if(close){this.setState({hidden:true})}
          //panresponder->buttons->button
          //                     ->cell
          //                     ->backgroundColor
          // expand
          //panresponder->buttons(expand)->button(user callback)
          //                             ->cell(close):parent
          // buttons.expand().then(cell.close)
          //
          // close
          //panresponder->buttons(close)->button(user callback)
          //                            ->backgroundColor(reset):children
          // buttons.close()
        }
        );
      },

      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
    this._panX.addListener(({value:value}) => {
      this.setState({left: value,})
    });
  },
  getInitialState: function() {
    return {
      left:0,//changed when move & release
      componentIndex:0,
      hidden:false,
    }
  },
  componentDidMount: function(){
    console.log("did m:%O", this);
  },
  render: function(){
    //genButton([a,b,c,d],left)
    /* onRelease={(close)=>{
       if(close){this.setState({hidden:true})}
       }}*/
    var leftButtons=(
      <SwipeableButtons
          ref="leftButtons"
          direction="left"
          width={this.state.left}
          buttons={[
              <View onRelease={()=> console.log("1")}
                    close={false}
                    backgroundColor='rgb(158, 158, 158)'
                                     >
                <Text style={{margin:10,marginRight:5}}>
                            l1:left</Text>
              </View>,
              <View onRelease={()=> console.log("2")}
                    close={true}
                    backgroundColor='rgb(33,150,243)'
                                     >
                <Text style={[{margin:10},{marginRight:5}]}>
                            l1:left</Text>
                <Text style={{margin:10,marginLeft:0}}>
                            l1:right</Text>
              </View>,
              <View onRelease={()=> console.log("3")}
                    close={true}
                    backgroundColor='rgb(76, 175, 80)'
                                     >
                <Text style={{margin:10,marginRight:5}}>
                            l2:left</Text>
                <Text style={{margin:10,marginLeft:0}}>
                            l2:right</Text>
              </View>,
            ]}
      />);
    //button input color, component, release action
    //close flag is parent props
    var rightButtons=(
      <SwipeableButtons
          ref="rightButtons"
          direction="right"
          width={this.state.left < 0 ? -this.state.left : 0.01}
          buttons={[
              <View onRelease={()=> console.log("r1")}
                    backgroundColor='rgb(158, 158, 158)'
                    close={false}>
                <Text style={{margin:10,marginLeft:5}}>
                            r1:right</Text>
              </View>,
              <View onRelease={()=> console.log("r2")}
                    backgroundColor='#9C27B0'
                    close={true}>
                <Text style={{margin:10,marginRight:0}}>
                            r1:left</Text>
                <Text style={{margin:10,marginLeft:5}}>
                            r1:right</Text>
              </View>,
              <View onRelease={()=> console.log("r3")}
                    backgroundColor='#F44336'
                    close={true}>
                <Text style={{margin:10,marginRight:0}}>
                            r2:left</Text>
                <Text style={{margin:10,marginLeft:5}}>
                            r2:right</Text>
              </View>,
            ]}
      />
    );
    return(
      <AnimatableView
          style={{
              flexDirection:"row",
              height:this.state.hidden ? 0.01 : null,
              width:SWIPEABLE_MAIN_WIDTH,
              justifyContent: 0 < this.state.left ? "flex-start" : "flex-end",
            }}
          {...this._panResponder.panHandlers}
      >
        {leftButtons}
        <View
            style={[{
                flexDirection:"row",
                alignItems:"center",
                justifyContent:"center",
                backgroundColor:"green",
                borderWidth: 2,
              },{
                width: SWIPEABLE_MAIN_WIDTH,
              }]}>
          <Text onPress = {() => {
              //TODO:remove until test horizontal
              this.setState({hidden: true,})
              //console.log(this);
              //this.refs.root.close();
            }}>
              {'main?'}
            </Text>
            <FAIcon name="rocket" size={30}/>
        </View>
        {rightButtons}
      </AnimatableView>
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
