import React from 'react';

import {
  ListView,
  View
} from 'react-native';

import { _SwipeableRow3,SwipeableRow3 } from './SwipeableRow';
import { emptyFunction } from 'fbjs/lib/emptyFunction';

//class for ref
class SwipeableListView extends React.Component {
  setNativeProps(props) {
    // for Touchable
    this.listview.setNativeProps(props);
  }
  render() {
    const { renderRow, generateActions,
            onSwipeStart, onSwipeEnd, ...props } = this.props;
    return (
      <ListView
        ref={c => (this.listview = c)}
      renderRow={(rowData, sectionID, rowID, highlightRow) =>
        renderRow(rowData, sectionID, rowID, highlightRow)
                  }
        {...props}
      />);
  }
}
SwipeableListView.propTypes = {
  ...ListView.propTypes,
  generateActions:React.PropTypes.func.isRequired,
  onSwipeStart:React.PropTypes.func,
  onSwipeEnd:React.PropTypes.func,
};
SwipeableListView.defaultProps = {
  ...ListView.defaultProps,
  onSwipeStart:emptyFunction,
  onSwipeEnd:emptyFunction,
};

module.exports = { SwipeableListView };
