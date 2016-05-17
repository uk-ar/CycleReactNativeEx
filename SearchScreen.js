import React, { Component } from 'react';
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');
var GiftedSpinner = require('react-native-gifted-spinner');

import { RadioButtons,SegmentedControls } from 'react-native-radio-buttons'

import {
  TouchableOpacity,
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

var GiftedNavigator = React.createClass({
  componentDidMount: function(){
    //console.log("nav this:%O", this);
    //var navigatorDidMount = this.props.navigatorDidMount.bind(this);
    //navigatorDidMount(this.refs.nav);
    this.props.onNavigatorMounted.call({},this.refs.nav);
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

var {AnimatedFlick,BookCell} = require('./BookCell');

var dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

var BookListView = React.createClass({
  getInitialState(){
    return {
      dataSource:[],
    }
  },
  render() {
    const options = [
      '検索',
      '読みたい',
      //'読んだ',
    ];
    const normalStyle = {
      color: 'white',
      marginHorizontal: 5
    };

    const selectedStyle = {
      color: '#007AFF',//'rgba(0,0,0,1)',//baseColor,
      //fontWeight: 'bold'
      marginHorizontal: 5
    };
    //CycleView has not pass key props? bind this?
    //augmentVTreeWithHandlers seems to have problem
    //          directionalLockEnabled = {true}
    return(
      <CycleView style = {styles.container} key="listview">
      <ListView
          ref="listview"
          dataSource = {
            //FIXME:
            /* dataSource.cloneWithRows(this.state.dataSource) */
            dataSource.cloneWithRows(['row 1', 'row 2','row 3'])}
          renderRow ={(movie, sectionID, rowID, highlightRowFunc) =>
            <BookCell
                movie={movie}
                actions$={this.props.actions$}
                rowID={rowID}
                sectionID = {sectionID}
                            />}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
      />
            <View style = {[styles.row,
                            { justifyContent: "space-between",
                              alignItems: "center"}]}>
              <FAIcon name = "filter"
                    selector = "filter"
                    size = {25}
                    color = "#007AFF"
                    style={{marginHorizontal: 8}}
              />
              <SegmentedControls
                  options={ options }
                  selector = "segmented"
                  style={styles.toolbarButton}
                  renderOption={(option,selected)=>{
                      return <Text allowFontScaling={true} style={selected ? normalStyle : selectedStyle}>{option}</Text>
                    }}
                  selectedOption={this.props.selectedOption}
              />
              <FAIcon name = "sort"
                      selector = "sort"
                      size = {25}
                      color = "#007AFF"
                      style={{marginHorizontal: 8}}
              />
            </View>
      </CycleView>
    )
    {/*
        <Text allowFontScaling={scaleFont} style={style}>{label}</Text>}
        renderOption={RadioButtons.getTextOptionRenderer(normalStyle, selectedStyle, (i) => i)}
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
    //https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e#.9c2mobfa0
    //http://browniefed.com/blog/2015/08/01/react-native-animated-listview-row-swipe/
    var CustomLayoutSpring = {
      duration: 3000,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
        //property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete:{
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      }
    };
    this.subscription = this.props.dataSource$.subscribe((dataSource) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      //LayoutAnimation.configureNext(CustomLayoutSpring);
      this.setState({dataSource:dataSource})
    }
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
            selectedOption='読みたい'
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
        <BookListView dataSource$ = {this.props.state$.booksWithStatus$.merge(
            this.props.state$.searchRequest$.map((_) => []))}
                      actions$={this.props.actions$}
                      key = "searchlistview"
                      selectedOption='検索'
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
