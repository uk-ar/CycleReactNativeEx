/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let Rx = require('rx');
var _ = require('lodash');
let {run} = require('@cycle/core');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

var Icon = require('react-native-vector-icons/FontAwesome');

let {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
} = require('./common');

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  View,
  Platform,
  ToastAndroid,
  ToolbarAndroid,
  Navigator,
  BackAndroid,
  WebView,
  AsyncStorage
} = React;

let {SearchScreen, InBoxScreen, GiftedNavigator} = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');

function main({RN, HTTP}) {
  const actions = intent({RN:RN, HTTP:HTTP});
  const state$ = model(actions);

  var RouteMapper = function(navigator) {
    state$.navigator$.onNext(navigator);
    //push & pop is Destructive operations
    state$.navigatorPushRequest$
          .subscribe((route) => navigator.push(route));
    state$.navigatorPopRequest$
          .subscribe((_)=>navigator.pop());//need to use canPop?
    state$.navigatorReplaceRequest$.subscribe((route) =>
      navigator.replace(route)
      //console.log("%O", route)
    );
  }

  let SearchView$ = state$.booksWithStatus$
                          .startWith(MOCKED_MOVIES_DATA)
                          .map(i =>
                            <GiftedNavigator
                                initialRoute = {{
                                    component:SearchScreen,
                                    title: 'search',
                                    passProps:
                                    {state$: state$, actions$: actions}
                                  }}
                                onNavigatorMounted = {(nav) => {
                                    //console.log("nav this:%O", this);
                                    RouteMapper(nav);
                                  }}
                            />
                          );

  return {
    RN: SearchView$,//.merge(DetailView$),
    HTTP: state$.searchRequest$.merge(state$.statusRequest$),
  };
}

var styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  WebViewContainer: {
    flex: 1,
  }
});

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver()
});
