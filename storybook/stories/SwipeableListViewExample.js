import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ListView,
  ScrollView
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookCell} from '../../BookCell';
import {genActions2,Action} from '../../Action';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

import {SwipeableListView} from '../../SwipeableListView';
import {LayoutableView} from '../../Closeable';

import {withDebug,VerticalCenterView,TestSectionListView,
        TestListView,debugView} from './common'

class TestSwipeableListView extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    })
    this.data = {"a":"a", "b":"b" ,"c":"c"};
    this.state = {
      ds: ds.cloneWithRows(this.data)
    };
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRows(this.data)})
  }
  render(){
    //console.log("s1",this.state.ds._dataBlob.s1)
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              //replace
              const i = Math.random()
              const s1 = {...this.data}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data={[`r${i}`]:`r${i}`,...s1}
              this.updateDataSource()
              console.log("td",this.data)
            }}>
          press to re-order(new & delete)
        </Text>
        <Text
          onPress={()=>{
              //delete
              const s1 = {...this.data}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data={...s1}
              this.updateDataSource()
            }}>
          press to remove last
        </Text>
        <SwipeableListView
          ref={ c => this.listview=c }
          style={{paddingTop:20}}
          generateActions={()=>genActions2('search')}
          dataSource={this.state.ds}
          onSwipeEnd={({rowData,sectionID,rowID,action,...rest}) =>{
              //console.log("re",{rowData,sectionID,rowID,action,...rest})
              if(action.target == null) { return }
              this.listview
                  .close(sectionID,rowID)
                  .then(()=>{
                    const s1 = {...this.data}
                    delete s1[rowID]
                    this.data = s1
                    this.setState({
                      ds:this.state.ds.cloneWithRows(this.data)},()=>
                        Promise.resolve()
                    )
                  })
                  .then(()=>{
                    this.data={ [rowID]:rowData, ...this.data }
                    this.setState({
                      ds:this.state.ds.cloneWithRows(this.data)})
                  })
            }}
          renderRow={(rowData,sectionID,rowID,highlightRow) => {
              return (debugView("row")(rowData,rowID,sectionID))
            }}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

class TestSectionSwipeableListView extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    })
    this.data = {s1:{"a":"a"},
                 s2:{"a":"a"}};
    /* this.data = {s1:{"a":"a", "b":"b" ,"c":"c"},
     *              s2:{"a":"a", "b":"b" ,"c":"c"}};*/
    this.state = {
      ds: ds.cloneWithRowsAndSections(this.data)
    };
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRowsAndSections(this.data)})
  }
  render(){
    //console.log("s1",this.state.ds._dataBlob.s1)
    return(
      <View
        style={{paddingTop:20}}>
        <Text
          onPress={()=>{
              //replace
              const i = Math.random()
              const s1 = {...this.data}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data={[`r${i}`]:`r${i}`,...s1}
              this.updateDataSource()
              console.log("td",this.data)
            }}>
          press to re-order(new & delete)
        </Text>
        <Text
          onPress={()=>{
              //delete
              this.listview.close("s1","a")
              /* const s1 = {...this.data.s1}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data = {...this.data, s1 }
              this.updateDataSource() */
            }}>
          press to remove last
        </Text>
        <SwipeableListView
          ref={ c => this.listview=c }
          style={{paddingTop:20,borderColor:"red",borderWidth:3}}
          generateActions={()=>genActions2('search')}
          dataSource={this.state.ds}
          onSwipeEnd={({rowData,sectionID,rowID,action,...rest}) =>{
              //console.log("re",{rowData,sectionID,rowID,action,...rest})
              if(action.target == null) { return }
              this.listview
                  .close(sectionID,rowID)
                  .then(()=>{
                    const s1 = {...this.data}
                    delete s1[rowID]
                    this.data = s1
                    this.setState({
                      ds:this.state.ds.cloneWithRowsAndSections(this.data)},()=>
                        Promise.resolve()
                    )
                  })
                  .then(()=>{
                    this.data={ [rowID]:rowData, ...this.data }
                    this.setState({
                      ds:this.state.ds.cloneWithRowsAndSections(this.data)})
                  })
            }}
          renderRow={(rowData,sectionID,rowID,highlightRow) => {
              return (debugView("row")(rowData,rowID,sectionID))
            }}
          renderSectionHeader={debugView("head")}
        />
        <Text>
          end of listview
        </Text>
      </View>
    )
  }
}

storiesOf('SwipeableListView', module)
/* .addDecorator(getStory => (
 *   <CenterView>{getStory()}</CenterView>
 * ))*/
  .add('with listview', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        style={{paddingTop:20}}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    )
  })
  .add('with book', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <SwipeableListView
        style={{paddingTop:20}}
        generateActions={()=>genActions2('search')}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    )
  })
  .add('with callback', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <SwipeableListView
        style={{paddingTop:20}}
        generateActions={()=>genActions2('search')}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        onSwipeEnd={action('swipeEnd')}
        onSwipeStart={action('swipeStart')}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    )
  })
  .add('with add row', () => {
    return(
      <TestListView>
        {(dataSource)=>
          <SwipeableListView
            style={{paddingTop:20,flex:1}}
            generateActions={()=>genActions2('search')}
            dataSource={dataSource}
            renderRow={(rowData,rowID,sectionID) =>
              debugView("row")(rowData,rowID,sectionID)
                      }
            renderSectionHeader={(sectionData,sectionID) =>
              //workround for android
              <View style={{height:1}}/>
              //debugView("section")(sectionData,sectionID)
              //null
                                }
          />
        }
      </TestListView>
    )
  })
  .add('with Normal listview add row', () => {
    return(
      <TestListView>
        {(dataSource)=>
          <ListView
            style={{paddingTop:20,flex:1}}
            dataSource={dataSource}
            renderRow={(rowData,rowID,sectionID) =>
              <LayoutableView>
                <View>
                      {debugView("row")(rowData,rowID,sectionID)}
                </View>
              </LayoutableView>
                      }
          />
        }
      </TestListView>
    )
  })
  .add('with Normal listview section add row', () => {
    return(
      <TestSectionListView>
        {(dataSource)=>
          <ListView
            style={{paddingTop:20,flex:1}}
            dataSource={dataSource}
            renderRow={(rowData,rowID,sectionID) =>
                <View>
                      {debugView("row")(rowData,rowID,sectionID)}
                </View>
                      }
            renderSectionHeader={(sectionData,sectionID) =>
              debugView("section")(sectionData,sectionID)
                                }
          />
        }
      </TestSectionListView>
    )
  })
  .add('with section add row', () => {
    return(
      <TestSectionListView>
        {(dataSource)=>
          <SwipeableListView
            generateActions={()=>genActions2('search')}
            style={{paddingTop:20,flex:1}}
            dataSource={dataSource}
            renderRow={(rowData,rowID,sectionID) =>
              debugView("row")(rowData,rowID,sectionID)
                      }
            renderSectionHeader={(sectionData,sectionID) =>
              debugView("section")(sectionData,sectionID)
                         }
          />
        }
      </TestSectionListView>
    )
  })
  .add('with TestSwipeableListView', () =>
    <TestSwipeableListView/>
  )
  .add('with TestSectionSwipeableListView', () =>
    <TestSectionSwipeableListView/>
  )
