import React from 'react';
const FAIcon = require('react-native-vector-icons/FontAwesome');
import { getBackHandler } from '@cycle/react-native/src/driver';
import materialColor from 'material-colors';
import { styles } from './styles';
// there is 1 errors
import {
  ListView,
  Platform,
  Text,
  View,
  NavigationExperimental,
  TextInput,
  // LayoutAnimation,
  ActivityIndicator,
} from 'react-native';

import NavigationStateUtils from 'NavigationStateUtils';

import Touchable from '@cycle/react-native/src/Touchable';
Touchable.TouchableElement = Touchable.TouchableHighlight;
if (Platform.OS === 'android') {
  Touchable.TouchableElement = Touchable.TouchableNativeFeedback;
}

Touchable.TextInput = Touchable.createCycleComponent(
  TextInput);

Touchable.FAIcon = Touchable.createCycleComponent(
  FAIcon, Touchable.PRESS_ACTION_TYPES);

function onNavigateBack(action) {
  // console.log('on:%O,%O,%O', action,action.type,(action.type === 'back' || action.type === 'BackAction'));
  const backActionHandler = getBackHandler();
  // if (action.type === 'back' || action.type === 'BackAction') {
  backActionHandler.send();
// }
}

function MyCard({ children, navigationProps }) {
  return (
    //      onNavigate={onNavigateBack}
    // NavigationExperimental.Card is not deplicated.
    // navigationState={navigationProps.navigationParentState}
    // NavigationExperimental.Card is static view?
    // ref: https://github.com/facebook/react-native/issues/7720
    // key={'View:' + navigationProps.scene.navigationState.key}
    <NavigationExperimental.Card
      {...navigationProps}
      renderScene={() => children}
      onNavigate={onNavigateBack}
    />
    );
}

import { BookRow } from './BookCell';
Touchable.BookRow = Touchable.createCycleComponent(
  BookRow, {
    onRelease: 'release',
  });

class MyListView extends React.Component {
  // remove this.state.dataSource && this.listview
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(props.items)
    };
  }

  componentWillReceiveProps({ items, offset }) {
    /* if(this.listview && this.props.){
       this.listview.scrollTo({y:this.props.offset,animated:false})
       } */

    if (items !== this.props.items) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(items)
      });
    }
  }
  /* getScrollResponder() {
    return this.listview.getScrollResponder();
  },*/

  render() {
    // https://github.com/babel/babel-eslint/issues/95#issuecomment-102170872
    const { items: _, ...listViewProps } = this.props;
    return (
      // onResponderMove is too premitive
      // directionalLockEnabled disables horizontal scroll when scroll vertically
      // https://github.com/facebook/react-native/issues/6764
      <ListView
        ref={listView => (this.listview = listView)}
        directionalLockEnabled={true}
        dataSource={this.state.dataSource}
        enableEmptySections
        {...listViewProps}
      />
      );
  }
}

MyListView.propTypes = {
  items: React.PropTypes.object.isRequired,
// selectedSection:selectedSection
};

import { AnimView } from './SwipeableRow';
const ReactTransitionGroup = require('react-addons-transition-group')

class Closeable extends React.Component {
  constructor(props) {
    super(props);
    //this.state = { height: null ,width: null };
  }
  /* componentWillReceiveProps(nextProps) {
   *   if(this.props.close !== nextProps.close){
   *     //foo.bar
   *     //cannot measure animatedView
   *     this.refs.inner.measure((x,y,width,height) => {        
   *       //this.props.refs.outer.animate
   *       //null or else
   *       console.log("next:",nextProps.close,x,y,width,height)
   *       if(nextProps.close){
   *         //animate from height to 0.01
   *         //this.refs.outer
   *           //.animate({height:height},{height:0.01})
   *         // rendered
   *         //.animateTo({height:0.01})
   *         //this.refs.outer.animateTo({height:0.01})
   *       }else{
   *         //animate from 0.01   to height
   *         //this.refs.outer
   *           //.animate({height:0.01},{height:height})
   *         //.animateTo({height:height})
   *         //this.refs.outer.animateTo({height:0.01});
   *       }
   *     })
   *   }
   * }*/
  render() {
    //style={{ height:0.01 }}
    // not to optimize
    console.log("rend close");
    return(
      <View
        ref="outer"
        collapsable={false}
      >
        <View
          ref="inner"
          collapsable={false}
          onLayout={({ nativeEvent: { layout: {x, y, width, height } } }) => {
              this.style={width:width,height:height};
              //this.props.close ? trace func : none
            }}
        >
          {this.props.children}
        </View>
      </View>
      )
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggle: true ,opacity: 0 };
  }
  componentDidMount() {
    this.setState({ opacity: 1 })
  }
  render() {
    //console.log('render header pad?', this.state.toggle);
    return (
      <AnimView
        style={{ padding: 10, opacity:this.state.opacity }}
        anim={{ duration: 500 }}
      >
        <AnimView
          ref="view1"
          style={{
            //height:this.state.toggle ? 10 : 20,
            //height:10,
            backgroundColor: this.state.toggle ? 'black' : 'white',
          }}
        >
          <Closeable
            close={!this.state.toggle}
            ref="close">
            <Text>foo</Text>
          </Closeable>
        </AnimView>
        <AnimView
          ref="view2"
          style={{
            height: 10,
            backgroundColor: 'green',
          }}
        />
        <View
          ref="view5"
          style={{
            height:20,
            width:20,
            backgroundColor: 'gray',
          }}
        >
           <View
             ref="view4"
             style={{
               height:40,
               width:40,
               backgroundColor: 'yellow',
               //transform: this.state.toggle ? [{scale:3}] : [{scale:2},{scale:3}],
              }}
            />
         </View>
         <Text
          style={{ color: 'white' }}
          onPress={() => {
              this.refs.view2.animate(
                {
                  height: 10,
                  backgroundColor: 'black',
                },
                {
              height: 10,
              backgroundColor: 'orange',
            },);
          }}
        >
          {'animate'}
        </Text>
        <Text
          style={{ color: 'white' }}
          onPress={() => {
              /* console.log("refs",this.refs)
              this.refs.view4.measure((x,y,width,height)=>
              console.log("view4:",width,height))
              this.refs.view5.measure((x,y,width,height)=>
              console.log("view5:",width,height)) */
            this.setState((prev, current) => ({ toggle: !prev.toggle }));
          }}
        >
          {'toggle'}
        </Text>
      </AnimView>);
  }
}

function ItemsFooter({ payload, count }) {
  return (
    <Touchable.TouchableElement
      selector="section"
      payload={payload}
    >
      <View style={styles.sectionFooter}>
        <Text>
          {`すべて表示(${count})`}
        </Text>
      </View>
    </Touchable.TouchableElement>
  );
}

function SearchHeader({ selectedSection, children, loadingState }) {
  return ((selectedSection !== null) ? (
     <ItemsHeader
       selectedSection={selectedSection}
       section="検索"
     >
       <Touchable.TextInput
         autoCapitalize="none"
         autoCorrect={false}
         selector="text-input"
         autoFocus
         style={styles.searchBarInput}
       />
       {loadingState ?
        <ActivityIndicator
          animating
          color="white"
          size="large"
          style={styles.spinner}
        /> : null}
     </ItemsHeader>
   ) : (
     <ItemsHeader
       style={[styles.sectionFooter, styles.sectionHeader]}
       selectedSection={selectedSection}
       section="検索"
     />)
   );
}

import { itemsInfo } from './common';
function ItemsHeader({ selectedSection, section, children, style }) {
  let icon = (selectedSection === null) ? (
    <FAIcon
      name={itemsInfo[section].icon}
      color={itemsInfo[section].backgroundColor}
      size={20}
      style={{ marginRight: 5 }}
    />) : (
    <Touchable.FAIcon
      name="close"
      selector="close"
      payload="contentOffset.y"
      size={20}
      style={{ marginRight: 5 }}
    />);
  let content = children || (
    <Text>
      {section}
    </Text>
  );
  return (
    <Touchable.TouchableElement
      selector="section"
      key={section}
      payload={section}
    >
      <View style={style || styles.sectionHeader}>
        {icon}
        {content}
    </View>
    </Touchable.TouchableElement>
  );
}

function booksToObject(books) {
  // https://github.com/eslint/eslint/issues/5284
  /* eslint prefer-const:0 */
  let obj = {};
  books.forEach((book) => {
    if (book.isbn) {
      obj[`isbn-${book.isbn}`] = book;
    } else {
      obj[book.key] = book.component;
    }
  });
  return obj;
}

function mainView({ searchedBooks, savedBooks, booksLoadingState, selectedSection }) {
  console.log("s b",savedBooks);
  const borrowedBooks = savedBooks.filter((book) => book.bucket === 'borrowed');
  const likedBooks = savedBooks.filter((book) => book.bucket === 'liked');
  const doneBooks = savedBooks.filter((book) => book.bucket === 'done');
  // todo transition to detail view
  /* 検索: {
     books:searchedBooks,
     icons:
     title:
     }*/
  const allItems = {
    検索: searchedBooks,
    読みたい: likedBooks,
    借りてる: borrowedBooks,
    読んだ: doneBooks,
  };
  console.log('render main');
  // LayoutAnimation.easeInEaseOut();

  let items = {};
  let header = null;
  // console.log("se:%O",selectedSection);
  if (selectedSection === null) {
    const limit = 2;
     // assign component to item
     // TODO: verify layoutAnimation
    Object.keys(allItems).forEach((key) => {
      if (key === '検索') {
        items[key] = [];
      } else {
        items[key] = booksToObject(
          allItems[key].slice(0, limit)
                       .concat({
                         key,
                         component: (
                           <ItemsFooter
                             payload={key}
                             count={allItems[key].length}
                           />)
                       }));
      }
       // console.log("i",items[key])
    });
    /* var items={
      "検索":booksToObject(searchedBooks,limit),
      "読みたい":booksToObject(likedBooks,limit),
      "借りてる":booksToObject(borrowedBooks,limit),
      "読んだ":booksToObject(doneBooks,limit),
    }*/
    header = (
      <Header />
    );
  } else {
    // detail view
    items[selectedSection] = booksToObject(allItems[selectedSection]);
    items[selectedSection][selectedSection] = {
      type: 'term',
      count: allItems[selectedSection].length
    };
  // console.log("detail",items)
  }
  console.log('render main2');
  return (
    <View
      key="main"
      style={{
        flex: 1,
        backgroundColor: '#1A237E', // indigo 900
      }}
    >
      {header}
      { /* listView should have onRelease method? */ }
      <MyListView
        selectedSection={selectedSection}
        items={items}
        renderRow={(rowData, sectionID, rowID) => {
            if (React.isValidElement(rowData)) {
              //for section footer rendering
              return rowData;
            }
            //console.log("row:",rowData, sectionID, rowID.replace('isbn-',''))
            return (
              <Touchable.BookRow
                key={rowID}
                selector="bookcell"
                bucket={sectionID}
                book={rowData}
                style={{ backgroundColor: materialColor.grey['50'] }}/>
            );
          }}
        renderSectionHeader={(sectionData, sectionID) =>
          (sectionID === '検索') ? (
            <SearchHeader
              selectedSection={selectedSection}
              loadingState={booksLoadingState}
            />) : (
            <ItemsHeader
              section={sectionID}
              selectedSection={selectedSection}
            />
          )}

        style={{
          paddingHorizontal: 3,
    // height:100,
        }}
      />
    </View>
    );
}

function view(model) {
  /* NavigationExperimental.Transitioner calls twice when layout changed in
     android. But NavigationExperimental.CardStack cannot re-render by model
     change.So we should add random key or force update*/
  // http://stackoverflow.com/a/35004739
  const navigationState = NavigationStateUtils.replaceAtIndex(
    model.navigationState, // navigationState
    model.navigationState.index, // index
    {
      ...model.navigationState.routes[model.navigationState.index],
      id: Math.random(),
    } // route
  ); //
  console.log('mynav', navigationState, onNavigateBack);
  return (
    // <NavigationExperimental.Transitioner
    <NavigationExperimental.CardStack
      style={{ flex: 1 }}
      navigationState={navigationState}
      onNavigate={onNavigateBack}
      renderOverlay={(navigationProps) => {
          // console.log("np:",navigationProps);
        let style = null;
        if (navigationProps.scene.route.key === 'Main') {
          // style = { opacity: 0 }; // cannot touch close button
          return null;
        }//
        return (
            <NavigationExperimental.Header
              {...navigationProps}
              onNavigateBack={onNavigateBack}
              style={style}
              renderTitleComponent={(props) => {
                return (
                <NavigationExperimental.Header.Title>
                               foo
                </NavigationExperimental.Header.Title>
              );
              }}
            />);
          // return (<Text>overlay</Text>)
      }}
      renderScene={(navigationProps) => {
        console.log('MyNav:renderScene', navigationProps);
      // const key = navigationProps.scene.navigationState.key;
        const key = navigationProps.scene.route.key;
        switch (key) {
          case 'Main':
          // return (mainView(model))
            return (
              <MyCard navigationProps={navigationProps}>
                {mainView(model)}
              </MyCard>
            );
          case 'Book Detail':
            // return (mainView(model))
            return (
              <View style={{ marginTop: 64, backgroundColor: 'red' }}>
                <Text>book detail</Text>
              </View>
            );
          default:
            console.error('Unexpected view', navigationProps,
            navigationProps.scene.navigationState);
            return (<Text>bar</Text>);
      // renderCard(<Text>Everything is fucked</Text>, navigationProps);
        }
      }}

    />);
}
/* renderOverlay={(props)=>{
   return (
   //NavigationExperimental.Header is not deplicated, but no examples.
   <NavigationExperimental.Header
   {...props}
   />
   )
   }}
 */

module.exports = view;
