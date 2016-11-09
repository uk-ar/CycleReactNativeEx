import React from 'react';

import {
  ListView,
  View,
  Easing
} from 'react-native';

import { _SwipeableRow3, SwipeableRow3 } from './SwipeableRow';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { LayoutableView, CloseableView } from './Closeable';
import Stylish from 'react-native-stylish';

// class for ref
class _SwipeableListView extends React.Component {
  // auto entering animation when element add
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
    };
    // this.closeable = [];
    this.added = null;
  }
  setNativeProps(props) {
    // for scroll lock
    this.listview.setNativeProps(props);
  }
  /* close(sectionID, rowID) {
   *   return this.closeable[sectionID][rowID].close();
   * }*/
  changeDataSource(dataSource) {
    function toRowsAndSections(arrays) {
      return arrays.map((rows, sectionIndex) =>
        rows.map((elem, rowIndex) => [elem, rowIndex])
            .filter(([elem, rowIndex]) => elem === true)
            .map(([elem, rowIndex]) => ({ sectionIndex, rowIndex }))
      ).reduce((acc, rows) => { // flatten
        acc = [...acc, ...rows];
        return acc;
      }, []);
    }
    function difference(a, b) {
      return a.map(
        (rowIDs, section) => rowIDs.map(row =>
          b[section].indexOf(row) === -1
        ));
    }
    /* console.log("ds:",
     *             this.state.dataSource.rowIdentities,dataSource.rowIdentities)*/

    /* const removed =
     *   toRowsAndSections(
     *     difference(this.state.dataSource.rowIdentities,
     *                dataSource.rowIdentities))
     *     .map(({ sectionIndex, rowIndex }) =>
     *       ({ section: this.state.dataSource
     *                     .sectionIdentities[sectionIndex],
     *         row: this.state.dataSource
     *                 .rowIdentities[sectionIndex][rowIndex] }));
     */
    this.added = difference(dataSource.rowIdentities,
                            this.state.dataSource.rowIdentities);

    this.setState({ dataSource });
  }
  componentWillReceiveProps(nextProps: Props): void {
    if (this.state.dataSource !== nextProps.dataSource) {
      this.changeDataSource(nextProps.dataSource);
    }
  }
  rowShouldEnter(sectionID, rowID) {
    // return this.added()
    // this.state.dataSource.rowIdentities
    const sectionIndex =
      this.state.dataSource.sectionIdentities.indexOf(sectionID);
    const rowIndex = this.state.dataSource.rowIdentities[sectionIndex]
                         .indexOf(rowID);
    // console.log("ind",sectionIndex,rowIndex,this.added)
    return this.added ? this.added[sectionIndex][rowIndex] : false;
  }
  render() {
    const { renderRow, // generateActions,
            // onSwipeStart, onSwipeEnd,
            dataSource, ...props } = this.props;
    // console.log("ds",this.state.dataSource)
    return (
      <ListView
        dataSource={this.state.dataSource}
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>
           (
             <LayoutableView
               ref={(c) => {
                    /* this.closeable[sectionID] = this.closeable[sectionID] || [];
                    this.closeable[sectionID][rowID] = c; */
                    //                transitionEnter={true}
               }}
               transitionEnter={this.rowShouldEnter(sectionID, rowID)}
             >
               {renderRow(rowData, sectionID, rowID, highlightRow)}
             </LayoutableView>
            )
        }
        {...props}
      />);
  }
}

class SwipeableListView extends React.Component {
  // enable scroll lock
  close(sectionID, rowID) {
    // console.log("sw cl",sectionID,rowID,this.listview,this.props.dataSource)
    // return this.listview.close(sectionID, rowID);
    return this.rows[sectionID][rowID].close();// SwipeableRow3
  }
  /* closeSection(sectionID) {
   *   //return this.listviews[sectionID].close(sectionID, rowID);
   *   return this.listview.closeSection(sectionID)//BookListView1
   * }*/
  /* scrollTo(obj){
   *   return this.listview.scrollTo(obj)
   * }*/
  setNativeProps(props) {
    // for scroll lock
    this.listview.setNativeProps(props);
  }
  render() {
    const { renderRow, generateActions,
            onSwipeStart, onSwipeEnd, ...props } = this.props;
    // console.log("sw re",this.props.dataSource)
    this.rows = this.rows || {};
    return (
      <_SwipeableListView
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>
            // layoutableView > SwipeableRow3 > props.render
            // layoutableView && SwipeableRow3
             (
               <SwipeableRow3
                 ref={(c) => {
                   this.rows[sectionID] = this.rows[sectionID] || {};
                   this.rows[sectionID][rowID] = c;
                 }}
                 animationConfig={{ easing: Easing.inOut(Easing.quad) }}
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
               </SwipeableRow3>
            )
          }
        {...props}
      />);
  }
}

// const SwipeableListView = createStylishComponent(_SwipeableListView)

SwipeableListView.propTypes = {
  ...ListView.propTypes,
  // generateActions: React.PropTypes.func.isRequired,
  onSwipeStart: React.PropTypes.func,
  onSwipeEnd: React.PropTypes.func,
};

SwipeableListView.defaultProps = {
  ...ListView.defaultProps,
  onSwipeStart: emptyFunction,
  onSwipeEnd: emptyFunction,
};

module.exports = { SwipeableListView };
