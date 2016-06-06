'use strict';

import React, { Component } from 'react';
let Rx = require('rx');
var _ = require('lodash');
let {run} = require('@cycle/core');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

var Icon = require('react-native-vector-icons/FontAwesome');
var BookScreen = require('./BookScreen');
let {SearchScreen, InBoxScreen, GiftedNavigator} = require('./SearchScreen');

let {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
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
  BackAndroid,
  AsyncStorage,
} from 'react-native';

import NavigationStateUtils from 'NavigationStateUtils';

function model(actions){
  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */

  //model
  //result items inbox favoritebox searchedbox
  //searchedBooks $
  const searchedBooks$ = Rx.Observable
                             .combineLatest(
                               actions.booksResponse$,
                               actions.booksStatus$.startWith([]),
                               (books, booksStatus) => {
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
          libraryStatus: book.libraryStatus,
          active: true
        })
      }
      )
    })
    .do(i => console.log("searchedBooks$:%O", i))
    /* .combineLatest(actions.filterState$,(books,filter)=>{
       return books.map(book => {
       book.active = filter ? (!book.libraryStatus || book.libraryStatus.exist) :
       true;
       return book
       })
       }) */
    .do(i => console.log("searchedBooks2$:%O", i));
    /* .combineLatest(actions.openSwipe$.startWith(1), (books,rowID) => {
       for (var i = 0; i < books.length; i++) {
       if (i != rowID) books[i].active = false
       else books[i].active = true
       }
       return books;
       }) */
    //.share();
    /*
  let navigatorPushRequest$ = actions
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
       })); */

  let likedBooks$ = Rx.Observable.just([
    {title: "like:SOFT SKILLS",isbn:"9784822251550",},
    {title: "like:foo",isbn:"9784480064851",},
  ])
  let doneBooks$ = Rx.Observable.just([
    {title:"done:bar",isbn:"9784105393069"},
    {title:"done:baz",isbn:"9784822285159"},
    {title:"done:toz",isbn:"9784757142794"},
  ]);
  let borrowedBooks$ = Rx.Observable.just([
    {title:"borrow:qux",isbn:"9784492314630",},
    {title:"borrow:quxx",isbn:"9784798134208",},
  ]);
  let selectedBook$ = actions.goToBookView$
                             .map(({data})=>data)
  // for android action
  /* function canPop(navigator){
    return (navigator && navigator.getCurrentRoutes().length > 1)
  }
  let navigatorPopRequest$;
  //let navigator$ = new Rx.Subject();
  if (Platform.OS === 'android') {
    let _navigator;
    actions.navigatorMounted$.subscribe((navigator) => {
      _navigator = navigator;
      console.log("nav mount2")
    });
    let hardwareBackPress$ = Rx.Observable.create((observer)=> {
      BackAndroid.addEventListener('hardwareBackPress', () =>{
        observer.onNext('hardwareBackPress');
        console.log("can pop?");
        return canPop(_navigator);
      });
    });
    navigatorPopRequest$ = hardwareBackPress$
        .merge(actions.navigatorBackPress$);
  }else{
    navigatorPopRequest$ = actions.navigatorBackPress$;
  }

  let inbox=[]
  //load inbox
  actions.inBoxStatus$.subscribe((i) => inbox = i);
  //.do(i => console.log("addInbox$:%O", i))
  actions.addInbox$.map(book =>
    [book].concat(
      inbox.filter(inBoxBook =>
        inBoxBook.isbn !== book.isbn)
    )).subscribe((books) => inbox = books);

  actions.removeInbox$.map(book =>
    inbox.filter(inBoxBook =>
      inBoxBook.isbn !== book.isbn)
  ).subscribe((books) => inbox = books);

  //Rx.Observable.fromPromise(AsyncStorage.removeItem(STORAGE_KEY)).subscribe()
  let inbox$ = actions.inBoxStatus$
                      .merge(actions.addInbox$)
                      .merge(actions.removeInbox$)
    //TODO:save
                      .map((i) => inbox)
                      .do(i => console.log("Inbox$:%O", i))
    //.share();
    //actions.inBoxStatus$.subscribe(inbox$);
    inbox$.subscribe(e => {
      return Rx.Observable
               .fromPromise(
                 AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(inbox)))
    });*/
  var booksLoadingState$ = actions.requestBooks$.map((_)=> true)
                                  .merge(
                                    //response event
                                    actions.booksResponse$.map((_)=>false));
  /* searchRequest$,statusRequest$
     searchRequest,statusRequest, */

  const initialNavigationState = {
    key: 'MainNavigation',
    index: 0,
    title: 'Cycle Native',
    children: [
      {key: 'Main'},
    ]
  };
  //const navigationState$ = Rx.Observable.just(initialNavigationState)
  const navigationState$ =
  Rx.Observable
    .merge(
      actions.goToInboxView$,
      actions.goToSearchView$,
      //actions.goToSectionView$,
      actions.goToBookView$,
      actions.back$,
    )
    .distinctUntilChanged(navigationState =>
      navigationState, (a, b) => {
        if (a.type === `back` && b.type === `back`) {
          return false
        }
        return a.key === b.key
      })
    .startWith(initialNavigationState)
    .scan((prevState, action) => {
      switch (action.type) {
        case 'back':
          return NavigationStateUtils.pop(prevState);
        case 'push':
          return NavigationStateUtils.push(prevState, action);
        case 'replace':
          return NavigationStateUtils.replace(prevState, action);
        default:
          console.error('Unexpected action', navigationProps, key);
      }
    });

  return  Rx.Observable
            .combineLatest(searchedBooks$.startWith(MOCKED_MOVIES_DATA),
                           likedBooks$,
                           doneBooks$,
                           borrowedBooks$,
                           booksLoadingState$.startWith(false),
                           navigationState$,
                           selectedBook$.startWith(null),
                           actions.selectedSection$.startWith(null),
                           (searchedBooks,likedBooks,doneBooks,borrowedBooks,booksLoadingState,navigationState,selectedBook,selectedSection) =>
                             ({searchedBooks,likedBooks,doneBooks,borrowedBooks,booksLoadingState,navigationState,selectedBook,selectedSection,}));

  /*
  var state$ = {
    searchRequest$: searchRequest$,//request$
    statusRequest$: statusRequest$,
    booksWithStatus$: booksWithStatus$,
    inbox$:inbox$,
    booksLoadingState$:
  }

  let navigatorReplaceRequest$ =
  actions.selectScene$
         .do(i => console.log("nav rep:%O", i) )
         .map(options =>{
           var option = options[0];
           if(option == "検索"){
             return ({
               component:SearchScreen,
               title: 'search',
               passProps: {state$: state$, actions$: actions}
             })
           }else if(option == "読みたい"){
             return ({
               component:InBoxScreen,
               title: 'inbox',
               passProps: {state$: state$, actions$: actions}
             })
           }
         });
  //push & pop is Destructive operations
  let navigator;
  navigatorPushRequest$
     .subscribe((route) => navigator.push(route));
  navigatorPopRequest$
        .subscribe((_)=>navigator.pop());//need to use canPop?
  navigatorReplaceRequest$
        .subscribe((route) => navigator.replace(route));

  actions.navigatorMounted$.subscribe((nav) => {
    navigator = nav;
  });

  return state$ */
}

module.exports = model;
