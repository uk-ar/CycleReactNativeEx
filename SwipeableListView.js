import React from 'react';

import {
  ListView,
} from 'react-native';

import { SwipeableRow3 } from './SwipeableRow';

class SwipeableListView extends React.Component {
  render() {
    const { renderRow, generateActions, ...props } = this.props;
    return (
      <ListView
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>
          <SwipeableRow3
            {...generateActions(rowData, sectionID, rowID, highlightRow)}
            onSwipeStart={() =>
               this.listview.setNativeProps({ scrollEnabled: false })}
            onSwipeEnd={() =>
               this.listview.setNativeProps({ scrollEnabled: true })}
          >
            {renderRow(rowData, sectionID, rowID, highlightRow)}
          </SwipeableRow3>
                  }
        {...props}
      />);
  }
}
SwipeableListView.propTypes = {
  ...ListView.propTypes
};
SwipeableListView.defaultProps = {
  ...ListView.defaultProps
};

module.exports = { SwipeableListView };
