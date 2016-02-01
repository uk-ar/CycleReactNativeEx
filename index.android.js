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

let {SearchScreen,InBoxScreen} = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');

function main({RN, HTTP}) {
  const actions = intent({RN:RN, HTTP:HTTP});
  const state$ = model(actions);

  //ぐりとぐら
  //FIXME:Change navigator to stream
  //actions.openBook$.subscribe()
  //0192521722
  //qwerty
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
                     //return [book].concat(inbox.filter)
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

  let navigatorReplaceRequest$ =
  actions.changeScene$
         .map(index =>{
           if(index==0){
             return ({
               component:SearchScreen,
               title: 'search',
               passProps: {state$: state$, actions$: actions}
             })
           }else if(index==1){
             return ({
               component:InBoxScreen,
               title: 'inbox',
               passProps: {state$: state$, actions$: actions}
             })
           }
         });
  // for android action
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

  var MyNavigator = React.createClass({
    componentDidMount: function(){
      //console.log("nav this:%O", this);
      /* var navigatorDidMount = this.props.navigatorDidMount.bind(this);
         navigatorDidMount(this.refs.nav); */
      this.props.navigatorDidMount.call({},this.refs.nav);
    },
    render: function() {
      if (Platform.OS === 'android') {
        return(
          <Navigator {...this.props}
          ref="nav"
          renderScene = {(route, navigator, component) =>{
            //console.log("nav this:%O", this)
            return React.createElement(route.component,route.passProps)
          }}
          />)}
      else{
        return (
          <NavigatorIOS
              {...this.props}
              ref="nav"
          />)
      }
    }
  });

  let SearchView$ = state$.booksWithStatus$
                          .startWith(MOCKED_MOVIES_DATA)
                          .map(i =>
                            <MyNavigator
                                initialRoute = {{
                                    component:SearchScreen,
                                    title: 'search',
                                    passProps:
                                    {state$: state$, actions$: actions}
                                  }}
                                navigatorDidMount = {(nav) => {
                                    console.log("nav this:%O", this);
                                    console.log("nav ref2:%O", nav);
                                    RouteMapper(nav);
                                    //console.log(this.refs);
                                    //RouteMapper(this.refs.nav)
                                  }}
                            />
                          )
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
