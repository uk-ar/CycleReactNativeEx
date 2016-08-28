const Rx = require('rx');// for debug http://stackoverflow.com/questions/32211649/debugging-with-webpack-es6-and-babel
// import Rx from 'rx';
import _ from 'lodash';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
} from './common';

import NavigationStateUtils from 'NavigationStateUtils';

function model(actions) {
  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */
  function mergeBooksStatus(books, booksStatus) {
    return books.map(book => {
      // console.log("book:",book,booksStatus)
      let libraryStatus;
      if ((booksStatus[book.isbn] !== undefined) && // not yet retrieve
          // sub library exist?
          (booksStatus[book.isbn][LIBRARY_ID].libkey !== undefined)) {
        const bookStatus = booksStatus[book.isbn][LIBRARY_ID];
        // TODO:support error case
        // if bookStatus.status == "Error"
        libraryStatus = {
          status: bookStatus.libkey,
          reserveUrl: bookStatus.reserveurl,
          rentable: _.values(bookStatus.libkey)
                     .some(i => i === '貸出可'),
          exist: Object.keys(bookStatus.libkey)
                       .length !== 0,
        };
      }

      return ({
        title: book.title.replace(/^【バーゲン本】/, ''),
        author: book.author,
        isbn: book.isbn,
        thumbnail: book.largeImageUrl,
        libraryStatus,
        //active: true,
      });
    }
    );
  }
  /* actions.requestStatus$
   *        .do(i=>console.log("req",i))
   *        .subscribe();*/
  const searchedBooks$ =
    actions.searchedBooksStatus$;
  /* Rx.Observable
   *   .combineLatest(
   *     actions.booksResponse$,
   *     actions.booksStatusResponse$,
   *     mergeBooksStatus,
   *     //actions.booksStatus$.startWith([]),
   *     ).do(i => console.log('searchedBooks$:%O', i)
   *     ).distinctUntilChanged();*/
  // searchedBooks$.subscribe();

  const selectedBook$ = actions.goToBookView$;
  const booksLoadingState$ =
    Rx.Observable.just([]);
  /* actions.requestBooks$.map((_) => true)
   *        .merge(
   *          // response event
   *          actions.booksResponse$.map((_) => false));*/
  /* searchRequest$,statusRequest$
     searchRequest,statusRequest, */

  const initialNavigationState = {
    key: 'MainNavigation',
    index: 0,
    title: 'Cycle Native',
    routes: [
      { key: 'Main' },
      //{ key: 'Search' },
    ],
  };

  // const navigationState$ = Rx.Observable.just(initialNavigationState)
  const navigationState$ =
    Rx.Observable
      .merge(
        actions.goToBookView$.map((e) =>
          ({ type: 'push', key: 'Book Detail', data: e })),
        actions.back$,
      )
      .distinctUntilChanged(navigationState =>
        navigationState, (a, b) => {
          if (a.type === 'back' && b.type === 'back') {
            return false;
          }

          return a.key === b.key;
        })
      .startWith(initialNavigationState)
      .scan((prevState, action) => {
        console.log('a:', action);
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

  const state$ = Rx
    .Observable
    .combineLatest(searchedBooks$.startWith(MOCKED_MOVIES_DATA).distinctUntilChanged(),
                   actions.savedBooksStatus$.do(i => console.log('s:', i)),
                   // actions.savedBooks$,
                   booksLoadingState$.startWith(false).distinctUntilChanged(),
                   navigationState$.distinctUntilChanged(),
                   selectedBook$.startWith(null).distinctUntilChanged(),
                   actions.selectedSection$.startWith(null),
                   // actions.selectedSection$.startWith("検索"),
                   (searchedBooks, savedBooks, booksLoadingState, navigationState, selectedBook, selectedSection) =>
                     ({ searchedBooks, savedBooks, booksLoadingState, navigationState, selectedBook, selectedSection }));
  return state$;
  /* return {
   *   state$,
   *   request$: requestSavedBooksStatus$
   * };*/
}

module.exports = model;
