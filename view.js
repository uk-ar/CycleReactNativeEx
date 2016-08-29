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
  ToastAndroid,
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

/* if(this.listview && this.props.){
   this.listview.scrollTo({y:this.props.offset,animated:false})
   } */
/* getScrollResponder() {
   return this.listview.getScrollResponder();
   },*/
/* const dataSource = new ListView.DataSource({
 *   rowHasChanged: (r1, r2) => r1 !== r2,
 *   sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
 * });
 * */
class MyListView0 extends React.Component {
  // remove this.state.dataSource && this.listview
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    //getSectionLengths
  }

  render() {
    // https://github.com/babel/babel-eslint/issues/95#issuecomment-102170872
    const { items, ...other } = this.props;
    return (
      // onResponderMove is too premitive
      // directionalLockEnabled disables horizontal scroll when scroll vertically
      // https://github.com/facebook/react-native/issues/6764
      <ListView
        ref={listView => (this.listview = listView)}
        directionalLockEnabled
        dataSource = {this.dataSource.cloneWithRowsAndSections(items)
          //TODO:rowIdentities
                   }
        enableEmptySections
        {...other}
      />
      );
  }
}
//filter by getSectionLengths?
//react renderSectionFooter
class MyListView extends React.Component {
  render() {
    //filter selectedSection or full
    //console.log("li",this.props)
    const {selectedSection, limit, items,
           renderRow, renderSectionFooter, ...other} = this.props
    const limited = Object
      .keys(items)
      .filter((key) => selectedSection ? selectedSection === key : true)
      .reduce((acc,key) => {
        acc[key]= items[key]
          .slice(0, limit || undefined)
          .concat({
            payload: key,
            count:items[key].length
          })

        return acc;
      },{})
    //(rowData, sectionID, rowID) => {
    //renderSectionFooter={(sectionData, sectionID) =>{
    return (
      <MyListView0
        items={limited}
        renderRow={(rowData, sectionID, rowID) => {
            return rowData.count ?
                   this.props.renderSectionFooter(limited[sectionID], sectionID) :
                   this.props.renderRow(rowData, sectionID, rowID);
          }}
        {...other}/>)
  }
}

MyListView.propTypes = {
  items: React.PropTypes.objectOf(React.PropTypes.array),
  selectedSection: React.PropTypes.string,
};

import { AnimView, MeasureableView } from './SwipeableRow';
const ReactTransitionGroup = require('react-addons-transition-group');

// test(isSelected,componentA,componentB)
// https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775#gistcomment-1574787
class Closeable2 extends React.Component {
  // TODO:High Order Component can remove inner view
  constructor(props) {
    super(props);
    this.state = { close: this.props.close };
    this.style = this.props.close ? { height: 0.01 } : { height: null };
  }
  open() {
    return new Promise((resolve, reject) => {
      this.refs.inner.measure((x, y, width, height) => {
        this.style = { height };
        this.setState({ close: false }, () => { // widen
          this.refs.outer.animate({ height: 0.01 }, this.style)
              .then(() => {
                resolve();
              });
        });
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.refs.inner.measure((x, y, width, height) => {
        this.style = { height: 0.01 };
        this.refs.outer.animate({ height }, this.style)
            .then(() => {
              this.setState({ close: true });// shrink
              resolve();
            });
      });
    });
  }
  toggle() {
    return (this.state.close ? this.open() : this.close());
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.close !== nextProps.close) {
      this.toggle();
    }
  }
  render() {
    return (
      <AnimView
        style={this.style}
        ref="outer"
      >
        <View
          ref="inner"
          style={[this.props.style, this.state.close ? { position: 'absolute' } : null]}
        >
          {this.props.children}
        </View>
      </AnimView>
    );
  }
}
// willRecieveProps
// withPropsWillChange("key",(old,new)=>)
// {key1:,key2:}
// [key1,key2],func
function willRecieveProps(key, fn) {
  // console.log("p:",key,Object.keys(key))
  return (WrappedComponent) => {
    return class extends WrappedComponent {
      render() {
        // console.log("iiHOC",this.props,this.state)
        return super.render();
      }
      componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        // this.close.bind(this)();
        fn(this);
        /* if(this.props[key] !== nextProps[key]){
         *   fn.bind(this)(this.props[key],nextProps[key]);
         * }*/
      }
    };
  };
}
// this.toggle
// const Closeable3 = willRecieveProps(key, (inst) => inst.toggle())(Closeable2)

// TODO:refactor
class Closeable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { layouted: false };
    /* this.initialStyle = { height: null };
     * this.closedStyle = { height: 0.01 };
     * this.state = { style: this.initialStyle };*/
  }
  close() {
    this.style = this.calcStyle(true);
    return this.refs.root.animateTo(this.style);
  }
  open() {
    this.style = this.calcStyle(false);
    return this.refs.root.animateTo(this.style);
  }
  toggle() {
    const closedStyle = this.calcStyle(true);
    if ((this.style.width === closedStyle.width) &&
       (this.style.height === closedStyle.height)) {
      this.style = this.calcStyle(false);
    } else {
      this.style = this.calcStyle(true);
    }
    console.log('st:', this.style);
    return this.refs.root.animateTo(this.style);
  }
  calcStyle(close) {
    let style = !this.state.layouted ?
                { width: null, height: null } : close ?
                { width: 0.01, height: 0.01 } :
                { width: this.contentWidth, height: this.contentHeight };
    if (this.props.direction == 'horizontal') {
      // style.height = null;
      return { width: style.width };
    } else if (this.props.direction == 'vertical') {
      // style.width  = null;
      return { height: style.height };
    } else {
      return style;
    }
  }
  // horizontal
  // promise
  render() {
    // on the fly measureing cannot working when closed -> open
    this.style = this.calcStyle(this.props.close);
    console.log('st:', this.style);
    return (
      // not to optimize
      // add absolute from parent when measureing
      // first:  close -> absolute, open -> null
      // second: close -> absolute, open -> null
        <AnimView
          style={[{// .vertical closable
            overflow: 'hidden',
              //flexDirection:"row",//not to resize text when horizontal
          }, this.style]}
          ref="root"
        >
          { /* open ? tracking view : non tracking */ }
          <MeasureableView
            onFirstLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
              console.log('h:', height);
              this.contentWidth = width;
              this.contentHeight = height;
              this.setState({ layouted: true });
            }}
            style={[this.props.style, { overflow: 'hidden' }]}
          >
            {this.props.children}
          </MeasureableView>
        </AnimView>
    );
  }
}

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
    return (
      <AnimView
        style={{ padding: 10, opacity: this.state.opacity }}
        anim={{ duration: 500 }}
      >
          <Closeable2
            style={{ justifyContent: 'center',
                    backgroundColor: 'red' }}
            direction="vertical"
            close={!this.state.toggle}
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
              /* console.log("refs",this.refs)
              this.refs.view4.measure((x,y,width,height)=>
              console.log("view4:",width,height))
              this.refs.view5.measure((x,y,width,height)=>
              console.log("view5:",width,height)) */
            this.setState((prev, current) => ({ toggle: !prev.toggle }));
              /* this.refs.close.toggle()
              .then(()=>
              ToastAndroid.show('Toggled', ToastAndroid.SHORT)
              ); */
              // FIXME:why width is shurinked?
          }}
        >
          {'toggle'}
        </Text>
         </View>
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
       section="search"
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
       section="search"
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
  return books.reduce((acc,book)=> {
    acc[book.key] = book;
    return acc
  },{})
};

function mainView({ searchedBooks, savedBooks, booksLoadingState, selectedSection }) {
  console.log('s b', savedBooks);
  // TODO: transition to detail view
  const items = {
    search: searchedBooks,
    liked: savedBooks.filter((book) => book.bucket === 'liked'),
    borrowed: savedBooks.filter((book) => book.bucket === 'borrowed'),
    done: savedBooks.filter((book) => book.bucket === 'done')
  };
  console.log('render main');

  let header = <Header />;
  console.log('render main2', items);
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
        limit={selectedSection ? null : 2}
        renderRow={(rowData, sectionID, rowID) => {
            return (!selectedSection && sectionID === 'search') ?
                   null : (
                     <Touchable.BookRow
         key={rowID}
         selector="bookcell"
         bucket={sectionID}
         book={rowData}
         style={{ backgroundColor: materialColor.grey['50'] }}
               />)
          }}
        renderSectionFooter={(sectionData, sectionID) =>{
            const [,,rowData] = sectionData
            return (!selectedSection && sectionID === 'search') ? null :
                   <ItemsFooter
                payload={rowData.payload}
                              count={rowData.count}
                                    />
          }}
        renderSectionHeader={(sectionData, sectionID) => {
            console.log("header",sectionData, sectionID)
            return (sectionID === 'search') ? (
              <SearchHeader
 selectedSection={selectedSection}
 loadingState={booksLoadingState}
              />) : (
                <ItemsHeader
 selectedSection={selectedSection}
 section={sectionID}
         />)
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
