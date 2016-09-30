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
import {Closeable3} from '../../Closeable';

import {withDebug} from './common';
const Closeable3Debug = withDebug(Closeable3)

storiesOf('Closeable3', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with close props', () => (
    <Closeable3Debug
      data={[{close:"true"},
             {close:"false"}]}
    >
      <Text>foo</Text>
    </Closeable3Debug>
  ))
  .add('with toggle', () => (
    <Closeable3Debug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          self.toggle();
          console.log(self);
          //self.animateTo({height:20,backgroundColor:"red"})
        }}/>
  ))
