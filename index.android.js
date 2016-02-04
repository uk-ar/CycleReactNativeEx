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
  makeEventEmitterDriver,
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

let {SearchScreen, InBoxScreen, GiftedNavigator} = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');

function main({RN, HTTP, EE}) {
  const actions = intent({RN:RN, HTTP:HTTP});
  const state$ = model(actions);

  EE.events("foo").subscribe(args =>
    console.log("EE:%O",args)
  );
  //ぐりとぐら
  //FIXME:Change navigator to stream
  //0192521722
  //qwerty
  actions.sortState$
         .flatMap(e => Rx.Observable.fromPromise(AsyncStorage.getItem(STORAGE_KEY)))
         .map(i => JSON.parse(i))
         .do(i => console.log("storage:%O", i))
         .subscribe();

  let sinks = new Rx.ReplaySubject();
  // for android action
  let navigatorReplaceRequest$ =
  actions.changeScene$
         .map(index =>{
           if(index==0){
             return ({
               component:SearchScreen,
               title: 'search',
               passProps:
               {state$: state$, actions$: actions, sinks: sinks}
             })//add source$?
           }else if(index==1){
             return ({
               component:InBoxScreen,
               title: 'inbox',
               passProps: {state$: state$, actions$: actions}
             })
           }
         });

  var RouteMapper = function(navigator) {
    state$.navigator$.onNext(navigator);
    //push & pop is Destructive operations
    state$.navigatorPushRequest$
          .subscribe((route) => navigator.push(route));
    state$.navigatorPopRequest$
          .subscribe((_)=>navigator.pop());//need to use canPop?
    navigatorReplaceRequest$.subscribe((route) =>
      navigator.replace(route));
  }

  /* function CycleCompo(source,func){
     //var value$
     var compo = React.createClass({
     getInitialState:function(){
     return{
     vtree:React.createElement(View),
     }
     source.props$.subscribe(
     setState{
     vtree:
     }) */
          //func() can use this.props & this.props$
  //func() returns DOM & value
  //then subscribe DOM & setstate
  //and subscribe value & onNext
          //call func
          /* const sinks = {
             compo:compo
             DOM: vtree,
             value$,
             };
             return sinks; */
  /* },
     render():{
     return this.state.vtree
     }
     //func can
     });
     return compo
     }; */
  /* CycleCompo1 = CycleCompo(source) */
  /* render=CycleCompo1.DOM */
  /* FooView=CycleCompo1.Compo */

  let SearchView$ = state$.booksWithStatus$
                          .startWith(MOCKED_MOVIES_DATA)
                          .map(i =>
                            <GiftedNavigator
                                initialRoute = {{
                                    component:SearchScreen,
                                    title: 'search',
                                    passProps:
                                    {state$: state$, actions$: actions,
                                     sinks: sinks}
                                  }}
                                navigatorDidMount = {(nav) => {
                                    //console.log("nav this:%O", this);
                                    RouteMapper(nav);
                                  }}
                            />
                          );
  sinks.onNext({event: "foo",args:{bar:"baz"}});
  return {
    RN: SearchView$,//.merge(DetailView$),
    HTTP: state$.searchRequest$.merge(state$.statusRequest$),
    EE: sinks,
    //
    //sinks.onNext({event: "foo",args:{bar:"baz"}}),
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
  HTTP: makeHTTPDriver(),
  EE: makeEventEmitterDriver(),
});
