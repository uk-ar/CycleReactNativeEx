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
import {AnimView} from '../../AnimView';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
require("./nativeExample")
require("./default")
require("./SwipeableRowExample")
require("./SwipeableListViewExample")

require("./AnimViewExample")
require("./CloseableExample")
require("./BookCellExample")
require("./BookRowExample")
require("./BookListViewExample")

storiesOf('Action', module)
  .add('with liked', () => (
    <Action
      icon="heart-o"
      text="読みたい"
      backgroundColor="#03a9f4"
    />
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
      <TouchableHighlight
        onPress={()=>{
            this.setState(
              {index:(this.state.index+1)%3})
          }}>
        <SwipeableActions
          style={{width:widths[this.state.index]}}
          actions={leftActions}/>
      </TouchableHighlight>
    )
  }
}

storiesOf('SwipeableActions', module)
  .add('with book', () => (
    //style={{width:100,flexDirection:"row"}}
    <SwipeableActions
      style={{margin:50,height:10,backgroundColor:"red"}}
      actions={[<Text>foo</Text>,<Text>bar</Text>]}
    />
  )).add('with search', () => {
    const { leftActions, rightActions } = genActions2('search');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with liked', () => {
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

import {withDebug} from './common';
