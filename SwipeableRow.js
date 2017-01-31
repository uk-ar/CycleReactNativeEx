
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

import { LayoutableView } from './Closeable';
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
        this.props.onRelease();
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
        }
        // console.log("on",gestureStateSave,this.row.getCurrentAction())
      });
    }
    render() {
      const { onSwipeEnd, onSwipeStart, onRelease , ...props } = { ...this.props };
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
          toValue: width * 2,
          //duration:10000
        })
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
    //console.log("width",this.props.width,width)
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
        <View style={{ width:this.props.width }}>
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
SwipeableRow3.propTypes = {
  ...View.propTypes, //  ...Closable.propTypes,
  onSwipeStart: React.PropTypes.func,
  onSwipeEnd: React.PropTypes.func,
  onRelease: React.PropTypes.func,
  leftActions: React.PropTypes.array.isRequired,
  rightActions: React.PropTypes.array.isRequired,
  renderActions: React.PropTypes.func,
  transitionEnter:React.PropTypes.bool,
  width:React.PropTypes.number,
};

SwipeableRow3.defaultProps = {
  ...View.defaultProps,
  onSwipeStart: emptyFunction,
  onSwipeEnd: emptyFunction,
  onRelease: emptyFunction,
  leftActions: [],
  rightActions: [],
  width:SWIPEABLE_MAIN_WIDTH,
};

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
    //console.log("st",style)
    return (
      <Stylish.View
        ref={c => (this.root = c)}
        {...props}
        style={[style, {
            backgroundColor: currentAction.backgroundColor,
            //justifyContent:"flex-end",
            //overflow: 'hidden'
          }
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
SwipeableActions.propTypes = {
  lock:React.PropTypes.bool,
  actions:React.PropTypes.array.isRequired,
};

SwipeableActions.defaultProps = {
};
/////////////////////////////////
var {width:WIDTH} = Dimensions.get('window');

class PanResponderView2 extends React.Component {
  constructor(props) {
    super(props);
    //this.panX = new Animated.Value(0.01);
    function isSwipeHorizontal(evt, gestureState) {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          && Math.abs(gestureState.dx) > 10;
    }
    const { onSwipeMove, onSwipeStart, onSwipeEnd, onSwipeDirectionChange,
            ...otherProps } = props;
    let positiveSwipe = true;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      // for select cell
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: isSwipeHorizontal,
      onMoveShouldSetPanResponderCapture: isSwipeHorizontal,
      // no effect
      // onShouldBlockNativeResponder: (evt, gestureState) => false,
      onPanResponderGrant: (evt, gestureState) => {
        onSwipeStart(gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        onSwipeMove(gestureState);
        if(0 < gestureState.dx && !positiveSwipe){
          positiveSwipe = true;
          onSwipeDirectionChange(true);
        }else if(gestureState.dx <= 0 && positiveSwipe){
          positiveSwipe = false;
          onSwipeDirectionChange(false);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        onSwipeEnd(gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        onSwipeEnd(gestureState);
      },
    });
    /* this.panX.addListener(({ value }) => {
     *   if (value > 0 && this.state.positiveSwipe != true) {
     *     this.setState({ positiveSwipe: true });
     *   } else if (value <= 0 && this.state.positiveSwipe != false) {
     *     this.setState({ positiveSwipe: false });
     *   }
     * }*/
  }
  render(){
    const { onSwipeMove, onSwipeStart, onSwipeEnd, onSwipeDirectionChange,
            ...otherProps } = this.props;
    return(
      <View
        {...this.panResponder.panHandlers}
        {...otherProps}
      />
    )
  }
}
PanResponderView2.propTypes = {
  ...View.propTypes, //  ...Closable.propTypes,
  onSwipeStart: React.PropTypes.func,
  onSwipeEnd: React.PropTypes.func,
  onSwipeMove: React.PropTypes.func,
  onSwipeDirectionChange: React.PropTypes.func,
};
PanResponderView2.defaultProps = {
  ...View.defaultProps,
  onSwipeStart: emptyFunction,
  onSwipeEnd: emptyFunction,
  onSwipeMove: emptyFunction,
  onSwipeDirectionChange: emptyFunction,
};

class ExpandableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index:0,
      thresholds:[],
    }
    this.panX = new Animated.Value(0.1);
    function calcIndex(value, thresholds) {
      let index = thresholds.findIndex((elem, i) =>
        value < elem
      );
      if (index === -1) { index = thresholds.length; }
      return index;
    }
    this.panX.addListener(({value:width})=>{
      const nextIndex = calcIndex(width, this.state.thresholds);
      if (nextIndex !== this.state.index && !this.props.indexLock) {
        this.setState({index:nextIndex},()=>this.props.onIndexChage(nextIndex))
      }
    })
  }
  render(){
    const { onIndexChage,
            renderElement, indexLock, enterFromLeft,
            ...props } = this.props;//  ...Closable.propTypes,
    //console.log("panx",this.panX)
    //console.log("ex")
    const offset =  this.state.thresholds[0];
    return(
      <View
        onLayout={Animated.event([
            { nativeEvent: { layout: { width:this.panX } } }
          ])}
        {...props}
      >
        <Animated.View style={[{
            //alignItems:"stretch",//not working
            //alignItems:"center",flex:1
            flex:1,
            overflow: "scroll",
            flexDirection: enterFromLeft ? "row" : "row-reverse",
            justifyContent: this.state.index === 0 ? "flex-end" : "flex-start"
            //backgroundColor:"blue"
          }]}>
          <Animated.View
            onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
                //console.log("onL1",this.state.index,this.state.thresholds,width,height)
                if(!this.state.thresholds[this.state.index] &&
                   (this.state.index === 0 ||
                    this.state.thresholds[this.state.index-1] !== width)){
                  this.setState((prevState,props)=>{
                    let thresholds = [...this.state.thresholds]
                    thresholds[this.state.index] = width;
                    return {thresholds:thresholds}
                  })
                }
              }}
            style={{}
            /* indexLock && {
               width: WIDTH,
               //backgroundColor:"red"
               //left: translateX
               } */}
          >
            { renderElement(this.state.index,indexLock) }
          </Animated.View>
        </Animated.View>
      </View>
    )
  }
}

ExpandableView.propTypes = {
  ...View.propTypes,
  onIndexChage: React.PropTypes.func,
  renderElement: React.PropTypes.func,
  indexLock: React.PropTypes.bool,
  enterFromLeft: React.PropTypes.bool,
  //width: React.PropTypes.instanceOf(Animated.Value),
};
ExpandableView.defaultProps = {
  ...View.defaultProps,
  onIndexChage: emptyFunction,
  renderElement: emptyFunction,
  indexLock: false,
  enterFromLeft: true,
};

Animated.ExpandableView=Animated.createAnimatedComponent(ExpandableView);

class SwipeableRow4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //index:0,
      positiveSwipe: true,
      releasing: false,
      leftBackgroundColor: 0,
      rightBackgroundColor: 0,
    }
    this.panX = new Animated.Value(0.1);
    this.index = 0;
  }
  render(){
    const { onClose, //width,
            renderLeftAction, renderRightAction,
            children,
            ...props } = this.props;//  ...Closable.propTypes,
    //        style={[style, { width: -10 }]}
    //console.log("sw4")
    return (
      <PanResponderView2
        style={{
          flexDirection: 'row',
          justifyContent: this.state.positiveSwipe ?
                          'flex-start' : 'flex-end',
          //overflow: 'hidden',
          //alignItems: 'stretch',
          width:WIDTH,
        }}
        onSwipeMove={Animated.event([
            {dx:this.panX}
          ])}
        onSwipeDirectionChange={(pos)=>{
            //console.log("pos",pos)
            this.setState({positiveSwipe:pos})
          }}
        onSwipeEnd={(gestureState)=>{
            //console.log("swiped",rowID,this.dataBlob[rowID].enable,rowData)
            if(this.index === 0){
              Animated.timing(this.panX,
                              {toValue:0,duration:300})
                      .start()
            }else{
              this.setState({releasing:true},()=>
                Animated.timing(this.panX,
                                this.state.positiveSwipe ?
                                {toValue: WIDTH, duration:300} :
                                {toValue:-WIDTH, duration:300})
                        .start(onClose)
              )
            }
          }}>
        {this.state.positiveSwipe && <Animated.ExpandableView
          key="left"
          style={{
            width:this.panX.interpolate({
              inputRange: [0  , 0.1, 1],
              outputRange:[0.1, 0.1, 1],
            }),
            justifyContent: this.state.positiveSwipe ?
                            'flex-start' : 'flex-end',
            backgroundColor: this.state.leftBackgroundColor
            //backgroundColor:"red",
            //alignItems:"stretch"
          }}
          enterFromLeft={true}
          indexLock={this.state.releasing}
          onIndexChage={(i)=>{
              this.index = i;
              //console.log("ch1:",i,this.index)
              //console.log("index change")
              //same timing as renderElement? -> no
            }}
          renderElement={renderLeftAction}
        />}
        <View style={{width:WIDTH}}>
          {children}
        </View>
        {!this.state.positiveSwipe &&
        <Animated.ExpandableView
          key="right"
          style={{
            width:Animated.multiply(this.panX, -1).interpolate({
              inputRange: [0  , 0.1, 1],
              outputRange:[0.1, 0.1, 1],
            }),
            justifyContent: this.state.positiveSwipe ?
                            'flex-start' : 'flex-end',
            backgroundColor: this.state.rightBackgroundColor
          }}
          enterFromLeft={false}
          indexLock={this.state.releasing}
          onIndexChage={(i)=>{
              //console.log("ch2:",i)
              this.index = i;
            }}
          renderElement={renderRightAction}
        />
        }
      </PanResponderView2>
    )
  }
}

SwipeableRow4.propTypes = {
  ...View.propTypes,
  onClose:  React.PropTypes.func.isRequired,
  renderLeftAction: React.PropTypes.func.isRequired,
  renderRightAction: React.PropTypes.func.isRequired,
};
SwipeableRow4.defaultProps = {
  ...View.defaultProps,
  onClose: emptyFunction,
  renderLeftAction: emptyFunction,
  renderRightAction: emptyFunction,
};

// scroll view base
// ref: http://browniefed.com/blog/react-native-animated-listview-row-swipe/
module.exports = { SwipeableRow4, SwipeableRow3, MeasureableView, SwipeableActions, withState2 };
