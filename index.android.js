/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let Rx = require('rx');
let {run} = require('@cycle/core');
let {makeReactNativeDriver, generateCycleRender} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');
let {makeJSONPDriver} = require('@cycle/jsonp');
var WebViewAndroid = require('react-native-webview-android');
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
} = React;

var SearchScreen = require('./SearchScreen');

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://resizing.flixster.com/DeLpPTAwX3O2LszOpeaMHjbzuAw=/53x77/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/47/11164719_ori.jpg'
  }},
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://resizing.flixster.com/DeLpPTAwX3O2LszOpeaMHjbzuAw=/53x77/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/47/11164719_ori.jpg'
  }}
];

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

const CALIL_STATUS_API = `http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`

function intent({RN, HTTP, JSONP}){
  const RAKUTEN_SEARCH_API =
  'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&booksGenreId=001&applicationId=1088506385229803383&formatVersion=2&keyword='

  //Actions
  return{
    changeSearch$: RN.select('text-input')
                     .events('change')
                     .map(event => event.args[0].nativeEvent.text),

      //.do(i => console.log("i:%O", i))
    //intent & model
    books$: HTTP.filter(res$ => res$.request.url.indexOf(RAKUTEN_SEARCH_API) === 0)
                .switch()
                .map(res => res.body.Items)
                .startWith([]),

    booksStatus$: JSONP.filter(res$ => res$.request.url.indexOf(CALIL_STATUS_API) === 0)
                       .switch()
                       .flatMap(result => {
                         [Object.assign({}, result, {continue:0}), result]
                       })
                       .map(result => {
                         if(result.continue == 1){
                           throw result
                         }
                         return result
                       })
                       .retryWhen(function(errors) {
                         return errors.delay(2000); //.map(log)
                       }).distinctUntilChanged().map(result=>result.books)
                       .startWith([]);
      //.share();
  };
}

function model(actions){
  const searchRequest$ = actions.changeSearch$.debounce(500)
                                .filter(query => query.length > 1)
                                .map(q => RAKUTEN_SEARCH_API + encodeURI(q));

  const LIBRARY_ID = "Tokyo_Fuchu"
  //model(Actions) -> State$
  const statusRequest$ = actions.books$.filter(query => query.length > 0)
                                .map(books => books.map(book => book.isbn))
                                .map(q => CALIL_STATUS_API + encodeURI(q));
  //model
  const booksWithStatus$ = actions
    .books$
    .combineLatest(booksStatus$, (books, booksStatus) => {
      return books.map(book => {
        if((booksStatus[book.isbn] !== undefined)&&
           (booksStatus[book.isbn][LIBRARY_ID].libkey !== undefined)){
             book.exist =
             Object.keys(booksStatus[book.isbn][LIBRARY_ID].libkey).length !=0;

             book.status =
             booksStatus[book.isbn][LIBRARY_ID].libkey;

             book.reserveUrl =
             booksStatus[book.isbn][LIBRARY_ID].reserveurl;

             //console.log(book.exist)
        }
        return book
      })
    })
    .startWith([])
    .do(i => console.log("booksWithStatus$:%O", i))
    .subscribe()
    /* .combineLatest(filterRequest$,(books,filter)=>{
       return filter ? books.filter(book => book.exist) : books
       }) */

  return{
    searchRequest$: searchRequest$,//request$
    statusRequest$: statusRequest$,
    booksWithStatus$: booksWithStatus$
  }
}

function main({RN, HTTP, JSONP}) {
  let _navigator;

  //FIXME:Change navigator to stream
  RN.select('cell').events('press')
    .map(i => i.currentTarget.props.item.posters.thumbnail)
    //.do(i => ToastAndroid.show(i, ToastAndroid.SHORT))
    .map(url => {
      _navigator.push({
        name: 'detail',
        url:  url
      })
    }).subscribe();

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
  RN.select('back').events('iconClicked')
                     .do(backAction)
                     .subscribe();
  // for android action
  var RouteMapper = function(route, navigator, component) {
    if(_navigator === undefined){
      _navigator=navigator;
    }
    if (route.name === 'search') {
      return (
          <SearchScreen
              key="my-scene"
              dataSource = {route.dataSource}
          />
      )
    } else if (route.name === 'detail') {
      return(
        <View key="webview" style={{flex: 1}}>
          <ToolbarAndroid
              actions={[]}
              navIcon={require('image!ic_arrow_back_white_24dp')}
              selector = "back"
              style={styles.toolbar}
              titleColor="white"
              //title={route.movie.title}
              //title = "detail"
          />
          <WebViewAndroid url={route.url}
                          style={styles.containerWebView}
          />
        </View>
      )
    }
  }

  //https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
  //https://facebook.github.io/react-native/docs/direct-manipulation.html
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/Movies
  //https://facebook.github.io/react/docs/reusable-components.html
  let SearchView$ =
  HTTP.filter(res$ => res$.request === REQUEST_URL)
      .mergeAll()
      .map(res => JSON.parse(res.text).movies)
      .startWith(MOCKED_MOVIES_DATA)
      .map(i =>
        <Navigator
            key="nav"
            initialRoute = {{name: 'search', dataSource: MOCKED_MOVIES_DATA}}
            renderScene={generateCycleRender(RouteMapper)}
        />);

  const actions = intent({RN:RN, HTTP:HTTP, JSONP:JSONP});
  const state$ = model(actions);

  return {
    RN: SearchView$,//.merge(DetailView$),
    HTTP: state$.searchRequest$,//request$
    JSONP: state$.statusRequest$
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  containerWebView: {
    flex: 1,
  }
});

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver(),
  JSONP: makeJSONPDriver()
});
