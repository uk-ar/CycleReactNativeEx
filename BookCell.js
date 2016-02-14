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
  return(
    <View>
      <ScrollView horizontal={true}
                  onPanResponderTerminationRequest={ () => false}>
        <View style = {{width:320, height:300, backgroundColor:"red"}}/>
        <View style = {{width:320, height:300, backgroundColor:"green"}}/>
        <View style = {{width:320, height:300, backgroundColor:"blue"}}/>
      </ScrollView>
      <View style={styles.separator}/>
    </View>
  )}
  /* return(
     <CycleView>
     {content}
     </CycleView>
     )} //collapsable={false} */
  //onPress = {() => console.log("pressed")}
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
});

module.exports = {AnimatedFlick,BookCell};
