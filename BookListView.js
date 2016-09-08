import React from 'react';

import {
  View,
  Text,
  ListView,
  ScrollView,
  findNodeHandle,
} from 'react-native';

function withItems(ListViewComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        getSectionHeaderData: (dataBlob, sectionID) =>
          dataBlob.sections[sectionID]
      });
    }
    render() {
      const { items, sectionIDs, rowIDs, ...other } = this.props;
      this.dataSource =
        this.dataSource.cloneWithRowsAndSections(items, sectionIDs, rowIDs);
      console.log('dataSource:',
                  this.dataSource.getRowCount(),
                  this.dataSource.getRowAndSectionCount(),
                  this.dataSource.getSectionLengths());
      return (
        <ListViewComponent
          dataSource={this.dataSource}
          {...other}
        />);
    }
  };
}

import util from 'util';
function debugRenderRow(rowData, sectionID, columnID) {
  console.log('row:', rowData, sectionID, columnID);
  return (<View style={{ height: 200, borderColor: columnID % 2 ? 'yellow' : 'green', borderWidth: 3 }}><Text>row:{columnID}:{util.inspect(rowData)}</Text></View>);
}

import { compose, mapProps, withState, toClass, withProps, withHandlers } from 'recompose';

// http://blog.koba04.com/post/2016/07/15/a-brief-note-of-reacteurope2016-sessions/
/* const enhance = compose(
 *   //toClass,
 *   //withItems
 *   withState(("dataSource","updateDataSource", new ListView.DataSource({
 *     rowHasChanged: (r1, r2) => r1 !== r2,
 *     sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
 *   }))),
 *   withProps(({items})=>
 *     ({dataSource:dataSource.cloneWithRowsAndSections(items)}))
 * )*/
const EnhancedListView = compose(
  withItems,
  /* withHandlers({
   *   onScroll: props => e => console.log("foo:",e.nativeEvent.contentOffset.y)
   * }),*/
  withHandlers({
    renderSectionHeader: props => (sectionData, sectionID) => {
      return sectionID.endsWith('_end') ?
             props.renderSectionFooter(sectionData, sectionID) :
             props.renderSectionHeader(sectionData, sectionID);
    }
  }),
  //withState('sectionRefs','updateSectionRefs',{})
)(ListView);

class BookListView extends React.Component {
  scrollTo(...args) {
    return new Promise((resolve, reject) => {
      this.scrollview.scrollTo(...args);
      setTimeout(() => resolve(), 100); // TODO:onScrollEndAnimation
    });
  }
  scrollToSectionHeader(sectionID) {
    // console.log("liked3",this)//211
    return new Promise((resolve, reject) => {
      return resolve([sectionID, 0]);
      console.log("sec:", this)
      this.sections[sectionID]
          .measureLayout(
            findNodeHandle(this.scrollview),
            (x, y) => {
              // console.log("liked4",x,y)//211
              this.scrollview.scrollTo({ x: 0, y, animated: true });
              setTimeout(() => resolve([sectionID, y]), 100);
              // TODO:onScrollEndAnimation
            });
    });
  }
  render() {
    this.sections = this.sections || {};
    return (<EnhancedListView
      {...this.props}
      renderScrollComponent={props =>
        <ScrollView
          ref={c => this.scrollview = c}
          {...props}
          />}
      renderSectionHeader={(sectionData, sectionID) =>
        <View
          ref={c => {
              this.sections[sectionID] = c;
            }}
          >
               {this.props.renderSectionHeader(sectionData, sectionID)}
        </View>}
    />);
  }
}
BookListView.propTypes = {
  // ...ListView.DataSource.propTypes
  items: React.PropTypes.object.isRequired,
  ...ListView.propTypes,
  dataSource: React.PropTypes.instanceOf(ListView.DataSource),
  renderSectionFooter: React.PropTypes.func.isRequired
};
BookListView.defaultProps = { ...ListView.defaultProps };
// BookListView.propTypes = { initialCount: React.PropTypes.number };

// Dumb compo
class ListViewWithFilter extends React.Component {
  render() {
    const { limit, items, selectedSection, ...other } = this.props;
    // function ListViewWithFilter({ limit, items, selectedSection, ...other }) {
    console.log('ListViewWithFilter', this.props);
    const sectionIDs =
    selectedSection ?
    [selectedSection, `${selectedSection}_end`] :
    Object.keys(items);
  // Object.keys(items).filter(key => key !== "search_end")
    console.log('sec:', sectionIDs);

    const rowIDs =
    selectedSection ?
    undefined :
    sectionIDs.map(sectionID =>
      Object.keys(items[sectionID]).slice(0, limit || undefined));
    console.log('row:', rowIDs);

    return (
      // ListViewWithFooter
      <ListView
        ref="root"
        items={items}
        rowIDs={rowIDs}
        sectionIDs={sectionIDs}
        enableEmptySections
        {...other}
      />);
  }
}

class BookListView0 extends React.Component {
  constructor(props) {
    super(props);
    this.sec = {};
    this.state = {
      selectedSection: this.props.selectedSection,
      items: this.props.items,
      limit: this.props.limit
    };
  }
  // another component?
  scrollToSectionHeader(sectionID, animated) {
    // console.log("scroll");
    return new Promise((resolve, reject) => {
      console.log('sec:', this.sec, sectionID);
      this.sec[sectionID]
          .measureLayout(
            findNodeHandle(this.listview),
            (x, y) => {
              console.log('liked4', x, y);// 211
              this.listview.scrollTo({ x: 0, y, animated: true });
              setTimeout(() => resolve(), 200); // TODO:onScrollEndAnimation
            });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSection !== this.props.selectedSection) {
      if (this.props.selectedSection === null) {
        this.scrollToSectionHeader(nextProps.selectedSection)
          .then(() => this.setState(nextProps));
      } else {
        current = this.props.selectedSection;
        this.setState({ ...nextProps, contentOffset: { x: 0, y: 211 } }, () => {
          // scroll to previous scroll position
          /* setTimeout(()=>
           *   this.scrollToSectionHeader(current))*/
        });
      }
    }
  }
  render() {
    const { renderSectionHeader, ...other } = this.props;
    return (
      // TODO:move key to listview with filter
      // SmartListView
      <ListViewWithFilter
        ref={(listview) => this.listview = listview}
        {...other}
        key={this.state.selectedSection}
        selectedSection={this.state.selectedSection}
        items={this.state.items}
        limit={this.state.limit}
        contentOffset={this.state.contentOffset || { x: 0, y: 0 }}
        renderSectionHeader={(sectionData, sectionID) => {
          return (
              <View ref={(sec) => this.sec[sectionID] = sec}>
                        {renderSectionHeader(sectionData, sectionID)}
              </View>
            );
        }}
      />
    );
  }
}

module.exports = { BookListView };
