import Rx from 'rx';
import _ from 'lodash';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID,
} from './common';

function intent(RN, HTTP) {
  // Actions
  const changeQuery$ = RN.select('text-input')
                         .events('changeText')
                         .map(([text])=>text)
                         .do(i => console.log('search text change:%O', i));
  const requestBooks$ =
    changeQuery$.debounce(500)
                .filter(query => query.length > 1)
                .map(q => ({
                  category: 'search',
                  url: RAKUTEN_SEARCH_API + encodeURI(q)
                }))
                .do(i=>console.log("requestBooks"))
                //.subscribe();
  const booksResponse$ =
    HTTP.select('search')
        .do(i=>console.log("i?:",i))
        .switch()
        .map(res=>res.text)
        .map(res=>JSON.parse(res))
        .do(i=>console.log("b re?:",i))
        .map(body =>
          body.Items
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
                  .map(q => ({
                    category: 'searchedBooksStatus',
                    url: CALIL_STATUS_API + encodeURI(q)
                  }))
                  .do(i => console.log('status req:%O', i));

  const booksStatusResponse$ =
    HTTP.select('searchedBooksStatus')
    //Rx.Observable.empty()
      .switch()
      .do(i => console.log('books status:%O', i))
  //.map(res$ => JSON.parse(res$.text.match(/callback\((.*)\)/)[1]))
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
      .do(i => console.log('books status change:%O', i));

  function createBooksStatusStream(httpResponseStream){
    const booksStatusResponse$ =
      httpResponseStream.switch()
                        .map(res => res.text)
                        .map(i => JSON.parse(i))
                        .do(i => console.log('saved books:%O', i))

    const retryResponse$ =
      booksStatusResponse$
        .do(i => console.log("retry:",i,i.continue))
        .map(result => {
          if (result.continue === 1) {
            throw result;
          }
          return result; // don't use?
        })
        .retryWhen((errors) =>
          errors.delay(2000) // .map(log)
        )
        .subscribe()
  }
  const savedBooksResponse$ =
    //Rx.Observable.empty()
    HTTP.select('savedBooksStatus')
        .switch()
        .map(res=>res.text)
        .map(i=> JSON.parse(i))
        .do(i => console.log('saved books:%O', i))
        //.subscribe()

  const retryResponse$ =
    savedBooksResponse$
      .do(i=>console.log("retry:",i,i.continue))
      .map(result => {
        if (result.continue === 1) {
          throw result;
        }
        return result; // don't use?
      })
      .retryWhen((errors) =>
        errors.delay(2000) // .map(log)
      )
      .subscribe()

  // release$.do((i)=>console.log("rel$")).subscribe()
  return {
    savedBooksResponse$,
    retryResponse$,
    requestStatus$,
    requestBooks$, // for loading status
    //request$,
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
    // TODO:change to isbn
       .map(([isbn, bucket]) => (
         { type: 'replace',
           isbn,
           bucket,
         }))
     /* .map(([book, bucket]) => (
      *   { type: 'replace',
      *     book: Object.assign(
      *       {}, book, { bucket, modifyDate: new Date(Date.now()) }) }))*/
     .do(i => console.log('rel:%O', i)),
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log('filter change:%O', i))
    ,
    sortState$: RN.select('sort')
                  .events('press')
                  .do(i => console.log('sort change:%O', i))
      // actions.sortState$
                  .startWith(false)
                  .scan((current, event) => !current)
                  .do(i => console.log('sort:%O', i))
    ,
    booksResponse$,
    booksStatusResponse$
  };
}

module.exports = intent;
