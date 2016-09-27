import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import {genActions,Action,BookCell} from '../../BookCell';
import {SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));

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
      bucket="liked"
    />
  )).add('with liked', () => (
    <Action
      bucket="liked"
      target="liked"
    />
  ))

storiesOf('SwipeableActions', module)
  .add('with book', () => (
    <SwipeableActions
      style={{width:100}}
      actions={["foo","bar","baz",<Text>boon</Text>]}
    />
  )).add('with liked', () => {
    const { leftActions, rightActions } = genActions('liked');
    return (
      <View>
        <SwipeableActions
          actions={leftActions}/>
        <SwipeableActions
          actions={rightActions}/>
      </View>
    )
  })

storiesOf('SwipeableRow3', module)
  .add('with book', () => (
    <SwipeableRow3>
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
  ))
