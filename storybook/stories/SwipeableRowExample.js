import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookCell} from '../../BookCell';
import {genActions2,Action} from '../../Action';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
import {withDebug,VerticalCenterView} from './common';

//with row && small height
class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lock:false };
  }
  render(){
    const { onSwipeEnd, ...props } = { ...this.props };
    return(
      <SwipeableRow3
        ref={c => this.row = c}
        {...genActions2('search')}
        renderActions={ actions => {
            return (
              <SwipeableActions
                actions={actions}
                lock={this.state.lock}
                     />
            )//need state index
          }}
        onSwipeEnd={(gestureState) => {
            const fn = onSwipeEnd || function () {};
            const velocity = gestureState.vx; // save value for async
            if (0 < gestureState.dx) {
              this.setState({ lock: true }, () => {
                if (this.row.getCurrentActions().state.index === 0) {
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
                if (this.row.getCurrentActions().state.index === 0) {
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
      >
          <View style={{backgroundColor:"blue",flex:1,justifyContent:"center"}}>
            <Text>bar</Text>
          </View>
      </SwipeableRow3>
    )
  }
}

storiesOf('SwipeableRow3', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with book', () => (
    <SwipeableRow3
      leftActions={[{text:"foo"}]}
      rightActions={[{text:"bar"}]}
    >
      <Text>baz</Text>
    </SwipeableRow3>
  ))
  .add('with callback', () => (
    <SwipeableRow3
      onSwipe={action('move')}
      onSwipeStart={action('start')}
      onSwipeEnd={action('end')}
      leftActions={[{text:"foo"}]}
      rightActions={[{text:"bar"}]}
      >
      <Text>baz</Text>
    </SwipeableRow3>
  ))
  .add('with release', () => (
    <SwipeableRow3
      leftActions={[{text:"foo"}]}
      rightActions={[{text:"bar"}]}
      onSwipeEnd={(gestureState)=>{
          0 < gestureState.dx ?
          action('left action')(gestureState) :
          action('right action')(gestureState)
        }}
      >
        <Text>bar</Text>
    </SwipeableRow3>
  ))
  .add('with actions && tall height', () => {
    const { leftActions, rightActions } = genActions2('liked');
    return(
      <SwipeableRow3
        leftActions={[{text:"foo"}]}
        rightActions={[{text:"bar"}]}
        onSwipeEnd={(gestureState)=>{
            console.log("gs:",gestureState)
            0 < gestureState.dx ?
            action('left action')(gestureState) :
            action('right action')(gestureState)
          }}
        >
        <Text style={{backgroundColor:"red",height:100}}>bar</Text>
      </SwipeableRow3>
    )})
  .add('with row && small height', () =>(
    <Row />
  ))
  .add('with default', () =>(
    <SwipeableRow3
      {...genActions2('search')}
      onSwipeEnd={(gestureState)=>{
          console.log("gs:",gestureState)
          0 < gestureState.dx ?
          action('left action')(gestureState) :
          action('right action')(gestureState)
        }}
    >
            <View style={{backgroundColor:"blue",flex:1,justifyContent:"center"}}>
              <Text>bar</Text>
            </View>
    </SwipeableRow3>
  ))

class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index:0 };
  }
  render(){
    const { leftActions, rightActions } = genActions2('search');
    const widths=[10,150,300]
    return (
      <View style={{marginTop:20}}>
        <Text
          onPress={()=>{
              this.setState(
                {index:(this.state.index+1)%3})
            }}>
          Press me
        </Text>
        <SwipeableActions
          style={{width:widths[this.state.index]}}
          actions={leftActions}/>
      </View>
    )
  }
}

storiesOf('SwipeableActions', module)
  .add('with book', () => (
    //style={{width:100,flexDirection:"row"}}
    //      actions={[<Text>foo</Text>,<Text>bar</Text>]}
    <SwipeableActions
      style={{margin:50,height:10,width:50}}
      actions={[{text:"foo"},{text:"bazz"}]}
    />
  )).add('with search text', () => {
    const { leftActions, rightActions } = genActions2('search');
    console.log("la",leftActions)
    return (
      <View style={{alignSelf:"center"}}
      >
        <SwipeableActions
          style={{height:50,width:10,marginTop:20}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:20}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:25}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:30}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:35}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:40}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:50}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:100}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:200}}
          actions={leftActions}/>
        <SwipeableActions
          style={{height:50,width:100}}
          actions={rightActions}/>
      </View>
    )
  })
  .add('with search reverse', () => {
    const { leftActions, rightActions } = genActions2('search');
    console.log("la",leftActions)
    return (
      <View style={{alignSelf:"flex-end",alignItems:"flex-end"}}
      >
        <SwipeableActions
          style={{height:50,width:10,marginTop:20}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:20}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:25}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:30}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:35}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:40}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:50}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:100}}
          actions={rightActions}/>
        <SwipeableActions
          style={{height:50,width:200}}
          actions={rightActions}/>
      </View>
    )
  })
  .add('with liked', () => {
    const { leftActions, rightActions } = genActions2('liked');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with borrowed', () => {
    const { leftActions, rightActions } = genActions2('borrowed');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with done', () => {
    const { leftActions, rightActions } = genActions2('done');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with Toggle', () => {
    const { leftActions, rightActions } = genActions2('search');
    return (
      <Actions />
    )}).add('with sw b', () => {
      const { leftActions, rightActions } = genActions2('done');
      return (
        <SwipeableButtons2
          ref="rightButtons"
          direction="right"
          width={new Animated.Value(100)}
          buttons={leftActions}
        />
      )
    })
