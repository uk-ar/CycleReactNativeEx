import React from 'react';

import {
  ListView,
  View
} from 'react-native';

import { _SwipeableRow3,SwipeableRow3 } from './SwipeableRow';
import emptyFunction from 'fbjs/lib/emptyFunction';
import { LayoutableView, CloseableView } from './Closeable';

//class for ref
class _SwipeableListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      added: null
    };
    this.closeable=[]
    this.promise = null
  }
  setNativeProps(props) {
    // for scroll lock
    this.listview.setNativeProps(props);
  }
  close(sectionID,rowID){
    
  }
  changeDataSource(dataSource){
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

    const removed =
      toRowsAndSections(
        difference(this.state.dataSource.rowIdentities,
                   dataSource.rowIdentities))
        .map(({sectionIndex,rowIndex})=>
          ({section:this.state.dataSource
                        .sectionIdentities[sectionIndex],
            row:this.state.dataSource
                    .rowIdentities[sectionIndex][rowIndex]}))

    if(this.promise){
      this.promise.then(()=>
        Promise.all(
          removed.map(({section,row})=>this.closeable[section][row].close()))
               .then(()=>{
                 this.setState({
                   dataSource: dataSource,
                   added:difference(dataSource.rowIdentities,
                                    this.state.dataSource.rowIdentities)
                 },
                               () => Promise.resolve())
               }))
    } else {
      this.promise =
        Promise.all(
          removed.map(({section,row})=>this.closeable[section][row].close()))
               .then(()=>{
                 this.setState({
                   dataSource: dataSource,
                   added:difference(dataSource.rowIdentities,
                                    this.state.dataSource.rowIdentities)
                 },
                               () => Promise.resolve())
               })
    }
  }
  componentWillReceiveProps(nextProps: Props): void {
    if (this.state.dataSource !== nextProps.dataSource) {
      this.changeDataSource(nextProps.dataSource)
      //console.log("rem",removed,this.added)
      //console.log("add",this.added)
      
      //add data after close
      /* .then(()=>
       *   this.setState({ dataSource: nextProps.dataSource},() =>
       *     Promise.resolve()))*/
      //console.log(removed,)
      //console.log(nextProps.dataSource)

      //open
      //willAppear
      /* console.log("add?",
       *             difference(nextProps.dataSource.rowIdentities,
       *                        this.state.dataSource.rowIdentities))*/
    }
  }
  rowShouldEnter(sectionID,rowID){
    //return this.added()
    //this.state.dataSource.rowIdentities
    const sectionIndex =
      this.state.dataSource.sectionIdentities.indexOf(sectionID)
    const rowIndex = this.state.dataSource.rowIdentities[sectionIndex]
                         .indexOf(rowID)
    //console.log("ind",sectionIndex,rowIndex,this.added)
    return this.added ? this.added[sectionIndex][rowIndex] : false
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
              <LayoutableView
                  ref={c=>{
                      this.closeable[sectionID] = this.closeable[sectionID] || []
                      this.closeable[sectionID][rowID] = c
                    }}
                  transitionEnter={this.rowShouldEnter(sectionID,rowID)}
                  >
                  {renderRow(rowData, sectionID, rowID, highlightRow)}
              </LayoutableView>
            )
          }}
        {...props}
      />);
  }
}

class SwipeableListView extends React.Component {
  constructor(props) {
    super(props);
  }
  close(sectionID,rowID){
  }
  render() {
    const { renderRow, generateActions,
            onSwipeStart, onSwipeEnd, ...props } = this.props;

    return(
      //
      <_SwipeableListView
        ref={c => (this.listview = c)}
        renderRow={(rowData, sectionID, rowID, highlightRow) =>{
          return (
            <SwipeableRow3
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
            </SwipeableRow3>)
          }}
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
