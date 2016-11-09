
import React from 'react';

import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  InteractionManager,
  Text,
} from 'react-native';

import cloneReferencedElement from 'react-clone-referenced-element';
import emptyFunction from 'fbjs/lib/emptyFunction';

import Stylish from 'react-native-stylish';

import { CloseableView, LayoutableView } from './Closeable';
import { Action } from './Action';

const {
  width,
} = Dimensions.get('window');

const SWIPEABLE_MAIN_WIDTH = width;

class MeasureableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { layouted: false };
  }
  render() {
    return (
      this.state.layouted ?
        <View {...this.props}>
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

function withState2(RowComponent) {
  // handle actions
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { ...this.state, lock: false };
      this.onSwipeEnd = this.onSwipeEnd.bind(this);
    }
    close(onComplete) {
      return this.row.close(onComplete);// _SwipeableRow3
    }
    onSwipeEnd(gestureState) {
      // const fn = ;//TODO:default
      const gestureStateSave = { ...gestureState }; // save value for async
      this.setState({ lock: true }, () => {
        // let promise;
        if (this.row.getCurrentActions().state.index === 0) {
          this.row.swipeToFlat(gestureStateSave.vx, () =>
            this.setState({ lock: false })
          );
          /* .then(() => )
           * .catch(() => { throw new Error("foo") })*/
        } else {
          let promise;
          const fn = () =>
            this.row
                .close(() => {
                  this.props.onSwipeEnd({
                    gestureState: gestureStateSave,
                    action: this.row.getCurrentAction() });
                });
          /* .then()
           * .catch(() => { throw new Error("foo?") })*/
          if (gestureStateSave.dx > 0) {
            this.row.swipeToMax(gestureStateSave.vx, fn);
          } else {
            this.row.swipeToMin(gestureStateSave.vx, fn);
          }
          /* promise
           *   .then(() => this.row.close())
           *   .then(() => {
           *     console.log("gecua",this.row.getCurrentAction())
           *     this.props.onSwipeEnd({
           *       gestureState:gestureStateSave,
           *       action:this.row.getCurrentAction()})
           *   })
           *   .catch(() => { throw new Error("foo?") })*/
        }
        // console.log("on",gestureStateSave,this.row.getCurrentAction())
      });
    }
    render() {
      const { onSwipeEnd, onSwipeStart, ...props } = { ...this.props };
      return (
        <RowComponent
          {...props}
          ref={c => this.row = c}
          renderActions={actions =>
            <SwipeableActions
              actions={actions}
              lock={this.state.lock}
              style={{ flex: 1 }}
            />
          }
          onSwipeEnd={this.onSwipeEnd}
          onSwipeStart={gestureState =>
            onSwipeStart({ gestureState, action: this.row.getCurrentAction() })}
        />
      );
    }
  };
}


// decorator cannot works with storybook
// @withState2//
class _SwipeableRow3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveSwipe: true,
    };

    function isSwipeHorizontal(evt, gestureState) {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          && Math.abs(gestureState.dx) > 10;
    }
    this.panX = new Animated.Value(0.01);

    const { onSwipeStart, onSwipeEnd, ...otherProps } = props;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      // for select cell
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: isSwipeHorizontal,
      onMoveShouldSetPanResponderCapture: isSwipeHorizontal,
      // no effect
      // onShouldBlockNativeResponder: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        onSwipeStart && onSwipeStart(gestureState);
      },
      /* onPanResponderMove: (evt, gestureState) =>{
       *   this.panX.setValue(gestureState.dx);
       *   //this.props.onSwipe && this.props.onSwipe(evt, gestureState)
       * },*/
      onPanResponderMove: Animated.event([
        null,                // raw event arg ignored
        { dx: this.panX },    // gestureState arg
      ]), // for performance
      onPanResponderRelease: (evt, gestureState) => {
        onSwipeEnd && onSwipeEnd(gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        onSwipeEnd && onSwipeEnd(gestureState);
      },
    });
    this.panX.addListener(({ value }) => {
      if (value > 0 && this.state.positiveSwipe != true) {
        this.setState({ positiveSwipe: true });
      } else if (value <= 0 && this.state.positiveSwipe != false) {
        this.setState({ positiveSwipe: false });
      }
    });
    this.getCurrentActions = this.getCurrentActions.bind(this);
    this.getCurrentAction = this.getCurrentAction.bind(this);
    this.swipeTo = this.swipeTo.bind(this);
    this.close = this.close.bind(this);
  }
  swipeTo(anim, fn) {
    // return new Promise((resolve, reject) => {
    anim.start(()=>InteractionManager.runAfterInteractions(fn));
    // })
  }
  swipeToFlat(velocity, fn) {
    return this.swipeTo(
      Animated.spring(this.panX, {
        toValue: 0.01,
        tension: 400, // default 40
        velocity
      }), fn);
  }
  swipeToMax(velocity, fn) {
    return this.swipeTo(
      Animated.parallel([
        Animated.decay(this.panX, {
          velocity
        }),
        Animated.timing(this.panX, {
          toValue: width * 2 })
        /* ,
         * Animated.spring(this.panX, {
         *   toValue: width })*/
      ]), fn);
  }
  swipeToMin(velocity, fn) {
    return this.swipeTo(
      Animated.parallel([
        Animated.decay(this.panX, {
          deceleration: 0.1, // default 0.997,
          velocity
        }),
        Animated.timing(this.panX, {
          toValue: -width * 2 })
      ]), fn);
  }
  close(onComplete) {
    // console.log("root",this)
    // this.row
    return this.root.close(onComplete);
  }
  getCurrentActions() {
    // console.log("actions",this.row,this.state.positiveSwipe, this.leftActions ,this.rightActions)
    return this.state.positiveSwipe ? this.leftActions : this.rightActions;
  }
  getCurrentAction() {
    const actions = this.getCurrentActions();
    return actions.props.actions[actions.state.index];
  }
  render() {
    const { onSwipeStart, onSwipeEnd,
            leftActions, rightActions, renderActions,
            children, style, ...props } = this.props;
    // const leftActionsElement = cloneReferencedElement(
    const leftActionsElement = React.cloneElement(
      renderActions(leftActions), {
        ref: c => (this.leftActions = c)
      });
    const rightActionsElement = React.cloneElement(
      renderActions(rightActions), {
        ref: c => (this.rightActions = c)
      });
    return (
      <LayoutableView
        ref={c => (this.root = c)}
        {...this.panResponder.panHandlers}
        {...props}
        style={[style, {
          flexDirection: 'row',
          justifyContent: this.state.positiveSwipe ?
                            'flex-start' : 'flex-end',
          overflow: 'hidden',
          alignItems: 'stretch'
        }]}
      >
        <Animated.View style={{ width: this.panX }}>
          {leftActionsElement}
        </Animated.View>
        <View style={{ width }}>
          {children}
        </View>
        <Animated.View style={{ width: Animated.multiply(this.panX, -1) }}>
          {rightActionsElement}
        </Animated.View>
      </LayoutableView>
    );
  }
}
const SwipeableRow3 = withState2(_SwipeableRow3);

class SwipeableActions extends React.Component {
  setNativeProps(nativeProps) {
    // for Touchable
    this.root.setNativeProps(nativeProps);
  }
  constructor(props) {
    super(props);
    this.state = { index: null };
    this.thresholds = [];
  }
  /* getCurrentAction() {
   *   return this.props.actions[this.state.index];
   * }*/
  render() {
    // console.log("c",calcIndex(0,[30,50,80]))
    function calcIndex(value, thresholds) {
      let index = thresholds.findIndex((elem, i) =>
        value < elem
      );
      if (index === -1) { index = thresholds.length - 1; }
      return index;
    }
    const { actions, style, ...props } = this.props;
    if (this.state.index == null) {
      /* style={{ flexDirection: 'row',
       *          opacity: 0,
       *          width: 0.01,
       *          overflow: 'hidden' }}
       */
      return (
        <View
          ref={c => (this.root = c)}
          {...props}
          style={{
            flexDirection: 'row',
            opacity: 0,
          }}
        >
          {actions.map((action, i, array) =>
            <MeasureableView
              key={i}
              onFirstLayout={
                ({ nativeEvent: { layout: { x, y, width, height } } }) => {
                  this.thresholds[i] = width;
                  if (Object.keys(this.thresholds).length === array.length) {
                    this.setState({ index: 0 });// for re-render
                  }
                }}
            >
              <Action {...action} />
            </MeasureableView>
           )}
        </View>);
    }
    const currentAction = actions[this.state.index];
    // onLayout may cause over position
    // but cannot addListener to multiply animatedValue...
    return (
      <Stylish.View
        ref={c => (this.root = c)}
        {...props}
        style={[style,
          { backgroundColor: currentAction.backgroundColor,
            overflow: 'hidden' }
        ]}
        onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
          const index = calcIndex(width, this.thresholds);
          if (this.state.index !== index && !this.props.lock) {
            this.setState({ index });
          }
        }}
      >
        <Action {...currentAction} />
      </Stylish.View>
    );
  }
}
SwipeableRow3.propTypes = {
  ...View.propTypes, //  ...Closable.propTypes,
  onSwipeStart: React.PropTypes.func,
  onSwipeEnd: React.PropTypes.func,
  leftActions: React.PropTypes.array.isRequired,
  rightActions: React.PropTypes.array.isRequired,
  renderActions: React.PropTypes.func,
};

SwipeableRow3.defaultProps = {
  ...View.defaultProps,
  onSwipeStart: emptyFunction,
  onSwipeEnd: emptyFunction,
  leftActions: [],
  rightActions: [],
};

// scroll view base
// ref: http://browniefed.com/blog/react-native-animated-listview-row-swipe/
module.exports = { SwipeableRow3, MeasureableView, SwipeableActions, withState2 };
