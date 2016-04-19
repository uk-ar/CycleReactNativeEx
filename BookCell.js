var React = require('react-native');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');
var Emoji = require('react-native-emoji');
var Swipeout = require('react-native-swipeout');
import { RadioButtons,SegmentedControls } from 'react-native-radio-buttons'
var _ = require('lodash');

var {
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
} = React;

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

//variable for debug layout
var SWIPEABLE_MAIN_WIDTH = 200;
//var SWIPEABLE_MAIN_WIDTH = SCREEN_WIDTH;

var MeasurableView = React.createClass({
  getInitialState() {
    //TODO:remove contentWidth
    return { contentWidth:  0,
             contentHeight: 0,
             //measured: false,
    }
  },
  _onLayout({nativeEvent:{layout:{x, y, width, height}}}){
    if(!this.state.contentWidth){
      this.setState({contentWidth:width,
                     contentHeight:height,
                     //measured:true,
      });
      this.props.onFirstLayout &&
      this.props.onFirstLayout(
        {nativeEvent:{layout:{x, y, width, height}}});
    }
    this.props.onLayout &&
    this.props.onLayout(
      {nativeEvent:{layout:{x, y, width, height}}});
  },
  //cannot measure Animated.View
  //hide(opacity:0) until measure is not mean because measure time is not large
  render() {
    return (
      //TODO:...this.props
      <Animated.View {...this.props}
                     style={[/* this.props.flexEnabled &&
                                {flex: this.state.contentWidth}, */
                         //this.state.measured ? null : {opacity:0},
                         this.props.style]}
                     onLayout={this._onLayout}
      >
        {this.props.children}
      </Animated.View>
    )
  }
});

//Expandable
//render with original width then
//shrink to given width
//set call back

var Expandable = React.createClass({
  getInitialState(){
    return{
      end:2,
      style:[this.props.style,{width:null}],
    }
  },
  render: function(){
    var components=[
      <View style={{flexDirection:"row"}}>
        <View style={{flex:1}}/><Text>1</Text></View>,
      <View><Text>2</Text></View>,
    ]
    console.log("render expandable");
    return(
      //this.props.style
      <MeasurableView
      ref="root"
      style={this.state.style}
      onFirstLayout={
        ({nativeEvent:{layout:{width, height}}})=>{
          this.original_width = width;
          this.original_height = height;
          this.setState({style:[this.props.style,
                                //{width: 4,
                                {//width: 0.01,
                                 backgroundColor:"pink"}
          ]});//TODO:remove width */
        }}
      onLayout={
        ({nativeEvent:{layout:{width, height}}})=>{
          console.log("ori wid:%O;real wid:%O",this.original_width,width);
          if(width < this.original_width){
            //ok
          }else if(this.original_width < width){
            //ng?
          }
            /* if(!this.previousWidth){
             //setWidth
             this.previousWidth = this.refs.root.contentWidth;
             return;
             }else if(this.props.onExpand &&
             (this.refs.root.contentWidth < this.previousWidth)){
             this.props.onExpand();
             }else if(this.props.onShrink &&
             (this.refs.root.contentWidth > this.previousWidth)){
             this.props.onShrink();
             }
             this.previousWidth = this.refs.root.contentWidth; */
          //console.log("left width:%O",width);
          /* this.setState({style:[this.props.style,
             {width: 0.01}]})//TODO:remove width */
        }
      }
      >
      {components.slice(0,this.state.end)}
      </MeasurableView>
      //components
    )
  }
})

var BookCell = React.createClass({
  /* getInitialState() {
     return {
     _panX: new Animated.Value(0),
     }
     }, */
  componentWillMount: function() {
    //this._panX = new Animated.Value(0.1);
    this._panX = new Animated.Value(1);//OK
    this._previousLeft = 0;

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
        //this._panx.setValue(0);
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
    //console.log("created");
    this._panX.addListener(({value:value}) => {
      //console.log("v:%O",value);
    }
    );
  },
  render: function(){
    var movie=this.props.movie;
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    //console.log("wid?:%O",this._panx <= 0 ? 0.01 : this._panx)
    return(
      <Animated.View style={{
          flexDirection:"row",
          //left:10,
          //width:this._panX,
          //left:this._panX,
        }}
      >
        <Expandable style={{
            width:this._panX,
            flexDirection:"row",            
            justifyContent:"flex-end",
          }}/>
        {/* expandable */}
        {/* <MeasurableView style={{
        //width:5,
        //width: this._panx <= 0 ? 0.01 : this._panx,//cannot compare animatedvalue
        //width:this._panx,
        //width:0.01,
        //flex:1,
        flexDirection:"row",
        justifyContent:"flex-end",
        //to flex-start
        }}
        onFirstLayout={({nativeEvent:
        {layout:{width, height}}})=>
        {console.log("left width:%O",width)}
        //20.33333396911621
        }
        >
        <Text 
            style={{
                  //width:3,
                  //numberOfLines={1}
                  }}>
          left
        </Text>
        </MeasurableView> */}
        <Animated.View
            style={{
                  backgroundColor:"transparent",
                  opacity:0.5,
                  //left:10,
                  }}
            {...this._panResponder.panHandlers}
        >
        <Text style={{
            //backgroundColor:"red",
            backgroundColor:"transparent",
            borderWidth: 2,
            paddingHorizontal:10,
            flex:1,
            //width:0,
          }}
              numberOfLines={1}
              
        >
          {'main?'}
        </Text>
        </Animated.View>
      </Animated.View>
  )
}, //collapsable={false}
});

//TODO:remove
var SwipeableButton = React.createClass({
  render(){
    return(
      //style={{mergin:10}}
      <View style={{flexDirection: 'row',
                    alignItems: "center",//vertical
                    padding:10,
                    justifyContent:"flex-end",
        }}>
          <Animated.Text numberOfLines = {1} style = {{
              //mergin:10,
              //backgroundColor:"red",
              //paddingHorizontal:10,
              //flex:1,
              //overflow:"hidden"
              //marginLeft:10,
              //position:"absolute"
            }}
                         onLayout={({nativeEvent:
                                     {layout:{x,y,width, height}}})=>{
                                       console.log("text:%O",x);
                                     }}
          >
            {this.props.text}
          </Animated.Text>
          <View style={{flex:1}} />
          <FAIcon name = "rocket" color = "white" style ={{
              //color container(icon & text) vs width container(text only)
              //try setNativeProps(AnimatedValue)
              //marginHorizontal:10,
              //margin:10,
              //fixed width & flex cannot work correctory for justifyContent
              //width:30
              //backgroundColor:"green",
              //position:"absolute",
            }}
                  onLayout={({nativeEvent:
                              {layout:{x,y,width, height}}})=>{
                                //console.log("icon:%O",x);
                              }}
          />
          {/* <View style = {{
          backgroundColor:"red",
          flex:1,
          padding:10,
          }}>
          </View> */}
      </View>
    )
      //pass panx as props?
      /* <View style={{flex:1}}>
         </View> */
  }
})

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
          //width: SCREEN_WIDTH,
          width: SWIPEABLE_MAIN_WIDTH,
          //backgroundColor: 'gray',
          borderWidth: 2,
          //height:70,
          //padding:1,
        },
              {/*
               left: this._panX,
               position:"absolute",
               */
              },
              /*overflow:"visible",
              flexDirection: "row",
              //padding: 10,
                 alignItems: "center",
                 } */

        //this.props.style,
              //this._animatedValue
              //to use negative value
        ]}
      {...this._panResponder.panHandlers}
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
