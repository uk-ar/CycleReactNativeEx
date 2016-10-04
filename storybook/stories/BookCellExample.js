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

storiesOf('BookCell', module)
  .add('with book min', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        //title: 'guri & gura',
        isbn: '9784834032147',
      }}
    />
  ))
  .add('with book', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'guri & gura', author: '',
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
