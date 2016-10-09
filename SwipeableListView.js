import React from 'react';

import {
  ListView,
  View
} from 'react-native';

import { _SwipeableRow3,SwipeableRow3 } from './SwipeableRow';
import { emptyFunction } from 'fbjs/lib/emptyFunction';

//class for ref
class SwipeableListView extends React.Component {
  render() {
    const { renderRow, generateActions,
            onSwipeStart, onSwipeEnd, ...props } = this.props;
    return (
      <ListView
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>
          <SwipeableRow3
            ref={ c => (this.row1 = c)}
            {...generateActions(rowData, sectionID, rowID, highlightRow)}
            onSwipeStart={({gestureState,action}) =>{
              this.listview.setNativeProps({ scrollEnabled: false })
              onSwipeStart && onSwipeStart(
                {gestureState, rowData, sectionID, rowID, highlightRow, action})
              //this.row1.getCurrentAction() not working
              }}
            onSwipeEnd={({gestureState,action}) =>{
                this.listview.setNativeProps({ scrollEnabled: true })
                onSwipeEnd && onSwipeEnd(
                  {gestureState, rowData, sectionID, rowID, highlightRow, action})
              }}
          >
            {renderRow(rowData, sectionID, rowID, highlightRow)}
          </SwipeableRow3>
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
