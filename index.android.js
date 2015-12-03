/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let {Rx, run} = require('@cycle/core');
let {makeReactNativeDriver, CycleListView} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');
var WebViewAndroid = require('react-native-webview-android');

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
} = React;

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://resizing.flixster.com/DeLpPTAwX3O2LszOpeaMHjbzuAw=/53x77/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/47/11164719_ori.jpg'
  }}
];

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';
function cellPress(){
  console.log("pressed")
}

function renderMovie(movie) {
  var TouchableElement = TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
  }
  // <TouchableElement>
  //</TouchableElement>

  //https://github.com/facebook/react-native/issues/1908
  return(<TouchableNativeFeedback selector="cell" item={movie}>
         <View key="cell" style={styles.container}>
         <Image
         source={{uri: movie.posters.thumbnail}}
         style={styles.thumbnail}
         />
         <View key="cell-part" style={styles.rightContainer}>
         <Text style={styles.title}>{movie.title}</Text>
         <Text style={styles.year}>{movie.year}</Text>
         </View>
         </View>
         </TouchableNativeFeedback>)
}

var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})

var MySceneComponent = React.createClass({
  render: function() {
    return(
        <View key="all" style={styles.rightContainer}>
        <Text style={styles.button} selector="button">Increment</Text>
        <CycleListView
      dataSource = {dataSource.cloneWithRows(this.props.dataSource)}
      renderRow ={renderMovie}
      style={styles.listView}
        />
        </View>
    )
  }
})

function main({RN,HTTP}) {
  //var movie = MOCKED_MOVIES_DATA[0];
  //let request$ = Rx.Observable.just(REQUEST_URL);
  let request$ = RN.select('button').events('press')
      .map(i => REQUEST_URL)
      .do(i => console.log(i));

  let DetailView$ = RN.select('cell').events('press')
  //.map(i => i.currentTarget.props.item)
      .map(i => i.currentTarget.props.item.posters.thumbnail)
      .do(i => ToastAndroid.show(i, ToastAndroid.SHORT))
        .map(i =>
             <View style={{flex: 1}}>
             <WebViewAndroid url={i}
             style={styles.containerWebView}
             />
             </View>)

  //https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
  //https://facebook.github.io/react-native/docs/direct-manipulation.html
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/Movies
  let SearchView$ = HTTP.filter(res$ => res$.request === REQUEST_URL)
      .mergeAll()
      .map(res => JSON.parse(res.text).movies)
      .startWith(MOCKED_MOVIES_DATA)
      .map(i =>
           <Navigator
           initialRoute={{name: 'My First Scene', index: 0}}
           renderScene={(route, navigator) =>
                        <View style={{flex: 1}}>
                        <MySceneComponent
                        dataSource={i}
                        onForward={() => {
                          var nextIndex = route.index + 1;
                          navigator.push({
                            name: 'Scene ' + nextIndex,
                            index: nextIndex,
                          });
                        }}
                        onBack={() => {
                          if (route.index > 0) {
                            navigator.pop();
                          }
                        }}
                        />
                        </View>
                       }
           />);

  return {
    RN:SearchView$.merge(DetailView$),
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
