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
  const release$ = RN.select('bookcell')
                     .events('release');

  const changeQuery$ = RN.select('text-input')
                         .events('changeText')
                         .map(([text]) => text)
                         .do(i => console.log('search text change:%O', i));

  const requestBooks$ =
    changeQuery$.debounce(500)
                .filter(query => query.length > 1)
                .map(q => ({
                  category: 'search',
                  url: RAKUTEN_SEARCH_API + encodeURI(q)
                }))
                .do(i => console.log('requestBooks'));

  function createResponseStream(category) {
    return (
      HTTP.select(category)
          .switch()
          .map(res => res.text)
          .map(res => JSON.parse(res))
    ); }

  const booksResponse$ =
    createResponseStream('search')
        .map(body =>
          body.Items
              .filter(book => book.isbn)
          // reject non book
              .filter(book => (book.isbn.startsWith('978')
                            || book.isbn.startsWith('979')))
        )
        .do(i => console.log('books change:%O', i))
        .share();

  function createBooksStatusStream(books$, category) {
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

    const requestStatus$ =
      // booksResponse$.map(books => books.map(book => book.isbn))
      books$.map(books => books.map(book => book.isbn))
            .filter(isbns => isbns.length > 0)
            .map(q => ({
              category, // 'searchedBooksStatus',
              url: CALIL_STATUS_API + encodeURI(q)
            }))
            .do(i => console.log('status req:%O', i));

    const booksStatusResponse$ =
      // createResponseStream('searchedBooksStatus')
      createResponseStream(category)
        .do(i => console.log('books status:%O', i, i.continue))// executed by retry
    // ok to retry but not output stream
    // .flatMap(result => result.continue === 1 ?
    //                 [result, Observable.throw(error)] : [result])
        .flatMap(result => [{ ...result, continue: 0 }, result])
        .map(result => {
          if (result.continue === 1) {
            throw result;
          }
          return result;
        })
        .retryWhen((errors) =>
          errors.delay(2000)
        )
        .distinctUntilChanged(i => JSON.stringify(i))
        .map(result => result.books)
    /* .do(books =>
       Object.keys(books).map(function(v) { return obj[k] })
       books.filter(book => book["Tokyo_Fuchu"]["status"] == "OK")) */
        .do(i => console.log('books status change:%O', i));

    const booksStatus$ =
      Rx.Observable
        .combineLatest(
          books$,
          booksStatusResponse$,
          mergeBooksStatus,
        ).do(i => console.log('books$:', category, i));
    return ({
      booksStatus$,
      requestStatus$ });
  }
  // const { booksStatus$: searchedBooksStatus$, requestStatus$: requestSearchedBooksStatus$} =
  const { booksStatus$: searchedBooksStatus$, requestStatus$ } =
    createBooksStatusStream(booksResponse$, 'searchedBooksStatus');
  // mojibake "nas" "ai"

  /* const { booksStatus$: searchedBooksStatus$, requestStatus$ } =
   *   createBooksStatusStream(booksResponse$, 'savedBooksStatus');
   *
   * const savedBooksResponse$ =
   *   //Rx.Observable.empty()
   *   HTTP.select('savedBooksStatus')
   *       .switch()
   *       .map(res=>res.text)
   *       .map(i=> JSON.parse(i))
   *       .do(i => console.log('saved books:%O', i))
   *       //.subscribe()*/

  // release$.do((i)=>console.log("rel$")).subscribe()
  return {
    // savedBooksResponse$,
    // retryResponse$,
    requestStatus$,
    requestBooks$, // for loading status
    // request$,
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
    // booksResponse$,
    // booksStatusResponse$,
    searchedBooksStatus$,
  };
}

module.exports = intent;
