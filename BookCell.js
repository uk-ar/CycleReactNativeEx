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

var SwipeableElement = React.createClass({

  _panResponder: {},

  _handleStartShouldSetPanResponder: function() {
    return true;
  },

  _handleMoveShouldSetPanResponder: function() {
    return true;
  },

  _handlePanResponderGrant: function() {},

  _handlePanResponderMove: function(e, gestureState) {
    if (!this.refs.mainElement) {
      return;
    }

    var dx;
    var direction = gestureState.dx > 0 ? 'right' : 'left';
    if (gestureState.dx < -150) {
      dx = -150;
    } else if (gestureState.dx > 150) {
      dx = 150;
    } else {
      dx = gestureState.dx;
    }

    var absdx = dx > 0 ? dx : -dx;
    var opacity = (absdx / SWIPE_RELEASE_POINT) * 1;
    var fontSize = 6 + ((opacity > 1 ? 1 : opacity) * 8);
    var paddingTop = 15 - ((opacity > 1 ? 1 : opacity) * 5);
    var text;
    var element;

    var props = {style: { width: absdx*2, opacity, }};

    //this.refs.mainElement.setNativeProps({style: { left: dx }});
    if (dx > 0) {
      element = this.refs.leftElement;
      props.style.left = absdx;
      text = this.refs.leftText;
    } else {
      element = this.refs.rightElement;
      props.style.right = absdx;
      text = this.refs.rightText;
    }
    //text.setNativeProps({style: { fontSize, paddingTop }});
    //element.setNativeProps(props);

    this.setState({ dx });

    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    posLeft = this._previousLeft + gestureState.dx
    this._updatePosition(posLeft)
    this.setState({ dx });//this.state.dx
  },
  _updatePosition: function(posLeft){
    var leftWidth  = 0 < posLeft ? posLeft : 0.00001
    var rightWidth = 0 < posLeft ? 0.00001 : -1 * posLeft

    this.refs.leftElement &&
    this.refs.leftElement.setNativeProps(
      {style:{width: leftWidth }});
    this.refs.mainElement &&
    this.refs.mainElement.setNativeProps(
      {style:{left: posLeft - leftWidth}});
    //close enable
    //console.log(rightWidth)
    this.refs.rightElement &&
    this.refs.rightElement.setNativeProps(
      {style:{width: rightWidth,
              left: posLeft - leftWidth}});
  },
  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
    if (this.state.dx > SWIPE_RELEASE_POINT) {
      if (this.props.onSwipeRight) {
        this.props.onSwipeRight.call();
      }
    } else if (this.state.dx < -SWIPE_RELEASE_POINT) {
      if (this.props.onSwipeLeft) {
        this.props.onSwipeLeft.call();
      }
    }
    posLeft = this._previousLeft + gestureState.dx;
    var newPos;
    if(posLeft < -50){
      newPos = -100;//right button size
    }else if(-50 < posLeft && posLeft < 10){
      newPos = 0;//flat
    }else if(10 < posLeft){
      newPos = 100;//left button size
    }else{
      newPos = 100;
    }
    console.log("pos:%O",newPos)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this._updatePosition(newPos);
    this._previousLeft = newPos;
      //this._previousLeft += gestureState.dx;
    //var animations = require('../../TaskList/animations');
    //LayoutAnimation.configureNext(animations.easeInEaseOut);
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //this.setState({dx:0,});
    //this.refs.mainElement && this.refs.mainElement.setNativeProps({style: { left: 0 }});
    //this.refs.leftElement && this.refs.leftElement.setNativeProps({style: { width: 0, left: 0, }});
    //expand to max
    //this.refs.rightElement && this.refs.rightElement.setNativeProps({style: { width: 0, right: 0,}});
    // Reset the left/right values after the animation finishes
    // This feels hacky and I hope there's a better way to do this
    setTimeout(() => {
      //this.refs.leftElement && this.refs.leftElement.setNativeProps({style: { left: null }});
      //this.refs.rightElement && this.refs.rightElement.setNativeProps({style: { right: null }});
    }, 300);
  },

  _previousLeft: 0,
  _mainElementStyles: {},
  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 0;
    this._mainElementStyles = {
      style: {
        left: this._previousLeft,
      }
    };
  },

  getInitialState: function() {
    return {
      dx: 0,
      openedLeft:false,//rename isLeftOpened
      btnsLeftWidth:0.1,
      openedRight:false,
      btnsRightWidth:0.1,
    };
  },

  componentDidMount: function() {
    //this._updatePosition();
  },
  /* _updatePosition: function() {

     }, */
  render: function() {
    /* var pullOrRelease = (this.state.dx > SWIPE_RELEASE_POINT || this.state.dx < -SWIPE_RELEASE_POINT) ?
       'Release' :
       'Pull'; */
    var pullOrRelease = 'Release'
    {/*
        <View style={{flex:1,}}></View>
        <View ref={'leftElement'} style={styles.swipeableLeft}>
        ok
        <View style={{width:300,flexDirection:'row',}}>
      */}
    return (
      <View style = {{justifyContent:"center",
                      flexDirection:'row'}}>
      <View style={styles.swipeableElementWrapper}>
        <View ref = {'leftElement'} style = {[styles.swipeableLeft, {width: this.state.btnsLeftWidth}]}>

          <Text ref={'leftText'} style={styles.leftText}>
              {pullOrRelease} to {this.props.swipeRightTitle}
            </Text>
          </View>

        <View ref={'mainElement'} style={styles.swipeableMain} {...this._panResponder.panHandlers}>
          {this.props.component}
        </View>
        <View ref={'rightElement'} style={styles.swipeableRight}>
          <View style={{width:300,overflow:'hidden'}}>
            <Text ref={'rightText'} style={styles.rightText}>
              {pullOrRelease} to {this.props.swipeLeftTitle}
            </Text>
          </View>
        </View>
      </View>
      </View>
    );
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
    width: SCREEN_WIDTH - 100,
    flexDirection:'row',
    //alignItems:'stretch'
    //justifyContent:'center',//not to affected by left button string change
  },
  swipeableMain: {
    //width: SCREEN_WIDTH,
    width: 200,
    backgroundColor: 'gray',
  },
  swipeableLeft: {
    overflow: 'hidden',
    //width: 100,
    //width: 0.1,
    //flex:1,
    backgroundColor: 'red',
    flexDirection:'row',
    justifyContent:'flex-end',//horizontal
  },
  leftText: {
    color:'#FFFFFF',
    //padding:10,
    //justifyContent:'center',
    //alignSelf:'center',
  },
  swipeableRight: {
    overflow: 'hidden',
    width: 0.1,
    //flex:1,
    //alignItems: 'flex-end',
    backgroundColor: 'blue',
  },
  rightText: {
    color:'#FFFFFF',
    //padding:10,
  }
});

module.exports = {AnimatedFlick,BookCell};
