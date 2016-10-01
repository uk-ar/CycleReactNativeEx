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
import {genActions,Action,BookCell} from '../../BookCell';
import {AnimView} from '../../AnimView';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
require("./nativeExample")
require("./default")
require("./SwipeableRowExample")
require("./CloseableExample")
require("./BookCellExample")
require("./AnimViewExample")

storiesOf('BookCell', module)
  .add('with book', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'ぐりとぐらの絵本7冊セット', author: '',
        thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
        libraryStatus: {
          exist: false,
          rentable: false,
          reserveUrl: '',
        },
        isbn: '9784834032147',
        active: true,
      }}
    />
  ))
  .add('with panresponder', () => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: ()=>true,
      onMoveShouldSetPanResponder:  ()=>true,
      onPanResponderMove: action('move'),
      onPanResponderRelease: action('release')
    })
    return (
      <BookCell
        {...panResponder.panHandlers}
        book={{
        title: 'foo', author: 'bar',
        thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
      }}
    />)
  })

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
    const { leftActions, rightActions } = genActions('search');
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
    const { leftActions, rightActions } = genActions('search');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with liked', () => {
    const { leftActions, rightActions } = genActions('liked');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with borrowed', () => {
    const { leftActions, rightActions } = genActions('borrowed');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with done', () => {
    const { leftActions, rightActions } = genActions('done');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  }).add('with Toggle', () => {
    const { leftActions, rightActions } = genActions('search');
    return (
      <Actions />
    )}).add('with sw b', () => {
      const { leftActions, rightActions } = genActions('done');
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
