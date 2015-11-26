/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let {Rx, run} = require('@cycle/core');
let {makeReactNativeDriver, augmentVTreeWithHandlers} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

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
  //<Text>You have clicked the button {i} times.</Text>
  var TouchableElement = TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
  }
    //
    // //selector="cell" onPress={cellPress}
  // <TouchableElement>
  //</TouchableElement>
  // augmentVTreeWithHandlers->view(all) text listview
  // extend component
  //https://github.com/facebook/react-native/issues/1908
  return(<TouchableNativeFeedback selector="cell">
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

//https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
// var CycleListView = React.createClass({
//   render: function() {
//     var renderRow = this.props.renderRow;
//     function wrapRenderRow(i){
//       var vtree = renderRow.call({},i)
//       return augmentVTreeWithHandlers(vtree);
//     }
//     return (<ListView {...this.props} renderRow = {wrapRenderRow}/>)
//   }
// })

function main({RN,HTTP}) {
  //var movie = MOCKED_MOVIES_DATA[0];
  //let request$ = Rx.Observable.just(REQUEST_URL);
  let request$ = RN.select('button').events('press').merge(RN.select('cell').events('press'))
      .map(i => REQUEST_URL)
      // .do(i => console.log(i));

  // .startWith(0)
  // .map(ev => +1)
  // .scan((x,y) => x+y)

  //.subscribe()
    //.do(i => console.log(i))
      //.subscribe();

  return {
    RN:
    HTTP.filter(res$ => res$.request === REQUEST_URL)
      .mergeAll()
      .map(res => JSON.parse(res.text).movies)
      .startWith(MOCKED_MOVIES_DATA)
      //.do(i => console.log(i))
        .map(i =>
             //renderMovie(i[0])
             <View key="all" style={styles.rightContainer}>
             <Text style={styles.button} selector="button">Increment</Text>
             <CycleListView
             dataSource = {dataSource.cloneWithRows(i)}
             renderRow ={renderMovie}
             style={styles.listView}
             />
             </View>
          ),
    HTTP: request$,
  };
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    //flexDirection: 'column',
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
});

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver()
});
