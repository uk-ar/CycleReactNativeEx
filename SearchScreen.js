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
  // cell
  PixelRatio,
  // searchBar
  TextInput,
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
      <View style={styles.row}>
        <Image
            source={{uri: movie.posters.thumbnail}}
            style={styles.cellImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title}
          </Text>
          <Text style={styles.movieYear} numberOfLines={1}>
            {movie.year}
          </Text>
        </View>
      </View>
    </TouchableElement>
  )}

var IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21;

var SearchBar = React.createClass({
  /* render: function(){
     generateCycleRender(this.myRender)
     }, */
  render: function() {
    var loadingView;
    if (this.props.isLoading) {
      loadingView = (
        <ProgressBarAndroid
            styleAttr="Large"
            style={styles.spinner}
        />
      );
    } else {
      loadingView = <View style={styles.spinner} />;
    }
    var background = IS_RIPPLE_EFFECT_SUPPORTED ?
                     TouchableNativeFeedback.SelectableBackgroundBorderless() :
                     TouchableNativeFeedback.SelectableBackground();
    return (
      <View style={styles.searchBar}>
        <TouchableNativeFeedback
            background={background}
            onPress={() => this.refs.input && this.refs.input.focus()}>
          <View>
            <Image
                source={require('image!android_search_white')}
                style={styles.icon}
            />
          </View>
        </TouchableNativeFeedback>
        <TextInput
            ref="input"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            selector="input"
            placeholder="Search a movie..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={styles.searchBarInput}
        />
        {loadingView}
      </View>
    );
    //onChange={this.props.onSearchChange}
    //onFocus={this.props.onFocus}
  }
});

var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

var SearchScreen = React.createClass({
  render: function() {
    //isLoading={this.state.isLoading}
    //onSearchChange={this.onSearchChange}
    return(
      <View style={styles.container}>
        <SearchBar
            onFocus={() =>
              this.refs.listview && this.refs.listview.getScrollResponder().scrollTo(0, 0)}
        />
        <View style={styles.separator} />
        <ListView
            dataSource = {dataSource.cloneWithRows(this.props.dataSource)}
            renderRow ={generateCycleRender(renderMovieCell)}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
        />
      </View>
    )
  },
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/SearchScreen.js
});

var styles = StyleSheet.create({
  //for searchBar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    height: 50,
    padding: 0,
    backgroundColor: 'transparent'
  },
  spinner: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  //for listview
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noMoviesText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  //for cell
  textContainer: {
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
});

module.exports = SearchScreen;
