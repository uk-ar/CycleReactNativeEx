import React, { Component } from 'react';
let { makeReactNativeDriver, generateCycleRender } = require('@cycle/react-native');
const FAIcon = require('react-native-vector-icons/FontAwesome');
const MIcon = require('react-native-vector-icons/MaterialIcons');

import ListView from '@cycle/react-native/src/ListView';

import {
  TouchableOpacity,
  ActivityIndicatorIOS,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  LayoutAnimation,
  // cell
  PixelRatio,
  // searchBar
  TextInput,
  ToolbarAndroid,
  Navigator,
  NavigatorIOS,
  Animated,
  ScrollView,
  PanResponder,
} from 'react-native';

import Touchable from '@cycle/react-native/src/Touchable';
Touchable['FAIcon'] = Touchable.createCycleComponent(
  FAIcon, Touchable.PRESS_ACTION_TYPES);

const GiftedNavigator = React.createClass({
  componentDidMount() {
    // console.log("nav this:%O", this);
    // var navigatorDidMount = this.props.navigatorDidMount.bind(this);
    // navigatorDidMount(this.refs.nav);
    // this.props.onNavigatorMounted.call({},this.refs.nav);
  },

  render() {
    if (Platform.OS === 'android') {
      return (
        <Navigator {...this.props}
          ref="nav"
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}
          renderScene={(route, navigator, component) => {
              // console.log("nav this:%O", this)
            return React.createElement(route.component, route.passProps);
          }}

        />);
    } else {
      return (
        <NavigatorIOS
          {...this.props}
          ref="nav"
          style={styles.container}
        />);
    }
  },
});

let { AnimatedFlick, BookCell } = require('./BookCell');

/* var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
}); */

const BookListView = React.createClass({
  render() {
    const options = [
      '検索',
      '読みたい',
      //'読んだ',
    ];
    const normalStyle = {
      color: 'white',
      marginHorizontal: 5,
    };
    const selectedStyle = {
      color: '#007AFF', // 'rgba(0,0,0,1)',//baseColor,
      // fontWeight: 'bold'
      marginHorizontal: 5,
    };
    return (
      <View>
      <ListView
        ref="listview"
        items={this.props.dataSource}
        renderRow={(movie, sectionID, rowID, highlightRowFunc) => {
              // actions$={this.props.actions$}
              // need to intercept renderRow?
              // error on already defined
              // selector="bookcell"
              // <Touchable.TouchableOpacity selector="list"> //ng
              // <TouchableOpacity selector="list"> //ok
          return (
                  <BookCell book={movie}
                    sectionID={sectionID}
                    rowID={rowID}
                    onLike={this.props.onLike}
                    onDone={this.props.onDone}
                    onInbox={this.props.onInbox}
                  />
              );
        }}

        enableEmptySections
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps
        showsVerticalScrollIndicator={false}
      />
            <View style={[styles.row,
                            { justifyContent: 'space-between',
                              alignItems: 'center' }]}>
              <Touchable.FAIcon name="filter"
                selector="filter"
                size={25}
                color="#007AFF"
                style={{ marginHorizontal: 8 }}
              />
              <Touchable.FAIcon name="sort"
                selector="sort"
                size={25}
                color="#007AFF"
                style={{ marginHorizontal: 8 }}
              />
            </View>
      </View>
    );
  },
  /* componentWillMount(){
     //https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e#.9c2mobfa0
     //http://browniefed.com/blog/2015/08/01/react-native-animated-listview-row-swipe/
     this.subscription = this.props.dataSource$.subscribe((dataSource) => {
     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
     //LayoutAnimation.configureNext(CustomLayoutSpring);
     this.setState({dataSource:dataSource});
     console.log("d:%O",dataSource);
     }
     )
     }, */
});

const InBoxScreen = React.createClass({
  render() {
    return (
      <View style={styles.container}
        key="InBoxScreen"
      >
        {}
        <BookListView
          dataSource$={this.props.state$.inbox$}
          key="inboxlistview"
          selectedOption="読みたい"
        />
      </View>
    );
  },
});

// var SearchBar = require('SearchBar');
const SearchBar = require('./SearchBar');

/* var SearchScreen = React.createClass({
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
    this.subscription = this.props.state$.booksLoadingState$
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
      <View style={styles.container}
                 key = "searchScreen">
        <SearchBar
            key="searchBar"
            isLoading={this.state.isLoading}
        />
        <View style={styles.separator} />
        <BookListView dataSource$={
          this.props.state$.booksWithStatus$
                                  }
                      key = "searchlistview"
                      selectedOption='検索'
                      selector="bookcell"
        />
      </View>
    )
  }
  //https://github.com/facebook/react-native/blob/master/Examples/Movies/SearchScreen.js
});*/

const cellWidth = 60;
let styles = StyleSheet.create({
  // for toolBar
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  iconContainer: {
    /* backgroundColor: 'deepskyblue', */
    backgroundColor: 'orange',
    /* borderRadius: 15, */
    borderRadius: 23,
    /* padding: 8, */
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 7,
  },
  libIcon: {
    textAlign: 'center',
    width: 30,
    color: 'white',
  },
  // for listview
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
  // for cell
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
    // alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  segmented: {
    flex: 1,
    backgroundColor: 'black',
  },
  icon: {
    // width: 50
  },
  toolbarButton: {
    // width: 50,            //Step 2
    // textAlign:'center',
    flex: 1,                //Step 3
  },
  toolbarTitle: {
    // alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,                //Step 3
  },
});

module.exports = { InBoxScreen, GiftedNavigator, BookListView };
