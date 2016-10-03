import React from 'react';
const ReactNative = require('react-native');
const FAIcon = require('react-native-vector-icons/FontAwesome');

import materialColor from 'material-colors';
import { styles } from './styles';
import { itemsInfo } from './common';

const _ = require('lodash');

const {
  ActivityIndicator,
  Text,
  View,
  Image,
  Animated,
  Platform,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableNativeFeedback,
} = ReactNative;
// jest bug
import Touchable from '@cycle/react-native/src/Touchable';
// const Touchable = require('@cycle/react-native/src/Touchable');
// const Touchable = require('@cycle/react-native/lib/Touchable');
// import Touchable from '@cycle/react-native/lib/Touchable';

const Dimensions = require('Dimensions');
const {
  width,
} = Dimensions.get('window');

import { SwipeableRow2, SwipeableRow3, SwipeableActions, SwipeableButtons2 } from './SwipeableRow';

import { AnimView } from './AnimView';
import { Action, genActions, genActions2 } from './Action';
// function BookRow({ bucket, book, onRelease, style }) {
class BookRow0 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      close: true,
      bounceValue: new Animated.Value(0),
      props: { style: { height: 0.1 },
               anim: { delay: 5000 } }
    };
  }
  componentDidMount() {
    // console.log('didmount', this, this.props.book);
    // this.state.bounceValue.setValue(1.5);     // Start large
    Animated.timing(                          // Base: spring, decay, timing
                                              this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 1,                         // Animate to smaller size
        duration: 5000,                          // Bouncier spring
      }
    ).start();
    /* this.refs.outer.open().then(
     *   this.setState({close:false})
     * )*/
    console.log('th:', this);
    // this.onMount(()=>console.log("onMount"))
    /* this.setState(
     *   {props:{style:{height:80},
     *           anim: {delay:2000}}})*/
    // this.anim.animateTo({height:80})
    // console.log("ta:",this.anim)
    // this.setState({close:!this.state.close})
  }
  // class style because of ref to leftActions
  close() {
    console.log('close');
    return new Promise(resolve =>
      setTimeout(() => {
        console.log('promise done');
        resolve('resolve');
      }, 5000)
    );
  }
  render() {
    const { bucket, book, onRelease, style } = this.props;
    // There is 3 type of close behavior
    // animated left only
    // animated right and vertical close permanently
    // animated right and vertical close temporary
    // onSwipeEnd onSwipeStart
    // expand or close
    // skip close behavior
    // (book,bucket)=>closeanimate.start(onRelease)
    // onRelease is cycle:touchable element
    const { leftButtons, rightButtons } = getButtons(bucket, book);
    return (
      // CloseableCompo
      // need ref & React.cloneElement?
      // onSwipeStart responder move
      // onSwipeEnd responder end
      // onOpen responder end(not closed)
      /* style={{
         opacity:this.state.bounceValue,
         height: this.state.close ? 50 : 80
         }}
         onLayout={c=>console.log('lay', this, this.props.book)}
         {...this.state.props}
         {c => {
         this.anim = c;
         console.log("this.anim:",this.anim)
         //this.anim.animateTo({height:80})
         }}
         <Closeable3
         direction="vertical"
         style={{ overflow: 'hidden'}}
         close={false}
         ref="outer"
         >
       */
      <TouchableHighlight
        onPress={() => {
          console.log(this);
          this.refs.anim.animateTo({ height: 80 });
            // this.setState({close:!this.state.close})
          console.log('mypress'); }}
      >
        <AnimView
          ref={(c) => {
            console.log('ref:', this, this.props.book);
            this.anim = c; }}
          style={{
            opacity: this.state.bounceValue,
            height: this.state.close ? 50 : 80
          }}
        >
          <SwipeableRow2
            ref={
              // c=>console.log('ref:', this, this.props.book)
              null
                }
            onSwipeStart={() => console.log('start')}
            onSwipeEnd={() => console.log('end')}
            onOpen={() => console.log('open')}
            onRelease={(positiveSwipe) => {
                // this.refs.leftButtons.state
              console.log('zzz',
                            this.leftActions.state.index,
                            this.leftActions.getTarget());
                /* this.refs.leftButtons.release().then(()=>
                   this.props.onRelease())
                 */
                // console.log("zzz",this.leftActions.state.index)
              if (positiveSwipe) {
                this.leftActions.release().then(() =>
                    onRelease(book, this.leftActions.getTarget(), this)
                  );
              }
            }}
            renderLeftActions={width =>
              <SwipeableButtons2
                ref={c => this.leftActions = c}
                direction="left"
                width={width}
                buttons={leftButtons}
              />}
            rightButtons={rightButtons}
          >
              <BookCell
                book={book}
                style={style}
              />
          </SwipeableRow2>
        </AnimView>
      </TouchableHighlight>
    );//
  }
}

class BookRow1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lock: false };
  }
  render() {
    const { bucket, onSwipeEnd, onSwipeStart, ...props } = this.props;
    // TODO:parameterize leftActions & rightActions
    return (
      <SwipeableRow3
        {...props}
        ref={c => this.row = c}
        {...genActions2(bucket)}
        renderActions={ actions => {
            return (
              <SwipeableActions
                actions={actions}
                lock={this.state.lock}
                     />
            )//need state index
          }}
        onSwipeStart={(evt, gestureState) => onSwipeStart(gestureState)}
        onSwipeEnd={(evt, gestureState)=>{
            const velocity = gestureState.vx //save value for async
            if(0 < gestureState.dx){
              this.setState({lock:true},()=>{
                if(this.row.getCurrentActions().state.index == 0){
                  this.row.swipeToFlat(velocity)
                  this.setState({lock:false})
                } else {
                  this.row.swipeToMax(velocity)
                      .then(()=> this.row.close())
                }
              })
            }else{
              this.setState({lock:true},()=>{
                if(this.row.getCurrentActions().state.index == 0){
                  this.row.swipeToFlat(velocity)
                  this.setState({lock:false})
                } else {
                  this.row.swipeToMin(velocity)
                      .then(()=> this.row.close())
                }
              })
              //this.rightActions.props.onSwipeEnd(this.row)
            }
          }}
      />
    );
  }
}

class BookRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(null),
    };
  }
  componentDidMount() {
    console.log('th:', this);
    // this.anim.animate({height:0.1},{height:80})
    // this.state.height.setValue(0.1)
    /* Animated.timing(this.state.height,{
     *   ToValue:100,
     *   duration:5000,
     *   delay:5000,
     * }
     * ).start(() => console.log("fin:"));*/
  }
  render() {
    console.log('rend?');
    const { bucket, book, onRelease, style } = this.props;
    const { leftButtons, rightButtons } = getButtons(bucket, book);
    return (
      //        style={{height:this.state.height}}
      <Animated.View >
        {/* <AnimView
        ref={c => {
        //console.log('ref:', this, this.props.book);
        this.anim = c;
        //this.anim.animateTo({height:80})
        }}
        style={{
        opacity:this.state.bounceValue,
        //height: this.state.close ? 50 : 80
        height: 40
        }}
        > */}
        <SwipeableRow2
          ref={
              // c=>console.log('ref:', this, this.props.book)
              null
              }
          onSwipeStart={() => console.log('start')}
          onSwipeEnd={() => console.log('end')}
          onOpen={() => console.log('open')}
          onRelease={(positiveSwipe) => {
              // this.refs.leftButtons.state
            console.log('zzz',
                          this.leftActions.state.index,
                          this.leftActions.getTarget());
              /* this.refs.leftButtons.release().then(()=>
                 this.props.onRelease())
               */
              // console.log("zzz",this.leftActions.state.index)
            if (positiveSwipe) {
              this.leftActions.release().then(() =>
                  onRelease(book, this.leftActions.getTarget(), this)
                );
            }
          }}
          renderLeftActions={width =>
            <SwipeableButtons2
              ref={c => this.leftActions = c}
              direction="left"
              width={width}
              buttons={leftButtons}
            />}
          rightButtons={rightButtons}
        >
            <BookCell
              book={book}
              style={style}
            />
        </SwipeableRow2>
        {/* </AnimView> */}
      </Animated.View>
    );//
  }
}
module.exports = { BookRow, BookRow1 };