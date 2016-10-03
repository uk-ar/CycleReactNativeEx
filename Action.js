import React from 'react';
const ReactNative = require('react-native');
const FAIcon = require('react-native-vector-icons/FontAwesome');

import materialColor from 'material-colors';
import { styles } from './styles';
import { itemsInfo } from './common';

const _ = require('lodash');

const {
  ActivityIndicator,
  Text,
  View,
  Image,
  Animated,
  Platform,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableNativeFeedback,
} = ReactNative;
// jest bug
import Touchable from '@cycle/react-native/src/Touchable';
// const Touchable = require('@cycle/react-native/src/Touchable');
// const Touchable = require('@cycle/react-native/lib/Touchable');
// import Touchable from '@cycle/react-native/lib/Touchable';

const Dimensions = require('Dimensions');
const {
  width,
} = Dimensions.get('window');

import { SwipeableRow2, SwipeableRow3, SwipeableActions, SwipeableButtons2 } from './SwipeableRow';

// bucket,target->icon,text,backgroundColor,close,target
function Action({ icon, text, backgroundColor, close, target, style, ...props }) {
  // console.log("props:",icon, text, style, backgroundColor, props)
  // backgroundColor,close,target are used from SwipeableActions
  return (
    <View
      {...props}
      style={[{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1, //vertical center
          //backgroundColor:backgroundColor,//for debug
        }, style]}
    >
      <FAIcon
        name={icon} size={20}
        style={{ margin: 10 }}
      />
      <View style={{ margin: -2.5 }} />
      <Text>
        {text}
      </Text>
    </View>
  );
}

// bucket,target->icon,text,backgroundColor,close,target
function genActions(self) {
  function getProps(self, target) {
    ({ icon, text, backgroundColor } = itemsInfo[target]);
    if (target === self) {
      ({ icon, text } = { text: '先頭に移動', icon: 'level-up' });
    }
    return { icon, text, backgroundColor, close: true, target };
  }
  const nop = {
    text: null, backgroundColor: materialColor.grey[300], close: false, target: null };
  const leftActions = [
    <Action
      {...getProps(self, 'liked')}
      {...nop}
      style={{ justifyContent: 'flex-end' }}
    />,
    <Action
      {...getProps(self, 'liked')}
      style={{ width: width / 2 }}
    />,
    <Action
      {...getProps(self, 'borrowed')}
      style={{ width }}
    />,
  ];
  const rightActions = [
    <Action
      {...getProps(self, 'done')}
      {...nop}
      style={{ flexDirection: 'row-reverse',
               justifyContent: 'flex-end' }}
    />,
    <Action
      {...getProps(self, 'done')}
      style={{ flexDirection: 'row-reverse' }}
    />,
  ];// Touchable
  return { leftActions, rightActions };
}

function genActions2(self) {
  function getProps(self, target) {
    ({ icon, text, backgroundColor } = itemsInfo[target]);
    if (target === self) {
      ({ icon, text } = { text: '先頭に移動', icon: 'level-up' });
    }
    return { icon, text, backgroundColor, close: true, target };
  }
  const nop = {
    text: null, backgroundColor: materialColor.grey[300], close: false, target: null };
  const leftActions = [
    {...getProps(self, 'liked'),
     ...nop,
     style:{ justifyContent: 'flex-end' }},
    {...getProps(self, 'liked'),
     style:{ width: width / 2 }},
    {...getProps(self, 'borrowed'),
     style:{ width: width }}
  ];
  const rightActions = [
    {...getProps(self, 'done'),
     ...nop,
     style:{flexDirection: 'row-reverse',
            justifyContent: 'flex-end' }},
    {...getProps(self, 'done'),
     style:{ flexDirection: 'row-reverse' }}
  ];
  return { leftActions, rightActions };
}

//console.log("sw:?",{ SwipeableRow2, SwipeableRow3, SwipeableActions, SwipeableButtons2,AnimView })

module.exports = { Action, genActions, genActions2 };
