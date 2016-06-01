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
let Rx = require('rx');
var _ = require('lodash');
let {run} = require('@cycle/core');
import makeReactNativeDriver, {getBackHandler} from '@cycle/react-native/src/driver';
let {makeHTTPDriver} = require('@cycle/http');

var Icon = require('react-native-vector-icons/FontAwesome');
//let EventEmitter = require('events').EventEmitter;
let EventEmitter = require('EventEmitter');

let {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
  makeEventEmitterDriver,
} = require('./common');

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
  //Text,
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

UIManager.setLayoutAnimationEnabledExperimental &&   UIManager.setLayoutAnimationEnabledExperimental(true);

let {SearchScreen, InBoxScreen, GiftedNavigator,BookListView} = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');
var view = require('./view');
//const emptyFunction: (...args) => void = function() {};

function main({RN, HTTP, EE}) {
  const actions = intent(RN, HTTP);
  const state$ = model(actions);

  EE.events("foo").subscribe(args =>
    console.log("EE:%O",args)
  );
  //ぐりとぐら
  //FIXME:Change navigator to stream
  //0192521722
  //qwerty
  /* .flatMap(e => Rx.Observable.fromPromise(AsyncStorage.getItem(STORAGE_KEY)))
     .map(i => JSON.parse(i))
     .do(i => console.log("storage:%O", i))
     .subscribe(); */

  let sinks = new Rx.ReplaySubject();
  // for android action

  return {
    RN: state$.map(view),
    HTTP: actions.request$,//state$.map(request),
    EE: sinks,
    //sinks.onNext({event: "foo",args:{bar:"baz"}}),
  };
}

import styles from './styles';

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver(),
  EE: makeEventEmitterDriver(),
});
