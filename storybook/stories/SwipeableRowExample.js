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
      onSwipeEnd={(evt, gestureState)=>{
          0 < gestureState.dx ?
          action('left action')(evt, gestureState) :
          action('right action')(evt, gestureState)
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
        onSwipeEnd={(evt, gestureState)=>{
            0 < gestureState.dx ?
            action('left action')(evt, gestureState) :
            action('right action')(evt, gestureState)
          }}
        >
        <Text style={{backgroundColor:"red",height:100}}>bar</Text>
      </SwipeableRow3>
    )})
  .add('with row && small height', () =>(
    <Row />
  ))
