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
