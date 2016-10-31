import React from 'react';
import { getBackHandler } from '@cycle/react-native/src/driver';
import materialColor from 'material-colors';
// there is 1 errors
import {
  Platform,
  Text,
  View,
  NavigationExperimental,
  TextInput,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
  // TouchableHighlight,
  // TouchableNativeFeedback
} from 'react-native';
import NavigationStateUtils from 'NavigationStateUtils';
import Touchable from '@cycle/react-native/src/Touchable';
import { styles } from './styles';

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

import { BookCell } from './BookCell';
import { BookRow1 } from './BookRow';
Touchable.BookRow1 = Touchable.createCycleComponent(
  BookRow1, {
    onRelease: 'release',
  });

import { genActions2 } from './Action';
import { BookListView } from './BookListView';
import { ItemsFooter, ItemsHeader } from './Header';

import { LayoutableView } from './Closeable';
import { Stylish } from './Stylish';
Touchable.BookListView = Touchable.createCycleComponent(
  BookListView);

function MainView({ items, sectionIDs, rowIDs, dataSource, booksLoadingState, selectedSection }) {
  // TODO:keep query text & scroll position
  // console.log('s b', savedBooks);
  // TODO: transition to detail view
  // console.log('render main', { items, sectionIDs, rowIDs, booksLoadingState, selectedSection });
  // console.log("render main");
  /* LayoutAnimation.configureNext(
   *   LayoutAnimation.create(1000,
   *                          LayoutAnimation.Types.easeInEaseOut,
   *                          LayoutAnimation.Properties.opacity))*/
  // let header = <Header />;
  // const header = null;
  // console.log('render main2', items);
  // items={items}
  //        key={selectedSection}
  // props.animations.start()
  // scroll
  // <BookListView
  //        key={selectedSection}
  return (
    <BookListView
      selector="listview"
        style={{
          paddingHorizontal: 3,
          flex: 1,
          backgroundColor: '#1A237E', // indigo 900
        }}
        dataSource={dataSource}
        ref={(c) => {
          this.listview = c;
        }}
        directionalLockEnabled
        enableEmptySections
        generateActions={(rowData, sectionID, rowID) =>
          genActions2(sectionID)}
      onSwipeEnd={({rowData,sectionID,rowID,action,...rest}) =>{
          if(action.target == null) { return }
          this.listview
              .close(sectionID,rowID)
          //TODO: handle data in intent.js
              /*.then(()=>{
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
        renderRow={(rowData, sectionID, rowID) => {
            return (
              <BookCell
              book={rowData}
              style={{ backgroundColor: materialColor.grey['50'] }}
                    />
            );
          }}
        renderSectionHeader={(sectionData, sectionID) => {
            return (
              <ItemsHeader
                   onSelectSection={(section)=>{
                       if(this.sectionIdentities.length === 2){ return }
                       this.positions.push(this._scrollY.__getValue())
                       //TODO:
                       //1. scroll to section header with animation
                       // (need expand view in android)
                       //2. save section header position
                       this.listview.scrollTo({y:0,animated:false})
                       this.sectionIdentities = [section,`${section}_end`]
                       this.updateDataSource()
                     }}
                   onCloseSection={(section)=>{
                       //TODO:
                       //1. scroll to section header with animation
                       //this.listview.scrollTo({y:0,animated:true})
                       this.sectionIdentities = Object.keys(this.data)
                       this.updateDataSource().then(()=>{
                         //TODO:
                         //2. scroll to section header with no animation
                         //2. scroll to original position with animation
                         let pos = this.positions.pop()
                         setTimeout(()=>
                           this.listview.scrollTo({y:pos,
                                                   animated:false}))
                       })
                     }}
                   section={sectionID}
                   {...sectionData}
                   />)
          }}
        renderSectionFooter={(sectionData, sectionID) => {
            //console.log("fo",sectionData)
            return (
              <ItemsFooter
                   {...sectionData}
                   />)
          }}
      />
    );
}

function view(model) {
  /* NavigationExperimental.Transitioner calls twice when layout changed in
     android. But NavigationExperimental.CardStack cannot re-render by model
     change.So we should add random key or force update*/
  // http://stackoverflow.com/a/35004739
  return <MainView {...model} />;
  /* const navigationState = NavigationStateUtils.replaceAtIndex(
   *   model.navigationState, // navigationState
   *   model.navigationState.index, // index
   *   {
   *     ...model.navigationState.routes[model.navigationState.index],
   *     id: Math.random(),
   *   } // route
   * );*/
  const navigationState = model.navigationState;
  // return MainView(model);
  // return <MainView  {...model}/>;
  // console.log('mynav', navigationState, onNavigateBack);
  return (
    // <NavigationExperimental.Transitioner
    <NavigationExperimental.CardStack
      style={{ flex: 1 }}
      navigationState={navigationState}
      onNavigate={onNavigateBack}
      renderOverlay={(navigationProps) => {
          // console.log("np:",navigationProps);
        const style = null;
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
          // return (MainView(model))
            return (
              <MyCard navigationProps={navigationProps}>
                {MainView(model)}
              </MyCard>
            );
          case 'Book Detail':
            // return (MainView(model))
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
