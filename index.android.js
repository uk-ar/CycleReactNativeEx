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
//let {makeReactNativeDriver, getBackHandler} = require('@cycle/react-native');
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
  Text,
} = Touchable;

import {
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

  //var {AnimatedFlick,BookCell} = require('./BookCell');
  // http://stackoverflow.com/questions/29756217/react-native-nested-scrollview-locking-up

  const onNavigateBack = action => {
    const backActionHandler = getBackHandler();
    if (action.type === 'back' || action.type === 'BackAction') {
      backActionHandler.send();
    }
  }

  function renderCard(vdom, navigationProps) {
    //
    return (
      <NavigationExperimental.Card
      {...navigationProps}
      key={'View:' + navigationProps.scene.navigationState.key}
      renderScene={() => vdom}
      onNavigate={onNavigateBack}
      />
    );
  }

  var SearchBar = require('./SearchBar');
  function SearchView({booksWithStatus,booksLoadingState}){
    //console.log('navigationProps', model);
    return(
      <View style={styles.container}
            key = "searchScreen">
        <Text selector="button">Increment1</Text>
        <TouchableOpacity selector='button'>
          <Text>Increment2</Text>
        </TouchableOpacity>
        <SearchBar
            key="searchBar"
            isLoading={booksLoadingState}
        />
        <View style={styles.separator} />
        <BookListView dataSource={booksWithStatus}
                      selectedOption='検索'
                      selector="bookcell"
        />
      </View>
      )
  };

  function view(model){
    //console.log('navigationProps', model);
    return(
      <NavigationExperimental.AnimatedView
      style={{flex: 1}}
      onNavigate={onNavigateBack}
      navigationState={model.navigationState}
      renderScene={(navigationProps) => {
          const key = navigationProps.scene.navigationState.key;
          console.log('navigationProps', navigationProps);
          switch (key) {
            case 'Search':
              //return renderCard(CreditsView(model), navigationProps);
              return renderCard(SearchView(model), navigationProps);
              //return (<Text>foo</Text>)
            default:
              console.error('Unexpected view', navigationProps, key);
              return (<Text>bar</Text>)
              //renderCard(<Text>Everything is fucked</Text>, navigationProps);
          }
        }}
      />)
  };

  let SearchView$ = state$.map(view);
  //let SearchView$ = state$.startWith(0).map(view);
  let request$ = actions.searchRequest$.merge(actions.statusRequest$)

  return {
    RN: SearchView$,//.merge(DetailView$),
    //HTTP: state$.searchRequest$.merge(state$.statusRequest$),
    HTTP: request$,
    EE: sinks,
    //
    //sinks.onNext({event: "foo",args:{bar:"baz"}}),
  };
}

import styles from './styles';

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver(),
  EE: makeEventEmitterDriver(),
});
