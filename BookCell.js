var React = require('react-native');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');
var Emoji = require('react-native-emoji');
var Swipeout = require('react-native-swipeout');
import { RadioButtons,SegmentedControls } from 'react-native-radio-buttons'

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

var GREY = 0;
var GREEN = 1;
var RED = 2;

var values = [1, 2, 3, 4, 5, 6, 7];

var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

var AnimatedFlick = React.createClass({
  getInitialState: function() {
    return {
      values: values,
      colors: values.map( () => new Animated.Value(GREY) )
    };
  },
  _animateScroll: function(index, e) {
    var threshold = width / 5;
    var x = e.nativeEvent.contentOffset.x;
    var target = null;
    x = x * -1;
    if (x > -50 && this._target != GREY) {
      target = GREY;
    } else if (x < -50 && x > -threshold && this._target != GREEN) {
      target = GREEN;
    } else if (x < -threshold && this._target != RED) {
      target = RED;
    }
    if (target !== null) {
      this._target = target;
      this._targetIndex = index;
      Animated.timing(this.state.colors[index], {
        toValue: target,
        duration: 180,
      }).start();
    }
  },
  takeAction: function() {
    this.setState({
      action: true
    });
  },
  getActionText: function() {
    var actionText = '';
    if (this.state.action) {
      if (this._target == GREEN) {
        actionText = 'Save Action';
      } else if (this._target == RED) {
        actionText = 'Delete Action'
      } else {
        actionText = 'No Action';
      }
      return 'You took "' + actionText + '" on the ' + this._targetIndex + ' row';
    }
    return 'You have not taken an action yet';
  },
  _renderRow: function(value, index) {
    //render cell
    //style=
    var bgColor = this.state.colors[index].interpolate({
      inputRange: [
        GREY,
        GREEN,
        RED
      ],
      outputRange: [
        'rgb(180, 180, 180)', // GREY
        'rgb(63, 236, 35)', // GREEN
        'rgb(233, 19, 19)', // RED
      ],
    });
    return (
      <View
          style={styles.row}
          key={index}
      >
        <AnimatedScrollView
            horizontal={true}
            directionalLockEnabled={true}
            style={[{flex: 1, height: 100}, {backgroundColor: bgColor}]}
            onScroll={this._animateScroll.bind(this, index)}
            scrollEventThrottle={16}
            onMomentumScrollBegin={this.takeAction}
        >
          <Text>{value + "  <----- Slide the row that way and release"}</Text>
          <View style = {{width:100, height:100, backgroundColor:"red"}}/>
        </AnimatedScrollView>
      </View>
    )
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.outerScroll}>
          {this.state.values.map(this._renderRow, this)}
        </ScrollView>
        <Text>{this.getActionText()}</Text>
      </View>
    );
  }
});

var LibraryStatus = React.createClass({
  render: function() {
    var libraryStatus = this.props.libraryStatus || {};

    var text, name, backgroundColor;

    if(libraryStatus.rentable){
      text="貸出可"
      style={backgroundColor: "#03A9F4"} //light blue
    }else if(libraryStatus.exist){
      text="貸出中"
      style={backgroundColor: "#FFC107"} //yellow
    }else if(libraryStatus.exist !== undefined){
      text="なし"
      style={backgroundColor: "#9E9E9E"} //grey
    }else{
      //text="取得中"
    }
    //http://www.google.com/design/spec/style/color.html#color-color-palette
    if(text){
      return (
        <View style = {[styles.rating, styles.row, style]}
        >
          <Text>
            {text}
          </Text>
        </View>
      );
    }else{
      return (
        <View style = {[styles.rating, styles.row]}>
          <Text>
            {"蔵書確認中"}
          </Text>
          <GiftedSpinner />
        </View>
      )
    }
    /*
       <Icon.Button name="facebook" backgroundColor="#3b5998">
       </Icon.Button>
       <Text>
       <Emoji name = "ok"/>
       {text}
       </Text> */

    {/*  <View style = {styles.iconContainer}>
        <Icon name = "building-o" size = {30}
        style={styles.libIcon}/>
        </View>
        <Icon name = "book" size={30} color="#900"/>
        <Icon name = "building" size={30} color="#900"/>
        <Icon name = "archive" size={30} color="#900"/>
        google icon location city
      */}
    {/* <Text style={[styles.ratingValue, getStyleFromScore(criticsScore)]}>
        {getTextFromScore(criticsScore)}
        </Text>
      */}
  },
});

var BookCell = React.createClass({
  render: function(){
    var movie=this.props.movie;
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var swipeoutBtns = [
      {
        text: '読みたい',
        onPress: () => {
          this.props.actions$.addInbox$.onNext(movie);
          console.log("add:%O", movie);
        }
      },
      {
        text: '削除',
        onPress: () => {
          this.props.actions$.removeInbox$.onNext(movie);
          console.log("remove:%O", movie);
        }
      }
    ]
    //conflict with cell action open state & update
    /*
       onPress={(e) => console.log("cell action:%O", e)}
       key="cell"
       close={true}
       onOpen = {(sectionID, rowID) =>
       this.props.handleSwipeout(sectionID, rowID)}
       close={!movie.active}
       // overflow: "hidden" //cannot work with android
     */
    var content = movie.active ? (
      <Swipeout
          selector="swipeout"
          left={swipeoutBtns}
          rowID = {this.props.rowID}
          autoClose={true}
      >
        <TouchableElement
            selector="cell"
            item={movie}
            onPress={(e) => console.log("cell action:%O", e)}
        >
          <TouchableOpacity>
            <Animated.View style = {[styles.row]}>
              <Image
                  source={{uri: movie.thumbnail}}
                  style={[styles.cellImage]}
              />
              <View style={styles.textContainer}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {movie.title}
                </Text>
                <Text style={styles.movieYear} numberOfLines={1}>
                  {movie.author}
                </Text>
                <LibraryStatus libraryStatus={movie.libraryStatus}/>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </TouchableElement>
      </Swipeout>
    ) : <View style={{backgroundColor: "white"}}/>
      //return(<AnimatedFlick/>)}
  var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
  /* return(
     <CycleView>
     {content}
     </CycleView>
     ) */
  return(
    <SwipeableElement
        component={<Text>{'Some Text'}</Text>}
        swipeRightTitle={'Delete'}
        swipeRightTextColor={'#FFFFFF'}
        swipeRightBackgroundColor={'#000000'}
        swipeLeftTitle={'Archive'}
        swipeLeftTextColor={'#FFFFFF'}
        swipeLeftBackgroundColor={'#FF0000'}
        onSwipeRight={() => {
            // Handle swipe
          }}
        onSwipeLeft={() => {
            // Swipe left
          }} />
  )
}, //collapsable={false}
    //onPress = {() => console.log("pressed")}

//},
                                 /* _animateScroll: function(index,e) {
                                    var threshold = width / 5;
                                    var x = e.nativeEvent.contentOffset.x;
                                    var target = null;
                                    x = x * -1;
                                    if (x > -50 && this._target != GREY) {
                                    target = GREY;
                                    } else if (x < -50 && x > -threshold && this._target != GREEN) {
                                    target = GREEN;
                                    } else if (x < -threshold && this._target != RED) {
                                    target = RED;
                                    }
                                    if (target !== null) {
                                    this._target = target;
                                    this._targetIndex = index;
                                    Animated.timing(this.state.colors[index], {
                                    toValue: target,
                                    duration: 180,
                                    }).start();
                                    }
                                    } */
  /* onPanResponderTerminationRequest={ () => false} */
});

var Dimensions = require('Dimensions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

var SWIPE_RELEASE_POINT = 70;
//var PureRenderMixin = require('react-addons-pure-render-mixin');

var SwipeableElement = React.createClass({
  //mixins: [PureRenderMixin],
  _panResponder: {},
  _previousLeft: 0,

  /* getStatus: function(PosX) {
     if(PosX < -1 * this.rightButtonWidth - styles.swipeableMain){
     return "releasedLeft"
     }else if(
     (-1 * this.rightButtonWidth - styles.swipeableMain < PosX) &&
     (PosX < -1 * this.rightButtonWidth - styles.swipeableMain/2)
     )else if(
     (-1 * this.rightButtonWidth - styles.swipeableMain/2) &&
     (PosX < -1 * this.rightButtonWidth){
     //this.setState({status:"rightOpen"})
     //this._animateRightButtonFlex.setValue(0);//fixed
     }else if(
     (-1 * this.rightButtonWidth < PosX) &&
     (PosX < this.leftButtonWidth)){
     //this.setState({status:"flat"})
     //this._animateRightButtonFlex.setValue(1);
     }else if(this.leftButtonWidth < PosX){
     //this.setState({status:"leftOpen"})
     }
     } */

  componentWillMount: function() {
    this._animatedValue = new Animated.ValueXY();
    this._value = {x: 0, y: 0};
    console.log("wiw:%O", styles);

    this._animateRightButtonsWidth = new Animated.Value(0);
    this._animateRightButtonFlex = new Animated.Value(0);
    this._animateRightButtonEndFlex = new Animated.Value(0);

    this._animateLeftButtonsWidth = new Animated.Value(0);
    this._animateLeftButtonFlex = new Animated.Value(0);
    this._animateLeftButtonEndFlex = new Animated.Value(0);

    this._animateMainLeft = new Animated.Value(0);

    this._animateRightButtonFlex.addListener((value) => {
      console.log("animateRightButtonFlex:%O", value);
    });

    this._animateLeftButtonsWidth.addListener((value) => {
      console.log("animateLeftButtonsWidth:%O", value);
    })

    this._animatedValue.addListener((value) => {
      this._value = value
      console.log("v:%O", value);

      Animated.timing(
        this._animateMainLeft,{
          duration:0,
          toValue:
          this._animatedValue.x
              .interpolate({
                inputRange:[
                 -1 * this.rightButtonWidth,
                  0,
                  this.leftButtonWidth
                ],
                outputRange:[
                  -1 * this.rightButtonWidth,
                  0,
                  0
                  //0,this.leftButtonWidth/2
                ]
              })
        }).start();

      //not needed ?
      Animated.timing(
        this._animateRightButtonsWidth,{
          duration:0,
          toValue:
          this._animatedValue.x
              .interpolate({
                inputRange:[
                  //-1 * this.rightButtonWidth - 1,
                 -1 * this.rightButtonWidth,
                  0
                ],
                outputRange:[
                  // this.rightButtonWidth,
                  this.rightButtonWidth,
                  0,
                ]
              })
        }).start();

      Animated.timing(
        this._animateRightButtonFlex,{
          duration:0,
          toValue:
          this._animatedValue.x
              .interpolate({
                inputRange:[
                       -1 * SWIPEABLE_MAIN_WIDTH,
      -1 * SWIPEABLE_MAIN_WIDTH,
       -1 * this.rightButtonWidth,
                  0
                ],
                outputRange:[
                  // this.rightButtonWidth,
                  0.1,
                  0.1,
                  this.rightButtonWidth,
                  this.rightButtonWidth,
                ]
              })
        }).start();
      Animated.timing(
        this._animateRightButtonEndFlex,{
          duration:0,
          toValue:
          this._animatedValue.x
              .interpolate({
                inputRange:[
               -1 * SWIPEABLE_MAIN_WIDTH,
               -1 * this.rightButtonWidth,
                  0
                ],
                outputRange:[
                  // this.rightButtonWidth,
                  SWIPEABLE_MAIN_WIDTH,
                  this.rightButtonWidth,
                  this.rightButtonWidth,
                ]
              })
        }).start();

      //not needed
      Animated.timing(
        this._animateLeftButtonsWidth,{
          duration:0,
          toValue:
          this._animatedValue.x
              .interpolate({
                inputRange:[
                  0,
                  0.1,
                  this.leftButtonWidth,
                ],
                outputRange:[
                  0.1,
                  0.1,
                  this.leftButtonWidth,
                ]
              })
        }).start();

      Animated.timing(
        this._animateLeftButtonFlex,{
          duration:0,
          toValue:
          this._animatedValue.x
              .interpolate({
                inputRange:[
                  0,
                  this.leftButtonWidth,
                  this.leftButtonWidth +
                  (SWIPEABLE_MAIN_WIDTH - this.leftButtonWidth)/2,
                  SWIPEABLE_MAIN_WIDTH,
                ],
                outputRange:[
                  // this.rightButtonWidth,
                  0,
                  this.leftButtonWidth,
                  this.leftButtonWidth,
                  SWIPEABLE_MAIN_WIDTH,
                ]
              })
        }).start();
      /* inputRange:[
         -1 * this.rightButtonWidth -
         styles.swipeableMain,
         -1 * this.rightButtonWidth -
         styles.swipeableMain / 2,
         -1 * this.rightButtonWidth,
         0
         ],
         outputRange:[
         1,
         0,//fixed
         0,//fixed
         1,
         ] */

      /*  */
    });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      //onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderGrant: () => {
        this._animatedValue.setOffset({x: this._value.x,
                                       y: this._value.y});
        this._animatedValue.setValue({x: 0, y: 0});
      },
      //onPanResponderMove: this._handlePanResponderMove,
      onPanResponderMove: Animated.event([
          null,
        {dx: this._animatedValue.x, dy: this._animatedValue.y}
        ]),
      //onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderRelease: (e,gestureState) =>{
        this._animatedValue.flattenOffset();
      },
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 0;
  },

  _handleStartShouldSetPanResponder: function() {
    return true;
  },

  _handleMoveShouldSetPanResponder: function() {
    return true;
  },

  _handlePanResponderGrant: function() {},

  _handlePanResponderMove: function(e, gestureState) {
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    posLeft = this._previousLeft + gestureState.dx
    this._updatePosition(posLeft)
    //this.setState({ dx });//this.state.dx
  },
  _updatePosition: function(posLeft){
    var leftWidth  = 0 < posLeft ? posLeft : 0.00001
    var rightWidth = 0 < posLeft ? 0.00001 : -1 * posLeft

    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.refs.leftElement &&
    this.refs.leftElement.setNativeProps(
      {style:{width: leftWidth }});
    this.refs.mainElement &&
    this.refs.mainElement.setNativeProps(
      {style:{left: posLeft - leftWidth}});
    //close enable
    console.log("riele:%O",this.refs.rightElement)
    this.refs.rightElement &&
    this.refs.rightElement.setNativeProps(
      {style:{width: rightWidth,
              left: posLeft - leftWidth}});
    this._setStatus(posLeft)
  },
  getInitialState: function() {
    return {
      //"leftOpen" , "leftRelease", "flat",
      //"rightOpen", "rightRelease"
    };
  },
  _setStatus: function(posLeft){
    if(posLeft < -1 * this.rightButtonWidth){
      //this.setState({status:"rightOpen"})
      //React.Children.forEach(this.refs.rightElement.props.children,         (elem) => {
      //})
        //https://github.com/facebook/react-native/blob/0293def7a9898f25699dcb2685aff2c5cecf152d/Libraries/Components/Touchable/TouchableOpacity.js
    }else if((-1 * this.rightButtonWidth < posLeft) && (posLeft < this.leftButtonWidth)){
      //this.setState({status:"flat"})

    }else if(this.leftButtonWidth < posLeft){
      //this.setState({status:"leftOpen"})
    }
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object)
  {
    posLeft = this._previousLeft + gestureState.dx;
    var newPos;
    if(posLeft < -1 * this.rightButtonWidth / 2){
      newPos =  -1 * this.rightButtonWidth;//right button size
    }else if((-1 * this.rightButtonWidth / 2 < posLeft) && (posLeft < this.leftButtonWidth / 2)){
      newPos = 0;//flat
    }else if(this.leftButtonWidth / 2 < posLeft){
      newPos = this.leftButtonWidth;//left button size
      //newPos = 150;//left button size
    }else{
      newPos = 100;
    }
    console.log("pos:%O",newPos)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this._updatePosition(newPos);
    this._previousLeft = newPos;
    // Reset the left/right values after the animation finishes
    // This feels hacky and I hope there's a better way to do this
    setTimeout(() => {
      //this.refs.leftElement && this.refs.leftElement.setNativeProps({style: { left: null }});
      //this.refs.rightElement && this.refs.rightElement.setNativeProps({style: { right: null }});
    }, 300);
  },
  //http://browniefed.com/react-native-animation-book/events/SCROLL.html
  //http://browniefed.com/blog/2015/08/15/react-native-animated-api-with-panresponder/
  //interface datasource & renderbutton(include default)
  leftButtonWidth: null,
  rightButtonWidth: null,
  render: function() {
    var pullOrRelease = 'Release'
    console.log("refs:%O:",this.refs);
    //TODO:support different length text
    var rightElementStyle;
    var leftElementStyle;
    switch(this.state.status){
      case "rightOpen":
        rightElementStyle = {flex:null}
        break;
      case "flat":
        rightElementStyle = {flex:1}
        break;
    }
    //flex: this._animateRightButtonFlex
    //flex: 0
    var rightButton = (
      <Animated.View
             ref = {'rightElement'}
             style = {[styles.swipeableRight,
                       {left: this._animatedValue.x,
                        width: this._animateRightButtonsWidth,
                        //flex:1,
                        //width:10
                       }]}
             onLayout= {({ nativeEvent: { layout: { width, height } } }) =>
               {
                 if(!this.rightButtonWidth){
                   this.rightButtonWidth = width;
                   console.log("rightButtonWidth:%O:",width);//124
                 }}}
      >
      <Animated.View style = {{
          flex:this._animateRightButtonFlex
          //width:
        }}>
        <Animated.Text ref={'rightText'}
                       numberOfLines={1}
              style={[styles.rightText,
                      {backgroundColor:"red",
                       //width: 20, //exception
                       //flex:1
                      }]}>
          foo
        </Animated.Text>
      </Animated.View>
      <Animated.View style = {{
          flex:this._animateRightButtonFlex
          //width:
          }}>
        <Animated.Text ref={'rightText'}
                       numberOfLines={1}
                       style =
                       {[styles.rightText,
                         {backgroundColor:"green",
                          //flex: this._animateRightButtonFlex
                          }]}>
          bar
        </Animated.Text>
      </Animated.View>
      <Animated.View style = {{
          flex:this._animateRightButtonEndFlex
          //width:
        }}>
        <Animated.Text ref={'rightText'}
                       numberOfLines={1}
              style =
              {[styles.rightText,
                {backgroundColor:"blue",
                 //flex: this._animateRightButtonEndFlex
                }
               ]}>
          baz
        </Animated.Text>
      </Animated.View>
        </Animated.View>
    )
      //this._animateLeftButtonsWidth,
    return (
      <View style = {{justifyContent:"center",
                      flexDirection:'row'}}>
      <View style={styles.swipeableElementWrapper}>
        <Animated.View ref = {'leftElement'}
              style = {[styles.swipeableLeft,
                        {width: this._animateLeftButtonsWidth,
                         backgroundColor:"yellow"}
                ]}
              onLayout= {({ nativeEvent: { layout: { width, height } } }) =>
                {
                  if(!this.leftButtonWidth){
                    this.leftButtonWidth = width;
                    console.log("www1:%O:",width);
                  }}
                }
        >
          <Animated.View style = {{
              flex:1
              //this._animateLeftButtonFlex
            }}>
            <Animated.Text ref = {'leftText'}
                           numberOfLines={1}
                           style = {[styles.leftText,
                                     {
                                       backgroundColor:"black"
                                     }]}>
              {pullOrRelease} to {this.props.swipeRightTitle}
            </Animated.Text>
          </Animated.View>
          <Animated.View style = {{
              flex:1
              //this._animateLeftButtonFlex
            }}>
            <Animated.Text ref = {'leftText'}
                           numberOfLines={1}
                           style = {[styles.leftText,
                                     {
                                       backgroundColor:"orange"
                                     }]}>
              bar
            </Animated.Text>
          </Animated.View>
          </Animated.View>
          <Animated.View
             ref={'mainElement'}
             style={[styles.swipeableMain,
                     {left:
                      //this._animatedValue.x,
                      this._animateMainLeft
                      /* Animated.add(
                      this._animateLeftButtonsWidth) */
                     }
                             //to use negative value
               ]}
                         {...this._panResponder.panHandlers}>
          {this.props.component}
          </Animated.View>
          {rightButton}
      </View>
      </View>
    );
    //Animated.multiply(,new Animated.Value(0.5))
    /* {left:
       Animated.multiply(
       this._animatedValue.x,
       new Animated.Value(0.5))
       } */
  }
});
var SWIPEABLE_MAIN_WIDTH = 150
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
    padding: 5,
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
  swipeableElementWrapper: {
    //width: SCREEN_WIDTH,
    width: SCREEN_WIDTH - 50,
    flexDirection:'row',
    //alignItems:'stretch'
    //justifyContent:'center',//not to affected by left button string change
  },
  swipeableMain: {
    //width: SCREEN_WIDTH,
    width: SWIPEABLE_MAIN_WIDTH,
    //left:40,
    backgroundColor: 'gray',
  },
  swipeableLeft: {
    //overflow: 'hidden',
    //width: 100,
    //width: 0.1,
    //flex:1,
    //backgroundColor: 'black',
    flexDirection:'row',
    justifyContent:'flex-start',//horizontal
  },
  leftText: {
    color:'#FFFFFF',
    //padding:10,
    //margin:10,
    //justifyContent:'center',
    //alignSelf:'center',
  },
  swipeableRight: {
    //overflow: 'hidden',
    overflow: 'visible',
    //flex:1,
    //width: 100,
    flexDirection:'row',
    justifyContent:'flex-end',
    //flex:1,
    //alignItems: 'flex-end',
    //backgroundColor: 'blue',
  },
  rightText: {
    //overflow: 'hidden',
    //overflow: 'visible',
    color:'#FFFFFF',
    padding:10,
    //flex:1
    //biblio
    //flex:1,
    //flex:null,
    //https://github.com/facebook/react-native/issues/364
    //width: '100%'
    //padding:10,
  }
});

module.exports = {AnimatedFlick,BookCell};
