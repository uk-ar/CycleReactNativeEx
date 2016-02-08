
'use strict';
let React = require('react-native');
let Rx = require('rx');
var _ = require('lodash');
let {run} = require('@cycle/core');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

let {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID
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

function intent({RN, HTTP}){
  //Actions
  return{
    navigatorMounted$: RN.select('nav')
                         .events('navigatorMounted')
                         .map(i=> i.args[0])
                         .do(i => console.log("nav on mount?:%O", i))
                         //.subscribe()
                         ,
    changeScene$: RN.select('toolbar').events('actionSelected')
                    .map(i=> i.args)
      ,
    addInbox$:new Rx.Subject(),
    removeInbox$:new Rx.Subject(),
    navigatorBackPress$: RN.select('back').events('iconClicked'),
    selectScene$: RN.select('segmented').events('selection')
                    .map(e => e.args)
                    .do(i => console.log("select press:%O", i))
      ,
    openBook$: RN.select('cell').events('press')
                 .map(i => i.currentTarget.props.item)
                 .do(i => console.log("cell press:%O", i))
      ,
    inBoxStatus$: Rx.Observable
                    .fromPromise(AsyncStorage.getItem(STORAGE_KEY))
                    .map(i => i ? JSON.parse(i) : [])
                    .do(i => console.log("inBoxStatus$:%O", i))
      ,
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log("filter change:%O", i)),
    sortState$: RN.select('sort')
                  .events('press')
                  .do(i => console.log("sort change:%O", i)),
    changeSearch$: RN.select('text-input')
                     .events('change')
                     .map(event => event.args[0].nativeEvent.text)
                     .do(i => console.log("search text change:%O", i)),
    //intent & model
    books$: HTTP.filter(res$ => res$.request.url.indexOf(RAKUTEN_SEARCH_API) === 0)
                .switch()
                .map(res =>
                  res.body.Items
                     .filter(book => book.isbn)
                    //reject non book
                     .filter(book => (book.isbn.startsWith("978")
                         || book.isbn.startsWith("979")))
                )
                .do(i => console.log("books change:%O", i))
                .share(),
    booksStatus$: HTTP
      .filter(res$ => res$.request.url.indexOf(CALIL_STATUS_API) === 0)
      .switch()
      .map(res$ => JSON.parse(res$.text.match(/callback\((.*)\)/)[1]))
      .do(i => console.log("books status retry:%O", i))
      //FIXME:
      .flatMap(result => [Object.assign({}, result, {continue:0}), result])
      .map(result => {
        if(result.continue == 1){
          throw result
        }
        return result //don't use?
      })
      //cannot capture retry stream
      .retryWhen(function(errors) {
        return errors.delay(2000); //.map(log)
      })
      .map(result => result.books)
      .distinctUntilChanged()
      /* .do(books =>
         Object.keys(books).map(function(v) { return obj[k] })
         books.filter(book => book["Tokyo_Fuchu"]["status"] == "OK")) */
      .do(i => console.log("books status change:%O", i))
  };
}

module.exports = intent;
