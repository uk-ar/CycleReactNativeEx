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
import {genActions,Action} from '../../BookRow';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

import {SwipeableListView} from '../../SwipeableListView';

storiesOf('SwipeableListView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with book', () => (
    <SwipeableListView
      renderLeftActions={()=><Text>foo1</Text>}
      renderRightActions={()=><Text>foo2</Text>}>
      <Text>foo</Text>
    </SwipeableListView>
  ))
  .add('with callback', () => (
    <SwipeableListView
      onSwipe={action('move')}
      onSwipeStart={action('start')}
      onSwipeEnd={action('end')}
      renderLeftActions={()=><Text>foo1</Text>}
      renderRightActions={()=><Text>foo2</Text>}
      style={{marginTop:20}}>
      <Text>bar</Text>
    </SwipeableListView>
  ))
