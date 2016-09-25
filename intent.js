import Rx from 'rx';
import _ from 'lodash';

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID,
  log,
} from './common';

const mockbooks = [
  { title: 'like:SOFT SKILLS', isbn: '9784822251550', bucket: 'liked' },
  { title: 'like:bukkyou', isbn: '9784480064851', bucket: 'liked' },
  { title: 'borrow:youji kyouiku keizai', isbn: '9784492314630', bucket: 'borrowed' },
  { title: 'borrow:gabage collection', isbn: '9784798134208', bucket: 'borrowed' },
  { title: 'done:simpsons', isbn: '9784105393069', bucket: 'done' },
  { title: 'done:wakuwaku programming', isbn: '9784822285159', bucket: 'done' },
  { title: 'done:toshi ha saikou no hatumei', isbn: '9784757142794', bucket: 'done' },
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
    // Image raise error when src is null
    thumbnail: { type: 'string', default: undefined },
    modifyDate: 'date',
  },
};
const realm = new Realm({ schema: [Book], schemaVersion: 4 });
realm.write(() => {
  /* mockbooks.reverse().map((book) => {
   *   realm.create('Book',
   *                {...book, modifyDate: new Date(Date.now())},
   *                true)
   * })*/
});
/* const initialBooks = realm.objects('Book')
 *                           .sorted('modifyDate', true)// reverse sort
 *                           .map((i) => i);// convert result to array
 * */
const initialBooks = mockbooks;

function intent(RN, HTTP) {
  // Actions
  // mojibake シンプ Q思考
  const release$ = RN.select('bookcell')
                     .events('release')
                     .do((...args) => console.log('foo:', ...args));

  const changeQuery$ = RN.select('text-input')
                         .events('changeText')
                         .map(([text]) => text)
                         .do(i => console.log('search text change:%O', i));

  const requestBooks$ =
    changeQuery$.debounce(500)
                .filter(query => query.length > 1)
                .do(i => console.log('requestBooks', i))
                .map(q => ({
                  category: 'search',
                  url: RAKUTEN_SEARCH_API + encodeURI(q),
                  headers: { 'Content-Type':
                             'application/json; charset=utf-8' },
                  /* accept: { 'Accept-Language':
                   *           'ja,en-US;q=0.8,en;q=0.6' }*/
                  accept: 'Accept-Language:ja,en-US;q=0.8,en;q=0.6'
                }));
  // NGsearch:ぐらと
  // ああ　あ

  function createResponseStream(category) {
    return (
      HTTP.select(category)
          .switch()
          .map(res => res.text)
          // .do(res => console.log(res))
          .map(res => JSON.parse(res))
    ); }

  const booksResponse$ =
    createResponseStream('search')
      .map(body =>
        body.Items
            .filter(book => book.isbn)
        // reject non book
            .filter(book =>
              book.isbn.startsWith('978') || book.isbn.startsWith('979'))
            .map(({ title, author, isbn, largeImageUrl }) => ({
              title: title.replace(/^【バーゲン本】/, ''),
              author,
              isbn,
              thumbnail: largeImageUrl,
            }))
      )
      .do(i => console.log('books change:%O', i))
      .share();

  function createBooksStatusStream(books$, category) {
    function mergeBooksStatus(books, booksStatus) {
      return books.map((book) => {
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
        // TODO:support books from search result
        // TODO:support books from saved result
        // TODO:move to booksStatusResponse$
        return ({
          ...book,
          libraryStatus,
          //active: true,
        });
      }
      );
    }

    const requestStatus$ =
      books$.do(i => console.log('connect:%O', i))
            .map(books => books.map(book => book.isbn))
            .do(i => console.log('isbns:%O', i))
            .filter(isbns => isbns.length > 0)
            .map(q => ({
              category,
              url: CALIL_STATUS_API + encodeURI(q)
            }))
            .do(i => console.log('status req:%O', i))
            .shareReplay();

    const booksStatusResponse$ =
      createResponseStream(category)
        .do(i => console.log('books status:%O', i, i.continue))// executed by retry
    // ok to retry but not output stream
    // .flatMap(result => result.continue === 1 ?
    //                 [result, Observable.throw(error)] : [result])
        .flatMap(result => [{ ...result, continue: 0 }, result])
        .map((result) => {
          if (result.continue === 1) {
            throw result;
          }
          return result;
        })
        .retryWhen(errors =>
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
          // books$.map((book) => ({...book, key: book.isbn})),
          // books$.map((book) => book),
          books$.map(books =>
            books.map(book => ({ ...book, key: `isbn-${book.isbn}` }))),
          // books$,
          booksStatusResponse$.startWith({}),
          mergeBooksStatus,
        ) // .do(i => console.log('books$:', category, i))
        .shareReplay();
    return ({
      booksStatus$,
      requestStatus$ });
  }

  const changeBucket$ =
    release$
      .do(i => console.log('release:', i))
      .filter(([book, bucket, bookRow]) => bucket !== null)
  // TODO:change to isbn
  /* .map(([book, bucket]) => (
   *   { type: 'replace',
   *     book,
   *     bucket,
   *   }))*/
  /* .map(([isbn, bucket]) => (
   *   { type: 'replace',
   *     isbn,
   *     bucket,
   *   }))*/
  /* .flatMap(([book, bucket, bookRow]) =>
   *   bookRow.close().then(()=>[book, bucket, bookRow])
   *   )*/
      .map(([book, bucket, bookRow]) => {
        return ({ type: 'replace', book, bucket, bookRow });
      })
  /* .flatMap(([book, bucket, bookRow]) =>
   *   [{ type: 'remove', book, bookRow},
   *    //bookRow.close(),
   *    { type: 'add', book, bucket }])*/
  /* .map(([book, bucket]) => (
   *   { type: 'replace',
   *     book: Object.assign(
   *       {}, book, { bucket, modifyDate: new Date(Date.now()) }) }))*/
      .do(i => console.log('rel:%O', i))
      .shareReplay();

  // [{isbn:,mod},{isbn:,mod}]
  const savedBooks$ =
    changeBucket$
      .startWith(initialBooks)
      .scan((books, { type, book, bucket, bookRow }) => {
        console.log('type:', type, book, bucket, bookRow);
        switch (type) {
            /* case 'remove':
             *   return books.filter((elem) =>
             *     elem.isbn.toString() !== book.isbn.toString());
             * case 'add':
             *   return [{...book,bucket}].concat(books);*/
          case 'replace':
            /* return [book].concat(
             *   books.filter((elem) => elem.isbn.toString() !== book.isbn.toString()));*/
            return [{ ...book, bucket, modifyDate: new Date(Date.now()) }]
              .concat(books.filter(elem =>
                elem.isbn.toString() !== book.isbn.toString()));
          default:
            return books;
        }
      } // ).do((books)=>LayoutAnimation.easeInEaseOut() //bug in ios
      ).shareReplay();

  savedBooks$.do((books) => {
    realm.write(() => {
      books.forEach((book) => {
        realm.create('Book', book, true);
      });
    });
  }).subscribe();

  const { booksStatus$: savedBooksStatus$,
          requestStatus$: requestSavedBooksStatus$ } =
            createBooksStatusStream(savedBooks$, 'savedBooksStatus');

  // array to object
  function arrayToObject(books) { // Books to dict
    return books.reduce((acc, book) => {
      acc[book.isbn] = book;
      return acc;
    }, {});
  }

  const mockSearcheBooks = [
    { title: 'like:SOFT SKILLS', isbn: '9784822251550' },
    { title: 'borrow:youji kyouiku keizai', isbn: '9784492314630' },
    { title: 'done:simpsons', isbn: '9784105393069' },
    { title: 'none:container', isbn: '9784822245641' },
    { title: 'guri', isbn: '9784834032147' },
    { title: 'ABC', isbn: '9784828867472' },
  ];

  const { booksStatus$: searchedBooksStatus$,
          requestStatus$: requestSearchedBooksStatus$ } =
            createBooksStatusStream(
              // merge savedBooks to searchedBooks
              booksResponse$
                .startWith(mockSearcheBooks)
                .combineLatest(
                  savedBooks$.map(arrayToObject),
                  (searchedBooks, savedBooks) =>
                    searchedBooks.map(book =>
                      savedBooks[book.isbn] || book))
              // booksResponse$
                .do(i => console.log('in:', i))
                .do(i => console.log('booksres0:', i))
              // .map(books => books.map((book) => ({...book, bucket:"foo"})))
              // .map(books => books.map((book) => book.isbn ))
                .do(i => console.log('booksres1:', i))
              //
              ,
              'searchedBooksStatus');
  // mojibake "nas" "ai"

  /* savedBooks$
   *   .do(i => console.log('saved:', i))
   *   .subscribe()

   * savedBooksStatus$
   *   .do(i => console.log('saved sta:', i))
   *   .subscribe()

   * searchedBooksStatus$
   *   .do(i => console.log('searched sta:', i))
   *   .subscribe()

   * requestSearchedBooksStatus$
   *   .do(i => console.log('req searched sta:', i))
   *   .subscribe()*/

  // TODO:
  const request$ = Rx.Observable
                     .merge(requestSavedBooksStatus$,
                            requestBooks$,
                            requestSearchedBooksStatus$);
  /* const { booksStatus$: searchedBooksStatus$, requestStatus$ } =
   *   createBooksStatusStream(booksResponse$, 'savedBooksStatus');*/

  /* const savedBooksResponse$ =
   *   //Rx.Observable.empty()
   *   HTTP.select('savedBooksStatus')
   *       .switch()
   *       .map(res=>res.text)
   *       .map(i=> JSON.parse(i))
   *       .do(i => console.log('saved books:%O', i))*/
  // .subscribe()

  // release$.do((i)=>console.log("rel$")).subscribe()
  const changeSection$ =
    RN.select('section')
      .events('press')
      .merge(RN.select('close')
               .events('press').map(() => null))
      // .do(i => console.log('section selected0:%O', i,this))
      .distinctUntilChanged()
      .shareReplay();

  const scrollListView$ =
    RN.select('listview')
      .events('scroll')
      .do(([e]) => console.log('scroll:', e.nativeEvent.contentOffset.y))
      .subscribe();

  const scrollToSection$ =
    changeSection$
      .filter(i => i !== null)// null->section
      .withLatestFrom(
        RN.select('listview')
          .my()
          .filter(i => i !== null)
          .distinctUntilChanged()
          .do(log('my'))
        // my() to payload or func param
      )
      // .do(i => console.log('listview:my:', i))
      .flatMap(([section, inst]) =>
        // Rx.Observable.fromPromise(inst.scrollTo({x:0,y:100,animated:true})))
        Rx.Observable.fromPromise(inst.scrollToSectionHeader(section)))
      .do(log('sec?'));
      // .do(i => console.log('prom result', i))
      // .distinctUntilChanged()

  const selectedSection$ =
    Rx.Observable.merge(
      scrollToSection$.map(([section, y]) => section).do(log('toSec')),
      changeSection$
        .filter(i => i === null) // section->null
        .do(log('toNull'))
    )
  // .distinctUntilChanged(x => x, (a,b) => a !== b )
      .distinctUntilChanged()
      .startWith(null)
      .do(i => console.log('section selected1:%O', i))
      .shareReplay();

  return {
    savedBooks$,
    savedBooksStatus$,
    request$,
    requestBooks$, // for loading status
    // request$,
    // onpress -> triggers animation -> change selectedSection
    selectedSection$,
    // .do((books)=>LayoutAnimation.easeInEaseOut())//there is bug in iOS
    // Will be fixed in RN 0.28?
    // ref: https://github.com/facebook/react-native/pull/7942
    goToBookView$: RN.select('cell').events('press')
                     .do(i => console.log('cell press:%O', i)),
    back$: Rx.Observable
             .merge(RN.navigateBack(),
                    )
             .map({ type: 'back' }),
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log('filter change:%O', i)),
    sortState$: RN.select('sort')
                  .events('press')
                  .do(i => console.log('sort change:%O', i))
      // actions.sortState$
                  .startWith(false)
                  .scan((current, event) => !current)
                  .do(i => console.log('sort:%O', i)),
    // booksResponse$,
    // booksStatusResponse$,
    searchedBooksStatus$,
  };
}

module.exports = intent;
