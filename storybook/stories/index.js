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
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
require("./native")
require("./default")

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
        <SwipeableBu
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


storiesOf('SwipeableRow3', module)
  .add('with book', () => (
    <SwipeableRow3
      renderLeftActions={()=><Text>foo1</Text>}
      renderRightActions={()=><Text>foo2</Text>}>
      <Text>foo</Text>
    </SwipeableRow3>
  )).add('with callback', () => (
    <SwipeableRow3
      onSwipe={action('move')}
      onSwipeStart={action('start')}
      onSwipeEnd={action('end')}
      renderLeftActions={()=><Text>foo1</Text>}
      renderRightActions={()=><Text>foo2</Text>}
      style={{marginTop:20}}>
      <Text>bar</Text>
    </SwipeableRow3>
  )).add('with release', () => (
    <SwipeableRow3
      renderLeftActions={(width)=>
        <Animated.View style={{width:width}}>
          <Text numberOfLines={1}>foo1</Text>
        </Animated.View>}
      renderRightActions={(width)=>
        <Animated.View style={{width:width}}>
          <Text numberOfLines={1}>foo2</Text>
        </Animated.View>}
      onSwipeEnd={(evt, gestureState)=>{
          0 < gestureState.dx ?
          action('left action')(evt, gestureState) :
          action('right action')(evt, gestureState)
        }}
      style={{marginTop:20}}>
        <Text>bar</Text>
    </SwipeableRow3>
  )).add('with actions', () => {
    const { leftActions, rightActions } = genActions('liked');
    return(
      <SwipeableRow3
        renderLeftActions={(width)=>
          <SwipeableActions
            style={{width:width}}
            actions={leftActions}/>
                          }
        renderRightActions={(width)=>
          <SwipeableActions
             style={{width:width}}
             actions={rightActions}/>
                           }
      onSwipeEnd={(evt, gestureState)=>{
          0 < gestureState.dx ?
          action('left action')(evt, gestureState) :
          action('right action')(evt, gestureState)
        }}
      style={{marginTop:20}}>
        <Text>bar</Text>
    </SwipeableRow3>
  )})
