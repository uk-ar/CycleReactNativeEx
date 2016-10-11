import React from 'react';

import {
  ListView,
  View
} from 'react-native';

import { _SwipeableRow3,SwipeableRow3 } from './SwipeableRow';
import { emptyFunction } from 'fbjs/lib/emptyFunction';
import { CloseableView } from './Closeable';

//class for ref
class SwipeableListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
    };
    this.closeable=[]
  }
  setNativeProps(props) {
    // for Touchable
    this.listview.setNativeProps(props);
  }
  componentWillReceiveProps(nextProps: Props): void {
    if (this.state.dataSource !== nextProps.dataSource) {
      function toRowsAndSections(arrays){
        return arrays.map((rows,sectionIndex) =>
          rows.map((elem,rowIndex) => [elem,rowIndex])
              .filter(([elem,rowIndex]) => elem === true)
              .map(([elem,rowIndex])=>({sectionIndex,rowIndex}))
        ).reduce((acc,rows) => {//flatten
          acc = [...acc,...rows]
          return acc;
        },[])
      }
      function difference(a,b){
        return a.map(
          (rowIDs,section) => rowIDs.map(row =>
            b[section].indexOf(row) === -1
          ))
      }
      //close
      //willDissapear
      const removed =
        toRowsAndSections(
          difference(this.state.dataSource.rowIdentities,
                   nextProps.dataSource.rowIdentities))
          .map(({sectionIndex,rowIndex})=>
            ({section:this.state.dataSource
                          .sectionIdentities[sectionIndex],
              row:this.state.dataSource
                      .rowIdentities[sectionIndex][rowIndex]}))
      this.added =
        difference(nextProps.dataSource.rowIdentities,
                   this.state.dataSource.rowIdentities)
      /* .map(({sectionIndex,rowIndex})=>
       *   ({section:nextProps.dataSource
       *                      .sectionIdentities[sectionIndex],
       *     row:nextProps.dataSource
       *                  .rowIdentities[sectionIndex][rowIndex]}))*/
      //console.log()
      Promise.all(
        removed.map(({section,row})=>this.closeable[section][row].close()))
          .then(()=>
            this.setState({ dataSource: nextProps.dataSource},() =>
              Promise.resolve()))
      /* .then(()=>
       *   this.setState({ dataSource: nextProps.dataSource},() =>
       *     Promise.resolve()))*/
      //console.log(removed,)
      //console.log(nextProps.dataSource)

      //open
      //willAppear
      console.log("add?",
                  difference(nextProps.dataSource.rowIdentities,
                             this.state.dataSource.rowIdentities))
    }
  }
  rowShouldEnter(sectionID,rowID){
    return this.added()
  }
  render() {
    const { renderRow, //generateActions,
            //onSwipeStart, onSwipeEnd,
            dataSource,...props } = this.props;
    //console.log("ds",this.state.dataSource)
    return(
      <ListView
        dataSource={this.state.dataSource}
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>{
            return (
              <CloseableView
                  ref={c=>{
                      this.closeable[sectionID] = this.closeable[sectionID] || []
                      this.closeable[sectionID][rowID] = c
                    }}
                  >
                  {renderRow(rowData, sectionID, rowID, highlightRow)}
              </CloseableView>
            )
          }}
        {...props}
      />);
  }
}
SwipeableListView.propTypes = {
  ...ListView.propTypes,
  //generateActions:React.PropTypes.func.isRequired,
  /* onSwipeStart:React.PropTypes.func,
   * onSwipeEnd:React.PropTypes.func,*/
};
SwipeableListView.defaultProps = {
  ...ListView.defaultProps,
  /* onSwipeStart:emptyFunction,
   * onSwipeEnd:emptyFunction,*/
};

module.exports = { SwipeableListView };
