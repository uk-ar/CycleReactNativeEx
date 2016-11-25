import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import { styles } from '../../styles';

import {BookCell,LibraryStatus,TextWithIndicator} from '../../BookCell';

storiesOf('BookCell', module)
  .add('with only isbn', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        //title: 'guri & gura',
        isbn: '9784834032147',
      }}
    />
  ))
  .add('with libraryStatus', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'guri & gura',
        isbn: '9784834032147',
      }}
    >
      <LibraryStatus libraryStatus={undefined} />
    </BookCell>
  ))
  .add('with only isbn & indicator', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        isbn: '9784834032147',
      }}
    >
      <TextWithIndicator>
        タイトル確認中
      </TextWithIndicator>
    </BookCell>
  ))
  .add('with book', () => (
    <BookCell
      onPress={action('clicked-bookcell')}
      book={{
        title: 'guri & gura & can I handle long long long title?', author: '',
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
  .add('with book & width', () => {
    const book ={
      title: 'guri & gura & can I handle long long long title?', author: '',
      thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
      libraryStatus: {
        exist: false,
        rentable: false,
        reserveUrl: '',
      },
      isbn: '9784834032147',
      active: true,
    }
    return(
      <View
        style={{
          flex:1,
          paddingHorizontal:10,
          backgroundColor:"green"
        }}>
        <BookCell
          style={{
            backgroundColor:"yellow"
          }}
          onPress={action('clicked-bookcell')}
          book={book}
        />
        <BookCell
          style={{
            backgroundColor:"yellow"
          }}
          onPress={action('clicked-bookcell')}
          book={{...book,bucket:"liked"}}
        />
      </View>
    )}
  )
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
