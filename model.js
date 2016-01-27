'use strict';

let React = require('react-native');
let Rx = require('rx');
var _ = require('lodash');
let {run} = require('@cycle/core');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

var Icon = require('react-native-vector-icons/FontAwesome');
var BookScreen = require('./BookScreen');

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

function model(actions){
  const searchRequest$ = actions.changeSearch$.debounce(500)
                                .filter(query => query.length > 1)
                                .map(q => RAKUTEN_SEARCH_API + encodeURI(q));

  //model(Actions) -> State$
  const statusRequest$ = actions.books$
                                .map(books => books.map(book => book.isbn))
                                .map(q => CALIL_STATUS_API + encodeURI(q))
                                .do(i => console.log("status req:%O", i));

  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */

  //model
  const booksWithStatus$ = actions
    .books$
    .combineLatest(actions.booksStatus$.startWith([]), (books, booksStatus) => {
      return books.map(book => {
        if((booksStatus[book.isbn] !== undefined) && //not yet retrieve
           //sub library exist?
           (booksStatus[book.isbn][LIBRARY_ID].libkey !== undefined)){
             const bookStatus = booksStatus[book.isbn][LIBRARY_ID];
             //TODO:support error case
             //if bookStatus.status == "Error"
             var exist = Object.keys(bookStatus.libkey)
                               .length !== 0;
             var rentable = _.values(bookStatus.libkey)//Object.values
                             .some(i => i === "貸出可");
             book.libraryStatus = {
               status: bookStatus.libkey,
               reserveUrl: bookStatus.reserveurl,
               rentable: rentable,
               exist: exist
             }}
        return ({
          title: book.title.replace(/^【バーゲン本】/, ""),
          author: book.author,
          isbn: book.isbn,
          thumbnail: book.largeImageUrl,
          libraryStatus: book.libraryStatus
        })
      }
      )
    })
    .startWith(MOCKED_MOVIES_DATA)
    .do(i => console.log("booksWithStatus$:%O", i))
    .combineLatest(actions.filterState$,(books,filter)=>{
      return filter ? books.filter(book =>
        !book.libraryStatus || book.libraryStatus.exist) : books
      //TODO:case for book.libraryStatus is undefined
    })
    .share()

    return{
      searchRequest$: searchRequest$,//request$
      statusRequest$: statusRequest$,
      booksWithStatus$: booksWithStatus$,
      navigatorPushRequest$: actions
        .openBook$
        .map(i => {
          if(i.libraryStatus && i.libraryStatus.exist){
            return i.libraryStatus.reserveUrl
          }else{
            return i.thumbnail
          }})
        //.map(i => {return i.thumbnail})
        .do(i => console.log("url:%O", i))
        //.do(i => ToastAndroid.show(i, ToastAndroid.SHORT))
        .map(url => ({
          title: 'detail',
          component: BookScreen,
          passProps: {url: url}
        }))
    }
}

module.exports = model;
