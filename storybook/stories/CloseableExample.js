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
import {CloseableView} from '../../Closeable';

import {withDebug} from './common';
const CloseableViewDebug = withDebug(CloseableView)

storiesOf('CloseableView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with close props', () => (
    <CloseableViewDebug
      data={[{close:"true"},
             {close:"false"}]}
    >
      <Text>foo</Text>
    </CloseableViewDebug>
  ))
  .add('with toggle', () => (
    <CloseableViewDebug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          self.toggle();
          console.log(self);
          //self.animateTo({height:20,backgroundColor:"red"})
        }}/>
  ))
