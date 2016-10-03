import React from 'react';

import {
  View,
  Text,
  ListView,
  ScrollView,
  findNodeHandle,
  TouchableHighlight,
} from 'react-native';

const RCTUIManager = require('NativeModules').UIManager;

function withItems(ListViewComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        getSectionHeaderData: (dataBlob, sectionID) =>
          dataBlob.sections[sectionID]
      });
    }
    render() {
      const { items, sectionIDs, rowIDs, ...other } = this.props;
      this.dataSource =
        this.dataSource.cloneWithRowsAndSections(items, sectionIDs, rowIDs);
      console.log('dataSource:',
                  items, sectionIDs, rowIDs,
                  this.dataSource.getRowCount(),
                  this.dataSource.getRowAndSectionCount(),
                  this.dataSource.getSectionLengths());
      return (
        <ListViewComponent
          dataSource={this.dataSource}
          {...other}
        />);
    }
  };
}

import util from 'util';
function debugRenderRow(rowData, sectionID, columnID) {
  console.log('row:', rowData, sectionID, columnID);
  return (<View style={{ height: 200, borderColor: columnID % 2 ? 'yellow' : 'green', borderWidth: 3 }}><Text>row:{columnID}:{util.inspect(rowData)}</Text></View>);
}

import { compose, mapProps, withState, toClass, withProps, withHandlers } from 'recompose';

// http://blog.koba04.com/post/2016/07/15/a-brief-note-of-reacteurope2016-sessions/
/* const enhance = compose(
 *   //toClass,
 *   //withItems
 *   withState(("dataSource","updateDataSource", new ListView.DataSource({
 *     rowHasChanged: (r1, r2) => r1 !== r2,
 *     sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
 *   }))),
 *   withProps(({items})=>
 *     ({dataSource:dataSource.cloneWithRowsAndSections(items)}))
 * )*/
const EnhancedListView = compose(
  // withItems,
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
  //props.renderSectionHeader &&
  //withState('sectionRefs','updateSectionRefs',{})
)(ListView);

const Dimensions = require('Dimensions');
const {
  width,
  height,
} = Dimensions.get('window');

import { SwipeableActions, SwipeableRow3, SwipeableRowW } from './SwipeableRow';
import { BookRow, BookRow1 } from './BookRow';
import { Action, genActions, genActions2 } from './Action';

class SwipeableListView extends React.Component {
  render() {
    const { renderRow, renderActions, actions, ...props } = this.props;

    return (
      <ListView
        ref={c => this.listview = c}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>
          <SwipeableRow3
            onSwipeStart={() =>
               this.listview.setNativeProps({ scrollEnabled: false })}
            onSwipeEnd={() =>
               this.listview.setNativeProps({ scrollEnabled: true })}
            {...genActions2('search')}
          >
            {renderRow(rowData, sectionID, rowID, highlightRow)}
          </SwipeableRow3>
                  }
        {...props}
      />);
  }
}
SwipeableListView.propTypes = {
  // ...ListView.DataSource.propTypes
  ...ListView.propTypes
};
SwipeableListView.defaultProps = {
  ...ListView.defaultProps
};
// SwipeableListView.propTypes = { initialCount: React.PropTypes.number };

// Dumb compo
class ListViewWithFilter extends React.Component {
  render() {
    const { limit, items, selectedSection, ...other } = this.props;
    // function ListViewWithFilter({ limit, items, selectedSection, ...other }) {
    console.log('ListViewWithFilter', this.props);
    const sectionIDs =
      selectedSection ?
      [selectedSection, `${selectedSection}_end`] :
      Object.keys(items);
    // Object.keys(items).filter(key => key !== "search_end")
    console.log('sec:', sectionIDs);

    const rowIDs =
      selectedSection ?
      undefined :
      sectionIDs.map(sectionID =>
        Object.keys(items[sectionID]).slice(0, limit || undefined));
    console.log('row:', rowIDs);

    return (
      // ListViewWithFooter
      <ListView
        ref="root"
        items={items}
        rowIDs={rowIDs}
        sectionIDs={sectionIDs}
        enableEmptySections
        {...other}
      />);
  }
}

module.exports = { SwipeableListView };
