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
import { emptyFunction } from 'fbjs/lib/emptyFunction';

import Dimensions from 'Dimensions';
const {
  height,
} = Dimensions.get('window');

import { SwipeableListView } from './SwipeableListView';

const RCTUIManager = require('NativeModules').UIManager;

function debugRenderRow(rowData, sectionID, columnID) {
  console.log('row:', rowData, sectionID, columnID);
  return (
    <View style={{ height: 200, borderColor: columnID % 2 ? 'yellow' : 'green', borderWidth: 3 }}>
      <Text>row:{columnID}:{util.inspect(rowData)}</Text>
    </View>);
}

// http://blog.koba04.com/post/2016/07/15/a-brief-note-of-reacteurope2016-sessions/
const EnhancedListView = compose(
  /* withHandlers({
   *   onScroll: props => e => console.log("foo:",e.nativeEvent.contentOffset.y)
   * }),*/
  withHandlers({
    renderSectionHeader: props => (sectionData, sectionID) => {
      return sectionID.endsWith('_end') ?
             props.renderSectionFooter(sectionData, sectionID) :
             props.renderSectionHeader(sectionData, sectionID);
    }
  }),
)(SwipeableListView);

class BookListView extends React.Component {
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
    //console.log('this.props', this.props);
    const {onRelease,dataSource, ...props} = this.props;

    //dataSource.
    return (
      <EnhancedListView
        {...this.props}
        onSwipeEnd={
          ({gestureState, rowData, sectionID, rowID, highlightRow, action}) =>
            onRelease(rowData,rowID,action)//book,to bucket
                   }
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
  }
}

BookListView.propTypes = {
  ...ListView.propTypes,
  renderSectionFooter: React.PropTypes.func,
  onRelease:React.PropTypes.func,
};
BookListView.defaultProps = {
  ...ListView.defaultProps,
  //onRelease:emptyFunction,
  onRelease:function(){},
};

module.exports = { BookListView };
