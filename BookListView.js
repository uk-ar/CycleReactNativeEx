import React from 'react';

import {
  ListView,
  Text,
  View,
} from 'react-native';

/* if(this.listview && this.props.){
   this.listview.scrollTo({y:this.props.offset,animated:false})
   } */
/* getScrollResponder() {
   return this.listview.getScrollResponder();
   },*/
import util from 'util';
function debugRenderRow(rowData,sectionID,columnID){
  console.log("row:",rowData,sectionID,columnID)
  return(<View style={{height:400,borderColor:columnID % 2 ? "yellow": "green",borderWidth:3}}><Text>row:{util.inspect(rowData)}</Text></View>)
}

// Smart compo
class InfSmartListView extends React.Component {
  constructor(props) {
    super(props);
    dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      dataSource:dataSource.cloneWithRows([{a:1},{a:2},{a:3},{a:4},{a:5},{a:6},{a:7},{a:8}])
    }
  }
  render() {
    const { items, sectionIDs, rowIDs, ...other } = this.props;
    console.log("smart")
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={debugRenderRow}
        onEndReached={()=>{
            console.log("end");
            this.setState({
              dataSource:this.state.dataSource.cloneWithRows([{a:1,b:1},{a:2,b:1},{a:3,b:1},{a:4,b:1},{a:5,b:1},{a:6,b:1},{a:7,b:1},{a:8,b:1},{a:9,b:1}])
            })}}
      />
    );
  }
}

// Smart compo
class SmartListView extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
  }
  render() {
    // https://github.com/babel/babel-eslint/issues/95#issuecomment-102170872
    const { items, sectionIDs, rowIDs, ...other } = this.props;
    this.dataSource =
      this.dataSource.cloneWithRowsAndSections(items, sectionIDs, rowIDs);
    return (
      // onResponderMove is too premitive
      // directionalLockEnabled disables horizontal scroll when scroll vertically
      // https://github.com/facebook/react-native/issues/6764
      <ListView
        directionalLockEnabled
        dataSource={this.dataSource}
        {...other}
      />
    );
  }
}

//TODO:interval timer
class InfBookListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: this.props.items}
  }
  render() {
    const { items, ...other } = this.props;
    return (
    <SmartListView
      {...other}
      items={this.state.items}
      onEndReachedThreshold={500}
      renderSectionHeader={null}
      onEndReached={()=>{
          this.setState({items: {...this.props.items,
                                 dummy:{"isbn-100":{title:"d1",isbn:100}}}})
          console.log("EEE")
        }}
    />)
  }
}

// Dumb compo
function BookListView({ limit, items, selectedSection, ...other }) {
  function ListViewWithFooter({
    renderSectionHeader, renderSectionFooter, ...smartProps }) {
    return (
      <SmartListView
        renderSectionHeader={(sectionData, sectionID) => {
          return sectionID.endsWith('_end') ?
                   renderSectionFooter(sectionData, sectionID) :
                   renderSectionHeader(sectionData, sectionID);
        }}
        {...smartProps}
      />
    );
  }

  const sectionIDs =
    selectedSection ?
    [selectedSection, `${selectedSection}_end`] :
    Object.keys(items);
  // Object.keys(items).filter(key => key !== "search_end")

  const rowIDs =
    selectedSection ?
    undefined :
    sectionIDs.map(sectionID =>
      Object.keys(items[sectionID]).slice(0, limit));

  return (
    <ListViewWithFooter
      items={items}
      enableEmptySections
      rowIDs={rowIDs}
      sectionIDs={sectionIDs}
      {...other}
    />);
}

BookListView.propTypes = {
  selectedSection: React.PropTypes.string,
  limit: React.PropTypes.number,
  items: React.PropTypes.object.isRequired,
  renderRow: React.PropTypes.func.isRequired,
  renderSectionHeader: React.PropTypes.func.isRequired,
  renderSectionFooter: React.PropTypes.func.isRequired
};

module.exports = { BookListView };
