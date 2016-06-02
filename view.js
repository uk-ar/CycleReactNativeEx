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
function renderCard(vdom, navigationProps) {
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

/* var terminator = (
   <View style={{
   backgroundColor:"#E0E0E0",//grey 300
   borderTopLeftRadius:0,
   borderTopRightRadius:0,
   borderRadius:5,
   padding:10,
   marginBottom:3,
   selector:"section",
   //height:30,
   }}>
   <Text>
   もっと読む
   </Text>
   </View>); */

function MySectionHeader(big) {
  return ((sectionData,sectionID)=>{
    //terminator is one of row
    //android not support sticky
    // return null;
    console.log("b:%O",big)
    var content=null;
    if(big == true){
      content=(
        <Touchable.FAIcon
          name="close"
          selector="close"
          size={20}
          style={{marginRight:5}}/>
      )//margin:10
    }
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
  })
}


function MyListView({items, sectionHeader }) {
  var data = dataSource.cloneWithRowsAndSections(items)
  return (
    <ListView
        dataSource={data}
        renderRow={(item)=> {
            return(
              <View style={{
                  backgroundColor:"#FAFAFA",//grey 300
                  padding:10,
                }}>
                <Text style={{height:30}}>
                            {item}
                </Text>
              </View>
            )
          }}
        renderSectionHeader={sectionHeader}
        style={{
            padding:3,
            //height:100,
          }}
    />
  )
}

function MainView({booksWithStatus,booksLoadingState}){
  //console.log('navigationProps', model);
  return(
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
    <MyListView
        items={{a:["foo","bar","baz","qux"],
                b:["a","b","c","d"],
                c:["f","g","h","i","j"],
          }}
        sectionHeader={MySectionHeader(false)}
    />
    </View>
  )
};

 function SectionView({booksWithStatus,booksLoadingState}){
   //console.log('navigationProps', model);
   return(
     <View style={{
         flex:1,
         backgroundColor:"#1A237E",//indigo 900
         //backgroundColor:"#263238",//blue grey 800
       }}>
       <MyListView
           items={{a:["foo","bar","baz","qux"],
             }}
           sectionHeader={MySectionHeader(true)}
       />
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
            case 'Section':
              return renderCard(SectionView(model), navigationProps);
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
