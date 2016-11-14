import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookRow1} from '../../BookRow';

import {withDebug} from './common';
const BookRow1Debug = withDebug(BookRow1)

const {
  width,
} = Dimensions.get('window');

storiesOf('BookRow1', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with close props', () => (
    <BookRow1
      bucket="liked"
      onSwipeEnd={action('swipeEnd')}
      onSwipeStart={action('swipeStart')}>
      <Text>foo</Text>
    </BookRow1>
  ))
//not working
/* <BookRow1
    bucket="liked"
    style={{flexDirection:"row"}}
    >
  */
  .add('with close props', () => (
    <BookRow1
      bucket="liked"
      style={{
        margin:10}}
      width={width-20}
    >
      <View
        style={{flexDirection:"row"}}>
        <Text>foo</Text>
        <View
          style={{flex:1}}/>
        <Text>bar</Text>
      </View>
    </BookRow1>
  ))
