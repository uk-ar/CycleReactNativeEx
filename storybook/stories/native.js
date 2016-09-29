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
import {SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

storiesOf('Scroll View', module)
  .add('contentContainerStyle', () => (
    //contentContainerStyle=
    <ScrollView
      style={{borderWidth:10,borderColor:"red"}/*out*/}
      contentContainerStyle={{borderWidth:10,borderColor:"green"}/*in*/}
    >
      <Text style={{fontSize:96}}>Scroll me plzaaaaaaaaaaaaaaaaaaaa</Text>
    </ScrollView>
  ))
