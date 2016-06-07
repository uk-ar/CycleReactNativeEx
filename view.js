import React, { Component } from 'react';
var FAIcon = require('react-native-vector-icons/FontAwesome');

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
  BackAndroid,
  AsyncStorage,
  NavigationExperimental,
  RecyclerViewBackedScrollView,
} from 'react-native';

import Touchable from '@cycle/react-native/src/Touchable';
var TouchableElement = Touchable.TouchableHighlight;
if (Platform.OS === 'android') {
  TouchableElement = Touchable.TouchableNativeFeedback;
}
Touchable["FAIcon"] = Touchable.createCycleComponent(
  FAIcon,Touchable.PRESS_ACTION_TYPES);

function onNavigateBack(action){
  console.log("on:%O",action)
  const backActionHandler = getBackHandler();
  if (action.type === 'back' || action.type === 'BackAction') {
    backActionHandler.send();
  }
}

import NavigationCardStackStyleInterpolator from 'NavigationCardStackStyleInterpolator';

function emptyFunction(){};
function renderVCard(vdom, navigationProps) {
  return (
    //      onNavigate={onNavigateBack}
    //NavigationExperimental.Card is not deplicated.
    //navigationState={navigationProps.navigationParentState}
    <NavigationExperimental.Card
      {...navigationProps}
      key={'View:' + navigationProps.scene.navigationState.key}
      style={NavigationCardStackStyleInterpolator.forVertical(navigationProps)}
      renderScene={() => vdom}
      onNavigate={onNavigateBack}
    />
  );
}
function renderCard(vdom, navigationProps) {
  return (
    //      onNavigate={onNavigateBack}
    //NavigationExperimental.Card is not deplicated.
    //navigationState={navigationProps.navigationParentState}
    <NavigationExperimental.Card
      {...navigationProps}
      key={'View:' + navigationProps.scene.navigationState.key}
      renderScene={() => vdom}
      onNavigate={onNavigateBack}
    />
  );
}

let {SearchScreen, InBoxScreen, GiftedNavigator,BookListView} = require('./SearchScreen');
var SearchBar = require('./SearchBar');
function SearchView({booksWithStatus,booksLoadingState}){
  //console.log('navigationProps', model);
  return(
    <View style={styles.container}
          key = "searchScreen">
      <SearchBar
          key="searchBar"
          isLoading={booksLoadingState}
      />
      <View style={styles.separator} />
      <BookListView dataSource={booksWithStatus}
                    selectedOption='検索'
      />
    </View>
  )
};
function InboxView({booksWithStatus,booksLoadingState}){
  //console.log('navigationProps', model);
  return(
    <View style={styles.container}
          key = "searchScreen">
      <View style={styles.separator} />
      <BookListView dataSource={booksWithStatus}
                    selectedOption='読みたい'
      />
    </View>
  )
};

var dataSource = new ListView.DataSource({
  //rowHasChanged: (r1, r2) => r1.isbn !== r2.isbn,
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

function MySectionFooter({text}) {
  return(
    <View style={{
        backgroundColor:"#E0E0E0",//grey 300
        borderTopLeftRadius:0,
        borderTopRightRadius:0,
        borderRadius:5,
        padding:10,
        marginBottom:3,
        //height:30,
      }}>
      <Text>
        {text}
      </Text>
    </View>)
};

import {BookCell,SwipeableRow} from './BookCell';
//key?
function Cell({book}) {
  return (
      <View style={{
          backgroundColor:"#FAFAFA",//grey 300
          padding:10,
        }}>
        <TouchableElement
            selector="cell"
            payload={book}>
          <View style={[styles.row,{flex:1}]}>
            <Image source={{uri: book.thumbnail}}
                   resizeMode="contain"
                   style={[styles.cellImage,]} />
            <View style={[{flex:1,}]}>
              <View style={[{flex:1,padding:10,justifyContent:"center",},
                ]}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {book.author}
                </Text>
              </View>
              <View style={{height:StyleSheet.hairlineWidth,
                            backgroundColor:'#CCCCCC',
                            marginRight:10,
                            //separator
                }}
              />
            </View>
          </View>
        </TouchableElement>
      </View>
  )
};

function MainView({searchedBooks,likedBooks,doneBooks,borrowedBooks,booksLoadingState,selectedSection}){
  var items = [
    searchedBooks,
    [],//terminator
    likedBooks,
    [],//terminator
    borrowedBooks,
    [],//terminator
    doneBooks,
    [],//terminator
  ]
  var titles=["検索","お気に入り","借りてる","読んだ"]

  LayoutAnimation.easeInEaseOut();

  const limit=1;
  console.log("se:%O",selectedSection);
  if(selectedSection !== null){
    //detail view
    return (
      <View style={{
          flex:1,
          backgroundColor:"#1A237E",//indigo 900
          //backgroundColor:"#263238",//blue grey 800
        }}>
        {null /* for LayoutAnimation */}
      <ListView
          dataSource={dataSource.cloneWithRowsAndSections(
              [items[selectedSection],items[parseInt(selectedSection)+1]])}
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID)=> {
              return (
                <BookCell
                    book={item}
                    style={{backgroundColor:"#FAFAFA",//grey 300
                    }}/>)
            }}
          renderSectionHeader={(sectionData, sectionID) => {
              if(sectionID % 2 == 0){
                return (
                  <View style={styles.sectionHeader}>
                    <Touchable.FAIcon
                       name="close"
                       selector="close"
                       size={20}
                       style={{marginRight:5}}/>
                    <Text>
                             {titles[selectedSection/2]}
                    </Text>
                  </View>
                )
              }else{
                return (
                  <MySectionFooter
                  text={items[selectedSection].length}/>)
              }
            }}
          style={{
            padding:3,
              //height:100,
            }}
      />
      </View>
    )
  }else{
    //cell
    return (
      <View style={{
        flex:1,
        backgroundColor:"#1A237E",//indigo 900
        //backgroundColor:"#263238",//blue grey 800
        }}>
        <View style={{padding:10,}}>
          <Text style={{color:"white"}}>
            header
          </Text>
        </View>
      <ListView
          dataSource={dataSource.cloneWithRowsAndSections(
              items.map((books)=> books.slice(0,limit)))}
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID)=> {
              return (
                <BookCell
                  book={item}
                  style={{backgroundColor:"#FAFAFA",//grey 300
                  }}/>)
            }}
          renderSectionHeader={(sectionData, sectionID) => {
              if(sectionID % 2 == 0){
                return (
                  <TouchableElement
                    selector="section"
                    payload={sectionID} >
                    <View style={styles.sectionHeader}>
                      <Text>
                                {titles[sectionID/2]}
                      </Text>
                    </View>
                  </TouchableElement>
                )
              }else{
                return (
                  <MySectionFooter
                  text={`すべて表示(${items[sectionID-1].length})`}/>)
              }
            }}
          style={{
            padding:3,
              //height:100,
            }}
      />
      </View>
    )
  };
};

function BookView({booksWithStatus,booksLoadingState,selectedBook}){
  //console.log('navigationProps', model);
  return(
    <View style={{
        flex:1,
        backgroundColor:"#1A237E",//indigo 900
        //backgroundColor:"#263238",//blue grey 800
      }}>
      <Text>
        {selectedBook}
      </Text>
    </View>
  )
};

function view(model){
  //console.log('navigationProps', model);
  return(
    //      onNavigate={onNavigateBack}
    // NavigationExperimental.AnimatedView is deplicated.
    // https://github.com/facebook/react-native/blob/69627bf91476274e92396370acff08fb20b8f3fc/Examples/UIExplorer/NavigationExperimental/NavigationCardStack-example.js#L140
    <NavigationExperimental.AnimatedView
      style={{flex: 1}}
      navigationState={model.navigationState}
      onNavigate={onNavigateBack}
      renderScene={(navigationProps) => {
          const key = navigationProps.scene.navigationState.key;
          console.log('navigationProps', navigationProps);
          switch (key) {
            case 'Search':
              return renderCard(SearchView(model), navigationProps);
            case 'Inbox':
              return renderCard(InboxView(model), navigationProps);
            case 'Main':
              return renderCard(MainView(model), navigationProps);
            case 'Book':
              return renderCard(BookView(model), navigationProps);
            default:
              console.error('Unexpected view', navigationProps, key);
              return (<Text>bar</Text>)
              //renderCard(<Text>Everything is fucked</Text>, navigationProps);
          }
        }}
    />)
};
/* renderOverlay={(props)=>{
   return (
   //NavigationExperimental.Header is not deplicated, but no examples.
   <NavigationExperimental.Header
   {...props}
   />
   )
   }}
 */
import {styles} from './styles';

module.exports = view;
