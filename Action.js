import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {
  Text,
  View,
} from 'react-native';

import materialColor from 'material-colors';

import _ from 'lodash';
import { itemsInfo } from './common';

import Dimensions from 'Dimensions';

const {
  width,
} = Dimensions.get('window');

// bucket,target->icon,text,backgroundColor,close,target
function Action({ icon, text, backgroundColor, close, target, style, ...props }) {
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
      { icon ?
        <FAIcon
          name={icon} size={20}
          style={{ margin: 10 }}
        /> : null }
      <View style={{ margin: -2.5 }} />
      <Text>
        {text}
      </Text>
    </View>
  );
}

function genActions2(bucket) {
  function getProps(self, target) {
    let { icon, text, backgroundColor } = itemsInfo[target];
    if (target === self) {
      ({ icon, text } = { text: '先頭に移動', icon: 'level-up' });
    }
    return { icon, text, backgroundColor, close: true, target };
  }
  const nop = {
    text: null, backgroundColor: materialColor.grey[300], close: false, target: null };
  const leftActions = [
    { ...getProps(bucket, 'liked'),
      ...nop,
      style: { justifyContent: 'flex-end' } },
    { ...getProps(bucket, 'liked'),
      style: { width: width / 2 } },
    { ...getProps(bucket, 'borrowed'),
      style: { width } }
  ];
  const rightActions = [
    { ...getProps(bucket, 'done'),
      ...nop,
      style: { flexDirection: 'row-reverse',
        justifyContent: 'flex-end' } },
    { ...getProps(bucket, 'done'),
      style: { flexDirection: 'row-reverse' } }
  ];
  return { leftActions, rightActions };
}

module.exports = { Action, genActions2 };
