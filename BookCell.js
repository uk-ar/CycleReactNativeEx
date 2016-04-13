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
    return { contentWidth:  0,
             contentHeight: 0,}
  },
  _onLayout({nativeEvent:{layout:{width, height}}}){
    if(!this.state.contentWidth){
      this.setState({contentWidth:width,
                     contentHeight:height});
      this.props.onFirstLayout &&
      this.props.onFirstLayout(
        {nativeEvent:{layout:{width, height}}});
    }
  },
  //cannot measure Animated.View
  //hide(opacity:0) until measure
  render() {
    return (
      //TODO:...this.props
      <Animated.View {...this.props}
                     style={[/* this.props.flexEnabled &&
                                {flex: this.state.contentWidth}, */
                         this.props.style]}
                     onLayout={this._onLayout}
      >
        {this.props.children}
      </Animated.View>
    )
  }
});

var BookCell = React.createClass({
  render: function(){
    var movie=this.props.movie;
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
  return(
    <SwipeableRow
        rightButtonSource ={[
          //{text: "long long long", backgroundColor: "blue"},
          {text: "foo", backgroundColor: "red"},
          {text: "ba", backgroundColor: "green"},
          {text: "b", backgroundColor: "blue", type:"de"},
          ]}
        leftButtonSource = {[
            //{text: "Some Text", backgroundColor: "black"},
            {text: "foo", backgroundColor: "black"},
            {text: "bar", backgroundColor: "orange",type:"destructive"},
          ]}
        style={{
            backgroundColor:"pink",
            //padding:10,//not work
            //margin:10,
          }}
    >
      <View style={{flexDirection:"row",
                    alignItems:"center",//vertical
                    padding:10,
                    justifyContent:"flex-end"
        }}>
        <FAIcon name="rocket" color="white"
        style={{
            backgroundColor:"green",
            marginRight:10,
            width:10,
            textAlign:"right"
          }}/>
        <Text style={{
            //backgroundColor:"red",
            paddingHorizontal:10,
            flex:1,
            //width:0,
          }}
              numberOfLines={1}
        >
          {'Some Other Text'}
        </Text>
      </View>
    </SwipeableRow>
  )
}, //collapsable={false}
});
var SwipeableButton = React.createClass({
  render(){
    return(
      //style={{mergin:10}}
      <View style={{flexDirection: 'row',
                    alignItems: "center",//vertical
                    padding:10,
                    justifyContent:"flex-end",
        }}>
        <FAIcon name = "rocket" color = "white" style ={{
            //color container(icon & text) vs width container(text only)
            //try setNativeProps(AnimatedValue)
            marginRight:10,
            //fixed width & flex cannot work correctory for justifyContent
            //width:30
            //backgroundColor:"green",
          }}/>
        <View style={{flexDirection: 'row',
                      justifyContent:"flex-end",
          }}>

          <Animated.Text numberOfLines = {1} style = {{
              //mergin:10,
              //backgroundColor:"red",
              //paddingHorizontal:10,
              //flex:1,
              //overflow:"hidden"
            }}>
            {this.props.text}
          </Animated.Text>
          <View style={{flexDirection: 'row',
                        justifyContent:"flex-end",
            }}>

            <View style = {{
                backgroundColor:"red",
                flex:1,
                padding:10,
              }}>
            </View>
          </View>
        </View>
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
    return { text:<SwipeableButton text="foo" /> }
  },
  componentWillMount: function() {
    this.height = new Animated.Value(0);

    this._panX = new Animated.Value(0);
    //https://www.google.com/design/spec/style/color.html#color-color-palette
    //http://www.kitaq.net/lib/rgb/16to10.cgi
    var blue=(<SwipeableButton text="blue" />);
    var green = (<SwipeableButton text = "green" />);
    var grey = (<SwipeableButton text = "grey" />);
      //string or component
    var leftButtonSource = [
      {text: grey, backgroundColor: 'rgb(158, 158, 158)'},
      {text: blue, backgroundColor: 'rgb(33,150,243)'},
      {text: green, backgroundColor: 'rgb(76, 175, 80)'},
    ]
    //http://rochefort.hatenablog.com/entry/2015/01/08/005043
    this._animatedColor = new Animated.Value(0);
    this.leftBackGroundColor = this._animatedColor.interpolate({
      inputRange: _.range(leftButtonSource.length),//Cannot use ES6 method e.g.Array.from(Array(3).keys())
      outputRange: leftButtonSource.map((elem) => elem.backgroundColor),
    });
    this._panX.addListener(({value:value}) => {
      //this.leftBackGroundColor = new Animated.Value('rgb(233, 19, 19)');//ok
      //Not working
      /* Animated.timing(this.leftBackGroundColor, {
         toValue: 'rgb(0, 0, 255)',//blue
         duration: 30,
         }).start(); */
      //https://github.com/facebook/react-native/issues/2072#issuecomment-123778910
      var threshold = SWIPEABLE_MAIN_WIDTH / leftButtonSource.length
      var nextColor = Math.abs(Math.floor(value / threshold));
      var nextText = null;

      if (this.state.text !== leftButtonSource[nextColor].text){
        nextText = leftButtonSource[nextColor].text;
      }
      if (nextText !== null) {
        Animated.timing(this._animatedColor, {
          toValue: nextColor,
          duration: 180,
        }).start();
        this.setState({text:nextText})//It's hard to change opacity
      }
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
      <Animated.View style = {
        {backgroundColor: this.leftBackGroundColor,
         width: this._panX <= 0 ? 0.01 : this._panX,
         //padding:10,
         height:this.height,
        }}
      >
            {this.state.text}
      </Animated.View>);

    return(
      //{height: this._height},
      <MeasurableView style={
        [{
          //width: SCREEN_WIDTH,
          width: SWIPEABLE_MAIN_WIDTH,
          flexDirection:'row',
          backgroundColor:'yellow',
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
        {leftButtons}
        <Animated.View
      ref={'mainElement'}
      style={[
        {
          //width: SCREEN_WIDTH,
          width: SWIPEABLE_MAIN_WIDTH,
          //backgroundColor: 'gray',
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

              this.props.style,
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
    backgroundColor: 'white',
  },
  //for cell
  row: {
    //alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  segmented:{
    flex: 1,
    backgroundColor: 'black',
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
    backgroundColor: '#CCCCCC',
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
