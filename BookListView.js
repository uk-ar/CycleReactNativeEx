import React from 'react';

import {
  View,
  Text,
  ListView,
  findNodeHandle,
} from 'react-native';

/* if(this.listview && this.props.){
   this.listview.scrollTo({y:this.props.offset,animated:false})
   } */
/* getScrollResponder() {
   return this.listview.getScrollResponder();
   },*/
function withItems(Component) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });
    }
    render() {
      const { items, sectionIDs, rowIDs, ...other } = this.props;
      this.dataSource =
        this.dataSource.cloneWithRowsAndSections(items, sectionIDs, rowIDs);
      //this.refs.listview.scrollTo(10,20,true)
      console.log("ref",this.refs.listview)
      return (
        // onResponderMove is too premitive
        // directionalLockEnabled disables horizontal scroll when scroll vertically
        // https://github.com/facebook/react-native/issues/6764
        <Component
          ref={(c)=>c.scrollTo({x:0,y:50,animated:true})}
          directionalLockEnabled
          dataSource={this.dataSource}
          {...other}
        />)
      //return <Component {...this.props}>
    }
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
  scrollTo(arg){
    console.log("scrolledto")
    this.refs.root.scrollTo(arg)//{x,y,animated}
  }
  getScrollResponder(arg){
    return this.refs.root.getScrollResponder(arg)//{x,y,animated}
  }
  render() {
    // https://github.com/babel/babel-eslint/issues/95#issuecomment-102170872
    const { items, sectionIDs, rowIDs, ...other } = this.props;
    this.dataSource =
      this.dataSource.cloneWithRowsAndSections(items, sectionIDs, rowIDs);
    //this.refs.listview.scrollTo(10,20,true)
    console.log("ref",this.refs.listview)
    return (
      // onResponderMove is too premitive
      // directionalLockEnabled disables horizontal scroll when scroll vertically
      // https://github.com/facebook/react-native/issues/6764
      <ListView
        ref="root"
        directionalLockEnabled
        dataSource={this.dataSource}
        {...other}
      />
    );
  }
}

import util from 'util';
function debugRenderRow(rowData,sectionID,columnID){
  console.log("row:",rowData,sectionID,columnID)
  return(<View style={{height:400,borderColor:columnID % 2 ? "yellow": "green",borderWidth:3}}><Text>row:{util.inspect(rowData)}</Text></View>)
}

class InfSmartListView extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      dataSource:this.dataSource
        .cloneWithRows([{a:1},{a:2},{a:3},{a:4},{a:5},{a:6}])
    }
  }
  render() {
    const { items, sectionIDs, rowIDs, i, ...other } = this.props;
    console.log("smart")
    //dataSource={this.state.dataSource}
    return (
      <ListView
        dataSource={this.dataSource.cloneWithRows(Array(3).fill(i))}
        renderRow={debugRenderRow}
        onEndReached={()=>{
            console.log("end");
            this.setState({
              dataSource:this
                .state.dataSource
                .cloneWithRows([{a:1,b:2},{a:2},{a:3},{a:4},{a:5},{a:6},{a:7}])
            })}}
      />
    );
  }
}

function ListViewWithFooter({
  renderSectionHeader, renderSectionFooter, ...smartProps }) {
  return (
    <SmartListView
      renderSectionHeader={(sectionData, sectionID) => {
        //console.log("with:",sectionData, sectionID)
          return sectionID.endsWith('_end') ?
                 renderSectionFooter(sectionData, sectionID) :
                 renderSectionHeader(sectionData, sectionID);
        }}
      {...smartProps}
    />
  );
}

// Dumb compo
function ListViewWithFilter({ limit, items, selectedSection, ...other }) {
  const sectionIDs =
    selectedSection ?
    [selectedSection, `${selectedSection}_end`] :
    Object.keys(items);
  // Object.keys(items).filter(key => key !== "search_end")
  //console.log("sec:",sectionIDs);

  const rowIDs =
    selectedSection ?
    undefined :
    sectionIDs.map(sectionID =>
      Object.keys(items[sectionID]).slice(0, limit));
  //console.log("row:",rowIDs);

  return (
    <ListViewWithFooter
      items={items}
      rowIDs={rowIDs}
      sectionIDs={sectionIDs}
      enableEmptySections
      {...other}
    />);
}

class BookListView0 extends React.Component {
  constructor(props) {
    super(props);
    //this.state = { animating: false }
    this.sec = {}
  }
  componentWillReceiveProps(nextProps){
    //selectedSection:
    //null -> selectedSection
    //scroll then rerender
    //selectedSection -> null
    // rerender with offset
  }
  render() {
    const {renderSectionHeader, ...other} = this.props
    return (
      <View style={{flex:1}}>
        <Text
          style={{ color: 'white' }}
          onPress={() => {
              console.log("toggle",this,this.sec.liked);
              this.sec.liked
                  .measureLayout(
                    findNodeHandle(this.refs.listview),
                    (x,y) => {
                      //console.log("liked4",args)
                      this.refs.listview.scrollTo({x:x,y:y,animated:true});
                    });
            }}
        >
          {'toggle'}
        </Text>
        <SmartListView
          ref="listview"
          {...other}
          renderSectionHeader={(sectionData ,sectionID) => {
              return (
                <View ref={(sec) => this.sec[sectionID] = sec}>
                    {renderSectionHeader(sectionData ,sectionID)}
                </View>
              )
            }}
        />
      </View>
    );
  }
}

class BookListView extends React.Component {
  constructor(props) {
    super(props);
    this.sec   = {}
    this.state = { selectedSection: this.props.selectedSection }
  }
  // another component?
  scrollToSectionHeader(sectionID){
    //console.log("scroll");
    return new Promise((resolve, reject) => {
      this.sec[sectionID]
          .measureLayout(
            findNodeHandle(this.refs.listview),
            (x,y) => {
              //console.log("liked4",args)
              this.refs.listview.scrollTo({x:0, y:y, animated:true});
              setTimeout(() => resolve(), 200) //TODO:onScrollEndAnimation
            });
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.selectedSection!==this.props.selectedSection){
      this.scrollToSectionHeader(nextProps.selectedSection)
          .then(()=>this.setState(
            {selectedSection: nextProps.selectedSection}));
    }
  }
  render() {
    const {renderSectionHeader, ...other} = this.props
    return (
      //TODO:move key to listview with filter
      //SmartListView
      <SmartListView
        ref="listview"
        {...other}
        key={ this.state.selectedSection }
        selectedSection={ this.state.selectedSection }
        renderSectionHeader={(sectionData ,sectionID) => {
            return (
              <View ref={(sec) => this.sec[sectionID] = sec}>
                        {renderSectionHeader(sectionData ,sectionID)}
              </View>
            )
          }}
      />
    );
  }
}

BookListView.propTypes = {
  selectedSection: React.PropTypes.string,
  limit: React.PropTypes.number,
  items: React.PropTypes.object.isRequired,
  renderRow: React.PropTypes.func.isRequired,
  renderSectionHeader: React.PropTypes.func.isRequired,
  renderSectionFooter: React.PropTypes.func.isRequired
};

module.exports = { BookListView,InfSmartListView,SmartListView,ListViewWithFooter };
