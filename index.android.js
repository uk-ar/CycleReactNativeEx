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

function main({RN,HTTP}) {
  let _navigator;

  let request$ = RN.select('button').events('press')
                   .map(i => REQUEST_URL);

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

  function backAction(){
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  }

  //onIconClicked
  let foo$ = RN.select('back').events('iconClicked')
               .do(backAction)
               .subscribe();
  //FIXME:Change to stream
  BackAndroid.addEventListener('hardwareBackPress', backAction);

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

  return {
    RN:SearchView$,//.merge(DetailView$),
    HTTP: request$,
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
  HTTP: makeHTTPDriver()
});
