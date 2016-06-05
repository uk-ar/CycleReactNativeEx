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

function MySectionHeader({big,sectionID}) {
  var content = big ? (
      <Touchable.FAIcon
          name="close"
          selector="close"
          size={20}
          style={{marginRight:5}}/>
  ) : null;
    //margin:10
  return(
    <TouchableElement
        selector="section"
        payload={sectionID}>
      <View style={{
          backgroundColor:"#E0E0E0",//grey 300
          borderTopLeftRadius:5,
          borderTopRightRadius:5,
          marginTop:3,
          padding:10,
          flexDirection:"row",
          //selector:"section",
          //height:30,
        }}>
        {content}
        <Text>
          {"section:"+sectionID}
        </Text>
      </View>
    </TouchableElement>
  )
};

function Cell({item}) {
  return (
    <Touchable.TouchableNativeFeedback
                          selector="cell"
                          payload={item}>
      <View style={{
          backgroundColor:"#FAFAFA",//grey 300
          padding:10,
        }}>
        <Text style={{height:30}}>
          {item}
        </Text>
      </View>
    </Touchable.TouchableNativeFeedback>
  )
};


function MyListView({items, sectionHeader,selectedSection }) {
  var data = dataSource.cloneWithRowsAndSections(items)
    //cell
    return (
    <ListView
        dataSource={data}
        renderRow={(item,sectionID)=> {
            if(!selectedSection || sectionID == selectedSection){
              if(item !== null){return <Cell item={item}/>}
              return (selectedSection ?
                      <MySectionFooter text={""}/> :
                      <MySectionFooter text={"もっと読む"}/>
              )
            }else{
              //non active section
              return null;
            }
          }}
        renderSectionHeader={sectionHeader}
        style={{
            padding:3,
            //height:100,
          }}
    />
  )
}

function MainView({booksWithStatus,booksLoadingState,selectedSection}){
  //console.log('navigationProps', model);
  var header =
  selectedSection ?
  null : (
    <View style={{padding:10,}}>
      <Text style={{color:"white"}}>
        header
      </Text>
    </View>);

  // ref: https://facebook.github.io/react-native/docs/listviewdatasource.html#constructor
  var all_items = {
    a:["foo","bar","baz","qux","1","2","3","4","5",],
    b:["a","b","c","d"],
    c:["f","g","h","i","j"],
  }
  var items ={}// = all_items;
  Object.keys(all_items)
        .map((key)=>{
          items[key] = selectedSection ?
                       all_items[key] :
                       all_items[key].slice(0,3)
          return key;
        }).map((key)=>
          //add terminator
          items[key].push(null)
        )
  LayoutAnimation.easeInEaseOut();

  return(
    <View style={{
        flex:1,
        backgroundColor:"#1A237E",//indigo 900
        //backgroundColor:"#263238",//blue grey 800
      }}>
      {header}
    <MyListView
        items={items}
        selectedSection={selectedSection}
        sectionHeader={(sectionData, sectionID) => {
            return (!selectedSection || sectionID == selectedSection) ?
                   <MySectionHeader
                 big={selectedSection ? true : false}
                 sectionID={sectionID}/>: <View />
          }}/>
    </View>
  )//big={selectedSection ? false : true}
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
import styles from './styles';

module.exports = view;
