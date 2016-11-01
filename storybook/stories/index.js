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
import Stylish from 'react-native-stylish';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import {BookCell} from '../../BookCell';
import {genActions2,Action} from '../../Action';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
require("./nativeExample")
require("./default")
require("./SwipeableRowExample")
require("./SwipeableListViewExample")

require("./AnimViewExample")
require("./CloseableExample")
require("./BookCellExample")
require("./BookRowExample")
require("./HeaderExample")
require("./BookListViewExample")

storiesOf('Action', module)
  .add('with liked', () => (
    <Action
      icon="heart-o"
      text="読みたい"
      backgroundColor="#03a9f4"
    />
  ))

import {withDebug} from './common';
