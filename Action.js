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
function Action({ icon, text, backgroundColor, target, style, ...props }) {
  // backgroundColor,target are used from SwipeableActions
  //console.log("pro",style,text,icon)
  return (
    <View
      {...props}
      style={[{
          //passed
          flexDirection:"row-reverse",

          alignItems:"center",
          flex:1, //verticalCenter
          padding:10,
          paddingRight:0,
        },style]}>
      <FAIcon
        name={icon} size={20}
        style={{
          //margin:5,
        }}
      />
      {text ?
       <Text
         style={{
           //numberOfLines={1}
           margin:5,
           //position:"absolute",
         }}
       >
         {text}
       </Text>
       : null }
    </View>
  );
}

Action.propTypes = {
  icon:React.PropTypes.string,
  text:React.PropTypes.string,
  backgroundColor:React.PropTypes.string,
  target:React.PropTypes.string,
};

Action.defaultProps = {
  //
};

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
      style: {
        flexDirection: 'row',
        justifyContent: 'flex-end' } },
    { ...getProps(bucket, 'liked'),
      style: {
        flexDirection: 'row',
        width: width / 2 } },
    { ...getProps(bucket, 'borrowed'),
      style: {
        flexDirection: 'row',
        width } }
  ];
  const rightActions = [
    { ...getProps(bucket, 'done'),
      ...nop,
      style: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end' } },
    { ...getProps(bucket, 'done'),
      style: {
        flexDirection: 'row-reverse' } }
  ];
  return { leftActions, rightActions };
}

module.exports = { Action, genActions2 };
