const Rx = require('rx');
const _ = require('lodash');

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID,
} from './common';

import {
  AsyncStorage,
} from 'react-native';

function intent(RN, HTTP) {
  // Actions
  const changeQuery$ = RN.select('text-input')
                         .events('changeText')
                         .do(i => console.log('search text change:%O', i));
  const requestBooks$ =
    changeQuery$.debounce(500)
                .filter(query => query.length > 1)
                .map(q => RAKUTEN_SEARCH_API + encodeURI(q));
  const booksResponse$ =
    HTTP.filter(res$ => res$.request.url.indexOf(RAKUTEN_SEARCH_API) === 0)
        .switch()
        .map(res =>
          res.body.Items
             .filter(book => book.isbn)
          // reject non book
             .filter(book => (book.isbn.startsWith('978')
                           || book.isbn.startsWith('979')))
        )
        .do(i => console.log('books change:%O', i))
        .share();
  const release$ = RN.select('bookcell')
                     .events('release');
  // move to model?
  const requestStatus$ =
    booksResponse$.map(books => books.map(book => book.isbn))
                  .map(q => CALIL_STATUS_API + encodeURI(q))
                  .do(i => console.log('status req:%O', i));
  const request$ = Rx.Observable.merge(requestBooks$, requestStatus$);

  // release$.do((i)=>console.log("rel$")).subscribe()
  return {
    requestBooks$,
    request$,
    selectedSection$: RN.select('section')
                        .events('press')
                        .merge(RN.select('close')
                                 .events('press').map(() => null))
                        .do(i => console.log('section selected:%O', i))
    // .do((books)=>LayoutAnimation.easeInEaseOut())//there is bug in iOS
    // Will be fixed in RN 0.28?
    // ref: https://github.com/facebook/react-native/pull/7942
    ,
    goToBookView$: RN.select('cell').events('press')
                     .do(i => console.log('cell press:%O', i)),
    back$: Rx.Observable
             .merge(RN.navigateBack(),
                    )
             .map({ type: 'back' }),
    changeBucket$: release$
      .do(i => console.log('release:', i))
      .map(([book, bucket]) => (
        { type: 'replace',
          book: Object.assign(
            {}, book, { bucket, modifyDate: new Date(Date.now()) }) }))
      .do(i => console.log('rel:%O', i)),
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log('filter change:%O', i))
                    .subscribe(),
    sortState$: RN.select('sort')
                  .events('press')
                  .do(i => console.log('sort change:%O', i))
      // actions.sortState$
                  .startWith(false)
                  .scan((current, event) => !current)
                  .do(i => console.log('sort:%O', i))
                  .subscribe(),
    booksResponse$,
    booksStatus$: HTTP
      .filter(res$ => res$.request.url.indexOf(CALIL_STATUS_API) === 0)
      .switch()
      .map(res$ => JSON.parse(res$.text.match(/callback\((.*)\)/)[1]))
      .do(i => console.log('books status retry:%O', i))
      // FIXME:
      .flatMap(result => [Object.assign({}, result, { continue: 0 }), result])
      .map(result => {
        if (result.continue === 1) {
          throw result;
        }

        return result; // don't use?
      })
      // cannot capture retry stream
      .retryWhen((errors) =>
        errors.delay(2000) // .map(log)
      )
      .map(result => result.books)
      .distinctUntilChanged()
      /* .do(books =>
         Object.keys(books).map(function(v) { return obj[k] })
         books.filter(book => book["Tokyo_Fuchu"]["status"] == "OK")) */
      .do(i => console.log('books status change:%O', i)),
  };
}

module.exports = intent;
