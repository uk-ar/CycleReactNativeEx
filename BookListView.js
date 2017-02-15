import React from 'react';

import {
  View,
  Text,
  ListView,
  ScrollView,
  findNodeHandle,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import util from 'util';
import emptyFunction from 'fbjs/lib/emptyFunction';
import Stylish from 'react-native-stylish';
import materialColor from 'material-colors';

import Dimensions from 'Dimensions';
const {
  height:HEIGHT,
  //width:WIDTH
} = Dimensions.get('window');

import { SwipeableListView } from './SwipeableListView';
import { BookRow2 } from './BookRow';
import { BookCell } from './BookCell';
import { ItemsFooter, ItemsHeader } from './Header';
import { styles } from './styles';

const RCTUIManager = require('NativeModules').UIManager;

function debugRenderRow(rowData, sectionID, columnID) {
  console.log('row:', rowData, sectionID, columnID);
  return (
    <View style={{ height: 200, borderColor: columnID % 2 ? 'yellow' : 'green', borderWidth: 3 }}>
      <Text>row:{columnID}:{util.inspect(rowData)}</Text>
    </View>);
}

// http://blog.koba04.com/post/2016/07/15/a-brief-note-of-reacteurope2016-sessions/
/* const EnhancedListView = compose(
 *   withHandlers({
 *     renderSectionHeader: props => (sectionData, sectionID) => {
 *       return sectionID.endsWith('_end') ?
 *              props.renderSectionFooter(sectionData, sectionID) :
 *              props.renderSectionHeader(sectionData, sectionID);
 *     }
 *   }),
 * )(SwipeableListView);*/
const EnhancedListView = SwipeableListView;

class BookListView1 extends React.Component {
  // nested listview
  constructor(props) {
    super(props);
    this.dataSources = {};
    this.dataSource =
      new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        /* getSectionHeaderData: (dataBlob, sectionID) =>
         *   dataBlob.sections[sectionID]*/
      })
    //this.dataSource = this.props.dataSource;
    //this.listviews = {};
    // this.sections = {};
    // this.rows = {};
  }
  setNativeProps(props) {
    // for Touchable
    this.listview.setNativeProps(props);
  }
  /* close(sectionID, rowID) {
   *   // console.log("close",sectionID,rowID,this.listviews,this.dataSources)
   *   return this.listviews[sectionID].close(sectionID, rowID);
   * }*/
  /* closeSection(sectionID) {
   *   //return this.listviews[sectionID].close(sectionID, rowID);
   *   return Promise.all([
   *     this.sections[sectionID].close(),
   *     this.rows[sectionID].close()
   *     ]
   *   )
   * }*/
  scrollTo(obj) {
    return this.listview.scrollTo(obj);
  }
  render() {
    const {
      renderRow,
      //dataSource,
      dataBlob,
      selectedSection,
      onSwipeEnd,
      onSwipeStart,
      onRelease,
      renderSectionHeader,
      generateActions,
      width,
      // TODO: onSwipeStart?
      ...props } = this.props;
    // console.log("r",Object.keys(dataSource._dataBlob),{...dataSource._dataBlob})
    //console.log("dBlob",dataBlob)

    const nestedDataSource =
      Object.keys(dataBlob)
            .reduce((acc,sectionID)=>{
              acc[sectionID] = [{ [sectionID]: dataBlob[sectionID] }];
              acc[`${sectionID}_end`] = { count: Object.keys(dataBlob[sectionID]).length };
              return acc;
            },{})

    const sectionIdentities =
      selectedSection ?
      [selectedSection, `${selectedSection}_end`] :
      undefined ;
    //console.log("sec",sectionIdentities)
      //foreach(dataBlob)
      /* dataSource.sectionIdentities
       * // Object.keys(dataSource._dataBlob)//section
       *       .reduce((acc, sectionID) => {
       *         acc[sectionID] =
       *           [{ [sectionID]: dataSource._dataBlob[sectionID] }];
       *         return acc;
       *       }, { ...dataSource._dataBlob });// keep section data*/
    // console.log(nestedDataSource)
    // console.log(this.dataSource._getSectionHeaderData)

    this.dataSource =
      this.dataSource.cloneWithRowsAndSections(
        nestedDataSource,
        sectionIdentities);
    // console.log("n",nestedDataSource)
    // TODO:lock on swipe
    return (
      <ListView
        ref={c => this.listview = c}
        removeClippedSubviews={false}
        {...props}
        renderSectionHeader={(rowData, sectionID, rowID, highlightRow) =>{
            // ref={c => this.sections[sectionID] = c}
            //console.log("row",rowData,sectionID,rowID);
            return(
              renderSectionHeader(rowData, sectionID, rowID, highlightRow)
            )
          }}
        dataSource={this.dataSource}
        renderRow={(rowData, sectionID, rowID, highlightRow) => {
          this.dataSources[sectionID] =
              this.dataSources[sectionID] || new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
              });
            //console.log("rend row",rowData);
            //const num = Math.min(Object.keys(rowData[sectionID]).length, 2);
            // Wrapper View for prevent layout destruction
            // removeClippedSubviews={false} seems no mean
            //                style={{maxHeight: 100 * num}}
            //                 ref={c => this.rows[sectionID] = c}
            return (
              //dummy view for insert?
              <SwipeableListView
                width={width}
                enableEnterAnimation={sectionID !== "search"}
                enableEmptySections
                scrollEnabled={false}
                removeClippedSubviews={false}
                onSwipeEnd={onSwipeEnd}
                onSwipeStart={onSwipeStart}
                onRelease={onRelease}
                renderRow={renderRow}
                generateActions={generateActions}
                renderSectionHeader={(sectionData, sectionID) =>
                  // workround for android to fix entering animations
                  //                    style={{height:StyleSheet.hairlineWidth}}
                  // collapsable={false} seems no mean
                  <View
                    style={{ height: 1 }}
                  />
                                    }
                dataSource={this.dataSources[sectionID]
                                .cloneWithRowsAndSections(rowData)}
                           />
          );
        }}
      />
    );
  }
}

class BookListView extends React.Component {
  // add section footer
  /* close(sectionID, rowID) {
   *   return this.listview.close(sectionID, rowID);//BookListView1
   *   //wrapping renderRow can not work, because of actions
   *   //return this.rows[sectionID][rowID].close();
   * }*/
  /* closeSection(sectionID) {
   *   return this.listview.closeSection(sectionID)//BookListView1
   * }*/
  scrollTo(obj) {
    // used by section selected
    return this.listview.scrollTo(obj);
  }
  render() {
    const { renderSectionHeader,
            renderSectionFooter,
            // TODO:separate
            onRelease,
            onSwipeEnd,
            onSwipeStart,
            ...props } = this.props;
    this.rows = this.rows || {};

    // console.log("sw re",this.props.dataSource)
    return (
      <BookListView1
        ref={c => (this.listview = c)}
        {...props}
        renderSectionHeader={(sectionData, sectionID) =>
             sectionID.endsWith('_end') ?
                   renderSectionFooter(sectionData, sectionID) :
                   renderSectionHeader(sectionData, sectionID)
          }
        onSwipeStart={(args) => {
            this.listview.setNativeProps({ scrollEnabled: false });
          onSwipeStart(args);
          }}
        onRelease={()=>{
            this.listview.setNativeProps({ scrollEnabled: true });
          }}
        onSwipeEnd={(args) => {
          onSwipeEnd(args);
            // onRelease(rowData,action)
            /* closeAnimation={
            start:()=>{
            return this.listview
            .close(sectionID, rowID)
            //.then(()=> Promise.resolve())
            //return promise
            }
            }
               onRelease(rowData,action,closeAnimation) */
            /* if(action.target === null){ return }
            this.listview
            .close(sectionID, rowID)
            .then(()=>onRelease(rowData,action)) */
        }}
      />);
  }
}

/* const {
 *   //renderRow,
 *   //dataSource,
 *   dataBlob,
 *   selectedSection,
 *   //onSwipeEnd,
 *   //onSwipeStart,
 *   //onRelease,
 *   //renderSectionHeader,
 *   //generateActions,
 *   width,
 *   // TODO: onSwipeStart?
 *   ...props } = this.props;
 * */
BookListView.propTypes = {
  ...ListView.propTypes,
  dataSource: React.PropTypes.instanceOf(ListView.DataSource),
  renderSectionFooter: React.PropTypes.func,
  // onRelease: React.PropTypes.func,
  onSwipeEnd: React.PropTypes.func,
  onSwipeStart: React.PropTypes.func,
  onRelease: React.PropTypes.func,
  //generateActions: React.PropTypes.func,
};
BookListView.defaultProps = {
  ...ListView.defaultProps,
  // onRelease:emptyFunction,
  onSwipeEnd: emptyFunction,
  onSwipeStart: emptyFunction,
  onRelease: emptyFunction,
};

class BookListView_old extends React.Component {
  setNativeProps(props) {
    // for Touchable
    this.listview.setNativeProps(props);
  }
  // class because refs & methods
  scrollTo(...args) {
    /* return new Promise((resolve, reject) => {
     *   this.scrollview.scrollTo(...args);
     *   setTimeout(() => resolve(), 100); // TODO:onScrollEndAnimation
     * });*/
  }
  scrollToSectionHeader(sectionID) {
    console.log('liked3', this);// 211
    /* return new Promise((resolve, reject) => {
     *   // return resolve([sectionID, 0]);
     *   console.log('scrosec:', height, this, this.scrollview.getInnerViewNode());
     *   RCTUIManager.measure(this.scrollview.getInnerViewNode(), (...data) =>
     *     { console.log('inn:', data); });
       * this.scrollview.getInnerViewNode().measure(
       *   (x, y, width, height)=>console.log("in",(x, y, width, height))
         * )
    *   this.sections[sectionID]
    *       .measureLayout(
      *         findNodeHandle(this.scrollview),
      *         (x, y, width, height) => {
        *           // support scroll max
        *           // sec:687, max 256
        *           // totalheight:916
        *           // dim heigjt 683
        *           console.log('liked4', x, y, width, height);// 232 691
        *           this.scrollview.scrollTo({ x: 0, y, animated: true });
        *           // this.scrollview.scrollTo({ x: 0, y: 200, animated: true });
        *           setTimeout(() => resolve([sectionID, y]), 1000);
        *           // TODO:onScrollEndAnimation
        *         });
    * });*/
  }
  render() {
    this.sections = this.sections || {};// refs
    // console.log('this.props', this.props);
    const { onRelease, dataSource, ...props } = this.props;

    // dataSource.
    return (
      <EnhancedListView
        ref={c => this.listview = c}
        {...this.props}
        onSwipeEnd={
          ({ gestureState, rowData, sectionID, rowID, highlightRow, action }) => {
            console.log('onSwipeEnd');
            onRelease(rowData, rowID, action);// book,to bucket
          }}
        renderScrollComponent={props =>
          <ScrollView
            ref={c => this.scrollview = c}
            {...props}
          />}

        renderSectionHeader={(sectionData, sectionID) =>
          <View
            ref={(c) => {
              this.sections[sectionID] = c;
            }}
          >
            {this.props.renderSectionHeader(sectionData, sectionID)}
          </View>}
      />);
    /* renderSectionHeader: props => (sectionData, sectionID) => {
     *   return sectionID.endsWith('_end') ?
     *          props.renderSectionFooter(sectionData, sectionID) :
     *          props.renderSectionHeader(sectionData, sectionID);*/
  }
}

//For cycle.js
class BookListView2 extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.selectedSection !== nextProps.selectedSection) {
      //this.header.forceUpdate()
      //console.log("th",this.header)
    }
  }
  render(){
    const { renderFooter, onSelectSection ,onCloseSection, selectedSection,
            dataSource, onCloseStart, onCloseEnd, bucket,style }=this.props;
    //console.log("dataSource",selectedSection)
    //console.log("tr;",this.done)
    //console.log("v2;",this.props)
    const HEADER_HEIGHT=40
    const ROW_HEIGHT=84
    const count=dataSource.rowIdentities[0]
                          .map((id,j)=>dataSource.getRowData(0,j))
                          .filter((book)=>book.bucket===bucket)
                          .length
    //Math.min(2,count)
    return (
      <View>
        <ItemsHeader
          style={styles.sectionHeader/*grey 200*/}
          section={bucket/* TODO:change prop name */}
          close={ selectedSection === bucket }
          onSelectSection={(section)=>{
              //this.refs.root.focus()
              onSelectSection(section)
            }}
          onCloseSection={()=>onCloseSection()}
        />
        <ListView
          style={[{backgroundColor: materialColor.grey['100']},
                  selectedSection===bucket ?
                  {flex:1}//{minHeight: HEIGHT - HEADER_HEIGHT +20 }
               :
                  {maxHeight: ROW_HEIGHT*2}]}
          dataSource={dataSource}
          scrollEnabled={selectedSection!==null}
          renderRow={
            //contentContainerStyle style
            (rowData,sectionID,rowID, highlightRow)=>{
              //console.log("rr")
              return(
                <BookRow2
                close={rowData.bucket!==bucket}
                bucket={bucket}
                onCloseStart={(target)=>
                  onCloseStart(target,rowData,sectionID,rowID, highlightRow)}
                onCloseEnd={(target)=>
                  onCloseEnd(target,rowData,sectionID,rowID, highlightRow)}
                           >
                  <BookCell
                  style={{
                    height:ROW_HEIGHT,
                    backgroundColor: materialColor.grey['50']
                  }}
                  book={rowData} />
                </BookRow2>
              )
            }}
      />
        <ItemsFooter
          count={
            count
            /* cannot pass ListView because of height */
                }
          onSelectSection={()=>onSelectSection(bucket)}
        />
      </View>
    )
  }
}

BookListView2.propTypes = {
  dataSource: React.PropTypes.object,
  bucket: React.PropTypes.string.isRequired,
  onCloseStart: React.PropTypes.func,
  onCloseEnd: React.PropTypes.func,
  onSelectSection: React.PropTypes.func,
  onCloseSection: React.PropTypes.func,
};

BookListView2.defaultProps = {
  onCloseStart: (target,rowData,sectionID,rowID, highlightRow) => emptyFunction(),
  onCloseEnd: (target,rowData,sectionID,rowID, highlightRow) => emptyFunction(),
  onSelectSection: emptyFunction,
  onCloseSection: emptyFunction,
};

class ToggleableScrollView extends React.Component {
  render(){
    const { scrollEnabled,...props } = this.props;
    return(
      scrollEnabled ?
      <ScrollView {...props} /> :
      <View {...props} />
    )
  }
}

class BookListView3 extends React.Component {
  render(){
    const {selectedSection,dataSource,style,
           onCloseStart,onCloseEnd,onCloseSection,onSelectSection,
    }=this.props;

    const props = {
      selectedSection,
      onCloseStart,
      onCloseEnd,
      onSelectSection,
      onCloseSection
    }
    //console.log("p",this.props)
    return(
      selectedSection ?
      <ScrollView
        key="scroll"
          scrollEnabled={false}
          style={style}>
          <BookListView2
            dataSource={dataSource}
            key={selectedSection}
            bucket={selectedSection}
            {...props}
          />
        </ScrollView> :
      <ScrollView
        key="scroll"
          scrollEnabled={true}
          style={style}>
          <BookListView2
            dataSource={dataSource}
            key="liked"
            bucket="liked"
            {...props}
          />
          <BookListView2
            dataSource={dataSource}
            bucket="done"
            key="done"
            {...props}
          />
          <BookListView2
            dataSource={dataSource}
            bucket="borrowed"
            key="borrowed"
            {...props}
          />
        </ScrollView>
    )
  }
}

BookListView3.propTypes = {
  dataSource: React.PropTypes.object,
  selectedSection: React.PropTypes.string,
  onCloseStart: React.PropTypes.func,
  onCloseEnd: React.PropTypes.func,
  onSelectSection: React.PropTypes.func,
  onCloseSection: React.PropTypes.func,
};

BookListView3.defaultProps = {
  selectedSection: null,
  onCloseStart: (target,rowData,sectionID,rowID, highlightRow) => emptyFunction(),
  onCloseEnd: (target,rowData,sectionID,rowID, highlightRow) => emptyFunction(),
  onSelectSection: emptyFunction,
  onCloseSection: emptyFunction,
};

function toDataSource(dataBlob){
  const nextDataBlob=dataBlob.reduce((acc,book)=>{
    acc[book.isbn] = book;
    return acc;
  },{})
  //console.log("ndb",nextDataBlob)
  return [nextDataBlob,dataBlob.map((book)=>book.isbn)]
}

class BooksDataSource extends React.Component {
  constructor(props) {
    super(props)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
  }
  render() {
    //console.log("books:",this.props.books)
    this.dataSource = this.dataSource
                          .cloneWithRows(...toDataSource(this.props.books))
    return(
      this.props.renderListView(this.dataSource)
    )
  }
}
//ArrayDataSource
BooksDataSource.propTypes = {
  books: React.PropTypes.array,
  renderListView: React.PropTypes.func,
};

module.exports = { BookListView, BookListView1, BookListView2, BookListView3,
                   BooksDataSource };
