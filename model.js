import Rx from 'rx';
import _ from 'lodash';
import NavigationStateUtils from 'NavigationStateUtils';
import {
  UIManager,
  ListView,
  LayoutAnimation
} from 'react-native';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
  log
} from './common';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

function model(actions) {
  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */

  const selectedBook$ = actions.goToBookView$;
  const booksLoadingState$ =
    Rx.Observable.just(true);
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
        actions.goToBookView$.map(e =>
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

  //  selectedSection, booksLoadingState
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
      let booksInBucket = books.filter(book => book.bucket === bucket);
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

  const searchedBooks$ =
    actions.searchedBooksStatus$
           // .startWith(MOCKED_MOVIES_DATA)
           .map(books =>
             books.map(book => ({ ...book, key: `isbn-${book.isbn}` })))
           .shareReplay();

  // selectedSection triggers scroll and update value when animation end
  // update with animation when selectedSection$ changed
  const books$ =
    Rx.Observable.combineLatest(
      searchedBooks$//.do(i => console.log('searched books'))
      ,
      actions.savedBooksStatus$//.do(i => console.log('saved books'))
      ,
      genItems)
      //.debounce(100)//ms
  /* .do(i=>console.log("items:",JSON.stringify(i)))
   * .distinctUntilChanged(x => JSON.stringify(x),(a,b)=>a!==b) */
      .do(i=>console.log("items:",i))
      .shareReplay();

  const limit = 2;

  const dataSource$ =
    Rx.Observable.combineLatest(
      books$//.do(i => console.log('books', i))
      ,
      actions.selectedSection$.do(i => console.log('selectedSection', i))
      ,
      booksLoadingState$.do(i => console.log('booksLoadingState', i))
      ,
      (books, selectedSection, booksLoadingState) => {
        const sections = {
          search: { close: selectedSection, loadingState: booksLoadingState },
          search_end: { count: Object.keys(books.search).length,
                        section: 'search' },
          liked: { close: selectedSection, loadingState: booksLoadingState },
          liked_end: { count: Object.keys(books.liked).length, section: 'like' },
          borrowed: { close: selectedSection, loadingState: booksLoadingState },
          borrowed_end: { count: Object.keys(books.borrowed).length,
                        section: 'borrowed' },
          done: { close: selectedSection, loadingState: booksLoadingState },
          done_end: { count: Object.keys(books.done).length, section: 'done' }
        };
        const sectionIdentities =
          selectedSection ?
          [selectedSection, `${selectedSection}_end`] :
          Object.keys(books);
        const rowIdentities =
          sectionIdentities.map((sectionID) => {
            return selectedSection ?
                   Object.keys(books[sectionID]) :
                   Object.keys(books[sectionID]).slice(0, limit || undefined);
          });
        // Object.keys(items).filter(i => i !== 'sections');
        return ({
          dataBlob: { ...books, sections },
          sectionIdentities,
          rowIdentities
        });
      })
      .scan(
        (datasource, { dataBlob, sectionIdentities, rowIdentities }) => {
          return datasource.cloneWithRowsAndSections(
            dataBlob, sectionIdentities, rowIdentities);
        }, new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
          getSectionHeaderData: (dataBlob, sectionID) =>
            dataBlob.sections[sectionID]
        }))
      //.do(i => console.log('datasource:', i));
      // .subscribe()

      // .do(i => console.log('rowIDs?:', i));
  // FIXME:bug with select done
  // Maybe scroll position keeped when transition
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
      /* items$,
       * sectionIDs$,
       * rowIDs$,*/
      dataSource$,
      /* dataSource$.do(i =>
       *   LayoutAnimation.configureNext(
       *     LayoutAnimation
       *       .create(3000,
       *               LayoutAnimation.Types.easeInEaseOut,
       *               LayoutAnimation.Properties.opacity))),*/
      // actions.selectedSection$,
      actions.selectedSection$.do(i => LayoutAnimation.easeInEaseOut()),
      /* actions.selectedSection$.do(i =>
       *   LayoutAnimation.configureNext(
       *     LayoutAnimation
       *       .create(3000,
       *               LayoutAnimation.Types.easeInEaseOut,
       *               LayoutAnimation.Properties.opacity))),*/
      // counts$,
      // actions.savedBooks$,
      booksLoadingState$.startWith(false).distinctUntilChanged(),
      navigationState$.distinctUntilChanged(),
      selectedBook$.startWith(null).distinctUntilChanged(),
      // LayoutAnimation treate listview as different
      // Rx.Observable.interval(1000).do(i=>console.log("int",i)),
      // Rx.Observable.just(1000),
      // actions.selectedSection$.startWith("search"),
      (/* items, sectionIDs, rowIDs,*/
       dataSource, selectedSection, booksLoadingState, navigationState, selectedBook, i) => ({ /* items, sectionIDs, rowIDs,*/
         dataSource, selectedSection, booksLoadingState, navigationState, selectedBook, i }))
  return state$;
}

module.exports = model;
