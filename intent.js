
'use strict';
import React, { Component } from 'react';
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

import {
  TouchableOpacity,
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
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
  AsyncStorage,
} from 'react-native';

function intent(RN, HTTP){
  //Actions
  const changeQuery$ = RN.select('text-input')
                         .events('changeText')
                         .do(i => console.log("search text change:%O", i));
  const requestBooks$ = changeQuery$.debounce(500)
                                    .filter(query => query.length > 1)
                                    .map(q => RAKUTEN_SEARCH_API + encodeURI(q));
  const booksResponse$ = HTTP.filter(res$ => res$.request.url.indexOf(RAKUTEN_SEARCH_API) === 0)
                             .switch()
                             .map(res =>
                               res.body.Items
                                  .filter(book => book.isbn)
                                 //reject non book
                                  .filter(book => (book.isbn.startsWith("978")
                                      || book.isbn.startsWith("979")))
                             )
                             .do(i => console.log("books change:%O", i))
                             .share();
  const requestStatus$ = booksResponse$.map(books => books.map(book => book.isbn))
                                       .map(q => CALIL_STATUS_API + encodeURI(q))
                                       .do(i => console.log("status req:%O", i));
  const request$ = Rx.Observable.merge(requestBooks$, requestStatus$);
  console.log("RN:%O",RN.navigateBack())
  const release$ = RN.select('bookcell')
                     .events('release')
                     //.publish()
                     //.share()
  //release$.do((i)=>console.log("rel$")).subscribe()
  return{
    requestBooks$:requestBooks$,
    request$:request$,
    /* changeScene$: RN.select('toolbar').events('actionSelected')
                    .map(i=> i.args),
       navigatorBackPress$: RN.select('back').events('iconClicked'),*/
    goToInboxView$: RN.select('segmented').events('selection')
                      .distinctUntilChanged()
                      .filter(([title,i])=>title=='読みたい')
                      .map(profile=>({
                        type: 'push',
                        key: 'Inbox',
                      }))
                      .do(i => console.log("select press1:%O", i))
      ,
    goToSearchView$: RN.select('segmented').events('selection')
                       .distinctUntilChanged()
                       .filter(([title,i])=>title=='検索')
                       .map(profile=>({
                         type: 'push',
                         key: 'Search',
                       }))
                       .do(i => console.log("select press2:%O", i))
      ,
    selectedSection$: RN.select('section')
                        .events('press')
                        .merge(RN.select('close')
                                 .events('press').map(()=>null))
                        .do(i => console.log("section selected:%O", i))
                        .do((books)=>LayoutAnimation.easeInEaseOut())
      ,
    goToBookView$: RN.select('cell').events('press')
                     .do(i => console.log("cell press:%O", i))
                     //.subscribe()
      /* .map(book=>({
         type: 'push',
         key: 'Book',
         data: book,
         })) */
      ,
    back$: Rx.Observable
             .merge(RN.navigateBack(),
                    )
             .map({type: 'back'})
      ,
    inBoxStatus$: Rx.Observable
                    .fromPromise(AsyncStorage.getItem(STORAGE_KEY))
                    .map(i => i ? JSON.parse(i) : [])
                    .do(i => console.log("inBoxStatus$:%O", i))
    ,
    /* changeBucket$: Rx.Observable.merge(
       release$
       .distinctUntilChanged()
       .do(i=>console.log("release:",i))
       .map(([book,bucket])=>({type:"remove",book:book}))
       ,
       release$
       .map(([book,bucket])=>{
       return ({type:"add",
       book:Object.assign(
       {},book,{bucket:bucket,modifyDate: new Date(Date.now())})})
       })
      ).do(i => console.log("rel:%O", i))*/
    changeBucket$: release$
      .do(i=>console.log("release:",i))
      .map(([book,bucket])=>(
        {type:"replace",
         book:Object.assign(
           {},book,{bucket:bucket,modifyDate: new Date(Date.now())})}))
      .do(i => console.log("rel:%O", i))
    ,
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log("filter change:%O", i))
                    .subscribe()
      ,
    sortState$: RN.select('sort')
                  .events('press')
                  .do(i => console.log("sort change:%O", i))
      //actions.sortState$
                  .startWith(false)
                  .scan((current, event) => !current)
                  .do(i => console.log("sort:%O", i))
                  .subscribe()
      ,
    booksResponse$: booksResponse$,
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
