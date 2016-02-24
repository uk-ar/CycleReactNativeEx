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
//var SWIPEABLE_MAIN_WIDTH = 300;
var SWIPEABLE_MAIN_WIDTH = SCREEN_WIDTH;

var SwipeableElement = React.createClass({
  _panResponder: {},
  _previousLeft: 0,

  _canRelease: function(buttons){
    (buttons[buttons.length - 1].type == "destructive");
  },
  componentWillMount: function() {
    this._animatedValue = new Animated.Value(0);
    this._value = 0;

    //used by right width
    this._animateRightButtonsWidth = new Animated.Value(0);
    //used by left width
    this._animateLeftButtonsWidth = new Animated.Value(0);
    //used by main left
    this._animateMainLeft = new Animated.Value(0);
    //used by right & left last button flex
    this._animateLastButtonflex = new Animated.Value(0);

    //TODO:props
    this.rightButtons = [
      {text: "foo", backgroundColor: "red"},
      {text: "bar", backgroundColor: "green"},
      //{text: "baz", backgroundColor: "blue", type:"destructive"},
      //type: close cell or close button or limit
      {text: "baz", backgroundColor: "blue", type:"de"},
    ]
    this.canReleaseLeft = this._canRelease(this.rightButtons);

    this.leftButtons = [
      {text: "foo", backgroundColor: "black"},
      {text: "bar", backgroundColor: "orange",type:"destructive"},
    ]
    this.canReleaseRight = this._canRelease(this.leftButtons);

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
        //this._value += gestureState.dx;//not work
        this._animatedValue.flattenOffset();
        LayoutAnimation.configureNext(
          LayoutAnimation.Presets.easeInEaseOut
          //LayoutAnimation.Presets.linear
        );
        //console.log("th:%O:ges:%O", this._value, gestureState.dx)
        this._animatedValue
            .setValue(
              this._calcPosition(this._value)
            );
      },
      //onPanResponderTerminate: this._handlePanResponderEnd,
    });
    //this._previousLeft = 0;
  },
  _onLayout:function(){
    if(!this.rightReleasePos){
      this.rightReleasePos = this.leftButtonWidth + Math.min(this.leftButtonWidth/2, SWIPEABLE_MAIN_WIDTH/4);
      this.leftReleasePos = - this.rightButtonWidth - Math.min(this.rightButtonWidth/2, SWIPEABLE_MAIN_WIDTH/4);
      //console.log("r:%O,l:%O,w:%O",this.rightReleasePos,this.leftReleasePos,SWIPEABLE_MAIN_WIDTH);//336,-248,360

      this._animatedValue.interpolate(
        {inputRange:
         [this.canReleaseLeft ? this.leftReleasePos : - this.rightButtonWidth - SWIPEABLE_MAIN_WIDTH,
        - this.rightButtonWidth,
          this.leftButtonWidth,
          this.canReleaseRight ? this.rightReleasePos : this.leftButtonWidth + SWIPEABLE_MAIN_WIDTH,
          ],
         outputRange:
         [this.leftReleasePos, - this.rightButtonWidth,
          this.leftButtonWidth, this.rightReleasePos]
        }
      ).addListener(({value:value}) => {
        //console.log("v:%O", value);
        this._value = value;

        var leftWidth  = 0 < value ? value : 0.00001 //limit min value
        var rightWidth = 0 < value ? 0.00001 : - value //invert value
        var lastButtonFlex = this.leftButtonWidth < value ? value
                 : value < - this.rightButtonWidth ? -value
                 : 0

        /* var buttonFlex = this.leftButtonWidth < value ? value
           : value < - this.rightButtonWidth ? -value
           : 0 */

        this._animateMainLeft.setValue(value);
        this._animateLeftButtonsWidth.setValue(leftWidth);
        this._animateRightButtonsWidth.setValue(rightWidth);
        this._animateLastButtonflex.setValue(lastButtonFlex);
        //this._animateButtonflex.setValue(0);
      });
      this._animatedValue.setValue(0);
    }
  },
  leftButtonWidth: null,
  rightButtonWidth: null,
  //_calcPosition: function(posLeft, canReleaseRight, canReleaseLeft){
  _calcPosition: function(posLeft){
    //There is a bug when swipe from left max and right max,but need not to fix
    //_calcPosition: function(dx,prev){
    //var posLeft=dx+prev;
    var newPos = 0;
    if((posLeft < this.leftReleasePos)
    ){
      newPos = - SWIPEABLE_MAIN_WIDTH;
    }else if((posLeft < - this.rightButtonWidth / 2) &&
             (this.leftReleasePos < posLeft)
    ){
      newPos = - this.rightButtonWidth;//right button size
    }else if((- this.rightButtonWidth / 2 < posLeft) &&
             (posLeft < this.leftButtonWidth / 2)){
               newPos = 0;//flat
    }else if((this.leftButtonWidth / 2 < posLeft) &&
             (posLeft < this.rightReleasePos)){
      newPos = this.leftButtonWidth;//left button size
    }else if((this.rightReleasePos < posLeft )){
      newPos = SWIPEABLE_MAIN_WIDTH;
    }
    return newPos;
  },
  //http://browniefed.com/react-native-animation-book/events/SCROLL.html
  //http://browniefed.com/blog/2015/08/15/react-native-animated-api-with-panresponder/
  //interface datasource & renderbutton(include default)
  _renderButtons: function(buttonParams, left){
    var buttonElems =
    buttonParams.map((buttonParam, index, buttonParams) => {
      return (
        <Animated.View style = {[
            {
              backgroundColor:buttonParam.backgroundColor,
              padding:10,
            },//user value
          ]}>
          <Animated.Text numberOfLines={1}
                         style={[styles.rightText,
                           ]}>
            {buttonParam.text}
          </Animated.Text>
        </Animated.View>)
    });
    buttonElems[left ? 0 : buttonElems.length - 1].props.style.push({
      flex: this._animateLastButtonflex,
      flexDirection:'row',
      justifyContent: left ? "flex-start" : "flex-end",
    });
    console.log("be:%O", buttonElems);
    return buttonElems;
  },

  render: function() {
    //TODO:support different length text
    /* <View style = {{
        justifyContent:"center",
        flexDirection:'row'}}
        >
       </View>*/
      return (
          <View style={styles.swipeableElementWrapper}
                onLayout = {() => this._onLayout()}
                {...this._panResponder.panHandlers}>
            <Animated.View
                ref = {'leftElement'}
                style = {[styles.swipeableLeft,
                          {
                            position:"absolute",
                            width:this._animateLeftButtonsWidth,
                          }]}
                onLayout= {({nativeEvent:{layout:{width,height}}}) =>
                  {
                    if(!this.leftButtonWidth){
                      this.leftButtonWidth = width;
                      console.log("www1:%O:",width);
                    }}}
            >
              {this._renderButtons(this.leftButtons, true)}
            </Animated.View>
            <Animated.View
             ref = {'rightElement' //for z-index
                   }
             style = {[styles.swipeableRight,
                       {
                         position:"absolute",
                         right: 0,
                         width: this._animateRightButtonsWidth,
                       }]}
             onLayout= {({nativeEvent:{layout:{width,height}}})=>
               {if(!this.rightButtonWidth){
                 this.rightButtonWidth = width;
                 console.log("rightButtonWidth:%O:",width);//124
               }}}
            >
              {this._renderButtons(this.rightButtons, false)}
            </Animated.View>
            <Animated.View
             ref={'mainElement'}
             style={[styles.swipeableMain,
                     {left: this._animateMainLeft,
                      overflow:"visible"}
                 //this._animatedValue
                 //to use negative value
               ]}
             >
              {this.props.component}
            </Animated.View>
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
    width: SCREEN_WIDTH,
    flexDirection:'row',
    backgroundColor:'rgba(0,0,0,0)',//transparent
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
