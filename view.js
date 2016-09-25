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

import { BookRow } from './BookCell';
Touchable.BookRow = Touchable.createCycleComponent(
  BookRow, {
    onRelease: 'release',
  });

import { BookListView } from './BookListView';

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

import { Closeable, Closeable2 } from './Closeable';
import { AnimView } from './AnimView';
class Header extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { toggle: true ,opacity: 0 };
    this.state = { toggle: true };
  }
  componentDidMount() {
    // this.setState({ opacity: 1 })
  }
  render() {
    console.log('render header pad?', this.state.toggle);
    //            close={this.state.toggle}
    //            close={true}
    //            close={!this.state.toggle}
    //          close={!this.state.toggle}
    return (
      <AnimView
        style={{ padding: 10, opacity: this.state.opacity }}
        anim={{ duration: 500 }}
      >
        <Closeable2
          style={{ justifyContent: 'center',
                   backgroundColor: 'red' }}
          direction="vertical"
          close
          ref="close"
        >
          <AnimView
            ref="view1"
            style={{
              // height:this.state.toggle ? 10 : 20,
              // height:10,
              // backgroundColor: this.state.toggle ? 'black' : 'white',
            }}
          >
            <Text>foo</Text>
          </AnimView>
        </Closeable2>

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
            height: 20,
            width: 20,
            backgroundColor: 'gray',
          }}
        >
          <View
            ref="view4"
            style={{
              height: 40,
              width: 40,
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
        <View style={{
          backgroundColor: 'purple' }}>
          <Text
            style={{ color: 'white' }}
            onPress={() => {
              console.log('refs', this.refs);
              this.refs.view4.measure((x, y, width, height) =>
                  console.log('view4:', width, height));
              this.refs.view5.measure((x, y, width, height) =>
                  console.log('view5:', width, height));
              this.setState((prev, current) => ({ toggle: !prev.toggle }));
              this.refs.close.toggle()
                    .then(() =>
                      console.log('toggled')
                      // ToastAndroid.show('Toggled', ToastAndroid.SHORT)
                    );
                // FIXME:why width is shurinked?
            }}
          >
            {'toggle'}
          </Text>
        </View>
      </AnimView>);
  }
}

function SearchHeader({ loadingState, close, ...props }) {
  // console.log('search',   loadingState);
  return (!close ? (
    <ItemsHeader
      {...props}
      section="search"
    >
       <TextInput
         autoCapitalize="none"
         autoCorrect={false}
         selector="text-input"
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
       {...props}
       style={[styles.sectionHeader]}
       section="search"
     />)
    //       style={[styles.sectionFooter, styles.sectionHeader]}
   );
}

import { itemsInfo } from './common';
function ItemsHeader({ section, children, style, close }) {
  if (!itemsInfo[section]) { return null; }
  // const icon = (selectedSection === null) ? (
  const icon = !close ? (
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
  const content = children || (
    <Text>
      {itemsInfo[section].text}
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

Touchable.BookListView = Touchable.createCycleComponent(
  BookListView);

function MainView({ items, sectionIDs, rowIDs, dataSource, booksLoadingState, selectedSection }) {
  // TODO:keep query text & scroll position
  // console.log('s b', savedBooks);
  // TODO: transition to detail view
  console.log('render main', { items, sectionIDs, rowIDs, booksLoadingState, selectedSection });
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
    <View
      key="main"
      style={{
        flex: 1,
        backgroundColor: '#1A237E', // indigo 900
      }}
    >
      <Header />
      { /* listView should have onRelease method? */ }
      { /* key is for rerender header */ }
      <Touchable.BookListView
        removeClippedSubviews={false}
        onContentSizeChange={(contentWidth, contentHeight) =>
          //console.log('change', contentWidth, contentHeight)
          null
                            }
        selector="listview"
        dataSource={dataSource}
        ref={(c) => {
            // console.log("ref:",c);
            // this.listview=c
            // c.scrollTo({x:0,y:100,animated:false})
        }}
        directionalLockEnabled
        enableEmptySections
        renderRow={(rowData, sectionID, rowID) => {
          // console.log('row:', rowData, sectionID, rowID);
          return (
          <Touchable.BookRow
            key={rowID}
            selector="bookcell"
            bucket={sectionID}
            book={rowData}
            style={{ backgroundColor: materialColor.grey['50'] }}
          />);
        }}
        renderSectionFooter={(sectionData, sectionID) => {
            //console.log('footer', sectionData, sectionID);
          const { section } = sectionData;
          return (
            <ItemsFooter
              {...sectionData}
              key={selectedSection}
              payload={section}
            />);
        }}
        renderSectionHeader={(sectionData, sectionID) => {
            //console.log('header', sectionData, sectionID);// ,
            // const {selectedSection, booksLoadingState} = sectionData;
          return (sectionID === 'search') ? (
              <SearchHeader
                {...sectionData}
              />) : (
                <ItemsHeader
                  {...sectionData}
                  section={sectionID}
                />);
        }}
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
