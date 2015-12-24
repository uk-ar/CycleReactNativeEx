var React = require('react-native');
let {makeReactNativeDriver, generateCycleRender} = require('@cycle/react-native');

var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
} = React;

function renderMovieCell(movie, sectionID, rowID, highlightRowFunc) {
  var TouchableElement = TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
  }
  {/* onShowUnderlay={()=>highlightRowFunc(sectionID, rowID)}
      onHideUnderlay={highlightRowFunc(null, null)} */}
  return(
    <TouchableElement
        selector="cell"
        item={movie}
    >
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
    </TouchableElement>
  )}

var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

var SearchScreen = React.createClass({
  render: function() {
    return(
      <ListView
          dataSource = {dataSource.cloneWithRows(this.props.dataSource)}
          renderRow ={generateCycleRender(renderMovieCell)}
          style={styles.listView}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
      />
    )
  }
});

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

module.exports = SearchScreen;
