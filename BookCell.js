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
    return { measured: false }
  },
  _onLayout({nativeEvent:{layout:{x, y, width, height}}}){
    if(!this.state.measured){
      this.setState({measured:true,});
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
                     style={[
                       this.props.style,
                       this.state.measured ? null :
                       {width:null, height:null},
                     ]}
                     onLayout={this._onLayout}
      >
        {this.props.children}
      </Animated.View>
    )
  }
});

var BookCell = React.createClass({
  componentWillMount: function() {
    //this._panX = new Animated.Value(0.1);//NG for frex-end.OK for flex-start
    //this._panX = new Animated.Value(-30);//OK
    this._panX = new Animated.Value(0);//?
    //this._previousLeft = 0;

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        //this._panX.setOffset(this._previousLeft);
        //this._panX.setValue(0);
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this._panX}
      ]),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        //this._previousLeft += gestureState.dx;
        Animated.timing(
          this._panX,
          {toValue: this.ReleaseTo ,
           duration: 180,}
        ).start();
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
    this.colorIndex = new Animated.Value(0);
  },
  getInitialState: function() {
    return {
      left:0,
    }
  },
  componentDidMount: function(){
    console.log("did m");
  },
  render: function(){//left is like argument
    //console.log("render:%O",this);
    var nextColorIndex = 0;
    var colors = [
      'rgb(158, 158, 158)',//grey
      'rgb(33,150,243)',//blue
      'rgb(76, 175, 80)',//green
    ];
    //left
    if ((0 <= this.state.left) &&
        (this.state.left < this.leftWidth)){
          nextColorIndex=0;
          this.ReleaseTo=0;
    }else if(( this.leftWidth <= this.state.left) &&
             ( this.state.left < SWIPEABLE_MAIN_WIDTH/2 )){
               nextColorIndex=1;
               this.ReleaseTo=SWIPEABLE_MAIN_WIDTH;
    }else if( SWIPEABLE_MAIN_WIDTH/2 <= this.state.left ){
      nextColorIndex=2;
      this.ReleaseTo=SWIPEABLE_MAIN_WIDTH;
    }
    //right
    Animated.timing(
      this.colorIndex,
      {toValue: nextColorIndex,//interpolate?
       //https://facebook.github.io/react-native/docs/animations.html
       duration: 90,}
    ).start();

    return(
      <Animated.View style={{
          flexDirection:"row",
        }}
                     {...this._panResponder.panHandlers}
      >
        <MeasurableView
            style={{
                flexDirection:"row",
                //backgroundColor:this.backgroundColor,
                backgroundColor:this.colorIndex.interpolate({
                  //Cannot use ES6 method e.g.Array.from(Array(3).keys())
                  inputRange: _.range(colors.length),
                  outputRange: colors,
                }),
                width:this.state.left,
                justifyContent:(this.leftWidth < this.state.left) ?
                "flex-start": "flex-end",
              }}
            onFirstLayout={
              ({nativeEvent:{layout:{width, height}}})=>{
                this.leftWidth = width;
              }}
        >
          <Animated.Text
              style={{
                  color:"yellow",
                }}>
            l:left
          </Animated.Text>
          <Animated.Text
              style={{
                  position:"absolute",
                  color:"yellow",
                }}>
            l:right
          </Animated.Text>
        </MeasurableView>
        <MeasurableView
            style={{
                position:"absolute",
                flexDirection:"row",
                right:0,
                width:-1 * this.state.left,
                //left:this.state.left,
                backgroundColor:"orange",
                justifyContent:(this.rightWidth < -1 * this.state.left) ?
                "flex-end":"flex-start",
              }}
            onFirstLayout={
              ({nativeEvent:{layout:{width, height}}})=>{
                this.rightWidth = width;
              }}
        >
          {
            (this.rightWidth < -1 * this.state.left) ?
            <Animated.Text
          style={{
              color:"yellow",
            }}>
              r:left
            </Animated.Text> : null
          }
            <Animated.Text
          style={{
              color:"yellow",
            }}>
              r:right
            </Animated.Text>
        </MeasurableView>
        <Animated.View
            style={{
                backgroundColor:"blue",
                position:"absolute",
                left:this.state.left,
                borderWidth: 2,
              }}>
          <Text style={{
              width: SWIPEABLE_MAIN_WIDTH,
            }}
                numberOfLines={1}

          >
            {'main?'}
          </Text>
        </Animated.View>
      </Animated.View>
  )
},
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
