/**
 * Sample React Native App
 * https://github.com/facebook/react-native
TODO:
   - fix swipeout
     - enable swipe out
     - fix performance
   - automate webview
   - support books pagination
   - add done state
   - add sort feature
 */
'use strict';

import React, { Component } from 'react';
const Rx = require('rx');
var _ = require('lodash');
const { run } = require('@cycle/core');
import makeReactNativeDriver, { getBackHandler } from '@cycle/react-native/src/driver';
const { makeHTTPDriver } = require('@cycle/http');

var Icon = require('react-native-vector-icons/FontAwesome');

import Touchable from '@cycle/react-native/src/Touchable';
const {
  TouchableOpacity,
  TouchableWithoutFeedback,
} = Touchable;

import {
  Text,
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  // Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  LayoutAnimation,
  // cell
  PixelRatio,
  // searchBar
  TextInput,
  ToolbarAndroid,
  Navigator,
  NavigatorIOS,
  Animated,
  ScrollView,
  PanResponder,
  UIManager,
  NavigationExperimental,
} from 'react-native';
import NavigationStateUtils from 'NavigationStateUtils';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

let { SearchScreen, InBoxScreen, GiftedNavigator, BookListView } = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');
var view = require('./view');

function main({ RN, HTTP, EE }) {
  const actions = intent(RN, HTTP);
  const state$ = model(actions);

  // 0192521722
  // qwerty
  return {
    RN: state$.map(view),
    HTTP: actions.request$, //state$.map(request),
  };
}

import styles from './styles';

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver(),
});
