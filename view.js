import React from 'react';
import { getBackHandler } from '@cycle/react-native/src/driver';
import materialColor from 'material-colors';
// there is 1 errors
import {
  Platform,
  Text,
  WebView,
  NavigationExperimental,
  TextInput,
  StatusBar,
  Animated,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
  Dimensions,
  // TouchableHighlight,
  // TouchableNativeFeedback
} from 'react-native';
import NavigationStateUtils from 'NavigationStateUtils';
import Touchable from '@cycle/react-native/src/Touchable';
import { styles } from './styles';
import emptyFunction from 'fbjs/lib/emptyFunction';

const FAIcon = require('react-native-vector-icons/FontAwesome');

// TouchableElement = TouchableHighlight;
Touchable.TouchableElement = Touchable.TouchableHighlight;
if (Platform.OS === 'android') {
  Touchable.TouchableElement = Touchable.TouchableNativeFeedback;
  // TouchableElement = TouchableNativeFeedback;
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

function MyCard({ children, navigationProps, style }) {
  return (
    //      onNavigate={onNavigateBack}
    // NavigationExperimental.Card is not deplicated.
    // navigationState={navigationProps.navigationParentState}
    // NavigationExperimental.Card is static view?
    // ref: https://github.com/facebook/react-native/issues/7720
    // key={'View:' + navigationProps.scene.navigationState.key}
    //      style={{ marginTop: 64, backgroundColor: 'red' }}
    <NavigationExperimental.Card
      style={style}
      {...navigationProps}
      renderScene={() => children}
      onNavigate={onNavigateBack}
    />
  );
}

import { BookCell } from './BookCell';
import { BookRow1 } from './BookRow';
Touchable.BookRow1 = Touchable.createCycleComponent(
  BookRow1, {
    onRelease: 'release',
  });

import { genActions2 } from './Action';
import { BookListView } from './BookListView';
import { ItemsFooter, ItemsHeader } from './Header';
Touchable.ItemsHeader = Touchable.createCycleComponent(ItemsHeader);

import { LayoutableView } from './Closeable';
import Stylish from 'react-native-stylish';

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.positions = [];
    this._scrollY = new Animated.Value(0);
  }
  render() {
    const { items, sectionIDs, rowIDs, books,
            onSelectSection, onCloseSection, onRelease,
            onSelectCell, style, onChangeQuery, width,
            booksLoadingState, selectedSection } = this.props;
    //console.log("sel",selectedSection)
    // TODO:keep query text & scroll position
    //console.log('ds change', dataSource._dataBlob);
    // TODO: transition to detail view
    // console.log('render main', { items, sectionIDs, rowIDs, booksLoadingState, selectedSection });
    /* LayoutAnimation.configureNext(
     *   LayoutAnimation.create(1000,
     *                          LayoutAnimation.Types.easeInEaseOut,
     *                          LayoutAnimation.Properties.opacity))*/
    // items={items}
    //        key={selectedSection}
    // props.animations.start()
    //      style={{ marginTop: 64, backgroundColor: 'red' }}
    return (
      <BookListView
        style={style}
        dataBlob={books}
        ref={(c) => {
            this.listview = c;
          }}
        selectedSection={selectedSection}
        directionalLockEnabled
        enableEmptySections
        width={width}
        generateActions={(rowData, sectionID, rowID) =>
          genActions2(sectionID)}
        onSwipeEnd={({ rowData, sectionID, rowID, action, ...rest }) => {
            onRelease(rowData, action);
            /* if(action.target == null) { return }
             *   this.listview
             *       .close(sectionID,rowID)*/
            // TODO: handle data in intent.js
            /* .then(()=>{
               const s = {...this.data[sectionID]}
               delete s[rowID]
               this.data = {...this.data,[sectionID]:s}
               return this.updateDataSource()
               })
               .then(()=>{
               this.data = {
               ...this.data,
               [action.target]:{[rowID]:rowData,...this.data[action.target]}
               }
               this.updateDataSource()
               }) */
          }}
        renderRow={(rowData, sectionID, rowID) =>
          (
            <BookCell
                 onPress={() => {
                     onSelectCell(rowData);
                   }}
                 book={rowData}
                 style={{
                   backgroundColor: materialColor.grey['50']}}
                       >
              <LibraryStatus libraryStatus={rowData.libraryStatus} />
            </BookCell>
          )
          /* style={{
           *   ...StyleSheet.absoluteFillObject,
           *   backgroundColor: materialColor.grey['50'],
           *   //margin: 10,
           * }}*/
                  }
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this._scrollY } } }],
            //{listener},          // Optional async listener
          )}
        renderSectionHeader={(sectionData, sectionID) =>{
            // call upper onSelectSection after scroll
            //console.log("sec header")
            return (
            <ItemsHeader
                 style={{backgroundColor:style.backgroundColor}}
                 onChangeQuery={onChangeQuery}
              section={sectionID}
              close={selectedSection}
                 key={sectionID}
                 {...sectionData}
                 onSelectSection={(section) => {
                     //if (dataSource.sectionIdentities.length === 2) { return; }
                     this.positions.push(this._scrollY.__getValue());
                     // TODO:
                     // 1. scroll to section header with animation
                     // (need expand view in android)
                     // 2. save section header position
                     this.listview.scrollTo({ y: 0, animated: false });
                     //TODO: no need to handle in intent?
                     onSelectSection(section);
                     // this.sectionIdentities = [section,`${section}_end`]
                     // this.updateDataSource()
                   }}
                 onCloseSection={() => {
                     // TODO:
                     // 1. scroll to section header with animation
                     // this.listview.scrollTo({y:0,animated:true})
                     // this.sectionIdentities = Object.keys(this.data)
                     onCloseSection();
                     const pos = this.positions.pop();
                     setTimeout(() =>
                       this.listview.scrollTo({ y: pos,
                                                animated: false }));
                     /* this.updateDataSource().then(()=>{
                        //TODO:
                        //2. scroll to section header with no animation
                        //2. scroll to original position with animation
                        }) */
                   }}
                                />)}}
        renderSectionFooter={(sectionData, sectionID) =>
          // console.log("fo",sectionData)
          (
            <ItemsFooter
                 {...sectionData}
                 />)
                            }
      />
    );
  }
}

MainView.propTypes = {
  onSelectSection: React.PropTypes.func,
  onCloseSection: React.PropTypes.func,
  onRelease: React.PropTypes.func,
  onSelectCell: React.PropTypes.func,
  onChangeQuery: React.PropTypes.func
};
MainView.defaultProps = {
  //onRelease:
  onChangeQuery:emptyFunction
};
Touchable.MainView = Touchable.createCycleComponent(
  MainView);

const {
  width,
} = Dimensions.get('window');

function view(model) {
  //console.log('view');
  const navigationState = model.navigationState;
  // return <MainView  {...model}/>;
  // console.log('mynav', navigationState, onNavigateBack);
  return (
    // <NavigationExperimental.Transitioner
    <NavigationExperimental.CardStack
      style={{ flex: 1 }}
      navigationState={navigationState}
      onNavigate={onNavigateBack}
      renderScene={(navigationProps) => {
          //console.log('MyNav:renderScene', navigationProps);
      // const key = navigationProps.scene.navigationState.key;
        const key = navigationProps.scene.route.key;
        switch (key) {
          case 'Main':
            // return (MainView(model))
            /* return (<Touchable.MainView
            selector="main"
            style={{
            paddingHorizontal: 3,
            flex: 1,
            backgroundColor: '#1A237E', // indigo 900
            }}
            {...model}
            />) */
            return (
              <MyCard
                navigationProps={navigationProps}
                style={{ paddingTop: 20, backgroundColor: '#1A237E' }}
              >
                <StatusBar
                  barStyle="light-content"
                  networkActivityIndicatorVisible={true}
                />
                <Touchable.MainView
                  selector="main"
                  style={{
                    paddingHorizontal: 3,
                    flex: 1,
                    backgroundColor: '#1A237E', // indigo 900
                  }}
                  width={width-6}
                  {...model}
                />
              </MyCard>
            );
          case 'Book Detail':
            // return (MainView(model))
            //console.log(model.selectedBook)
            let {selectedBook:{libraryStatus:{reserveUrl:url}}} = model;
            url = url || 'https://github.com/facebook/react-native'
            return (
              <MyCard
                navigationProps={navigationProps}
                style={{backgroundColor: 'yellow' }}
                      >
                <StatusBar
                  animated={true}
                  barStyle='dark-content'
                            />
                <NavigationExperimental.Header
            {...navigationProps}
            onNavigateBack={onNavigateBack}
            renderTitleComponent={props =>
              (
                <NavigationExperimental.Header.Title>
                                 foo
                </NavigationExperimental.Header.Title>
              )
                                 }
                                 />
                <WebView
        source={{uri: url}}
              />
              </MyCard>
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

module.exports = view;
