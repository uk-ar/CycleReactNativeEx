import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ListView,
  ScrollView,
  LayoutAnimation
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';
import util from 'util'

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookCell} from '../../BookCell';
import {BookRow1} from '../../BookRow';
import {genActions2,Action} from '../../Action';
import {BookListView} from '../../BookListView';
import {LayoutableView} from '../../Closeable';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

import {withDebug,VerticalCenterView,TestListView,debugView} from './common'

class TestListView3 extends React.Component {
//swipe and reoder
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.dataBlob = {
      foo:[{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"},
           {key:"d",data:"e"}, {key:"ea",data:"fe"},{key:"ef",data:"ee"}],
      bar:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"},
           {key:"ef",data:"efe"}, {key:"eaq",data:"fe"},{key:"ef",data:"ee"}]
    }
    this.sectionIdentities = ["foo","bar"]
    this.state = {
      ds: ds.cloneWithRowsAndSections(this.dataBlob,this.sectionIdentities)
    }
  }
  render(){
    //console.log(this.state.ds._dataBlob.s1)
    const dataSource = this.state.ds
    console.log("ds:",dataSource.getRowCount(),
                dataSource.getRowAndSectionCount(),
                dataSource.getSectionLengths(),
                dataSource.getRowData(0,0),
                dataSource.getRowData(1,0)
      
    );

    let obj={};
    let sectionLengths=dataSource.getSectionLengths()
    //sectionLengths.map((i)=>)
    /* for(let i = 0;i<sectionLengths.length;i++){
     *   
     * }*/
    console.log(obj)  
    for(let i = 0;i<dataSource.getRowCount();i++){
      //dataSource.getSectionLengths()
      console.log("fo",i,
                  //dataSource.getSectionHeaderData(i),
                  dataSource.getRowIDForFlatIndex(i),
                  dataSource.getSectionIDForFlatIndex(i));
      const sectionID = dataSource.getSectionIDForFlatIndex(i)
      const rowID = dataSource.getRowIDForFlatIndex(i)
      
      obj[sectionID] = obj[sectionID] || []
      
      //obj[sectionID]=dataSource.getSectionHeaderData(sectionID)
        //"a"//dataSource.getRowData(sectionID,rowID)
                                                              
                                                 }
                     console.log(obj)

    return(
      <View
        style={{flex:1,paddingTop:20}}>        
        <BookListView
          ref={c=> this.listview = c}
          style={{paddingTop:20}}
          generateActions={()=>genActions2('search')}
          dataSource={this.state.ds}
          renderRow={(rowData,rowID,sectionID) =>
            <LayoutableView>
                    {debugView("row")(rowData,rowID,sectionID)}
            </LayoutableView>
                    }
          renderSectionHeader={(sectionData, sectionID)=>
            <Text key={sectionID}
          onPress={()=>{
              if(this.sectionIdentities.length==2){
                this.sectionIdentities = [sectionID]
              }else{
                this.sectionIdentities = ["foo","bar"]
              }
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
              this.setState(
                {ds:this.state.ds.cloneWithRowsAndSections(
                  this.dataBlob,this.sectionIdentities)},
                ()=>{
                  this.listview.scrollToSectionHeader(sectionID)
                }
              )
            }}>
                  press me
            </Text>
                              }
        />
      </View>
    )
  }
}
class TestListView2 extends React.Component {
  //swipe and reoder
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
    this.data = [{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}];
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRows(
        this.data.reduce((acc,elem)=>{
          acc[elem.key] = elem.data
          return acc
        },{})
      )})//return acc
  }
  componentWillMount(){
    this.updateDataSource();
  }
  render(){
    //console.log(this.state.ds._dataBlob.s1)
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              [head,...this.data]= this.data
              const i = Math.random()
              this.data.push({key:i,data:`${i}`})
              this.updateDataSource()
            }}>
          pressMe
        </Text>
        <BookListView
          style={{paddingTop:20}}
          generateActions={()=>genActions2('search')}
          dataSource={this.state.ds}
          onRelease={(rowData,rowID,action)=>{
              //rowID is string
              this.data =
                this.data 
                    .filter((elem)=>
                      elem.key.toString() !== rowID)
              //console.log("td:", this.data, rowID)
              this.updateDataSource()

              this.data.push({key:rowID,data:rowData})
              //console.log("td:",this.data)
              this.updateDataSource()
            }}
          renderRow={(rowData,rowID,sectionID) =>
            <LayoutableView>
                    {debugView("row")(rowData,rowID,sectionID)}
            </LayoutableView>
                    }
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

storiesOf('BookListView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with book', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <BookListView
        style={{paddingTop:20,backgroundColor:"blue"}}
        generateActions={()=>genActions2('search')}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        renderRow={(rowData) => <Text>row:{rowData}</Text>}
        renderSectionHeader={(rowData) => <Text>sec:{rowData}</Text>}
      />
    )
  })
  .add('with callback', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <BookListView
        style={{paddingTop:20}}
        generateActions={()=>genActions2('search')}
        dataSource={ds.cloneWithRows(
            {a:{title:'row 1',isbn:'123'},
             b:{title:'row 2',isbn:'456'}
            })}
        onRelease={action('onRelease')}
      renderRow={(rowData,rowID,sectionID) =>
        <Text>foo</Text>
          }
        renderSectionHeader={debugView("head")}
      />
    )
  })
  .add('with add row', () => {
    return(
      <TestListView>
        {(dataSource)=>
          <BookListView
            style={{paddingTop:20}}
            generateActions={()=>genActions2('search')}
            dataSource={dataSource}
            onRelease={action('onRelease')}
            renderRow={(rowData,rowID,sectionID) =>
                <LayoutableView>
                          {debugView("row")(rowData,rowID,sectionID)}
                </LayoutableView>
                      }
            renderSectionHeader={debugView("head")}
          />
        }
      </TestListView>
    )
  })
  .add('with class', () => {
    return(<TestListView2 />)
  })
  .add('with class2', () => {
    return(<TestListView3 />)
  })
