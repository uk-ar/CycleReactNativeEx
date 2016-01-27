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
//let EventEmitter = require('events').EventEmitter;
let EventEmitter = require('EventEmitter');

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
  TouchableHighlight,
  TouchableNativeFeedback,
  ToastAndroid,
  ToolbarAndroid,
  Navigator,
  BackAndroid,
  WebView,
  AsyncStorage
} = React;

var SearchScreen = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');

function main({RN, HTTP}) {
  const actions = intent({RN:RN, HTTP:HTTP});
  const state$ = model(actions);
  let _navigator;
  //ぐりとぐら
  //FIXME:Change navigator to stream

  //0192521722
  //qwerty

  // for android action
  var eventEmitter = new EventEmitter();
  let navigatorPopRequest$ = RN.select('back')
                               .events('iconClicked')
                               .merge(Rx.Observable
                                        .fromEvent(eventEmitter,
                                                   'hardwareBackPress'));

  function canPop(navigator){
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      return true;
    }
    return false;
  }

  //https://colinramsay.co.uk/2015/07/04/react-native-eventemitters.html
  BackAndroid.addEventListener('hardwareBackPress', () =>{
    eventEmitter.emit('hardwareBackPress');
    return canPop(_navigator);
  });
  // for android end

  const storageRequest$ = actions
          .inBoxStatus$
          .flatMap(inbox =>
            actions.openBook$
                   .startWith(inbox)
                   .scan((inbox,book) => {
                     console.log("inbox1:%O", inbox);
                     //TODO:use lodash
                     var result = inbox.filter(inBoxBook => inBoxBook.isbn !== book.isbn);
                     console.log("result1:%O", result);
                     result.unshift(book);
                     console.log("result2:%O", result);
                     return result;
                   }))
          .do(i => console.log("inbox:%O", i))
    //output
          .flatMap(inbox => {
            return Rx.Observable.fromPromise(AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(inbox)))
          })
          //.do(i => console.log("storage set:%O", i))
          //.subscribe();
    actions.sortState$
          .flatMap(e => Rx.Observable.fromPromise(AsyncStorage.getItem(STORAGE_KEY)))
          .map(i => JSON.parse(i))
          .do(i => console.log("storage:%O", i))
          .subscribe();

  // for android action
  var RouteMapper = function(route, navigator, component) {
    if(_navigator === undefined){
      _navigator = navigator;

      Rx.Observable.just(navigator)
        .do(i => console.log("nav1:%O", i))
        .map(nav =>
          navigatorPopRequest$
           .startWith(nav)
           .scan((navi,_) => {
             canPop(navi) && navi.pop()
             return navi;
           }))
        .switch()
        .map(nav =>
          state$.navigatorPushRequest$
           .startWith(nav)
           .scan((navi,route) => {
             navi.push(route);
             return navi;
           }))
        .switch()
        .do(i => console.log("nav2:%O", i))
        //.map(navigator => _navigator = navigator)
        .subscribe();
    }
    return (React.createElement(route.component,route.passProps))
  }
  /* var MyNavigator = React.createClass({
     render: function() {
     <Navigator {...this.props}/>
     }
     });
   */
  let SearchView$ = state$.booksWithStatus$
                          .startWith(MOCKED_MOVIES_DATA)
                          .map(i =>
                            <Navigator
                                initialRoute = {{
                                    component:SearchScreen,
                                    title: 'search',
                                    passProps: {state$: state$}
                                    }}
                                renderScene={RouteMapper}
                            />
                          )
    //ref="nav"
    /*                             <View
       >
       </View>
       componentDidMount={
       console.log("on nav:%O", this.refs.nav)
       } */
                          .do(i => console.log("nav elem:%O", i));

  return {
    RN: SearchView$,//.merge(DetailView$),
    HTTP: state$.searchRequest$.merge(state$.statusRequest$),
    //storage: storageRequest$
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
