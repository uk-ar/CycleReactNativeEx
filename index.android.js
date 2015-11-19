/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

let React = require('react-native');
let {Rx, run} = require('@cycle/core');
let {makeReactNativeDriver} = require('@cycle/react-native');
let {makeHTTPDriver} = require('@cycle/http');

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  View,
} = React;

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://resizing.flixster.com/DeLpPTAwX3O2LszOpeaMHjbzuAw=/53x77/dkpu1ddg7pbsk.cloudfront.net/movie/11/16/47/11164719_ori.jpg'
  }}
];

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

function renderMovie(movie) {
  return (
      <View style={styles.container}>
      <Image
    source={{uri: movie.posters.thumbnail}}
    style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.year}>{movie.year}</Text>
      </View>
      </View>
  );
}

function main({RN,HTTP}) {
  var movie = MOCKED_MOVIES_DATA[0];
  let request$ = Rx.Observable.just(REQUEST_URL);

  HTTP.filter(res$ => res$.request === REQUEST_URL)
    .mergeAll()
    .map(res => res.text)
    .subscribe()
    //.do(i => console.log(i))
      //.subscribe();

  return {
    RN: RN.select('button').events('press')
      .map(ev => +1)
      .startWith(0)
      .scan((x,y) => x+y)
      .do(i => console.log(i))
      .map(i =>
           renderMovie(movie)
          ),
    HTTP: request$,
      // <Text style={styles.button} selector="button">Increment</Text>
      // <Text>You have clicked the button {i} times.</Text>
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
});

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver()
});
