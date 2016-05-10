var React = require('react-native');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');

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

var MeasurableView = React.createClass({
  getInitialState() {
    return { contentWidth:  0,
             contentHeight: 0,}
  },
  _onLayout({nativeEvent:{layout:{width, height}}}){
    if(!this.state.contentWidth){
      //this.state.contentWidth = width;
      //this._root.setNativeProps({style:{flex:width}})

      this.setState({contentWidth:width,
                     contentHeight:height});
      this.props.onFirstLayout &&
      this.props.onFirstLayout(
        {nativeEvent:{layout:{width, height}}});
    }
  },
  //cannot measure Animated.View
  render() {
    return (
      //TODO:...this.props
      <Animated.View style = {[this.props.flexEnabled &&
                               {flex: this.state.contentWidth},
                               this.props.style]}
                     onLayout={this.props.onLayout || this._onLayout}
      >
        {this.props.children}
      </Animated.View>
    )
  }
});

var MeasurableWidth = React.createClass({
  getDefaultProps() {
    return { flexEnabled: false }
  },
  getInitialState() {
    return { contentWidth: 0, }
  },
  _onLayout({nativeEvent:{layout:{width, height}}}){
    if(!this.state.contentWidth){
      //this.state.contentWidth = width;
      //this._root.setNativeProps({style:{flex:width}})

      this.setState({contentWidth:width});
      this.props.onFirstLayout &&
      this.props.onFirstLayout(
        {nativeEvent:{layout:{width, height}}});
    }
  },
  //cannot measure Animated.View
  /* componentDidMount(){
     this._root.measure((x,y,width,height,pageX,pageY)=>
       this.setState({contentWidth:width})
       )
  },*/
  render() {
    return (
      //TODO:...this.props
      <Animated.View style = {[this.props.flexEnabled &&
                               {flex: this.state.contentWidth},
                               this.props.style]}
            ref={(component) => this._root = component}
            onLayout={this.props.onLayout || this._onLayout}
      >
        {this.props.children}
      </Animated.View>
    )
  }
});
//cannot access state & function from AnimatedComponent
//Animated.MeasurableWidth = Animated.createAnimatedComponent(MeasurableWidth);

var BookCell = React.createClass({
  /* componentDidMount(){
     console.log(this);
     //refs["long button"].getWidth();
     //refs["long button"].state.flex;
     }, */
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
  /* return(
      <View style={{
          flexDirection: "row",
          backgroundColor: "yellow",
          borderColor: "black",
          borderWidth: 1,
          //flex:1,
          //height:90,
          alignItems:"center",
          //alignItems:"stretch",
          //alignItems:"flex-end",
          //alignItems:"stretch",//not working?
          //height:60,
        }}>
        <View key="buttons" style={{
            backgroundColor: "red",
            flexDirection: "row",
            alignItems:"center",
            //width:100,
            //alignSelf:"stretch",
            flex:1,
            // transform:[{scaleX:2.0}]
            //height:60,
          }}>
          <MeasurableWidth ref="long button" style={{
              backgroundColor: "purple",
              //flex:10,
            }}>
            <Text style={{
                //margin: 10,
              }}>{'long long long'}</Text>
          </MeasurableWidth>
          <MeasurableWidth style={{
              backgroundColor: "blue",
              //flex:0.1,
              //flex:1000,
              //width:100,
              //minWidth:50,
            }}>
            <View style={{
                padding:10,
              }}>
            <Text style={{
                margin: 10,
              }}>{'b2'}</Text>
            </View>
          </MeasurableWidth>
        </View>
        <View key="main" style={{
            backgroundColor: "green",
            height:80,
            //mergin:10,
            padding: 10,
            flexDirection: "row",
            alignItems:"center",
            //alignSelf:"stretch",
            //flex:1,
          }}>
          <Text style={{
              //height:40,
              //padding: 10,
            }}>{'b3'}</Text>
        </View>
      </View>
  )*/
  return(
    <SwipeableRow
        rightButtonSource ={[
            {text: "long long long", backgroundColor: "blue", type:"de"},//invalid
            {text: "foo", backgroundColor: "red"},
            {text: "ba", backgroundColor: "green"},
            //{text: "baz", backgroundColor: "blue", type:"destructive"},
            //type: close cell or close button or limit
            //{text: "long long long", backgroundColor: "blue", type:"de"},
            {text: "b", backgroundColor: "blue", type:"de"},
          ]}
        leftButtonSource = {[
            //{text: "Some Text", backgroundColor: "black"},
            {text: "foo", backgroundColor: "black"},
            {text: "bar", backgroundColor: "orange",type:"destructive"},
          ]}
        onSwipeRight={() => {
            // Handle swipe
          }}
        onSwipeLeft={() => {
            // Swipe left
          }}
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
        <Animated.Text numberOfLines = {1} style = {{
            //mergin:10,
            //backgroundColor:"red",
            //paddingHorizontal:10,
            flex:1,
          }}>
          {this.props.text}
        </Animated.Text>
      </View>)
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
      //var nextText = null;
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
        //{this.height.setValue(height)}
        //Animated.sequence()
        /* Animated.parallel([
           Animated.decay(this._panX, {
           velocity:gestureState.vx,
           }),
           Animated.spring(this._panX, {
           toValue: 0,
           }),
           Animated.timing(this.height, {
           toValue: 0.1,
           })
           ]).start(); */
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
         width: this._panX < 0 ? 0.01 : this._panX,
         //padding:10,
         height:this.height,
        }}
      >
            {this.state.text}
      </Animated.View>);

    return(
      //{height: this._height},
      <MeasurableView style={
        [styles.swipeableElementWrapper,
         {height:this.height,
         }
        ]}
                      onFirstLayout={({nativeEvent:{layout:{width, height}}})=>
                        {this.height.setValue(height)}}
      >
        {leftButtons}
        <Animated.View
      ref={'mainElement'}
      style={[styles.swipeableMain,
              {
                //left: this._panX,
               //position:"absolute",
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

var Dimensions = require('Dimensions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

//variable for debug layout
var SWIPEABLE_MAIN_WIDTH = 200;
//var SWIPEABLE_MAIN_WIDTH = SCREEN_WIDTH;

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
    this._animateButtonflex = new Animated.Value(0);
    this._height = new Animated.Value(0);

    this.canReleaseLeft = true;

    this.canReleaseRight = true;

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
        /* LayoutAnimation.configureNext(
           LayoutAnimation.Presets.easeInEaseOut,
           //LayoutAnimation.Presets.linear
           ); */
        var animations = [
          Animated.timing(
            this._animatedValue,
            {toValue:this._calcPosition(this._value)}
          )]
        if(Math.abs(this._calcPosition(this._value)) == SWIPEABLE_MAIN_WIDTH){
          animations.push(Animated.timing(
            this._height,
            {toValue: 0.01 }
          ))
        }
        //Animated seems to disable when chrome debugging in windows
        Animated.sequence(animations).start();
        //this._height.setValue(0.01)
        //this._height.setValue(0.01);
      },
      //https://github.com/facebook/react-native/issues/1046#issuecomment-176744577
      /* onPanResponderTerminationRequest: () => false,
         onStartShouldSetPanResponderCapture: () => true, */
      //onPanResponderTerminate: this._handlePanResponderEnd,
    });
    //this._previousLeft = 0;
  },
  _onLayout:function({nativeEvent:{layout:{width,height}}}){
    //https://github.com/CEWendel/SWTableViewCell
    //https://github.com/MortimerGoro/MGSwipeTableCell
    //https://github.com/alikaragoz/MCSwipeTableViewCell
    //http://koze.hatenablog.jp/entry/2015/06/16/220000
    //fixed width problem -> cannot detect releasing or not
    if(!this.rightReleasePos){
      //console.log("refs:%O", this.refs);//log when onLayout is expensive
      this.rightButtonWidth = this.refs['rightElement'].state.contentWidth;
      this.leftButtonWidth = this.refs['leftElement'].state.contentWidth;
      //Animated.View has not measure function
      /* this.refs['rightElement'].measure((x, y, width, height, pageX, pageY)=>{
         console.log("width r:%O", width);
         }) */
      //console.log("width:%O", this.refs['rightElement'].getContentWidth());
      //this.rightButtonWidth = this.refs['rightElement'].state.contentWidth;
      //this.leftButtonWidth = this.refs['leftElement'].state.contentWidth;

      this._height.setValue(height);
      this.rightReleasePos = this.leftButtonWidth
                           + Math.min(this.leftButtonWidth/4, SWIPEABLE_MAIN_WIDTH/4);
      this.leftReleasePos = - this.rightButtonWidth
                          - Math.min(this.rightButtonWidth/4, SWIPEABLE_MAIN_WIDTH/4);

      //console.log("r:%O,l:%O,w:%O",this.rightReleasePos,this.leftReleasePos,SWIPEABLE_MAIN_WIDTH);//336,-248,360
      this._animatedValue
      /* .interpolate(
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
         ) */
               .addListener(({value:value}) => {
        //console.log("v:%O", value);
        this._value = value;

        var leftWidth  = 0 < value ? value : 0.00001 //limit min value
        var rightWidth = 0 <= value ? 0.00001 : - value //invert value
        /* var lastButtonFlex = this.leftButtonWidth < value ? value
           : value < - this.rightButtonWidth ? - value
           : 0 */
        /* var buttonFlex = this.leftButtonWidth < value ? value
           : value < - this.rightButtonWidth ? -value
           : 0 */
        //var lastButtonFlex = 0 <= value ? value : - value //add zero
        var lastButtonFlex = 0 < value ? value
                           : value == 0 ? 0.1
                           : - value //add zero

        console.log("rightWidth:%O",rightWidth);
        this._animateMainLeft.setValue(value);
        this._animateLeftButtonsWidth.setValue(leftWidth);
        this._animateRightButtonsWidth.setValue(rightWidth);
        this._animateLastButtonflex.setValue(lastButtonFlex);
        console.log("lastButtonFlex:%O",lastButtonFlex);
        //this._animateButtonflex.setValue(this.rightButtonWidth);
      });
      //FIXME:error on long button
      Animated.timing(this._animateButtonflex, {
        duration:0,
        toValue: this._animatedValue.interpolate({
          inputRange: [- this.rightButtonWidth - SWIPEABLE_MAIN_WIDTH,
                       this.leftReleasePos -
                       Math.min(10, Math.abs(SWIPEABLE_MAIN_WIDTH + this.leftReleasePos)),
                       this.leftReleasePos,
                       0,
                       this.rightReleasePos,
                       this.rightReleasePos +
                       Math.min(10, Math.abs(SWIPEABLE_MAIN_WIDTH + this.rightReleasePos)),
                       this.rightButtonWidth + SWIPEABLE_MAIN_WIDTH
          ],
          outputRange: [0.1,
                        0.1,
                      - this.leftReleasePos,
                        0.1,
                        this.rightReleasePos,
                        0.1,
                        0.1],
        }),
      }).start();//TODO:stop when release gesture

      this._animateButtonflex.addListener(({value:value}) => {
        console.log("this._animateButtonflex:%O", value);
      })
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
    if((posLeft < this.leftReleasePos)){
      //newPos = - SWIPEABLE_MAIN_WIDTH - this.rightButtonWidth;//fixed width
      newPos = - SWIPEABLE_MAIN_WIDTH;
    }else if((posLeft < - this.rightButtonWidth / 2) &&
             (this.leftReleasePos < posLeft)){
      newPos = - this.rightButtonWidth;//need offset??
    }else if((- this.rightButtonWidth / 2 < posLeft) &&
             (posLeft < this.leftButtonWidth / 2)){
      newPos = 0;//flat
    }else if((this.leftButtonWidth / 2 < posLeft) &&
             (posLeft < this.rightReleasePos)){
      newPos = this.leftButtonWidth;//need offset??
    }else if((this.rightReleasePos < posLeft )){
      //newPos = SWIPEABLE_MAIN_WIDTH + this.leftButtonWidth;//fixed width
      newPos = SWIPEABLE_MAIN_WIDTH;
    }
    return newPos;
  },
  //http://browniefed.com/react-native-animation-book/events/SCROLL.html
  //http://browniefed.com/blog/2015/08/15/react-native-animated-api-with-panresponder/
  //interface datasource & renderbutton(include default)
  _renderButtons: function(buttonParams,left){
    //TODO:Support 0 or 1 element situation
    var buttonElems =
    buttonParams.map((buttonParam, index, buttonParams) => {
      return (
        //Setting for flexbox
        <MeasurableWidth
        flexEnabled={true}
        style = {[
          {
              //padding:10,//cannot shrink when padding
              //flex: 1,
              //flex: this._animateButtonflex,//TODO:remove self
              flexDirection:'row',
              alignItems:"center",
              justifyContent:"center",
              height: this._height,
              //height: 60,
              /* flexDirection:'column',
              alignItems:'center' */
            },//user value
          ]}>
          {/*Setting for container*/}
          <Animated.View style={{
              backgroundColor: buttonParam.backgroundColor,
              padding:10,
              flex:1,//expand to parent
            }}>
            <Animated.Text numberOfLines={1}
                           style = {[styles.Text,
                             ]}>
              {buttonParam.text}
            </Animated.Text>
          </Animated.View>
        </MeasurableWidth>)
    });
    buttonElems[left ? 0 : buttonElems.length - 1].props.style.push({
      //flex: this._animateLastButtonflex,
      //height:40,
      justifyContent: left ? "flex-end" : "flex-start",
    });

    console.log("be:%O", buttonElems);
    //To fix warning
    return React.Children.toArray(
      buttonElems
    );
  },

  render: function() {
    //TODO:support different length text
    /*
       <View style = {{
       justifyContent:"center",
       flexDirection:'row'}}
       >
       </View>*/
    var leftButtons, rightbuttons;
    var start, end, rest, rest2;
    [start, ...rest] = this._renderButtons(this.props.leftButtonSource, true);
    leftButtons = (
    <MeasurableWidth
        ref = {'leftElement'}
        style = {[styles.swipeableLeft,
                  {
                    //Because mainElement should move to minus point
                    position:"absolute",
                    width:this._animateLeftButtonsWidth,
                  }]}
    >
      {start}
      <View>
        {rest}
      </View>
    </MeasurableWidth>);
    //[...rest2, end] = //invalid
    rightButtons = (
      <MeasurableWidth
          ref = {'rightElement'}
          style = {[styles.swipeableRight,
                    {
                      position:"absolute",
                      right: 0,
                      width: this._animateRightButtonsWidth,
                    }]}
      >
        {this._renderButtons(this.props.rightButtonSource, false)}
        {/* <View>
        {rest}
        </View>
        {end} */}
      </MeasurableWidth>
    )
    return (
      <Animated.View style={
        [styles.swipeableElementWrapper,
         {height: this._height,
         },
        ]
                  }
                onLayout = {(e) => this._onLayout(e)}
                     {...this._panResponder.panHandlers}>
        {leftButtons}
        {/* for z-index order */}
        {rightButtons}
        <Animated.View
             ref={'mainElement'}
             style={[styles.swipeableMain,
                     {left: this._animateMainLeft,
                      overflow:"visible",
                      flexDirection: "row",
                      //padding: 10,
                      alignItems: "center",
                     },
                     this.props.style,
                 //this._animatedValue
                 //to use negative value
               ]}
             >
              {this.props.children}
            </Animated.View>
          </Animated.View>
      );
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
  componentWillMount: function() {
    this._panX = new Animated.Value(0);

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

var MeasurableView = React.createClass({
  getInitialState() {
    return { measuring: true }
  },
  _onLayout({nativeEvent:{layout:{x, y, width, height}}}){
    if(this.state.measuring){
      //console.log("fi:")
      this.props.onChildrenChange &&
      this.props.onChildrenChange(x, y, width, height);
      this.setState({measuring:false,});
    }else{
      //console.log("oth:")
      this.props.onLayout &&
      this.props.onLayout(
        {nativeEvent:{layout:{x, y, width, height}}});
    }
  },
  childrenChange(){
    this.setState({measuring:true,});
  },
  //cannot measure Animated.View
  //hide(opacity:0) until measure is not mean because measure time is not large
  render() {
    //console.log("rend mea")
    return (
      //TODO:...this.props
      <View {...this.props}
                     style={
                       this.state.measuring ? null : this.props.style
                           }
                     onLayout={this._onLayout}
                     ref="root"
      >
        {this.props.children}
      </View>
    )
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
  swipeableElementWrapper: {
    //width: SCREEN_WIDTH,
    width: SWIPEABLE_MAIN_WIDTH,
    flexDirection:'row',
    //backgroundColor:'rgba(0,0,0,0)',//transparent
    backgroundColor:'yellow',//transparent
    //alignItems:'flex-end',//vertical
    //alignItems:'stretch',//vertical,
    //justifyContent:'center',//not to affected by left button string change
  },
  swipeableMain: {
    //width: SCREEN_WIDTH,
    width: SWIPEABLE_MAIN_WIDTH,
    //backgroundColor: 'gray',
    //height:70,
    //padding:1,
  },
  swipeableLeft: {
    flexDirection:'row',
    //height:40,
    //alignItems:'flex-end',
    alignItems:'center',
    //alignSelf:'flex-end',
    //alignItems:'stretch',
    backgroundColor:'green',
    //justifyContent:'flex-start',//horizontal
  },
  /* leftText: {
     color:'#FFFFFF',
     textAlign:'center',//horizontal
     }, */
  swipeableRight: {
    flexDirection:'row',
    justifyContent:'flex-end',
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
