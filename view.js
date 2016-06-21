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
Touchable["TouchableElement"] = Touchable.TouchableHighlight;
var TouchableElement=TouchableHighlight;
if (Platform.OS === 'android') {
  Touchable["TouchableElement"] = Touchable.TouchableNativeFeedback;
  TouchableElement=TouchableNativeFeedback;
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
    //ref: https://github.com/facebook/react-native/issues/7720
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
        <Touchable.TouchableElement
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
        </Touchable.TouchableElement>
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

  componentWillReceiveProps({items,offset}) {
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
    if(this._listView && this.props.offset){
      this._listView.scrollTo({y:this.props.offset,animated:false})
    }
    return (
      //onResponderMove is too premitive
      //          directionalLockEnabled={true}
      <ListView
          ref={listView => this._listView = listView}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID)=> {
              if(item.isbn == undefined){
                return (
                  <Touchable.TouchableElement
                  selector="section"
                  payload={sectionID} >
                    <View style={styles.sectionFooter}>
                      <Text>
                                {`すべて表示(${item.count})`}
                      </Text>
                    </View>
                  </Touchable.TouchableElement>
                )
              }else{
                return(
                  <Touchable.BookCell
                                key={rowID}
                  selector="bookcell"
                  onPanResponderMove={()=>{
                      this._listView.setNativeProps({scrollEnabled:false})
                    }}
                  onPanResponderEnd={()=>{
                      this._listView.setNativeProps({scrollEnabled:true})
                    }}
                  book={item}
                  title={sectionID}
                  style={{backgroundColor:"#FAFAFA",//grey 300
                  }}/>
                )
              }
            }}
          {...listViewProps}
      />
    );
  }
});

function booksToObject(books){
  var obj={};
  books.forEach((book)=>{
    if(book.isbn){
      obj["isbn-"+book.isbn]=book;
    }else{
      obj[book.key]=book;
    }
  });
  return obj;
}

function MainView({searchedBooks,allBooks,booksLoadingState,selectedSection}){
  let borrowedBooks = allBooks.filter((book)=>book.bucket=="borrowed");
  let likedBooks = allBooks.filter((book)=>book.bucket=="liked");
  let doneBooks = allBooks.filter((book)=>book.bucket=="done");
  //todo transition to detail view
  var allItems = {
    "検索"   :searchedBooks,
    "読みたい":likedBooks,
    "借りてる":borrowedBooks,
    "読んだ"  :doneBooks,
  }
  //LayoutAnimation.easeInEaseOut();
  var items={};
  var header=null;
  var closeButton=null;
  //console.log("se:%O",selectedSection);
  if(selectedSection == null){
    const limit=2;
    Object.keys(allItems).map((key)=>{
      items[key]=booksToObject(allItems[key].slice(0,limit));
      items[key][key]={type:"term",count:allItems[key].length};
    });
    /* var items={
      "検索":booksToObject(searchedBooks,limit),
      "読みたい":booksToObject(likedBooks,limit),
      "借りてる":booksToObject(borrowedBooks,limit),
      "読んだ":booksToObject(doneBooks,limit),
    }*/
    header=(
      <View style={{padding:10,}}>
        <Text style={{color:"white"}} onPress={()=>console.log("pressed t")}>
          header
        </Text>
      </View>
    )
  }else{
    closeButton=(
      <Touchable.FAIcon
      name="close"
      selector="close"
      payload="contentOffset.y"
      size={20}
      style={{marginRight:5}}/>
    )
    //detail view
    items[selectedSection]=booksToObject(allItems[selectedSection]);
    items[selectedSection][selectedSection]=
      {type:"term",count:allItems[selectedSection].length};
    //console.log("detail",items)
  };
  return (
    //main
    <View style={{
      flex:1,
      backgroundColor:"#1A237E",//indigo 900
      //backgroundColor:"#263238",//blue grey 800
    }}>
      {header}
      <MyListView
          selectedSection={selectedSection}
          items={items}
          renderSectionHeader={(sectionData, sectionID) => {
                return (
                  <Touchable.TouchableElement
                      selector="section"
                      key={sectionID}
                      payload={sectionID}>
                    <View
                      style={styles.sectionHeader}>
                            {closeButton}
                      <Text>
                            {sectionID}
                     </Text>
                    </View>
                 </Touchable.TouchableElement>
               )
             }}
           style={{
               paddingHorizontal:3,
               //height:100,
             }}
        />
      </View>
    )
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
      <NavigationExperimental.Transitioner
      style={{flex: 1}}
      navigationState={model.navigationState}
      onNavigate={onNavigateBack}
      renderScene={(navigationProps) => {
          //console.log("rs");
          const key = navigationProps.scene.navigationState.key;
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
