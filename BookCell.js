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
});

var Dimensions = require('Dimensions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var SWIPEABLE_MAIN_WIDTH = 300;

var SwipeableElement = React.createClass({
  _panResponder: {},
  _previousLeft: 0,

  componentWillMount: function() {
    this._animatedValue = new Animated.Value(0);
    this._value = 0;

    //used by right width
    this._animateRightButtonsWidth = new Animated.Value(0);
    //used by left width
    this._animateLeftButtonsWidth = new Animated.Value(0);
    //used by main left
    this._animateMainLeft = new Animated.Value(0);

    this._animatedValue.addListener(({value:value}) => {
      console.log("v:%O", value);
      this._value = value;

      var leftWidth  = 0 < value ? value : 0.00001 //limit min value
      var rightWidth = 0 < value ? 0.00001 : - value //invert value
      var mainLeft = 0 < value ? 0 : value //limit max value

      this._animateMainLeft.setValue(mainLeft);
      this._animateLeftButtonsWidth.setValue(leftWidth);
      this._animateRightButtonsWidth.setValue(rightWidth);
      });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this._animatedValue.setOffset(this._value);
        this._animatedValue.setValue(0);
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: this._animatedValue}
      ]),
      onPanResponderRelease: (e,gestureState) =>{
        this._animatedValue.flattenOffset();
        //this._updatePosition(gestureState.dx + this._value)
      },
      //onPanResponderTerminate: this._handlePanResponderEnd,
    });
    //this._previousLeft = 0;
  },
  _updatePosition: function(posLeft){

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

    var rightButton = (
      <Animated.View
             ref = {'rightElement'}
             style = {[styles.swipeableRight,
                       {
                         left: this._animateMainLeft,
                         width: this._animateRightButtonsWidth,
                       }]}
             onLayout= {({ nativeEvent: { layout: { width, height } } })=>
                   {if(!this.rightButtonWidth){
                       this.rightButtonWidth = width;
                       console.log("rightButtonWidth:%O:",width);//124
                   }}}
      >
        <Animated.View style = {{backgroundColor:"red",
                               padding:10,
                               }}>
          <Animated.Text ref={'rightText'}
                         numberOfLines={1}
                         style={[styles.rightText,
                                 ]}>
            foo
          </Animated.Text>
        </Animated.View>
        <Animated.View style = {{backgroundColor:"green",
                               padding:10,
                               }}>
          <Animated.Text ref={'rightText'}
                         numberOfLines={1}
                         style =
                         {[styles.rightText,
                           ]}>
            bar
          </Animated.Text>
        </Animated.View>
        <Animated.View style = {{backgroundColor:"blue",
                                 padding:10,
                                 flex:1
                               }}>
          <Animated.Text ref={'rightText'}
                         numberOfLines={1}
                         style =
                         {[styles.rightText,
                           ]}>
            baz
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    )

      return (
        <View style = {{justifyContent:"center",
                        flexDirection:'row'}}>
          <View style={styles.swipeableElementWrapper}
                {...this._panResponder.panHandlers}>
            <Animated.View
                ref = {'leftElement'}
                style = {[styles.swipeableLeft,
                          {
                            width:this._animateLeftButtonsWidth
                          }
                  ]}
                onLayout= {({nativeEvent:{layout:{width,height}}}) =>
                             {
                               if(!this.leftButtonWidth){
                                 this.leftButtonWidth = width;
                                 console.log("www1:%O:",width);
                               }}}
            >
              <Animated.View style = {{padding:10,
                                       backgroundColor:"black",
                }}>
                <Text ref = {'leftText'}
                               style = {[styles.leftText,
                                         ]}>
                  {pullOrRelease} to {this.props.swipeRightTitle}
                </Text>
              </Animated.View>
              <Animated.View style = {{padding:10,
                                       backgroundColor:"orange",
                                       }}>
                <Animated.Text ref = {'leftText'}
                               numberOfLines={1}
                               style = {[styles.leftText,
                                         ]}>
                  bar
                </Animated.Text>
              </Animated.View>
            </Animated.View>
            <Animated.View
             ref={'mainElement'}
             style={[styles.swipeableMain,
                     {left: this._animateMainLeft}
                     /*{left:
                     //this._animatedValue.x,
                        this._animateMainLeft
                     /* Animated.add(
                     this._animateLeftButtonsWidth)
                     */
                 //to use negative value
               ]}
             >
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
    //backgroundColor:"yellow"
    //alignItems:'stretch'
    //justifyContent:'center',//not to affected by left button string change
  },
  swipeableMain: {
    //width: SCREEN_WIDTH,
    width: SWIPEABLE_MAIN_WIDTH,
    backgroundColor: 'gray',
    padding:10,
  },
  swipeableLeft: {
    flexDirection:'row',
    //alignItems:'stretch',
    //justifyContent:'flex-start',//horizontal
  },
  leftText: {
    color:'#FFFFFF',
    //textAlign:'center',
  },
  swipeableRight: {
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  rightText: {
    color:'#FFFFFF',
    //textAlign:'center',
    //biblio
  }
});

module.exports = {BookCell};
