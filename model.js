import Rx from 'rx';
import _ from 'lodash';
import NavigationStateUtils from 'NavigationStateUtils';
import {
  Platform,
  Text,
  View,
  NavigationExperimental,
  TextInput,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
  log
} from './common';

function model(actions) {
  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */

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
            return console.error('Unexpected action');
        }
      });

  function genItems(searchedBooks, savedBooks) {
    // move to model?
    function booksToObject(books) {
      // https://github.com/eslint/eslint/issues/5284
      /* eslint prefer-const:0 */
      return books.reduce((acc, book) => {
        acc[book.key] = book;
        return acc;
      }, {});
    }
    function filterBooks(books, bucket) {
      let ret = {};
      let booksInBucket = books.filter((book) => book.bucket === bucket);
      ret[bucket] = booksToObject(booksInBucket);
      ret[`${bucket}_end`] = {};
      return ret;
    }
    return {
      search: booksToObject(searchedBooks),
      search_end: {},
      ...filterBooks(savedBooks, 'liked'),
      ...filterBooks(savedBooks, 'borrowed'),
      ...filterBooks(savedBooks, 'done'),
    };
  }

  /* function genCounts(items) {
   *   return {
   *     search_end: Object.keys(items.search).length,
   *     liked_end: Object.keys(items.liked).length,
   *     borrowed_end: Object.keys(items.borrowed).length,
   *     done_end: Object.keys(items.done).length
   *   };
   * }*/

  const searchedBooks$ =
    actions.searchedBooksStatus$
           // .startWith(MOCKED_MOVIES_DATA)
           .map(books =>
             books.map(book => ({ ...book, key: `isbn-${book.isbn}` })))
           .shareReplay();

  // selectedSection triggers scroll and update value when animation end
  // update with animation when selectedSection$ changed
  const items$ =
    Rx.Observable.combineLatest(
      searchedBooks$, actions.savedBooksStatus$,
      genItems);

  // update with animation when selectedSection$ changed
  const sectionIDs$ =
    actions.selectedSection$.map(selectedSection =>
      selectedSection ? [selectedSection, `${selectedSection}_end`] : undefined
    );

  const limit = 2;
  /* const rowIDs$ =
   *   actions.selectedSection$.map(selectedSection =>
   *     selectedSection ?
   *                   undefined :
   *                   sectionIDs.map(sectionID =>
   *                     Object.keys(items[sectionID]).slice(0, limit || undefined));*/
    /* const rowIDs =
     * selectedSection ?
     * undefined :
     * sectionIDs.map(sectionID =>
     *   Object.keys(items[sectionID]).slice(0, limit || undefined));
     * console.log("row:",rowIDs);*/

  /* const counts$ =
   *   items$.map(genCounts);*/
  // const items = genItems(searchedBooks, savedBooks);
  // const counts = genCounts(items);
  const state$ = Rx
    .Observable
    .combineLatest(
      /* searchedBooks$,
       * actions.savedBooksStatus$,*/
      items$,
      sectionIDs$,
      //actions.selectedSection$.do(i => LayoutAnimation.easeInEaseOut()),
      actions.selectedSection$.do(i =>
        LayoutAnimation.configureNext(
          LayoutAnimation
            .create(3000,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity))),
      // counts$,
      // actions.savedBooks$,
      booksLoadingState$.startWith(false).distinctUntilChanged(),
      navigationState$.distinctUntilChanged(),
      selectedBook$.startWith(null).distinctUntilChanged(),
      // LayoutAnimation treate listview as different
      // Rx.Observable.interval(1000).do(i=>console.log("int",i)),
      // Rx.Observable.just(1000),
      // actions.selectedSection$.startWith("search"),
      (items, sectionIDs, selectedSection, booksLoadingState, navigationState, selectedBook, i) => ({ items, sectionIDs, selectedSection, booksLoadingState, navigationState, selectedBook, i }))
    .debounce(10);// for delay of selectedSection and sectionIDs
  return state$;
}

module.exports = model;
