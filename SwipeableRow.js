
import React from 'react';

const _ = require('lodash');

import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
} from 'react-native';

const Dimensions = require('Dimensions');
const {
  width,
  height,
} = Dimensions.get('window');

// constiable for debug layout
// const SWIPEABLE_MAIN_WIDTH = 300;
const SWIPEABLE_MAIN_WIDTH = width;

const Expandable = React.createClass({
  getInitialState() {
    return {
      index: 0,
      width: 0.001,
    };
  },

  componentWillMount() {
    this.thresholds = [];
    this.setState({ width: this.props.width });
  },

  componentWillReceiveProps(nextProps) {
    // console.log("next:%O",nextProps);
    const width = nextProps.width;
    this.setState({ width });
    if (this.props.lock) { return; }
    // this.width = width;
    if ((this.state.index < this.props.components.length - 1) &&
       (this.thresholds[this.state.index] < width)) {
      this.setState({ index: this.state.index + 1 });
      // console.log("set+1");
      this.props.onResize &&
      this.props.onResize(this.state.index + 1);
    } else if ((0 < this.state.index) &&
             (width < this.thresholds[this.state.index - 1])) {
      this.setState({ index: this.state.index - 1 });
      // console.log("set-1");
      this.props.onResize &&
      this.props.onResize(this.state.index - 1);
    }
  },

  render() {
    // render method called according to width
    // console.log("this.props:%O", this.props)
    // this.child exposed to parent
    // console.log("this.state.width:%O",this.state.width);
    // if (this.thresholds.length !== this.props.components.length){
    if (Object.keys(this.thresholds).length !== this.props.components.length)
    {
      return (
        // TODO:...this.props
        // use onFirstLayout
        // row->buttons({width})->selectableView({viewIndex})
        // TODO:optimize
        // this.setState({index:0})
        <View>
        {this.props.components.map((elem, i) => {
          return (


<View
  key={i}
  style={{ position: 'absolute' }}
  onLayout={({ nativeEvent: { layout: { width, height } } }) => {
                      // console.log("i:%O,w:%O",i,width);
                      // style={[this.props.style,{position:"absolute"}]}
                      // style={[this.props.style]}
                      // {padding:10,margin:7,position:"absolute"}47,120,220
                      // {padding:10,position:"absolute"}47,120,220
                      // {position:"absolute"}27,100,200
    this.thresholds[i] = width;
  }}
>
               {elem}
             </View>
            ); })}
      </View>);
    } else {
      // console.log("this.thresholds1:%O",this.thresholds);
      return (
        <View
          style={[this.props.style, { width: this.state.width }]}
        >
          {this.props.components[this.state.index]}
        </View>);
    }
    // return(this.child)
  },
});

const AnimatedExpandable = Animated.createAnimatedComponent(Expandable);

/* usage:
   <AnimatableBackGroundColor
   colors={colors}
   colorIndex={this.state.left}>
   <Text onPress = {() => {
   this.setState({
   left:this.state.left + 1
   })
   }}>foo</Text>
   </AnimatableBackGroundColor> */
// TODO:migrate to AnimatableView
const AnimatableBackGroundColor = React.createClass({
  componentWillMount() {
    this.colorIndex = new Animated.Value(this.props.colorIndex);
  },

  componentWillReceiveProps(nextProps) {
    // animated
    if (nextProps.colorIndex != this.props.colorIndex) {
      Animated.timing(
        this.colorIndex,
        { toValue: nextProps.colorIndex, // interpolate?
        duration: 360 } // TODO:add props
      ).start();
    }
  },

  render() {
    return (
      // AnimatableBackGroundColor and children can expose method?
      <Animated.View {...this.props} style={[this.props.style, {
        backgroundColor: this.colorIndex.interpolate({
          inputRange: _.range(this.props.colors.length),
          outputRange: this.props.colors,
        }),
      },
        ]}>
        {this.props.children}
      </Animated.View>);
  },
});

// Visible toggle hidden display
const AnimatableView = React.createClass({
  getInitialState() {
    return {
      style: this.props.style,
    };
  },

  componentWillMount() {
    this.animating = false;
  },

  _onLayout({ nativeEvent: { layout: { x, y, width, height } } }) {
    this.props.onLayout && this.props.onLayout(
      { nativeEvent: { layout: { x, y, width, height } } });
    if (this.animating) { return; }

    this.contentHeight = height;
    this.contentWidth = width;
  },

  componentWillReceiveProps(nextProps) {
    const current = StyleSheet.flatten(this.props.style);
    const next = StyleSheet.flatten(nextProps.style);
    const style = Object.assign({}, next);
    const values = Object.keys(StyleSheet.flatten(nextProps.style))
                       .filter((key) => current[key] !== next[key])
                       .filter((key) =>
                         ((typeof current[key] !== 'string') ||
                          (key === 'backgroundColor')))
                       .map((key) => {
                         if (current[key]) {
                           style[key] = new Animated.Value(current[key]);
                         } else if (key === 'height' || key === 'width') {
                           style[key] = new Animated.Value(this.contentHeight);
                         }

                         return key;
                       }).map((key) =>
                         Animated.timing(
                           style[key],
                           { toValue: next[key] }// TODO:add props duration
                         ));// null
    // console.log("style:%O,%O",current,next);
    // console.log("a:%O,%O",values,style);
    // TODO:may heavy?
    this.setState({ style });

    if (values.length !== 0) {
      this.animating = true;
      Animated.parallel(values).start((e) => {
        this.animating = false;
        // always animated...
        this.props.onAnimationEnd &&
                         this.props.onAnimationEnd();
      });
      // trac for re-render children
    }
  },

  render() {
    // drop own props
    const { style, ...props } = this.props;
    return (
      <Animated.View
        {...props}
        style={this.state.style}
        onLayout={this._onLayout}
      >
        {this.props.children}
      </Animated.View>);
  },
});

const SwipeableButtons = React.createClass({
  getInitialState() {
    return {
      componentIndex: 0,
      width: new Animated.Value(0.001),
      releasing: false,
    };
  },

  componentWillMount() {
    this.colors = this.props.buttons.map(
      (elem, i) => elem.props.backgroundColor);
    this.styles = this.props.direction == 'left' ? [{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: null,
      justifyContent: 'flex-end',
      //padding:10,//RN bug:clipped padding
    }, {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: null,
      width: SWIPEABLE_MAIN_WIDTH / 2,
    }, {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: null,
      width: SWIPEABLE_MAIN_WIDTH,
    }] : [{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: null,
    }, {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: null,
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      width: SWIPEABLE_MAIN_WIDTH / 2,
    }, {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: null,
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      width: SWIPEABLE_MAIN_WIDTH,
    }];
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.width != this.props.width) {
      this.setState({ width: new Animated.Value(nextProps.width) });
    }
  },
  // shuld handle in parent?
  release(callback) {
    // need release listener?
    // Execute button action
    const currentButton = this.props.buttons[this.state.componentIndex];
    const close = currentButton.props.close;
    this.setState({ releasing: true });

    return new Promise((resolve, reject) => {
      Animated.timing(
        this.state.width,
        { toValue: close ? SWIPEABLE_MAIN_WIDTH : 0.001,
        duration: 180 }
      ).start((e) => {
        // called when animation finished
        resolve(close);
        console.log('callReleasefunc');
        if (!close) {
          this.setState({
            releasing: false,
            componentIndex: 0,
          }, () => {
            // delete data
            console.log('callReleasefunc0');
            currentButton.props.onRelease && currentButton.props.onRelease();
          }
          );
        } else {
          this.setState({
            releasing: false,
          }, () => {
            // delete data
            console.log('callReleasefunc1');
            currentButton.props.onRelease && currentButton.props.onRelease();
          }
          );
        }
      });
    });
  },

  render() {
    const styles = this.styles;
    const { width, ...props } = this.props;
    //               colors={this.props.colors}
    // console.log("w:%O", width);
    return (
      <AnimatableBackGroundColor {...props}
        colors={this.colors}
        colorIndex={this.state.componentIndex}
      >
        <AnimatedExpandable
          width={this.state.width.interpolate({
            inputRange: [0, 0.01, 1],
            outputRange: [0.01, 0.01, 1],
          })}
          lock={this.state.releasing}
          style={{
                // width={this.state.width}
                // width={50}
                // width cannot shrink under padding
                // height:50,//TODO:support height centering
            justifyContent: 'center',
                //lock={this.releasing}
          }}
          onResize={(i) => {
                // TODO:shuld call from first time?
            this.setState({ componentIndex: i });
          }}

          components={this.props.buttons.map((elem, i) => {
            return (React.cloneElement(
                  elem,
                  { style: [
                    elem.props.style,
                    styles[i],
                  ] })); // for merge backgroundColor
          })}
        />
      </AnimatableBackGroundColor>);
  },
});

class MeasureableView extends React.Component {
//const MeasureableView = React.createClass({
  // TODO:position absolute
  constructor(props) {
    super(props);
    this.state = { layouted: false };
  }
  render() {
    return this.state.layouted ? (
      <View
        {...this.props}
      >
        {this.props.children}
      </View>) : (
<View
  {...this.props}
  style={[this.props.style,{position:"absolute"}] }
  onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
    this.props.onFirstLayout &&
                this.props.onFirstLayout(
                  { nativeEvent: { layout: { x, y, width, height } } });
      this.setState({layouted:true})
    }}
>
          {this.props.children}
        </View>
      );
  }
};

/* const SelectableView = React.createClass({
   getInitialState:function(){
   return({
   containerStyle:{position:"absolute"}
   })
   },
   render: function(){
   return (
   <View
   {...this.props}
   style={[this.props.style,this.state.containerStyle]}
   onFirstLayout={()=> this.setState({containerStyle:null})}
   >
   {this.props.components.map((elem,i)=>{
   return (
   <View
   key={i}
   onFirstLayout={({nativeEvent:{layout:{width, height}}})=>{
   //this.props.onChildrenMount()
   }}>
   {elem}
   </View>
   )
   })}
   </View>
   )
   }
}); */

/* const MeasureableViews = React.createClass({
 *   //TODO:remove this.widths
 *   render: function(){
 *     return (React.Children.toArray(this.props.children))
 *     return (
 *       React.Children.map(
 *         this.props.children,
 *         ((button, i, array)=>
 *           <MeasureableView
 *               onFirstLayout={({nativeEvent:{layout:{x, y, width, height}}})=>{
 *                   this.widths[i] = width;
 *                   if(Object.keys(this.widths).length == array.length){
 *                     this.props.onFirstLayoutAll &&
 *                     this.props.onFirstLayoutAll(widths)
 *                   }
 *                 }}>
 *             {button}
 *           </MeasureableView>)))
 *   }
 * })*/

const AnimView = React.createClass({
  // Use LayoutAnimation if you want to use height or width null
  getInitialState() {
    return {
      animatedStyle: StyleSheet.flatten(this.props.style),
    };
  },
  // for ReactTransitionGroup
  componentWillEnter(callback) {
    console.log("component will enter");
    callback();
  },
  componentWillLeave(callback) {
    console.log("component will leave");
    callback();
  },
  componentWillMount() {
    this.prevStyle = StyleSheet.flatten(this.props.style);
    // this.animating = false;
  },
  animate(fromValues, toValues){
    this.prevStyle = fromValues;
    this.animateTo(toValues);
  },
  //https://github.com/joshwcomeau/react-flip-move#enterleave-animations
  animateTo(nextStyle) {
      // duration,easing jquery
    console.log('animate');
      // this.animating = true;
    this.counter = new Animated.Value(0);
    const current = StyleSheet.flatten(this.prevStyle);
    const next = StyleSheet.flatten(nextStyle);
    let animatedStyle = Object.assign({}, next);
    // check for initial
    // console.log("rec",current,this.prevStyle,next,animatedStyle);
    /* if(current.height && next.height === null){
     *   const orig = next.height;
     *   this.refs.measure((x,y,width,height)=>{
     *     next.height = height;
     *     //replace
     *     //anim.then(next.height=orig)
     *   })
     * }*/
    //console.log("n:",next,nextStyle)
    next &&
    Object.keys(next).map((key) => {
          // remove if with filter & merge
          // console.log("k:",key,typeof next[key] === "number",key == "backgroundColor" || key == "color",current[key] != next[key],current[key],next[key])
      if (((typeof current[key] === 'number' && typeof next[key] === 'number')|
           key.endsWith('Color') ||
           key == 'color')
          && current[key] !== next[key]
          ) {
            // console.log("an",current[key],next[key]);
        animatedStyle[key] = this.counter.interpolate({
          inputRange: [0, 1],
          outputRange: [current[key], next[key]],
        });
      }else if(key === 'transform' && current['transform']){
        //current next
        // transform is ordered array!!
        /* console.log("ab",current['transform'],next['transform']);
         * animatedStyle['transform'] =
         *   [Object.keys(next['transform'][0])
         *         .map((transformKey)=>console.log("ke",transformKey))
         *         .filter((transformKey)=>
         *           next['transform'][0][transformKey]!==
         *             current['transform'][0][transformKey])
         *         .reduce((acc,transformKey)=>{
         *           acc[transformKey] = this.counter.interpolate({
         *             inputRange: [0, 1],
         *             outputRange: [current[key], next[key]],
         *           })
         *           return acc;
         *         },{...next['transform'][0]})] || next['transform']
         * console.log("as",animatedStyle['transform']);*/
      }
    });

    this.prevStyle = next;
    return new Promise((resolve, reject) => {
      this.setState({ animatedStyle }, () => {
        Animated.timing(
            this.counter,
            { toValue: 1,
              duration: (this.props.anim && this.props.anim.duration) || 360,//180,
              //duration: 180,
            }
          ).start(() => {
            resolve();
          });
      });
    });
  },

  componentWillReceiveProps(nextProps) {
    console.log('willReceiveProps');
    this.animateTo(nextProps.style);
  },
  measure(callback){
    //not needed?
    callback(...Object.values(this.layout));
  },
  render() {
    // console.log("rend anim,view1,view2",this.state.animatedStyle,this.props.style)
    return (
      // style={[this.state.style,]}
      <Animated.View
        ref="root"
        {...this.props}
        onLayout={
          this.props.onLayout ? this.props.onLayout :
          ({ nativeEvent: { layout: {x, y, width, height } } }) => {
            //Animated.View cannot measure
            this.layout = {x, y, width, height }
          }}
        style={[this.state.animatedStyle]}
      >
        {this.props.children}
      </Animated.View>);
  },
});

const SwipeableButtons2 = React.createClass({
  getInitialState() {
    return {
      index: 0,
    };
  },

  componentWillMount() {
    this.thresholds = [];
    this.releasing = false;
  },

  release() {
    const close = this.currentButton.props.close;
    this.releasing = true;

    Animated.timing(this.props.width,
                    { toValue: !close ? 0.001 :
                     this.props.direction == 'left' ? SWIPEABLE_MAIN_WIDTH
                   : -SWIPEABLE_MAIN_WIDTH,
                    duration: 180 }
    ).start(() => {
      this.currentButton.props.onRelease &&
      this.currentButton.props.onRelease();
      this.releasing = false;
    });
  },

  render() {
    /* width={Animated.multiply(this._panX,-1)}*/
    // console.log("mul",Animated.multiply(this._panX,-1))
    // console.log("buttons")
    // react-native cannot set width for clipped subview in ios
    const { width, props } = this.props;
    this.currentButton = this.props.buttons[this.state.index];
    if (this.props.direction == 'right') {
      this.width = Animated.multiply(this.props.width, -1);
    } else {
      this.width = this.props.width;
    }

    if (Object.keys(this.thresholds).length !== this.props.buttons.length) {
      // not measured
      return (
        <View
          {...props}
          style={{ flexDirection: 'row',
                    opacity: 0,
                    width: 0.01,
                    overflow: 'hidden' }}
        >
          {this.props.buttons.map((button, i, array) =>


<MeasureableView
  ref={i}
  key={i}
  onFirstLayout={
               ({ nativeEvent: { layout: { x, y, width, height } } }) => {
                 this.thresholds[i] = width;
                 if (Object.keys(this.thresholds).length == array.length) {
                  // console.log(this.thresholds)
                   this.props.width.addListener(({ value: value }) => {
                     if (this.releasing) { return; }

                     let index = calcIndex(value, this.thresholds);
                     if (this.props.direction == 'right') {
                       index = calcIndex(-value, this.thresholds);
                     }

                     if (index != -1 && this.state.index != index) {
                       this.setState({ index });
                     }
                   });
                   this.setState({ index: 0 });// for re-render
                 }
               }}
>
           {button}
             </MeasureableView>
            )}
         </View>);
    } else {
      console.log('rend buttons');
      return (
        <AnimView
          {...props}
          style={[{
            overflow: 'hidden',
                // height:30 * (this.state.index+1),
            backgroundColor: this.currentButton.props.backgroundColor,
            width: this.width.interpolate({
              inputRange: [0, 0.01, 1],
              outputRange: [0.01, 0.01, 1],
            }) }, this.props.style]}
        >
            {this.props.buttons[this.state.index]}
          </AnimView>);
    }
  },
});

function calcIndex(value, thresholds) {
  return thresholds.findIndex((elem, index) => {
    return value < elem;
  });
}

// scroll view base
// ref: http://browniefed.com/blog/react-native-animated-listview-row-swipe/
const SwipeableRow2 = React.createClass({
  getInitialState() {
    return {
      positiveSwipe: true,
    };
  },

  componentWillMount() {
    this._panX = new Animated.Value(0.01);
    function isSwipeHorizontal(evt, gestureState) {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          && Math.abs(gestureState.dx) > 10;
    }

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,

      onMoveShouldSetPanResponder: isSwipeHorizontal,
      onMoveShouldSetPanResponderCapture: isSwipeHorizontal,

      onPanResponderGrant: (evt, gestureState) => {},

      onPanResponderMove: (evt, gestureState) => {
        this._panX.setValue(gestureState.dx);
        // https://github.com/facebook/react-native/issues/1705
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
            && Math.abs(gestureState.dx) > 10) {
          /* this.props.onPanResponderMove &&
           * this.props.onPanResponderMove(evt, gestureState);*/
        }
      },

      onPanResponderEnd: (evt, gestureState) => {
        /* this.props.onPanResponderEnd &&
         * this.props.onPanResponderEnd(evt, gestureState);*/
      },

      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.positiveSwipe) {
          this.refs.leftButtons.release();
        } else {
          this.refs.rightButtons.release();
        }
      },

      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
    this._panX.addListener(({ value: value }) => {
      if (0 < value && this.state.positiveSwipe != true) {
        this.setState({ positiveSwipe: true });
      } else if (value <= 0 && this.state.positiveSwipe != false) {
        this.setState({ positiveSwipe: false });
      }
    });
  },

  render() {
    //console.log('sr2:');
    return (
      <View
        {...this._panResponder.panHandlers}
        style={{ flexDirection: 'row',
                  justifyContent: this.state.positiveSwipe ?
                                  'flex-start' : 'flex-end',
                  overflow: 'hidden',
                  //TODO:vertical stretch will fixed in RN 0.28?
                  //https://github.com/facebook/react-native/commit/d95757037aef3fbd8bb9064e667ea4fea9e5abc1
                  //alignItems:"stretch"
                }}
      >
         <SwipeableButtons2
           ref="leftButtons"
           direction="left"
           width={this._panX}
           buttons={this.props.leftButtons}
         />
         <View
           style={[{ width, //expand to cell width
    }, this.props.style]}
         >
           {this.props.children}
         </View>
         <SwipeableButtons2
           ref="rightButtons"
           direction="right"
           width={this._panX}
           buttons={this.props.rightButtons}
         />
       </View>
    );
  },
});

const SwipeableRow = React.createClass({
  componentWillMount() {
    this._panX = new Animated.Value(0);

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {},

      onPanResponderMove: Animated.event([
        null,
        { dx: this._panX },
      ]),
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        if (0 < this.state.left) {
          console.log('this.refs.leftButtons.refs.node:%O',
                      this.refs.leftButtons.refs.node);
          this.refs.leftButtons.release().then((close) => {
            // if(close){this.setState({hidden:true})}
          });
        } else {
          this.refs.rightButtons.release().then((close) => {
            // if(close){this.setState({hidden:true})}
          });
        }
      },

      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
    this._panX.addListener(({ value: value }) => {
      // if(0 < value){
      // }
      // TODO:heavy
      this.setState({ left: value });
    });
  },

  getInitialState() {
    return {
      left: 0.01, // changed when move & release
      positiveSwipe: true,
      width: null,
    };
  },

  render() {
    const leftButtons = (
      // cannot convert animatedvalue because of release function
      // <SwipeableButtons
      <SwipeableButtons
        ref="leftButtons"
        direction="left"
        width={this.state.left}
        buttons={this.props.leftButtons}
        style={{ justifyContent: 'center', //vertical center
    }}
      />);
    // button input color, component, release action
    // close flag is parent props
    const rightButtons = (
      <SwipeableButtons
        ref="rightButtons"
        direction="right"
        width={-this.state.left}
        buttons={this.props.rightButtons}
        style={{ justifyContent: 'center',
                  overflow: 'hidden' }}
      />
    );

    return (
      // onFirstLayout
      <MeasureableView
        onFirstLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
          this.setState({ width });
        }}

        style={{
          flexDirection: 'row',
            // TODO:vertical stretch will fixed in RN 0.28?
            // https://github.com/facebook/react-native/commit/d95757037aef3fbd8bb9064e667ea4fea9e5abc1
          alignItems: 'stretch',
          justifyContent: 0 < this.state.left ? 'flex-start' : 'flex-end',
          overflow: 'hidden',
        }}
        {...this._panResponder.panHandlers}
      >
        {leftButtons}
        <View style={[{ width: this.state.width }, // fixed width
                      this.props.style]}>
          {this.props.children}
        </View>
        {rightButtons}
      </MeasureableView>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  outerScroll: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
  },
});

module.exports = { SwipeableRow, SwipeableRow2, AnimView,MeasureableView };
