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
  ToastAndroid,
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
    //NavigationExperimental.Card is static view?
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
Touchable["BookCell"] = Touchable.createCycleComponent(
  BookCell,{
    onRelease:'release',
  });

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

var MyListView = React.createClass({
  /* propTypes: {
     items: PropTypes.array.isRequired
     }, */
  getInitialState(){
    const dataSource = new ListView.DataSource({
      //rowHasChanged: (r1, r2) => r1 !== r2,
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    return {dataSource:dataSource.cloneWithRowsAndSections(this.props.items)};
  },

  componentWillReceiveProps({items}) {
    if (items !== this.props.items) {
      this.setState(
        {dataSource: this.state.dataSource.cloneWithRowsAndSections(items)});
    }
  },

  getScrollResponder() {
    return this._listView.getScrollResponder();
  },

  render() {
    const {items, ...listViewProps} = this.props;
    return (
      <ListView
        ref={listView => this._listView = listView}
        dataSource={this.state.dataSource}
        {...listViewProps}
      />
    );
  }
});

 function booksToObject(books){
   var obj={};
   books.forEach((book)=>obj["isbn-"+book.isbn]=book)
   return obj
 }

function MainView({searchedBooks,likedBooks,doneBooks,borrowedBooks,booksLoadingState,selectedSection}){

  const limit=2;
  var items = {
    0: booksToObject(searchedBooks.slice(0,limit)),
    1: {},//terminator
    2: booksToObject(likedBooks.slice(0,limit)),
    3: {},//terminator
    4: booksToObject(borrowedBooks.slice(0,limit)),
    5: {},//terminator
    6: booksToObject(doneBooks.slice(0,limit)),
    7: {},//terminator
  }

  var buckets=[
    {title:"検索"     ,books:searchedBooks},
    {title:"読みたい"  ,books:likedBooks},
    {title:"借りてる"  ,books:borrowedBooks},
    {title:"読んだ"    ,books:doneBooks},
  ]
  //LayoutAnimation.easeInEaseOut();

  console.log("se:%O",selectedSection);
  if(selectedSection !== null){
    //detail view
    return (
      //   key={item.isbn}
      <View style={{
          flex:1,//for scroll
          backgroundColor:"#1A237E",//indigo 900
          //backgroundColor:"#263238",//blue grey 800
        }}>
        {null /* for LayoutAnimation */}
      <MyListView
          items={{
              0:booksToObject(buckets[selectedSection].books),
              1:[],
            }}
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID)=> {
              return (
                <Touchable.BookCell
                    selector="bookcell"
                    book={item}
                    title={buckets[selectedSection].title}
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
                             {buckets[selectedSection].title}
                    </Text>
                  </View>
                )
              }else{
                return (
                  <MySectionFooter
                      text={buckets[selectedSection].books.length}/>)
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
    //main
    return (
      //dataSource={dataSource.cloneWithRowsAndSections(items.map((books)=> books.slice(0,limit)))}
      <View style={{
        flex:1,
        backgroundColor:"#1A237E",//indigo 900
        //backgroundColor:"#263238",//blue grey 800
        }}>
        <View style={{padding:10,}}>
          <Text style={{color:"white"}} onPress={()=>console.log("pressed t")}>
            header
          </Text>
        </View>
        <MyListView
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID)=> {
              return(
                <Touchable.BookCell
                    selector="bookcell"
                    book={item}
                    title={buckets[sectionID/2].title}
                    style={{backgroundColor:"#FAFAFA",//grey 300
                      }}/>)
              }}
          items={items}
          renderSectionHeader={(sectionData, sectionID) => {
              if(sectionID % 2 == 0){
                return (
                  <TouchableElement
                    selector="section"
                    payload={sectionID/2} >
                    <View style={{backgroundColor:"#1A237E",//indigo 900
                    }} >
                    <View style={styles.sectionHeader}>
                      <Text>
                                {buckets[sectionID/2].title}
                      </Text>
                    </View>
                    </View>
                  </TouchableElement>
                )
              }else{
                return (
                   <TouchableElement
                       selector="section"
                       payload={(sectionID-1)/2} >
                   <View style={styles.sectionFooter}>
                     <Text>
                                {`すべて表示(${buckets[(sectionID-1)/2].books.length})`}
                     </Text>
                   </View>
                   </TouchableElement>
                )
              }
            }}
          style={{
            paddingHorizontal:3,
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

var MyNav = React.createClass({
  render: function(){
    var model=this.props.model
    console.log("mynav");
    //this.setState({foo:null})
    return(
      //<NavigationExperimental.CardStack
      <NavigationExperimental.AnimatedView
      style={{flex: 1}}
      navigationState={model.navigationState}
      onNavigate={onNavigateBack}
      renderScene={(navigationProps) => {
          console.log("rs");
          const key = navigationProps.scene.navigationState.key;
          console.log('navigationProps', navigationProps);
          switch (key) {
            case 'Search':
              return renderCard(SearchView(model), navigationProps);
            case 'Inbox':
              return renderCard(InboxView(model), navigationProps);
            case 'Main':
              return (
                <MainView
                     key="root"
                     {...model} />)
            case 'Book':
              return renderCard(BookView(model), navigationProps);
            default:
              console.error('Unexpected view', navigationProps, key);
              return (<Text>bar</Text>)
              //renderCard(<Text>Everything is fucked</Text>, navigationProps);
          }
        }}
      />)
  }
});

function view(model){
  console.log('view:', model);
  return (<MyNav model={model}/>)
  //      onNavigate={onNavigateBack}
  // NavigationExperimental.AnimatedView is deplicated.
  // https://github.com/facebook/react-native/blob/69627bf91476274e92396370acff
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
