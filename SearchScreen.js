var React = require('react-native');
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var Icon = require('react-native-vector-icons/FontAwesome');
var GiftedSpinner = require('react-native-gifted-spinner');
var Emoji = require('react-native-emoji');
var Swipeout = require('react-native-swipeout');
import { SegmentedControls } from 'react-native-radio-buttons'

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
  ToolbarAndroid,
  Navigator,
  NavigatorIOS
} = React;

var GiftedNavigator = React.createClass({
  componentDidMount: function(){
    //console.log("nav this:%O", this);
    //var navigatorDidMount = this.props.navigatorDidMount.bind(this);
    //navigatorDidMount(this.refs.nav);
    this.props.navigatorDidMount.call({},this.refs.nav);
  },
  render: function() {
    if (Platform.OS === 'android') {
      return(
        <Navigator {...this.props}
          ref="nav"
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene = {(route, navigator, component) =>{
              //console.log("nav this:%O", this)
              return React.createElement(route.component,route.passProps)
            }}
        />)
    }
    else{
      return (
        <NavigatorIOS
            {...this.props}
            ref="nav"
            style={styles.container}
        />)
    }
  }
});

var LibraryStatus = React.createClass({
  render: function() {
    var libraryStatus = this.props.libraryStatus || {};

    var text, name, backgroundColor;

    if(libraryStatus.rentable){
      text="貸出可"
      style={backgroundColor: "#03A9F4"} //light blue
    }else if(libraryStatus.exist){
      text="貸出中"
      style={backgroundColor: "#FFC107"} //yellow
    }else if(libraryStatus.exist !== undefined){
      text="なし"
      style={backgroundColor: "#9E9E9E"} //grey
    }else{
      //text="取得中"
    }
    //http://www.google.com/design/spec/style/color.html#color-color-palette
    if(text){
      return (
        <View style = {[styles.rating, styles.row, style]}
        >
          <Text>
            {text}
          </Text>
        </View>
      );
    }else{
      return (
        <View style = {[styles.rating, styles.row]}>
          <Text>
            {"蔵書確認中"}
          </Text>
          <GiftedSpinner />
        </View>
      )
    }
    /*
       <Icon.Button name="facebook" backgroundColor="#3b5998">
       </Icon.Button>
       <Text>
       <Emoji name = "ok"/>
       {text}
       </Text> */

    {/*  <View style = {styles.iconContainer}>
        <Icon name = "building-o" size = {30}
        style={styles.libIcon}/>
        </View>
        <Icon name = "book" size={30} color="#900"/>
        <Icon name = "building" size={30} color="#900"/>
        <Icon name = "archive" size={30} color="#900"/>
        google icon location city
      */}
    {/* <Text style={[styles.ratingValue, getStyleFromScore(criticsScore)]}>
        {getTextFromScore(criticsScore)}
        </Text>
      */}
  },
});

var MovieCell = React.createClass({
  render: function(){
    var movie=this.props.movie;
  var TouchableElement = TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
  }
  var swipeoutBtns = [
    {
      text: '読みたい',
      onPress: () => {
        this.props.actions$.addInbox$.onNext(movie);
        console.log("add:%O", movie);
      }
    },
    {
      text: '削除',
      onPress: () => {
        this.props.actions$.removeInbox$.onNext(movie);
        console.log("remove:%O", movie);
      }
    }
  ]
    //conflict with cell action open state & update
  return(
    <CycleView key = "cell">
      <Swipeout
          left={swipeoutBtns}
          close={true}
          autoClose={true}
      >
        <TouchableElement
            selector="cell"
            item={movie}
            onPress={(e) => console.log("cell action:%O", e)}
        >
          <View style={styles.row}>
            <Image
                source={{uri: movie.thumbnail}}
                style={styles.cellImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.title}
              </Text>
              <Text style={styles.movieYear} numberOfLines={1}>
                {movie.author}
              </Text>
              <LibraryStatus libraryStatus={movie.libraryStatus}/>
            </View>
          </View>
        </TouchableElement>
      </Swipeout>
    </CycleView>
  )}
})

var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

var BookListView = React.createClass({
  getInitialState(){
    return {
      dataSource:[],
      selectedOption:null
    }
  },
  render() {
    //https://facebook.github.io/react-native/docs/toolbarandroid.html
    let MyToolbar = (
      <ToolbarAndroid
          //logo={require('./app_logo.png')}
          title="AwesomeApp"
          actions = {[{title: '検索', show: 'always'},
                      {title: '読みたい', show: 'always'}]}
          //icon: require('./icon_settings.png'),
          style={styles.toolbar}
          selector = "toolbar"
          //onActionSelected={this.onActionSelected}
      />
    );
    const options = [
      '検索',
      '読みたい',
      '読んだ',
    ];
    function setSelectedOption(selectedOption){
      this.setState({
        selectedOption:selectedOption
      });
    };
    //CycleView has not pass key props? bind this?
    //augmentVTreeWithHandlers seems to have problem
    return(
      <CycleView style = {styles.container} key="listview">
      <ListView
          ref="listview"
          dataSource = {dataSource.cloneWithRows(this.state.dataSource)}
          renderRow ={(movie, sectionID, rowID, highlightRowFunc) =>
            <MovieCell
                movie={movie}
                actions$={this.props.actions$}/>}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
      />
      {MyToolbar}
            <View style = {styles.row}>
              <Icon name = "filter"
                    selector = "filter"
                    size = {20}
                    color = "#007AFF"
              />
              <SegmentedControls
                  options={ options }
                  selector = "segmented"
                  style={styles.toolbarButton}
              />
              <Text>Like</Text>
            </View>
      </CycleView>
    )
    {/*
        style={styles.toolbarButton}
        style = {styles.toolbarTitle}
        onSelection={ setSelectedOption.bind(this) }
        selectedOption={ this.state.selectedOption }
        <Icon.Button name = "filter" selector = "filter"
        style = {styles.icon}/>
        <Icon.Button name = "sort" selector = "sort"
        style = {styles.icon}/>


      */}
  },
  componentWillMount(){
    this.subscription = this.props.dataSource$.subscribe((dataSource) =>
      this.setState({dataSource:dataSource})
    )
  },
  componentWillUnmount(){
    this.subscription.dispose()
  }
});

var InBoxScreen = React.createClass({
  render: function(){
    return(
      <CycleView style={styles.container}
                 key = "InBoxScreen">
        <BookListView
            dataSource$={this.props.state$.inbox$}
            actions$={this.props.actions$}
            key = "inboxlistview"
        />
      </CycleView>
    )
  }
});

//var SearchBar = require('SearchBar');
var SearchBar = require('./SearchBar');

var SearchScreen = React.createClass({
  getInitialState(){
    return {
      isLoading:false,
      isLoadingTail:false,
      //support pagenation
      //https://github.com/facebook/react-native/blob/master/Examples/Movies/SearchScreen.js#L81
      //http://stackoverflow.com/questions/27514310/turning-paginated-requests-into-an-observable-stream-with-rxjs
    }
  },
  componentWillMount(){
    this.subscription = this.props.state$.searchRequest$.map((_)=> true)
                            .merge(
                              this.props.actions$.books$.map((_)=>false))
                            .subscribe((isLoading) =>
                              this.setState({isLoading:isLoading})
                            )
  },
  componentWillUnmount(){
    this.subscription.dispose()
  },
  render: function() {
    //isLoading={this.state.isLoading}
    //onSearchChange={this.onSearchChange}
    return(
      <CycleView style={styles.container}
                 key = "searchScreen">
        <SearchBar
            key="searchBar"
            isLoading={this.state.isLoading}
        />
        <View style={styles.separator} />
        <BookListView dataSource$={this.props.state$.booksWithStatus$}
                      actions$={this.props.actions$}
                      key = "searchlistview"
        />
      </CycleView>
    )
  }
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/SearchScreen.js
});

var styles = StyleSheet.create({
  //for toolBar
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  iconContainer:{
    /* backgroundColor: 'deepskyblue', */
    backgroundColor: 'orange',
    /* borderRadius: 15, */
    borderRadius: 23,
    /* padding: 8, */
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 7
  },
  libIcon: {
    textAlign: 'center',
    width: 30,
    color: "white",
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
    //alignItems: 'center',
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
  segmented:{
    flex: 1,
    backgroundColor: 'black',
  },
  icon:{
    //width: 50
  },
  toolbarButton:{
    //width: 50,            //Step 2
    //textAlign:'center',
    flex:1                //Step 3
  },
  toolbarTitle:{
    //alignItems: 'center',
    textAlign:'center',
    fontWeight:'bold',
    flex:1                //Step 3
  },
});

module.exports = {SearchScreen, InBoxScreen, GiftedNavigator};
