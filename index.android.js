/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let Rx = require('rx');
var _ = require('lodash');
let {run} = require('@cycle/core');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

var Icon = require('react-native-vector-icons/FontAwesome');

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  View,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  ToastAndroid,
  ToolbarAndroid,
  Navigator,
  BackAndroid,
  WebView
} = React;

var SearchScreen = require('./SearchScreen');

var MOCKED_MOVIES_DATA = [
  {title: "はじめてのABCえほん", author: "仲田利津子/黒田昌代",
   thumbnail: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200"
  },
  {title: "ぐりとぐら(複数蔵書)", author: "中川李枝子/大村百合子",
   thumbnail: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200", isbn: "9784834000825",
   libraryStatus: {
     exist: true,
     rentable: true,
     reserveUrl: "http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f"
   }
  },
  {title: "ぐりとぐらの1ねんかん(単一蔵書)",
   author: "中川李枝子/山脇百合子（絵本作家）", isbn: "9784834014655",
   libraryStatus: {
     exist: true,
     rentable: true,
     reserveUrl: "https://library.city.fuchu.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1009710046217"},
   thumbnail: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200"
  }
  //size 200x200 largeImageUrl 64x64
];

const LIBRARY_ID = "Tokyo_Fuchu"

const CALIL_STATUS_API = `http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`

const RAKUTEN_SEARCH_API =
'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&booksGenreId=001&applicationId=1088506385229803383&formatVersion=2&keyword='
//books search api cannot use query keyword

function intent({RN, HTTP}){
  //Actions
  return{
    filterState$: RN.select('filter')
                    .events('press')
                    .startWith(false)
                    .scan((current, event) => !current)
                    .do(i => console.log("filter change:%O", i)),
    changeSearch$: RN.select('text-input')
                     .events('change')
                     .map(event => event.args[0].nativeEvent.text)
                     .do(i => console.log("search text change:%O", i)),
    //intent & model
    books$: HTTP.filter(res$ => res$.request.url.indexOf(RAKUTEN_SEARCH_API) === 0)
                .switch()
                .map(res =>
                  res.body.Items
                     .filter(book => book.isbn)
                    //reject non book
                     .filter(book => (book.isbn.startsWith("978")
                         || book.isbn.startsWith("979")))
                )
                .do(i => console.log("books change:%O", i))
                .share(),
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

function model(actions){
  const searchRequest$ = actions.changeSearch$.debounce(500)
                                .filter(query => query.length > 1)
                                .map(q => RAKUTEN_SEARCH_API + encodeURI(q));

  //model(Actions) -> State$
  const statusRequest$ = actions.books$
                                .map(books => books.map(book => book.isbn))
                                .map(q => CALIL_STATUS_API + encodeURI(q))
                                .do(i => console.log("status req:%O", i));

  /* const statusRequest$ = Rx.Observable.just("http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472") */

  //model
  const booksWithStatus$ = actions
    .books$
    .combineLatest(actions.booksStatus$.startWith([]), (books, booksStatus) => {
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
          libraryStatus: book.libraryStatus
        })
      }
      )
    })
    .startWith(MOCKED_MOVIES_DATA)
    .do(i => console.log("booksWithStatus$:%O", i))
    .combineLatest(actions.filterState$,(books,filter)=>{
      return filter ? books.filter(book => book.libraryStatus.exist) : books
      //TODO:case for book.libraryStatus is undefined
    })
    .share()

  return{
    searchRequest$: searchRequest$,//request$
    statusRequest$: statusRequest$,
    booksWithStatus$: booksWithStatus$
  }
}

function main({RN, HTTP}) {
  let _navigator;
  //ぐりとぐら
  //FIXME:Change navigator to stream
  RN.select('cell').events('press')
    .do(i => console.log("url:%O", i.currentTarget.props.item))
    .map(i => i.currentTarget.props.item)
    // if else return has problem?
    .map(i => {if(i.libraryStatus && i.libraryStatus.exist){
      return i.libraryStatus.reserveUrl
    }else{
      return i.thumbnail
    }})
    //.map(i => {return i.thumbnail})
    .do(i => console.log("url:%O", i))
    //.do(i => ToastAndroid.show(i, ToastAndroid.SHORT))
    .map(url => {
      _navigator.push({
        name: 'detail',
        url:  url
      })
    }).subscribe();
  //0192521722
  //qwerty

  // for android action
  function backAction(){
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  }
  //FIXME:Change to stream
  BackAndroid.addEventListener('hardwareBackPress', backAction);
  //onIconClicked
  RN.select('back')
    .events('iconClicked')
    .do(backAction)
    .subscribe();

  const actions = intent({RN:RN, HTTP:HTTP});
  const state$ = model(actions);

  // for android action
  var RouteMapper = function(route, navigator, component) {
    if(_navigator === undefined){
      _navigator=navigator;
    }
    if (route.name === 'search') {
      //TODO:remove dataSource
      return (
        <SearchScreen
            state$ = {state$}
        />
      )
    } else if (route.name === 'detail') {
      return(
        <CycleView key="webview" style={{flex: 1}}>
          <ToolbarAndroid
              actions={[]}
              navIcon={require('image!ic_arrow_back_white_24dp')}
              selector = "back"
              style={styles.toolbar}
              titleColor="white"
              //title={route.movie.title}
              //title = "detail"
          />
          <WebView url={route.url}
                   domStorageEnabled={true}
                   startInLoadingState={true}
                   javaScriptEnabled={true}
                   onError = {i => console.log("on err:%O", i)}
                   onLoad = {i => console.log("on load:%O", i)}
                   onLoadEnd = {i => console.log("on load end:%O", i)}
                   onLoadStart = {i => console.log("on load start:%O", i)}
                   onNavigationStateChange = {i => console.log("on nav:%O", i)}
                   style={styles.WebViewContainer}
          />
        </CycleView>
      ) // 'document.querySelector("[value$=\'カートに入れる\']").click()'
        // injectedJavaScript='document.querySelector(".button").click()'
    }
  }
  /* state$.booksWithStatus$
     .do(i =>
     //FIXME:replace clears current input text & scroll status
     // doc for ref, element, instance...
     // https://facebook.github.io/react/docs/more-about-refs.html
     _navigator.replace({name: 'search', dataSource: i})
     )
     .do(i => console.log("navi change event:%O", i))
     .subscribe(); */

  //https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
  //https://facebook.github.io/react-native/docs/direct-manipulation.html
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/Movies
  //https://facebook.github.io/react/docs/reusable-components.html
  /* .startWith(MOCKED_MOVIES_DATA)
     .do(i =>
     <Navigator
     key="nav"
     initialRoute = {{name: 'search', dataSource: MOCKED_MOVIES_DATA}}
     renderScene={generateCycleRender(RouteMapper)}
     />
     _navigator.push({name: 'search', dataSource: i})
     ) */
  let SearchView$ = state$.booksWithStatus$
                          .startWith(MOCKED_MOVIES_DATA)
                          .map(i =>
                            <Navigator
                                key="nav"
                                initialRoute = {{name: 'search'}}
                                renderScene={RouteMapper}
                            />).do(i => console.log("nav elem:%O", i));

  return {
    RN: SearchView$,//.merge(DetailView$),
    HTTP: state$.searchRequest$.merge(state$.statusRequest$)
  };
}

var styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  WebViewContainer: {
    flex: 1,
  }
});

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver()
});
