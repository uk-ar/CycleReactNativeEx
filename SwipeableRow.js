
import React from 'react';

import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  Text,
} from 'react-native';

const _ = require('lodash');
const cloneReferencedElement = require('react-clone-referenced-element');

import { AnimView } from './AnimView';
import { Closeable3 } from './Closeable';
// const Dimensions = require('Dimensions');
// import { BookRow, BookRow1, Action, genActions, genActions2 } from './BookRow';
import { Action, genActions, genActions2 } from './Action';

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
// Visible toggle hidden display
class MeasureableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { layouted: false };
  }
  render() {
    return (
      this.state.layouted ?
      <View
        {...this.props}
      >
        {this.props.children}
      </View> :
      <View
        {...this.props}
        style={[this.props.style, { position: 'absolute', opacity: 0 }]}
        onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
          if (!this.state.layouted) {
            this.props.onFirstLayout &&
              this.props.onFirstLayout(
                { nativeEvent: { layout: { x, y, width, height } } });
            this.setState({ layouted: true });
          }
        }}
      >
        {this.props.children}
      </View>);
  }
}

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

    return new Promise((resolve, reject) => {
      Animated.timing(this.props.width,
                    { toValue: !close ? 0.001 :
                     this.props.direction == 'left' ? SWIPEABLE_MAIN_WIDTH
                   : -SWIPEABLE_MAIN_WIDTH,
                      duration: 180 }
    ).start(() => {
      /* this.currentButton.props.onRelease &&
       * this.currentButton.props.onRelease();*/
      this.releasing = false;
      resolve();
    });
    });
  },
  getTarget() {
    // console.log("buttons",this.props.buttons[this.state.index].props.target)
    return this.props.buttons[this.state.index].props.target || null;
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
                    this.props.width.addListener(({ value }) => {
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
  let index = thresholds.findIndex((elem, index) => {
    return value < elem;
  });
  if (index == -1) { index = thresholds.length - 1; }
  return index;
}
// console.log("c",calcIndex(0,[30,50,80]))
// const horizontalPanResponder =
// console.log("cl:",Closeable,View)
// https://github.com/facebook/react-native/blob/master/Libraries/Experimental/SwipeableRow/SwipeableListView.js

function withState2(DecoratedComponent) {
  console.log('withState2 deco');
  return class extends DecoratedComponent {
    constructor(props) {
      super(props);
      console.log('withState2');
      this.state = { ...this.state, lock: false };
    }
    render() {
      const { onSwipeEnd, ...props } = { ...this.props };
      return (
        <DecoratedComponent
          ref={c => this.row = c}
          renderActions={(actions) => {
            return (
                <SwipeableActions
                  actions={actions}
                  lock={this.state.lock}
                />
              );// need state index
          }}
          onSwipeEnd={(gestureState) => {
            const fn = onSwipeEnd || function () {};
            const velocity = gestureState.vx; // save value for async
            if (0 < gestureState.dx) {
              this.setState({ lock: true }, () => {
                if (this.row.getCurrentActions().state.index == 0) {
                  this.row.swipeToFlat(velocity)
                        .then(() => this.setState({ lock: false }, () =>
                                                Promise.resolve()))
                        .then(() => fn(gestureState));
                } else {
                  this.row.swipeToMax(velocity)
                        .then(() => this.row.close())
                        .then(() => fn(gestureState));
                }
              });
            } else {
              this.setState({ lock: true }, () => {
                if (this.row.getCurrentActions().state.index == 0) {
                  this.row.swipeToFlat(velocity)
                        .then(() => this.setState({ lock: false }, () =>
                                                Promise.resolve()))
                        .then(() => fn(gestureState));
                } else {
                  this.row.swipeToMin(velocity)
                        .then(() => this.row.close())
                        .then(() => fn(gestureState));
                }
              });
                // this.rightActions.props.onSwipeEnd(this.row)
            }
          }}
          {...props}
        />
      );
    }
  };
}


// decorator cannot works with storybook
// @withState2//
class _SwipeableRow3 extends React.Component {
  /* onSwipeEnd={() => this._setListViewScrollable(true)}
   * onSwipeStart={() => this._setListViewScrollable(false)}*/
  constructor(props) {
    super(props);
    console.log('SwipeableRow3');
    this.state = {
      positiveSwipe: true,
    };

    function isSwipeHorizontal(evt, gestureState) {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          && Math.abs(gestureState.dx) > 10;
    }
    this._panX = new Animated.Value(0.01);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: isSwipeHorizontal,
      onMoveShouldSetPanResponderCapture: isSwipeHorizontal,

      onPanResponderGrant: (evt, gestureState) => {
        this.props.onSwipeStart && this.props.onSwipeStart(gestureState); },
      /* onPanResponderMove: (evt, gestureState) =>{
       *   this._panX.setValue(gestureState.dx);
       *   //this.props.onSwipe && this.props.onSwipe(evt, gestureState)
       * },*/
      onPanResponderMove: Animated.event([
        null,                // raw event arg ignored
        { dx: this._panX },    // gestureState arg
      ]), // for performance
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('aa', gestureState.vx);
        this.props.onSwipeEnd && this.props.onSwipeEnd(gestureState);
      }
    });
    // console.log("pan",this._panResponder,this._panResponder.getInteractionHandle())
    this._panX.addListener(({ value }) => {
      if (0 < value && this.state.positiveSwipe != true) {
        this.setState({ positiveSwipe: true });
      } else if (value <= 0 && this.state.positiveSwipe != false) {
        this.setState({ positiveSwipe: false });
      }
    });
  }
  swipeTo(anim) {
    return new Promise((resolve, reject) => {
      anim.start(() => resolve());
    });
  }
  swipeToFlat(velocity) {
    return this.swipeTo(
      Animated.spring(this._panX, {
        toValue: 0.01,
        tension: 400, // default 40
        velocity }));
  }
  swipeToMax(velocity) {
    return this.swipeTo(
      Animated.parallel([
        Animated.decay(this._panX, {
          velocity
        }),
        Animated.timing(this._panX, {
          toValue: width * 2 })
        /* ,
         * Animated.spring(this._panX, {
         *   toValue: width })*/
      ]));
  }
  swipeToMin(velocity) {
    return this.swipeTo(
      Animated.parallel([
        Animated.decay(this._panX, {
          deceleration: 0.1, // default 0.997,
          velocity
        }),
        Animated.timing(this._panX, {
          toValue: -width * 2 })
        /* Animated.spring(this._panX, {
         *   toValue: -width })*/
      ]));
  }
  close() {
    return this._root.close();
  }
  getCurrentActions() {
    return this.state.positiveSwipe ? this.leftActions : this.rightActions;
  }
  render() {
    const { onSwipeStart, onSwipeEnd,
            leftActions, rightActions, renderActions,
            children, style, ...props } = this.props;
    // console.log("th:",this.props)
    // cloneReferencedElement
    console.log('tp:', this.props);
    /* let leftActionsElement = null;
     * let rightActionsElement = null;*/
    const leftActionsElement = cloneReferencedElement(
      renderActions(leftActions), {
        ref: c => this.leftActions = c
      });
    const rightActionsElement = cloneReferencedElement(
      renderActions(rightActions), {
        ref: c => this.rightActions = c
      });

    return (
      <Closeable3
        ref={c => this._root = c}
        {...this._panResponder.panHandlers}
        {...props}
        style={[style, {
          flexDirection: 'row',
          justifyContent: this.state.positiveSwipe ?
                            'flex-start' : 'flex-end',
          overflow: 'hidden',
          alignItems: 'stretch'
        }]}
      >
        <Animated.View style={{ width: this._panX }}>
          {leftActionsElement}
        </Animated.View>
        <View style={{ width }}>
          {children}
        </View>
        <Animated.View style={{ width: Animated.multiply(this._panX, -1) }}>
          {rightActionsElement}
        </Animated.View>
      </Closeable3>
    );
  }
}
const SwipeableRow3 = withState2(_SwipeableRow3);
// const SwipeableRowW = null//withState2(SwipeableRow3)

class SwipeableActions extends React.Component {
  /* onSwipeEnd={() => this._setListViewScrollable(true)}
   * onSwipeStart={() => this._setListViewScrollable(false)}*/
  setNativeProps(nativeProps) {
    // for Touchable
    this._root.setNativeProps(nativeProps);
  }
  constructor(props) {
    super(props);
    this.state = { index: null };
    this.thresholds = [];
    // this.width = new Animated.Value(0.1);
    // cannot trac value
    // this.width
  }
  /* componentWillReceiveProps(nextProps){
   *   console.log(nextProps)
   * }*/
  render() {
    const { actions, style, ...props } = this.props;
    if (this.state.index == null) {
      /* style={{ flexDirection: 'row',
       *          opacity: 0,
       *          width: 0.01,
       *          overflow: 'hidden' }}
       */
      return (
      <View
        ref={c => this._root = c}
        {...props}
        style={{
          flexDirection: 'row',
          opacity: 0,
        }}
      >
        {actions.map((action, i, array) => {
          return (
             <MeasureableView
               key={i}
               onFirstLayout={
                 ({ nativeEvent: { layout: { x, y, width, height } } }) => {
                   this.thresholds[i] = width;
                   if (Object.keys(this.thresholds).length == array.length) {
                     this.setState({ index: 0 });// for re-render
                     // console.log("comp",this.thresholds)
                   }
                 }}
             >
               <Action {...action} />
             </MeasureableView>
          );
        })}
      </View>);
    }
    // console.log("in",this.state.index)
    // currentAction = this.getCurrentAction();
    currentAction = actions[this.state.index];
    // onLayout has paformance problems?
    // onLayout may cause over position
    // cannot addListener to multiply animatedValue...
    //        style={[{width:width},otherStyle]}
    return (
      <AnimView
        ref={c => this._root = c}
        {...props}
        style={[style,
                { backgroundColor: currentAction.backgroundColor,
                  overflow: 'hidden' }
          ]}
        onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
          const index = calcIndex(width, this.thresholds);
            // this.width = width;
          if (this.state.index !== index && !this.props.lock) {
            this.setState({ index });
          }
            /* console.log("onlay:",width,this.thresholds,
               index,actions[this.state.index]) */
        }}
      >
        <Action {...currentAction} />
      </AnimView>
    );
    /* this.props.width.addListener(({ value }) => {
     *   if (this.releasing) { return; }

     *   let index = calcIndex(value, this.thresholds);
     *   if (this.props.direction == 'right') {
     *     index = calcIndex(-value, this.thresholds);
     *   }

     *   if (index != -1 && this.state.index != index) {
     *     this.setState({ index });
     *   }
     * });*/
    /* {actions.map(action =>
        React.isValidElement(action) ?
        action : <Text>{action}</Text>)} */
    /* this.props.width.addListener(({ value }) => {
     *   if (this.releasing) { return; }

     *   let index = calcIndex(value, this.thresholds);
     *   if (this.props.direction == 'right') {
     *     index = calcIndex(-value, this.thresholds);
     *   }

     *   if (index != -1 && this.state.index != index) {
     *     this.setState({ index });
     *   }
     * });*/
    /* {actions.map(action =>
        React.isValidElement(action) ?
        action : <Text>{action}</Text>)} */
  }
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
          this.props.onRelease(this.state.positiveSwipe);
          /* this.refs.leftButtons.release().then(()=>
           *   this.props.onRelease());*/
        } else {
          this.props.onRelease(this.state.positiveSwipe);
          /* this.refs.rightButtons.release().then(()=>
           *   this.props.onRelease());*/
        }
      },

      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
    this._panX.addListener(({ value }) => {
      if (0 < value && this.state.positiveSwipe != true) {
        this.setState({ positiveSwipe: true });
      } else if (value <= 0 && this.state.positiveSwipe != false) {
        this.setState({ positiveSwipe: false });
      }
    });
  },

  render() {
    // console.log('sr2:');
    /* React.cloneElement(,
     *                      {ref:})*/
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
        {this.props.renderLeftActions(this._panX)}
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

// module.exports = { SwipeableButtons2, SwipeableRow2, SwipeableRow3, AnimView, MeasureableView, SwipeableActions,SwipeableRowW ,withState2};

module.exports = { SwipeableButtons2, SwipeableRow2, SwipeableRow3, AnimView, MeasureableView, SwipeableActions, withState2 };
