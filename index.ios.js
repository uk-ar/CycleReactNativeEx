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

var SearchScreen = require('./SearchScreen');

var intent = require('./intent');
var model = require('./model');

function main({RN, HTTP}) {
  let _navigator;
  //FIXME:Change navigator to stream

  // for android action
  function backAction(){
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  }
  //FIXME:Change to stream
  //BackAndroid.addEventListener('hardwareBackPress', backAction);
  //onIconClicked
  RN.select('back')
    .events('iconClicked')
    .do(backAction)
    .subscribe();

  const actions = intent({RN:RN, HTTP:HTTP});
  const state$ = model(actions);

  /* const storageRequest$ = actions
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
     .flatMap(inbox => {
     return Rx.Observable.fromPromise(AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(inbox)))
     })
     //.do(i => console.log("storage set:%O", i))
     .subscribe(); */

  //ぐりとぐら
  // if else return has problem?
  actions.openBook$
     .map(i => {if(i.libraryStatus && i.libraryStatus.exist){
       return i.libraryStatus.reserveUrl
     }else{
       return i.thumbnail
     }})
    //.map(i => {return i.thumbnail})
     .do(i => console.log("url:%O", i))
    //.do(i => ToastAndroid.show(i, ToastAndroid.SHORT))
     .map(url => {
       _navigator.push({
         name: 'detail',
         url:  url
       })
     }).subscribe()

  //0192521722
  //qwerty

  actions.sortState$
         .flatMap(e => Rx.Observable.fromPromise(AsyncStorage.getItem(STORAGE_KEY)))
         .map(i => JSON.parse(i))
         .do(i => console.log("storage:%O", i))
         .subscribe();
  // for android action
  var RouteMapper = function(route, navigator, component) {
    if(_navigator === undefined){
      _navigator=navigator;
    }
    if (route.name === 'search') {
      //TODO:remove dataSource
      return (
        <SearchScreen
            state$ = {state$}
        />
      )
    } else if (route.name === 'detail') {
      return(
        <CycleView key="webview" style={{flex: 1}}>
          <ToolbarAndroid
              actions={[]}
              navIcon={require('image!ic_arrow_back_white_24dp')}
              selector = "back"
              style={styles.toolbar}
              titleColor="white"
              //title={route.movie.title}
              //title = "detail"
          />
          <WebView url={route.url}
                   domStorageEnabled={true}
                   startInLoadingState={true}
                   javaScriptEnabled={true}
                   scrollEnabled={true}
                   scalesPageToFit={false}
                   automaticallyAdjustContentInsets={true}
                   onError = {i => console.log("on err:%O", i)}
                   onLoad = {i => console.log("on load:%O", i)}
                   onLoadEnd = {i => console.log("on load end:%O", i)}
                   onLoadStart = {i => console.log("on load start:%O", i)}
                   onNavigationStateChange = {i => console.log("on nav:%O", i)}
                   style={styles.WebViewContainer}
          />
        </CycleView>
      ) // 'document.querySelector("[value$=\'カートに入れる\']").click()'
        // injectedJavaScript='document.querySelector(".button").click()'
    }
  }
  /* state$.booksWithStatus$
     .do(i =>
     //FIXME:replace clears current input text & scroll status
     // doc for ref, element, instance...
     // https://facebook.github.io/react/docs/more-about-refs.html
     _navigator.replace({name: 'search', dataSource: i})
     )
     .do(i => console.log("navi change event:%O", i))
     .subscribe(); */

  //https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
  //https://facebook.github.io/react-native/docs/direct-manipulation.html
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/Movies
  //https://facebook.github.io/react/docs/reusable-components.html
  /* .startWith(MOCKED_MOVIES_DATA)
     .do(i =>
     <Navigator
     key="nav"
     initialRoute = {{name: 'search', dataSource: MOCKED_MOVIES_DATA}}
     renderScene={generateCycleRender(RouteMapper)}
     />
     _navigator.push({name: 'search', dataSource: i})
     ) */
  let SearchView$ = state$.booksWithStatus$
                          .startWith(MOCKED_MOVIES_DATA)
                          .map(i =>
                            <Navigator
                                key="nav"
                                initialRoute = {{name: 'search'}}
                                renderScene={RouteMapper}
                            />).do(i => console.log("nav elem:%O", i));

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
