import React from 'react';

import {
  View,
  Text,
  ListView,
  ScrollView,
  findNodeHandle,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import { SwipeableRow3,SwipeableRow4,SwipeableRow5 } from './SwipeableRow';
import { genActions2,Action2 } from './Action';

class BookRow1 extends React.Component {
  constructor(props) {
    super(props);
    // console.log("const",props)
  }
  render() {
    const { bucket, ...props } = this.props;
    // console.log("br1 rend",this.props)
    return (
      <SwipeableRow3
        {...props}
        {...genActions2(bucket)}
      />
    );
  }
}

//for target bucket handling
class BookRow2 extends React.Component {
  constructor(props) {
    super(props);
    this.target=null;
  }
  render(){
    const {bucket,onCloseStart,onCloseEnd,close}=this.props;
    const {leftActions,rightActions} = genActions2(bucket);
    //console.log("row",close)
    return (
      <SwipeableRow4
        close={close}
        onCloseStart={()=>{
            const { onCloseStart }=this.props;
            //console.log("close start",this.target,rowData,this.props)
            onCloseStart(this.target)//,rowData,sectionID,rowID, highlightRow
          }}
        onCloseEnd={()=>{
            const { onCloseEnd }=this.props;
            //console.log("close end",this.target,this.props)
            onCloseEnd(this.target)//,rowData,sectionID,rowID, highlightRow
          }}
        renderLeftAction={(i, indexLock)=>{
            //i,indexLock->next bucket
            //const { left, icon, text, backgroundColor, target } = this.props
            //console.log("left",leftActions[i],indexLock)
            //don't update target when indexLock
            if(!indexLock && leftActions[i]){
              this.target=leftActions[i].target
            }
            return(
              <Action2 index={i} left={true}
              bucket={bucket}
              indexLock={indexLock}/>
            )
          }}
        renderRightAction={(i, indexLock)=>{
            //don't update target when indexLock
            //console.log("i,index:", i, indexLock)
            if(!indexLock && rightActions[i]){
              this.target=rightActions[i].target
            }
            return(<Action2 index={i} left={false}
                               bucket={bucket}
                               indexLock={indexLock}/>)
          }}
      >
              {this.props.children}
      </SwipeableRow4>
    )
  }
}

//for target bucket handling
class BookRow3 extends React.Component {
  constructor(props) {
    super(props);
    this.target=null;
  }
  render(){
    const {bucket,onCloseStart,onCloseEnd,close}=this.props;
    const {leftActions,rightActions} = genActions2(bucket);
    //console.log("row",close)
    return (
      <SwipeableRow5
        close={close}
        onCloseStart={()=>{
            const { onCloseStart }=this.props;
            //console.log("close start",this.target,rowData,this.props)
            onCloseStart(this.target)//,rowData,sectionID,rowID, highlightRow
          }}
        onCloseEnd={()=>{
            const { onCloseEnd }=this.props;
            //console.log("close end",this.target,this.props)
            onCloseEnd(this.target)//,rowData,sectionID,rowID, highlightRow
          }}
        renderLeftAction={(i, indexLock)=>{
            //i,indexLock->next bucket
            //const { left, icon, text, backgroundColor, target } = this.props
            //console.log("left",leftActions[i],indexLock)
            //don't update target when indexLock
            if(!indexLock && leftActions[i]){
              this.target=leftActions[i].target
            }
            return(
              <Action2 index={i} left={true}
              bucket={bucket}
              indexLock={indexLock}/>
            )
          }}
        renderRightAction={(i, indexLock)=>{
            //don't update target when indexLock
            //console.log("i,index:", i, indexLock)
            if(!indexLock && rightActions[i]){
              this.target=rightActions[i].target
            }
            return(<Action2 index={i} left={false}
                               bucket={bucket}
                               indexLock={indexLock}/>)
          }}
      >
              {this.props.children}
      </SwipeableRow5>
    )
  }
}

module.exports = { BookRow1,BookRow2,BookRow3 };
