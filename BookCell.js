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
            padding:10,//not work
            //margin:10,
          }}
    >
      <Text>{'Some Other Text'}</Text>
    </SwipeableRow>
  )
}, //collapsable={false}
});

var SwipeableRow = React.createClass({
  _previousLeft: 0,
  componentWillMount: function() {
    this._panX = new Animated.Value(0);
    //this.leftBackGroundColor.setValue("#0000ff");
    var GREY = 0
    var GREEN = 1
    var RED = 2
    //this._color = new Animated.Value(GREY);
    this._color = GREY
    this._animatedColor = new Animated.Value(this._color);
    //this.leftBackGroundColor = new Animated.Value('rgb(255, 0, 0)');
    this.leftBackGroundColor = this._animatedColor.interpolate({
      inputRange:[GREY, GREEN, RED],
      outputRange:[
        'rgb(180, 180, 180)',
        'rgb(63, 236, 35)',
        'rgb(233, 19, 19)',
      ]
    });

    this._panX.addListener(({value:value}) => {
      //console.log("v:%O", value)
      /* if(30 < value){
         Animated.timing(this.leftBackGroundColor, {
         toValue: 'rgb(0, 0, 255)',//blue
         duration: 30,
         }).start(); */
      //console.log("start anim");
      var nextColor = null;
      //if (value > -50 && this._color != GREY) {
      if (value < 50  && this._color != GREY) {
        nextColor = GREY;
      //} else if (value < -50 && value > -threshold && this._color != GREEN) {
      } else if (50 < value && value < 100 && this._color != GREEN) {
        nextColor = GREEN;
      } else if (100 < value && this._color != RED) {
        nextColor = RED;
      }
      if (nextColor !== null) {
        this._color = nextColor;
        Animated.timing(this._animatedColor, {
          toValue: nextColor,
          duration: 180,
        }).start();
      }
    }
      //this.leftBackGroundColor.setValue('rgb(0, 0, 255)')
    );
    /* this.leftBackGroundColor = this._panX.interpolate({
       inputRange:[50,
       99,
       100,
       149,
       150,
       200,
       ],
       outputRange:['rgb(0, 0, 0)',//black
       'rgb(0, 0, 0)',//black
       'rgb(255, 0, 0)',//red
       'rgb(255, 0, 0)',//red
       'rgb(0, 0, 255)',//blue
       'rgb(0, 0, 255)',//blue
       ]
       }); */
    //AddListener timing
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
        //this._previousLeft += gestureState.dx;
        //this._panX.setValue(0);
        Animated.parallel([
          Animated.decay(this._panX, {
            velocity:gestureState.vx,
          }),
          Animated.spring(this._panX, {
            toValue: 0,
          })
        ]).start();
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
    leftButtons = (
      <Animated.View style = {[{backgroundColor:this.leftBackGroundColor}]}>
        <Text>
          foo
        </Text>
      </Animated.View>);

    return(
      //{height: this._height},
      <View style={
        [styles.swipeableElementWrapper,
        ]}>
        {leftButtons}
        <Animated.View
      ref={'mainElement'}
      style={[styles.swipeableMain,
              {left: this._panX},
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
      </View>
    )
  },
})

var Dimensions = require('Dimensions');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

//variable for debug layout
var SWIPEABLE_MAIN_WIDTH = 300;
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
