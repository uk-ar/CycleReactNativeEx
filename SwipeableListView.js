import React from 'react';

import {
  ListView,
  View
} from 'react-native';

import { _SwipeableRow3, SwipeableRow3 } from './SwipeableRow';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { LayoutableView, CloseableView } from './Closeable';
import Stylish from './Stylish';

// class for ref
class SwipeableListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
    };
    this.closeable = [];
    this.added = null;
  }
  setNativeProps(props) {
    // for scroll lock
    this.listview.setNativeProps(props);
  }
  close(sectionID, rowID) {
    return this.closeable[sectionID][rowID].close();
  }
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

    const removed =
      toRowsAndSections(
        difference(this.state.dataSource.rowIdentities,
                   dataSource.rowIdentities))
        .map(({ sectionIndex, rowIndex }) =>
          ({ section: this.state.dataSource
                        .sectionIdentities[sectionIndex],
            row: this.state.dataSource
                    .rowIdentities[sectionIndex][rowIndex] }));

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
        renderRow={(rowData, sectionID, rowID, highlightRow) => {
          return (
              <LayoutableView
                ref={(c) => {
                  this.closeable[sectionID] = this.closeable[sectionID] || [];
                  this.closeable[sectionID][rowID] = c;
                }}
                transitionEnter={this.rowShouldEnter(sectionID, rowID)}
              >
                  {renderRow(rowData, sectionID, rowID, highlightRow)}
              </LayoutableView>
            );
        }}
        {...props}
      />);
  }
}

//const SwipeableListView = createStylishComponent(_SwipeableListView)

SwipeableListView.propTypes = {
  ...ListView.propTypes,
  //generateActions: React.PropTypes.func.isRequired,
  onSwipeStart: React.PropTypes.func,
  onSwipeEnd: React.PropTypes.func,
};

SwipeableListView.defaultProps = {
  ...ListView.defaultProps,
  onSwipeStart: emptyFunction,
  onSwipeEnd: emptyFunction,
};

module.exports = { SwipeableListView };
