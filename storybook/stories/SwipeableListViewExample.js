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

class TestListView2 extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    //this.data = [{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}];
    this.data = {"a":"a", "b":"b" ,"c":"c"};
    this.state = {
      ds: ds.cloneWithRows(this.data)
    };
  }
  
  updateDataSource(){
    /* this.setState(
     *   {ds:this.state.ds.cloneWithRows(
     *     this.data.reduce((acc,elem)=>{
     *       acc[elem.key] = elem
     *       return acc
     *     },{})
     *   )})//return acc*/
    this.setState(
      {ds:this.state.ds.cloneWithRows(this.data
      )})
  }
  render(){
    //console.log(this.state.ds._dataBlob.s1)
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              //replace
              //[head,...this.data]= this.data
              const i = Math.random()
              const s1 = {...this.data}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data={[`r${i}`]:`r${i}`,...s1}
              this.updateDataSource()
            }}>
          pressMe
        </Text>
        <SwipeableListView
          ref={ c => this.listview=c }
          style={{paddingTop:20}}
          generateActions={()=>genActions2('search')}
          dataSource={this.state.ds}
          onSwipeEnd={({rowData,rowID,action}) =>{
              //close animation
              //updata datasource(remove)
              //open animation
              //updata datasource(add)

              //onSwipeEnd={({gestureState,action}) =>{
              //console.log("gs",gestureState,action)
              //console.log("gs",obj)
              //this.layoutable[sectionID][rowID].close()
              //.then(()=>{
              //this.layoutable
              console.log("start swipeEnd",rowID)
              const s1 = {...this.data}
              delete s1[rowID]
              this.data = s1
              /* this.data = 
              this.data
              .filter((elem)=>
              elem.key !== rowID) */
              //elem.key.toString() !== rowID)
              console.log("middle swipeEnd",this.data)
              //this.updateDataSource()
              this.data=[{key:rowID,data:rowData.data},...this.data]
              this.updateDataSource()
              
              console.log("fin swipeEnd")
                       //})
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
              <LayoutableView>
                      {debugView("row")(rowData,rowID,sectionID)}
              </LayoutableView>
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
  .add('with TestListView2', () =>
    <TestListView2/>
  )

