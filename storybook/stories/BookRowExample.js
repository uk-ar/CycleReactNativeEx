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

import {BookRow1} from '../../BookRow';

import {withDebug} from './common';
const BookRow1Debug = withDebug(BookRow1)

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
/* .add('with close props', () => (
 *   <BookRow1Debug
 *     data={[{close:"true"},
 *            {close:"false"}]}
 *   >
 *     <Text>foo</Text>
 *   </BookRow1Debug>
 * ))*/
