import Rx from 'rx';
import _ from 'lodash';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
} from './common';

import NavigationStateUtils from 'NavigationStateUtils';

const mockbooks = [
  { title: 'like:SOFT SKILLS', isbn: '9784822251550', bucket: 'liked' },
  { title: 'like:foo', isbn: '9784480064851', bucket: 'liked' },
  { title: 'borrow:qux', isbn: '9784492314630', bucket: 'borrowed' },
  { title: 'borrow:quxx', isbn: '9784798134208', bucket: 'borrowed' },
  { title: 'done:bar', isbn: '9784105393069', bucket: 'done' },
  { title: 'done:baz', isbn: '9784822285159', bucket: 'done' },
  { title: 'done:toz', isbn: '9784757142794', bucket: 'done' },
];

const Realm = require('realm');
class Book {}
Book.schema = {
  name: 'Book',
  primaryKey: 'isbn',
  properties: {
    isbn: 'string',
    bucket: { type: 'string', optional: true },
    title: { type: 'string', optional: true },
    author: { type: 'string', optional: true },
    thumbnail: { type: 'string', optional: true },
    modifyDate: 'date',
  },
};
let realm = new Realm({ schema: [Book], schemaVersion: 3 });
realm.write(() => {
  mockbooks.reverse().map((book) => {
    realm.create('Book',
                 {...book, modifyDate: new Date(Date.now())},
                 true)
  })
});
const initialBooks = realm.objects('Book')
                          .sorted('modifyDate', true)// reverse sort
                          .map((i)=>i)//convert result to array

function model(actions) {
  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */
  const searchedBooks$ =
    Rx.Observable
      .combineLatest(
        actions.booksResponse$,
        //actions.booksStatus$.startWith([]),
        (books, booksStatus) => {
          return books.map(book => {
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
          ); }).do(i => console.log('searchedBooks$:%O', i)
          ).distinctUntilChanged();

  const savedBooks$ =
    actions.changeBucket$
           .startWith(initialBooks)
           .scan((books, { type, book }) => {
             console.log('type:', type);
             switch (type) {
               case 'remove':
                 return books.filter((elem) =>
                   elem.isbn.toString() !== book.isbn.toString());
               case 'add':
                 return [book].concat(books);
               case 'replace':
                 return [book].concat(books.filter((elem) =>
                   elem.isbn.toString() !== book.isbn.toString()));
               default:
                 return books;
             }
           } // ).do((books)=>LayoutAnimation.easeInEaseOut() //bug in ios
           ).do((books) => {
             realm.write(() => {
               books.forEach((book) => {
                 realm.create('Book', book, true);
               });
             });
           }).shareReplay();

  const requestSavedBooksStatus$ =
    savedBooks$
               .map((books) => books.map(book => book.isbn))
               //.map(q => CALIL_STATUS_API + encodeURI(q))
               .map(q => (
                 {
                   key: 'savedBooksStatus',
                   //category: 'savedBooksStatus',
                   url: CALIL_STATUS_API + encodeURI(q)
                 }))
               .do((i) => console.log('save status:', i))
               //.subscribe()

               //.subscribe();
  const selectedBook$ = actions.goToBookView$;
  const booksLoadingState$ = actions.requestBooks$.map((_) => true)
                                    .merge(
                                      // response event
                                      actions.booksResponse$.map((_) => false));
  /* searchRequest$,statusRequest$
     searchRequest,statusRequest, */

  const initialNavigationState = {
    key: 'MainNavigation',
    index: 0,
    title: 'Cycle Native',
    routes: [
      { key: 'Main' },
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
                   savedBooks$,
                   booksLoadingState$.startWith(false).distinctUntilChanged(),
                   navigationState$.distinctUntilChanged(),
                   selectedBook$.startWith(null).distinctUntilChanged(),
                   actions.selectedSection$.startWith(null),
                   (searchedBooks, savedBooks, booksLoadingState, navigationState, selectedBook, selectedSection) =>
                     ({ searchedBooks, savedBooks, booksLoadingState, navigationState, selectedBook, selectedSection }));
  return {
    state$,
    request$: requestSavedBooksStatus$
  };
}

module.exports = model;
