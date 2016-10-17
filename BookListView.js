import React from 'react';

import {
  View,
  Text,
  ListView,
  ScrollView,
  findNodeHandle,
  TouchableHighlight,
} from 'react-native';

import util from 'util';
import { compose, withHandlers } from 'recompose';
import emptyfunction from 'fbjs/lib/emptyFunction';

import Dimensions from 'Dimensions';
const {
  height,
} = Dimensions.get('window');

import { SwipeableListView } from './SwipeableListView';
import { SwipeableRow3 } from './SwipeableRow';

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
  constructor(props) {
    super(props);
    /* this.state = {
     *   dataSource: this.props.dataSource,
     * };
     * this.closeable = []
     * this.added = null*/
    this.dataSources = {};
    this.listviews = {};
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
  }
  setNativeProps(props) {
    // for Touchable
    this.listview.setNativeProps(props);
  }
  close(sectionID, rowID) {
    // console.log("close",sectionID,rowID,this.listviews,this.dataSources)
    return this.listviews[sectionID].close(sectionID, rowID);
  }
  render() {
    const {
      renderRow,
      dataSource,
      onSwipeEnd,
      onSwipeStart,
      // TODO: onSwipeStart?
      ...props } = this.props;
    // console.log("r",Object.keys(dataSource._dataBlob))
    const nestedDataSource =
      Object.keys(dataSource._dataBlob)
            .reduce((acc, sectionID) => {
              acc[sectionID] = [{[sectionID]: dataSource._dataBlob[sectionID]}];
              return acc;
            }, {});
    this.dataSource =
      this.dataSource.cloneWithRowsAndSections(nestedDataSource);
    // console.log("n",nestedDataSource)
    // TODO:lock on swipe
    return (
      <ListView
        {...props}
        dataSource={this.dataSource}
        ref={c => this.listview = c}
        renderRow={(rowData, sectionID, rowID, highlightRow) => {
            this.dataSources[sectionID] =
              this.dataSources[sectionID] || new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2 ,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
              });
            const num = Math.min(Object.keys(rowData[sectionID]).length,2)
            //console.log("?",num)
            //style={{ height: 100 * num }}
            //                automaticallyAdjustContentInsets={false}
            return (
              <SwipeableListView
                enableEmptySections={true}
                scrollEnabled={false}
                style={{borderColor:"red",borderWidth:3,height: 100 * num}}
                ref={c => this.listviews[sectionID] = c}
                onSwipeEnd={onSwipeEnd}
                onSwipeStart={onSwipeStart}
                renderRow={renderRow}
                dataSource={this.dataSources[sectionID]
                                .cloneWithRowsAndSections(rowData)}
                           />
            );
        }}
      />
    );
  }
}

class BookListView2 extends React.Component {
  close(sectionID, rowID) {
    // console.log("sw cl",sectionID,rowID,this.listview,this.props.dataSource)
    return this.listview.close(sectionID, rowID);
  }
  render() {
    const { renderRow, generateActions,
            onSwipeStart, onSwipeEnd, ...props } = this.props;
    // console.log("sw re",this.props.dataSource)
    return (
      <BookListView1
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) => {
          return (
          <SwipeableRow3
            {...generateActions(rowData, sectionID, rowID, highlightRow)}
            onSwipeStart={({ gestureState, action }) => {
              this.listview.setNativeProps({ scrollEnabled: false });
              onSwipeStart && onSwipeStart(
                  { gestureState, rowData, sectionID, rowID, highlightRow, action });
                // this.row1.getCurrentAction() not working
            }}
            onSwipeEnd={({ gestureState, action }) => {
                // console.log("swlv",gestureState,action)
              this.listview.setNativeProps({ scrollEnabled: true });
              onSwipeEnd && onSwipeEnd(
                  { gestureState, rowData, sectionID, rowID, highlightRow, action });
            }}
          >
            {renderRow(rowData, sectionID, rowID, highlightRow)}
          </SwipeableRow3>);
        }}
        {...props}
      />);
  }
}

class BookListView extends React.Component {
  setNativeProps(props) {
    // for Touchable
    this.listview.setNativeProps(props);
  }
  // class because refs & methods
  scrollTo(...args) {
    return new Promise((resolve, reject) => {
      this.scrollview.scrollTo(...args);
      setTimeout(() => resolve(), 100); // TODO:onScrollEndAnimation
    });
  }
  scrollToSectionHeader(sectionID) {
    console.log('liked3', this);// 211
    return new Promise((resolve, reject) => {
      // return resolve([sectionID, 0]);
      console.log('scrosec:', height, this, this.scrollview.getInnerViewNode());
      RCTUIManager.measure(this.scrollview.getInnerViewNode(), (...data) =>
        { console.log('inn:', data); });
      /* this.scrollview.getInnerViewNode().measure(
       *   (x, y, width, height)=>console.log("in",(x, y, width, height))
       * )*/
      this.sections[sectionID]
          .measureLayout(
            findNodeHandle(this.scrollview),
            (x, y, width, height) => {
              // support scroll max
              // sec:687, max 256
              // totalheight:916
              // dim heigjt 683
              console.log('liked4', x, y, width, height);// 232 691
              this.scrollview.scrollTo({ x: 0, y, animated: true });
              // this.scrollview.scrollTo({ x: 0, y: 200, animated: true });
              setTimeout(() => resolve([sectionID, y]), 1000);
              // TODO:onScrollEndAnimation
            });
    });
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

BookListView.propTypes = {
  ...ListView.propTypes,
  renderSectionFooter: React.PropTypes.func,
  onRelease: React.PropTypes.func,
};
BookListView.defaultProps = {
  ...ListView.defaultProps,
  // onRelease:emptyFunction,
  onRelease() {},
};

module.exports = { BookListView, BookListView1, BookListView2 };
