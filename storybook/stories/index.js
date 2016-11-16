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
  .add('with liked icon only', () => (
    <Action
      icon="heart-o"
    />
  ))
  .add('with some liked icon only', () => (
    <View style={{padding:20,justifyContent:"center",
                  height:100,width:100,backgroundColor:"red"}}>
      <View style={{
        height:20,width:10,backgroundColor:"blue",
        flexDirection:"row"
      }}>
        <View style={{
          right:0,
          position:"absolute",
          flexDirection:"row",
        }}>
          <Action
            icon="heart-o"
            style={{
              backgroundColor:"white",
              justifyContent:"flex-end"
            }}
          />
        </View>
      </View>
      <View style={{
        height:20,width:10,
        //backgroundColor:"blue",
        //flexDirection:"row"
      }}>
        <Action
          icon="heart-o"
          style={{
            backgroundColor:"green",
            justifyContent:"flex-end"
          }}
        />
      </View>
      <View style={{
        height:20,width:50,
        //backgroundColor:"blue",
        //flexDirection:"row"
      }}>
        <Action
          icon="heart-o"
          style={{
            //backgroundColor:"white",
            //justifyContent:"flex-end"
            //right:0
          }}
        />
      </View>
      <Action
        icon="heart-o"
        text="読みたい"
      />
    </View>
  ))

import {withDebug} from './common';
