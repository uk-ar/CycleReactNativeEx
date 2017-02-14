import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ListView,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Dimensions,
  Easing,
  InteractionManager,
  findNodeHandle,
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';
import util from 'util'
import _ from 'lodash'
//import {hello} from 'react-native-stylish'
import materialColor from 'material-colors';
import emptyFunction from 'fbjs/lib/emptyFunction';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookCell} from '../../BookCell';
import {BookRow1} from '../../BookRow';
import {genActions2,Action,Action2,Action3} from '../../Action';
import {BookListView1,BookListView2,BooksDataSource} from '../../BookListView';
import { LayoutableView, CloseableView, CloseableView2 } from '../../Closeable';
import {SwipeableButtons2,SwipeableActions,SwipeableRow4,SwipeableRow3} from '../../SwipeableRow';
import {SwipeableListView} from '../../SwipeableListView';

import {
  ToggleableView,withDebug,VerticalCenterView,TestListView,TestSectionListView,debugView,DebugView2,
} from './common'
import { ItemsHeader, ItemsFooter } from '../../Header';
class NestedListViewDataSource {
  constructor(params: Object) {
    this._dataSource = new ListView.DataSource(params);
  }
  cloneWithRowsAndSections(
    dataBlob: any,
    sectionIdentities: ?Array<string>,
    rowIdentities: ?Array<Array<string>>
  ): SwipeableListViewDataSource {
    this._dataSource = this._dataSource.cloneWithRowsAndSections(
      Object.keys(dataBlob)
            .reduce((acc,key) => {
              acc[key] = [dataBlob[key]]
              return acc;
            },{}),
      sectionIdentities,
      rowIdentities
    );
    //this._dataBlob = dataBlob;

    return this;
  }
  getDataSource(): ListViewDataSource {
    return this._dataSource;
  }
}
class NestedListView extends React.Component {
  //Nested ListView
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.dataBlob = {
      foo:[[{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}]],
      bar:[[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}]],
      baz:[[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}]]
    }
    this.state = {
      ds:  ds,
      foo: ds,
      bar: ds,
      baz: ds,
    }
  }
  componentWillMount(){
    this.updateDataSource()
  }
  updateDataSource(){
    this.setState({
      ds:  this.state.ds.cloneWithRowsAndSections(this.dataBlob),
      foo: this.state.foo.cloneWithRows(this.dataBlob.foo[0]),
      bar: this.state.bar.cloneWithRows(this.dataBlob.bar[0]),
      baz: this.state.baz.cloneWithRows(this.dataBlob.baz[0]),
    })
  }
  render(){
    const dataSource = this.state.ds
    const i = Math.random()
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              let next = this.dataBlob.foo[0]
              const i = Math.random()
              this.dataBlob = {
                foo:[[{key:i,data:`${i}`},...next]],
                bar:[[...this.dataBlob.bar[0]]],
                baz:[[...this.dataBlob.baz[0]]],
              }
              this.updateDataSource()
            }}>
          pressMe
        </Text>
        <ListView
          removeClippedSubviews={false}
          ref={c=> this.listview = c}
          dataSource={this.state.ds}
          renderRow={(rowData,sectionID,rowID) =>{
              console.log("rerend1",rowData,sectionID,rowID)
              //dynamic height cannot works
              //                    style={{maxHeight:200}}
              const i = Math.random();
              let next = this.dataBlob[sectionID][0].slice();
              return(
                <SwipeableListView
                    style={{height:200}}
                    generateActions={()=>genActions2('search')}
                    scrollEnabled={false}
               dataSource={
                 this.state[sectionID]
                     .cloneWithRows(
                       this.dataBlob[sectionID][0].reduce((acc,elem)=>{
                         acc[elem.key] = elem.data
                         return acc
                       },{})
                     )}
                    renderRow={(rowData,sectionID,rowID) =>{
                        return (
                          <LayoutableView key={rowID}>
                              {debugView("row")(rowData,sectionID,rowID)}
                          </LayoutableView>
                        )
                      }}
            />)}}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

class NestedListView2 extends React.Component {
  //Nested ListView
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.dataBlob = {
      foo:[{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}],
      bar:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}],
      baz:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}]
    }
    //this.sectionIdentities = ["foo","bar"]
    this.state = {
      ds:  ds
    }
  }
  componentWillMount(){
    this.updateDataSource()
  }
  updateDataSource(){
    this.setState({
      ds:  this.state.ds.cloneWithRowsAndSections(this.dataBlob)
    })
  }
  render(){
    //console.log(this.state.ds._dataBlob.s1)
    //console.log("this.rerender")
    const dataSource = this.state.ds
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              //console.log("onPress",this.state)
              let next = this.dataBlob.foo
              const i = Math.random()
              this.dataBlob = {
                foo:[...next,{key:i,data:`${i}`}],
                bar:this.dataBlob.bar,
                baz:this.dataBlob.baz,
              }
              this.updateDataSource()
              /* [head,...this.data]= this.data
                 const i = Math.random()
                 this.data=[{key:i,data:`${i}`},...this.data]
                 this.updateDataSource() */
            }}>
          pressMe
        </Text>
        <ListView
          ref={c=> this.listview = c}
          style={{paddingTop:20}}
          dataSource={this.state.ds}
          renderRow={(rowData,sectionID,rowID) =>{
              //console.log("rerend1")
              /* renderRow={(rowData,rowID,sectionID) => null
                 //return{debugView("row")(rowData,rowID,sectionID)}
                 } */
              //dynamic height cannot works
              //                    style={{height:200}}
              return debugView("row")(rowData,sectionID,rowID)
              /* return(
              <SwipeableListView
              generateActions={()=>genActions2('search')}
              scrollEnabled={false}
              dataSource={
              this.state[sectionID]
              .cloneWithRows(this.dataBlob[sectionID][0])}
              renderRow={(rowData,sectionID,rowID) =>{
              //console.log("rerend2",rowData,sectionID,rowID)
              return debugView("row")(rowData,sectionID,rowID)
              }}
              />) */
            }}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

class NestedListView3 extends React.Component {
  //NestedListViewDataSource
  constructor(props) {
    super(props);
    const ds = new NestedListViewDataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    const ds2 = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.dataBlob = {
      foo:[{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}],
      bar:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}],
      baz:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}]
    }
    this.state = {
      ds:  ds,
      foo: ds2,
      bar: ds2,
      baz: ds2,
    }
  }
  componentWillMount(){
    this.updateDataSource()
  }
  updateDataSource(){
    this.setState({
      ds:  this.state.ds.cloneWithRowsAndSections(this.dataBlob),
      foo: this.state.foo.cloneWithRows(this.dataBlob.foo),
      bar: this.state.bar.cloneWithRows(this.dataBlob.bar),
      baz: this.state.baz.cloneWithRows(this.dataBlob.baz),
    })
  }
  render(){
    const dataSource = this.state.ds
    const i = Math.random()
    return(
      <View
        style={{paddingTop:20}}>
        <Text
          onPress={()=>{
              const i = Math.random()
              this.dataBlob = {
                foo:[{key:i,data:`${i}`},...this.dataBlob.foo],
                bar:[...this.dataBlob.bar],
                baz:[...this.dataBlob.baz],
              }
              this.updateDataSource()
            }}>
          press to add
        </Text>
        <ListView
          removeClippedSubviews={false}
          ref={c=> this.listview = c}
          dataSource={this.state.ds.getDataSource()}
          renderRow={(rowData,sectionID,rowID) =>{
              //console.log("rerend1",rowData,sectionID,rowID)
              //dynamic height cannot works
              //                    style={{maxHeight:200}}
              //const i = Math.random();
              return(
                <SwipeableListView
                    style={{height:200}}
                    generateActions={()=>genActions2('search')}
                    scrollEnabled={false}
                    dataSource={
                      this.state[sectionID]
                          .cloneWithRows(
                            //this.dataBlob[sectionID]
                            this.dataBlob[sectionID].reduce((acc,elem)=>{
                              acc[elem.key] = elem.data
                              return acc
                            },{})
                          )
                               }
                    renderRow={(rowData,sectionID,rowID) =>{
                        return (
                          <LayoutableView key={rowID}>
                             {debugView("row")(rowData,sectionID,rowID)}
                          </LayoutableView>
                        )
                      }}
                                              />)}}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

class TestListView4 extends React.Component {
  //with section & transition
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.dataBlob = {
      foo:{a:"a", b:"b",c:"c"},
      bar:{d:"d", e:"e",f:"f"}
    }
    this.state = {ds}
  }
  componentWillMount(){
    this.updateDataSource()
  }
  updateDataSource(){
    const newDS = this.state.ds.cloneWithRowsAndSections(this.dataBlob)
    console.log("nds",this.state.ds.rowIdentities[0],newDS.rowIdentities[0])
    /* console.log("removed",
     *             _.difference(this.state.ds.rowIdentities[0],newDS.rowIdentities[0]),
     *             newDS)
     * console.log("added",
     *             _.difference(newDS.rowIdentities[0],this.state.ds.rowIdentities[0]))*/
    this.setState({ds:newDS})
  }
  render(){
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              const i = Math.random()
              this.dataBlob = {
                foo:{[i]:`${i}`,...this.dataBlob.foo},
                bar:this.dataBlob.bar
              }
              this.updateDataSource()
            }}>
          pressMe
        </Text>
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
          renderSectionHeader={ (sectionData,sectionID)=>
            debugView("header")(sectionData,sectionID)
                              }
        />
      </View>
    )
  }
}

class MultipleListView extends React.Component {
  //Nested ListView
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.dataBlob = {
      foo:[{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}],
      bar:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}],
      baz:[{key:"d",data:"d"}, {key:"e",data:"e"},{key:"f",data:"f"}]
    }
    this.state = {
      foo: ds,
      bar: ds,
      baz: ds,
    }
  }
  componentWillMount(){
    this.updateDataSource()
  }
  updateDataSource(){
    this.setState({
      //ds:  this.state.ds.cloneWithRowsAndSections(this.dataBlob),
      foo: this.state.foo.cloneWithRowsAndSections(this.dataBlob.foo),
      bar: this.state.bar.cloneWithRowsAndSections(this.dataBlob.bar),
      baz: this.state.baz.cloneWithRowsAndSections(this.dataBlob.baz),
    })
  }
  render(){
    const dataSource = this.state.ds
    const i = Math.random()
    return(
      <ScrollView
        style={{flex:1,paddingTop:20}}>
        <Text
          onPress={()=>{
              let next = this.dataBlob.foo[0]
              const i = Math.random()
              this.dataBlob = {
                foo:[[{key:i,data:`${i}`},...next]],
                bar:[[...this.dataBlob.bar[0]]],
                baz:[[...this.dataBlob.baz[0]]],
              }
              this.updateDataSource()
            }}>
          pressMe
        </Text>
        {["foo","bar","baz"].map((elem)=>
          <ListView
            style={{height:200}}
            dataSource={this.state[elem]}
            renderRow={debugView("head")}
            renderHeader={debugView("head")}
            renderSectionHeader={debugView("section head")}
          />
         )}
      </ScrollView>
    )//
  }
}

class TestListView3 extends React.Component {
  //section version swipe and reoder
  //select section
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
    let obj={};
    console.log("ds:",dataSource.getRowCount(),//12
    )
    const count=dataSource.getRowCount()
    console.log("keys:",
                dataSource.getSectionLengths(),
                count,
                dataSource.getSectionHeaderData(0))
    //[...Array(count).keys()]//.map(i=>console.log(i))
    //const a=Array.from(Array(3).keys())
    /* Array.from(Array(count).keys()).map(i=>
     *   console.log(dataSource.getRowIDForFlatIndex(i)))*/

    //console.log("keys:",a)
                          //
    /*             dataSource.getRowAndSectionCount(),
     *             dataSource.getSectionLengths(),
     *             dataSource.getRowData(0,0),
     *             dataSource.getRowData(1,0)

     * );

     * let sectionLengths=dataSource.getSectionLengths()*/
    //sectionLengths.map((i)=>)
    /* for(let i = 0;i<sectionLengths.length;i++){
     *
     * }*/
    console.log(obj)
    for(let i = 0;i<dataSource.getRowCount();i++){
      //dataSource.getSectionLengths()
      /* console.log("fo",i,
      //dataSource.getSectionHeaderData(i),
      dataSource.getRowIDForFlatIndex(i),
      dataSource.getSectionIDForFlatIndex(i));
      const sectionID = dataSource.getSectionIDForFlatIndex(i)
      const rowID = dataSource.getRowIDForFlatIndex(i)

      obj[sectionID] = obj[sectionID] || [] */

      //obj[sectionID]=dataSource.getSectionHeaderData(sectionID)
      //"a"//dataSource.getRowData(sectionID,rowID)
      //http://qiita.com/taizo/items/bab2db414e83d11b18f8
      //http://e10s.hateblo.jp/entry/20070526/1180173036
      //https://github.com/facebook/react/blob/master/src/addons/transitions/ReactTransitionGroup.js
      //https://github.com/facebook/react-native/blob/master/Libraries/CustomComponents/ListView/ListViewDataSource.js
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
  // press to replace
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
    this.data = [{key:"a",data:"a"}, {key:"b",data:"b"},{key:"c",data:"c"}];
    this.layoutable = []
  }
  updateDataSource(){
    this.setState(
      {ds:this.state.ds.cloneWithRows(
        this.data.reduce((acc,elem)=>{
          acc[elem.key] = elem
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
              //replace
              //[head,...this.data]= this.data
              const i = Math.random()
              this.data=[{key:`a-${i}`,data:`${i}`},...this.data]
              this.updateDataSource()
            }}>
          pressMe
        </Text>
        <BookListView
          ref={ c => this.listview=c }
          style={{paddingTop:20}}
          generateActions={()=>genActions2('search')}
          dataSource={this.state.ds}
          renderRow={(rowData,sectionID,rowID,highlightRow) => {
              /* console.log("should",
              this.state.ds.rowShouldUpdate(sectionID,rowID)) */
              return (
                <SwipeableRow3
                  ref={ c => {
                      this.layoutable[sectionID] = this.layoutable[sectionID] || []
                      this.layoutable[sectionID][rowID] = c
                    }}
                  disable={rowData.fadeIn ? false : true}
                  {...genActions2('search')}
                  onSwipeStart={({gestureState,action}) =>{
                      this.listview.setNativeProps({ scrollEnabled: false })
                    }}
                  onSwipeEnd={({gestureState,action}) =>{
                      this.listview.setNativeProps({ scrollEnabled: true })

                      //console.log("row",this.layoutable[sectionID][rowID])

                      if(action.target === null){ return }
                      this.layoutable[sectionID][rowID].close()
                          .then(()=>{
                            //this.layoutable
                            this.data =
                              this.data
                                  .filter((elem)=>
                                    elem.key.toString() !== rowID)
                            this.updateDataSource()

                            this.data=[{key:rowID,data:rowData.data,fadeIn:true},
                                       ...this.data]
                            this.updateDataSource()
                          })
                    }}
                >
                  {debugView("row")(rowData,rowID,sectionID)}
                </SwipeableRow3>
              )
          }}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )//            <LayoutableView>
  }
}

class TestBookListView1 extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID][0]
    })
    this.data = {
      s1:{r1:"a", r2:"b", r3:"c"},
      s2:{r4:"r4", r5:"r5", r6:"r6"}
    };
    this.state = {
      ds: ds.cloneWithRowsAndSections(this.data)
    };
  }
  updateDataSource(){
    return new Promise((resolve, reject)=>
      this.setState(
        {ds:this.state.ds.cloneWithRowsAndSections(this.data)}, ()=>
          resolve()
      ))
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
              const s1 = {...this.data.s1}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data={
                s1:{[`r${i}`]:`r${i}`,...s1},
                s2:this.data.s2
              }
              this.updateDataSource()
            }}>
          press to push head and pop tail
        </Text>
        <Text
          onPress={()=>{
              //replace
              const s1 = {...this.data.s1}
              delete s1[Object.keys(s1)[Object.keys(s1).length-1]]
              this.data={
                s1:{...s1},
                s2:this.data.s2
              }
              this.updateDataSource()
            }}>
          press to pop tail
        </Text>
        <Text
          onPress={()=>{
              this.listview
                  .close("s1","r1")
            }}>
          press to close head
        </Text>
        <BookListView2
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
                    const s = {...this.data[sectionID]}//clone
                    delete s[rowID]
                    this.data = {...this.data,[sectionID]:s}
                    return this.updateDataSource()
                  })
                  //.catch((e)=>console.log("error",e))
                  .then(()=>{
                    /* console.log("then",
                    {[rowID]:rowData,...this.data[sectionID]}) */
                    this.data = {
                      ...this.data,
                      [sectionID]:{[rowID]:rowData,...this.data[sectionID]}
                    }
                    //console.log("then",this.data)
                    this.updateDataSource()
                  })
            }}
          renderRow={(rowData,sectionID,rowID,highlightRow) => {
              //console.log("user",rowData,sectionID,rowID,highlightRow)
              return (debugView("row")(rowData,rowID,sectionID))
            }}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

class TestBookListView2 extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID][0]
    })
    this.data = {
      search:{s1:"s1", s2:"s2", s3:"s3"},
      liked:{l1:"l1", l2:"l2", l3:"l3"},
      borrowed:{b1:"b1", b2:"b2", b3:"b3"},
      done:{d1:"d1", d2:"d2", d3:"d3"}
    };
    this.state = {
      ds: ds.cloneWithRowsAndSections(this.data)
    };
  }
  updateDataSource(){
    return new Promise((resolve, reject)=>
      this.setState(
        {ds:this.state.ds.cloneWithRowsAndSections(this.data)}, ()=>
          resolve()
      ))
  }
  render(){
    //console.log("s1",this.state.ds._dataBlob.s1)
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <BookListView2
          ref={ c => this.listview=c }
          style={{paddingTop:20}}
          generateActions={(rowData,sectionID)=>genActions2(sectionID)}
          dataSource={this.state.ds}
          onSwipeEnd={({rowData,sectionID,rowID,action,...rest}) =>{
              //console.log("re",{rowData,sectionID,rowID,action,...rest})
              if(action.target == null) { return }
              this.listview
                  .close(sectionID,rowID)
                  .then(()=>{
                    const s = {...this.data[sectionID]}//clone
                    delete s[rowID]
                    this.data = {...this.data,[sectionID]:s}
                    return this.updateDataSource()
                  })
              //.catch((e)=>console.log("error",e))
                  .then(()=>{
                    this.data = {
                      ...this.data,
                      [action.target]:{[rowID]:rowData,...this.data[action.target]}
                    }
                    //console.log("then",this.data)
                    this.updateDataSource()
                  })
            }}
          renderRow={(rowData,sectionID,rowID,highlightRow) => {
              //console.log("user",rowData,sectionID,rowID,highlightRow)
              return (debugView("row")(rowData,rowID,sectionID))
            }}
          renderSectionHeader={debugView("head")}
        />
      </View>
    )
  }
}

class TestBookListView3 extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (dataBlob, sectionID) => //
        this.sectionHeaderData[sectionID]
    })
    this.data = {
      search:{s1:"s1", s2:"s2", s3:"s3"},
      search_end:{},
      liked:{l1:"l1", l2:"l2", l3:"l3"},
      liked_end:{},
      borrowed:{b1:"b1", b2:"b2", b3:"b3"},
      borrowed_end:{},
      done:{d1:"d1", d2:"d2", d3:"d3"},
      done_end:{}
    };
    this.sectionHeaderData = {
      search:{text:"search"},
      search_end:{text:"search_end"},
      liked:{text:"liked"},
      liked_end:{text:"liked_end"},
      borrowed:{text:"borrowed"},
      borrowed_end:{text:"borrowed_end"},
      done:{text:"done"},
      done_end:{text:"done_end"},
    }
    this.state = {
      ds: ds.cloneWithRowsAndSections(this.data)
    };
  }
  updateDataSource(){
    return new Promise((resolve, reject)=>
      this.setState(
        {ds:this.state.ds.cloneWithRowsAndSections(this.data)}, ()=>
          resolve()
      ))
  }
  render(){
    return(
      <View
        style={{flex:1,paddingTop:20}}>
        <BookListView2
          ref={ c => this.listview=c }
          style={{paddingTop:20}}
          generateActions={(rowData,sectionID)=>genActions2(sectionID)}
          dataSource={this.state.ds}
          onSwipeEnd={({rowData,sectionID,rowID,action,...rest}) =>{
              if(action.target == null) { return }
              this.listview
                  .close(sectionID,rowID)
                  .then(()=>{
                    const s = {...this.data[sectionID]}
                    delete s[rowID]
                    this.data = {...this.data,[sectionID]:s}
                    return this.updateDataSource()
                  })
                  .then(()=>{
                    this.data = {
                      ...this.data,
                      [action.target]:{[rowID]:rowData,...this.data[action.target]}
                    }
                    this.updateDataSource()
                  })
            }}
          renderRow={debugView("row")}
          renderSectionHeader={debugView("head")}
          renderSectionFooter={debugView("foot")}
        />
      </View>
    )
  }
}
class TestBookListView4 extends React.Component {
  //swipe and reoder
  // press to replace
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => {
        //console.log("s",s1,s2)
        return s1 !== s2
      },
      getSectionHeaderData: (dataBlob, sectionID) => {
        //return this.sectionHeaderData[sectionID]
        return dataBlob.sectionHeaderData[sectionID]
      }
    })
    this.data = {
      search:{s1:"s1", s2:"s2", s3:"s3"},
      search_end:{},
      liked:{l1:"l1", l2:"l2", l3:"l3"},
      liked_end:{},
      borrowed:{b1:"b1", b2:"b2", b3:"b3"},
      borrowed_end:{},
      done:{d1:"d1", d2:"d2", d3:"d3"},
      done_end:{}
    };
    //console.log({...this.data,sectionHeaderData:this.sectionHeaderData})
    /* this.sectionHeaderData = {
     *   search:{close:false,loadingState:true,count:3},
     *   search_end:{close:false,loadingState:true,count:3},
     *   liked: {close:false,loadingState:true,count:3},
     *   liked_end: {close:false,loadingState:true,count:3},
     *   borrowed:{close:false,loadingState:true,count:3},
     *   borrowed_end:{close:false,loadingState:true,count:3},
     *   done:{close:false,loadingState:true,count:3},
     *   done_end:{close:false,loadingState:true,count:3}
     * }*/
    this.sectionIdentities = Object.keys(this.data)
    this.state = {
      ds: ds.cloneWithRowsAndSections(
        {...this.data,
         sectionHeaderData:{
           search:{close:false,loadingState:true,count:3},
           search_end:{close:false,loadingState:true,count:3},
           liked: {close:false,loadingState:true,count:3},
           liked_end: {close:false,loadingState:true,count:3},
           borrowed:{close:false,loadingState:true,count:3},
           borrowed_end:{close:false,loadingState:true,count:3},
           done:{close:false,loadingState:true,count:3},
           done_end:{close:false,loadingState:true,count:3}
         }},
        this.sectionIdentities)
    };
    this._scrollY = new Animated.Value(0)
    this.positions = []
  }
  updateDataSource(){
    /* Object.keys(this.data).forEach( key =>{
     *   //console.log("k",key,this.sectionHeaderData[key])
     *   this.sectionHeaderData[key] =
     *     {close:false,loadingState:true,count:Object.keys(this.data[key]).length}
     * })*/
    return new Promise((resolve, reject)=>
      this.setState(
        {ds: this.state.ds.cloneWithRowsAndSections(
          {...this.data,
           //sectionHeaderData:this.sectionHeaderData
           sectionHeaderData:Object
             .keys(this.data)
             .reduce((acc,key) => {
               console.log()
               acc[key]={
                 close:this.sectionIdentities.length === 2,loadingState:true,
                 count:key.endsWith('_end') ?
                       Object.keys(this.data[key.slice(0,-4)]).length :
                       Object.keys(this.data[key]).length
               }
               return acc
             },{})
          },
          this.sectionIdentities)}, ()=>
          resolve()
      ))
  }
  render(){
    //console.log(this.state.ds)
    //{action("scroll")}
    return(
      <View
        style={{flex:1}}>
        <BookListView
          onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this._scrollY}}}],
              //{listener},          // Optional async listener
            )}
          ref={ c => this.listview=c }
          style={{backgroundColor:"black"}}
          generateActions={(rowData,sectionID)=>genActions2(sectionID)}
          dataSource={this.state.ds}
          onSwipeEnd={({rowData,sectionID,rowID,action,...rest}) =>{
              //console.log("foo")
              //action("swipe end")({rowData,sectionID,rowID,action,...rest})
              const s = {...this.data[sectionID]}
              delete s[rowID]
              this.data = {...this.data,[sectionID]:s}
              this.updateDataSource().then(()=>{
                this.data = {
                  ...this.data,
                  [action.target]:{[rowID]:rowData,...this.data[action.target]}
                }
                this.updateDataSource()
              })
            }}
          renderRow={(rowData,sectionID,rowID)=>{
              return debugView("row")(rowData,sectionID,rowID)
              let book ={ title: 'ぐりとぐらの絵本7冊セット', author: '',
              thumbnail: 'http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2147/9784834032147.jpg?_ex=200x200',
              libraryStatus: {
                exist: false,
                rentable: false,
                reserveUrl: '',
              },
              isbn: '9784834032147',
              active: true,
              }
            return (<BookCell
              book={book}
              style={{ backgroundColor: materialColor.grey['50'] }}
                    />)
                    }}
          renderSectionHeader={(sectionData, sectionID) => {
              //const { close, loadingState } = sectionData;
              // close or not
              /* onSelectSection={action("section select")}
              onCloseSection={action("section close")}
               */
              //console.log("rend sec header",sectionData)
              return (
                <ItemsHeader
                   onSelectSection={(section)=>{
                       if(this.sectionIdentities.length === 2){ return }
                       this.positions.push(this._scrollY.__getValue())
                       //TODO:
                       //1. scroll to section header with animation
                       // (need expand view in android)
                       //2. save section header position
                       this.listview.scrollTo({y:0,animated:false})
                       this.sectionIdentities = [section,`${section}_end`]
                       this.updateDataSource()
                     }}
                   onCloseSection={(section)=>{
                       //TODO:
                       //1. scroll to section header with animation
                       //this.listview.scrollTo({y:0,animated:true})
                       this.sectionIdentities = Object.keys(this.data)
                       this.updateDataSource().then(()=>{
                         //TODO:
                         //2. scroll to section header with no animation
                         //2. scroll to original position with animation
                         let pos = this.positions.pop()
                         setTimeout(()=>
                           this.listview.scrollTo({y:pos,
                                                   animated:false}))
                       })
                     }}
                   section={sectionID}
                   {...sectionData}
                         />)
            }}
          renderSectionFooter={(sectionData, sectionID) => {
              //console.log("fo",sectionData)
              return (
                <ItemsFooter
                   {...sectionData}
                         />)
            }}
        />
      </View>
    )
  }
}

const {
  width,
} = Dimensions.get('window');

storiesOf('BookListView', module)
/* .addDecorator(getStory => (
 *   <CenterView>{getStory()}</CenterView>
 * ))*/
  .add('with book', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View
        style={{
          paddingTop:20,
          paddingHorizontal:5,
        }}>
        <BookListView
          style={{backgroundColor:"blue"}}
          width={width-10}
          generateActions={()=>genActions2('search')}
          dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
          renderRow={(rowData) => <Text>row</Text>}
          renderSectionHeader={(rowData) => <Text>sec</Text>}
        />
      </View>
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
  .add('with TestListView2', () => {
    return(<TestListView2 />)
  })
  .add('with TestListView3', () => {
    return(<TestListView3 />)
  })
  .add('with TestListView4', () => {
    return(<TestListView4 />)
  })
  .add('with MultipleListView', () => {
    return(<MultipleListView/>)
  })
  .add('with NestedListView', () => {
    return(<NestedListView />)
  })
  .add('with NestedListView2', () => {
    return(<NestedListView2 />)
  })
  .add('with NestedListView3', () => {
    return(<NestedListView3 />)
  })
  .add('with add or remove row', () => {
    return(
      <TestSectionListView>
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
      </TestSectionListView>
    )
  })
  .add('with TestBookListView1', () => {
    return(<TestBookListView1/>)
  })
  .add('with TestBookListView2', () => {
    return(<TestBookListView2/>)
  })
  .add('with TestBookListView3', () => {
    return(<TestBookListView3/>)
  })
  .add('with TestBookListView4', () => {
    return(<TestBookListView4/>)
  })

class DelayedListView extends React.Component {
  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      dataSource: dataSource.cloneWithRows(
        this.props.dataBlob,
        this.props.rowIdentities
      )
    }
  }
  componentWillReceiveProps(nextProps){
    function difference(a,b) {
      return a.filter(row =>
        b.indexOf(row) === -1
      );
    }
    callback = () => {
      this.setState({
        dataSource: this.state.dataSource
                        .cloneWithRows(
                          this.props.dataBlob,
                          this.props.rowIdentities
                        )
      })
    }

    const added = difference(
      this.props.rowIdentities, nextProps.rowIdentities);

    if(added.length !== 0){
      this.props.onWillEnter(callback)
      console.log("added")
    }

    const removed = difference(
      nextProps.rowIdentities ,this.props.rowIdentities);

    if(removed.length !== 0){
      this.props.onWillLeave(callback)
      console.log("removed")
    }
  }
  render(){
    return (
      this.props.children(this.state.dataSource)
    )
  }
}
DelayedListView.propTypes = {
  children: React.PropTypes.func.isRequired,
  onWillLeave: React.PropTypes.func,
  onWillEnter: React.PropTypes.func,
};

DelayedListView.defaultProps = {
  children: emptyFunction,
  onWillLeave: (callback) => callback(),
  onWillEnter: (callback) => callback(),
};

class BookListView2_test extends React.Component {
  //cannot animate parallel
  constructor(props) {
    super(props);
    this.state = {
      toggle:true,
    };
  }
  render(){
    return (
      <View>
        <Text
          style={{paddingTop:20}}
          onPress={()=>{
              this.setState((prevState,props)=>{
                return {toggle: ! prevState.toggle}
              })
            }}>
          pressMe
        </Text>
        <DelayedListView
          dataBlob={{
            r1:"a", r2:"b", r3:"c"
          }}
          rowIdentities={
            (this.state.toggle ? ["r2", "r1"] : ["r1","r2","r3"])
                        }
        >
          {(dataSource)=>{
             return (
               <ListView
                 ref={ c => this.listview=c }
                 dataSource={dataSource}
                 renderRow={(rowData,sectionID,rowID)=>{
                     return debugView("row")(rowData,sectionID,rowID)
                   }}
               />
             )
           }}
        </DelayedListView>
      </View>
    )
  }
}

class BookListView3_test extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      toggle:true,
      /* dataSource: dataSource.cloneWithRows(
       *   this.props.dataBlob
       * )*/
    }
  }
  render(){
    //console.log("a",this.state.toggle)
    return (
      <View>
        <Text
          style={{paddingTop:20}}
          onPress={()=>{
              this.setState((prevState,props)=>{
                return {toggle: ! prevState.toggle}
              })
            }}>
          pressMe
        </Text>
        <ListView
          ref={ c => this.listview=c }
          dataSource={this.state.toggle ?
                      this.dataSource.cloneWithRows({
                        r1:{data:1,enable:true},
                        r2:{data:2,enable:true},
                        r3:{data:3,enable:true},
                      }) :
                      this.dataSource.cloneWithRows({
                        r1:{data:1,enable:true},
                        r2:{data:2,enable:false},
                        r3:{data:3,enable:true},
                      })
                     }
          renderRow={(rowData,sectionID,rowID)=>{
              //console.log("r:",rowData)
              return (
                <LayoutableView
                    close={!rowData.enable}>
                          {debugView("row")(rowData,sectionID,rowID)}
                </LayoutableView>
              )
            }}
        />
      </View>
    )
  }
}

class CountableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter:0,
    }
  }
  render(){
    return(
      <View>
        <Text
          style={{paddingTop:20}}
          onPress={()=>{
              this.setState((prevState,props)=>{
                return {counter: (prevState.counter + 1) % this.props.limit }
              })
            }}>
          pressMe to count
        </Text>
        {this.props.children(this.state.counter)}
      </View>
    )
  }
}

class BookListView4_test extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.dataBlobs = [
      {
        r1:{data:1,enable:true},
        r2:{data:2,enable:true},
        r3:{data:3,enable:true},
      },
      {
        r1:{data:1,enable:true},
        r2:{data:2,enable:false},
        r3:{data:3,enable:true},
      },
      {
        r1:{data:1,enable:true},
        r2:{data:2,enable:false},
        r3:{data:3,enable:false},
      },
      {
        r1:{data:1,enable:true},
        r2:{data:2,enable:true},
        r3:{data:3,enable:false},
      }
    ]
  }
  render(){
    //console.log("a",this.state.toggle)
    return (
      <CountableView limit={4}>
        {(counter) => {
           this.dataSource =
             this.dataSource.cloneWithRows(this.dataBlobs[counter])
           return (
             <View>
               <ListView
                 ref={ c => this.listview=c }
                 dataSource={this.dataSource}
                 renderRow={
                   (rowData,sectionID,rowID)=>{
                     //console.log("r:",rowData)
                     //rowData
                     //console.log("c:",counter)
                     return (
                       <CloseableView2
                    close={!rowData.enable}>
                          {debugView("row")(rowData,sectionID,rowID)}
                       </CloseableView2>
                     )
                   }}
               />
               <Text>foo</Text>
               <ListView
                 ref={ c => this.listview=c }
                 dataSource={this.dataSource}
                 renderRow={(rowData,sectionID,rowID)=>{
                     //rowData
                     //console.log("c:",counter)
                     return (
                       <CloseableView2
                    close={rowData.enable}>
                          {debugView("row")(rowData,sectionID,rowID)}
                       </CloseableView2>
                     )
                   }}
               />
             </View>
           )
         }}
      </CountableView>
    )
  }
}

class BookListView5_test extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <ToggleableView
        renderChildren={
          (toggle) => {
            return (
              <CloseableView close={toggle}>
                <Text>content</Text>
                  {/* {debugView("row")(this.props)} */}
              </CloseableView>
            )
          }}
      />)
  }
}

// PureComponent is only effective when no children
// class MyCloseableView extends React.PureComponent {
class MyCloseableView extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.close !== nextProps.close) {
      //this.toggle();
      //console.log("willRecieveProps::close change")
    } else if (this.props.children !== nextProps.children){
      //console.log("willRecieveProps::children change")
    }
  }
  render(){
    //console.log("my")
    return (
      <CloseableView close={false}>
        {this.props.children}
      </CloseableView>
    )
  }
}

class BookListView6_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle:true,
    }
    this.animationConfig={duration:3000}
    this.style={backgroundColor:"red"}
  }

  render(){
    return(
      <View
        style={{paddingTop:20}}>
        <Text>
          state.toggle is {this.state.toggle ? "true" : "false" }
        </Text>
        <Text
          onPress={()=>{
              this.setState((prevState,props)=>{
                return {toggle: ! prevState.toggle }
              })
            }}>
          pressMe to toggle
        </Text>
        <Text
          onPress={()=>{
              this.setState({toggle: true})
            }}>
          pressMe to set true
        </Text>
        <Text
          onPress={()=>{
              this.setState({toggle: false})
            }}>
          pressMe to set false
        </Text>
        <CloseableView2
          close={this.state.toggle}
        >
          {debugView("row")("content")}
        </CloseableView2>
        <Text>
          next
        </Text>
        <CloseableView2
          close={!this.state.toggle}
        >
          {debugView("row")("content2")}
        </CloseableView2>
        <Text>
          next2
        </Text>
      </View>
    )
  }
}

class BookListView7_test extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.dataBlob = [
      {isbn:1,title:"foo",bucket:"liked"},
      {isbn:2,title:"bar",bucket:"done" },
      {isbn:3,bucket:"liked"},
    ]
    this.state = {
      //dataSource: dataSource.cloneWithRows(this.dataBlob),
      dataSource: dataSource.cloneWithRows(
        ...this.toDataSource(this.dataBlob)),
    }
  }
  toDataSource(dataBlob){
    const nextDataBlob=dataBlob.reduce((acc,book)=>{
      acc[book.isbn] = book;
      return acc;
    },{})
    //console.log("ndb",nextDataBlob)
    return [nextDataBlob,dataBlob.map((book)=>book.isbn)]
  }
  render(){
    const onCloseStart=(target,rowData,sectionID,rowID, highlightRow)=>{
      //keep order when close start
      this.dataBlob = this.dataBlob.map((book)=>
        book.isbn === rowData.isbn ? {...book, bucket : null}: book)
      this.setState({
        dataSource:this.state.dataSource.cloneWithRows(
          ...this.toDataSource(this.dataBlob)
        )
      })
    }
    const onCloseEnd=(target,rowData,sectionID,rowID, highlightRow)=>{
      this.dataBlob = [
        {...rowData,bucket:target},
        ...this.dataBlob.filter((book)=>book.isbn!==rowData.isbn)
      ]
      //console.log("th",this.dataBlob,target)
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          dataSource:this.state.dataSource.cloneWithRows(
            ...this.toDataSource(this.dataBlob)
          )
        })
      })
    }

   return (
     <View
        style={{paddingTop:20}}>
        <Text>liked</Text>
        <BookListView2
          dataSource={this.state.dataSource}
          bucket="liked"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
        />
        <Text>done</Text>
        <BookListView2
          dataSource={this.state.dataSource}
          bucket="done"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
        />
        <Text>borrowed</Text>
        <BookListView2
          dataSource={this.state.dataSource}
          bucket="borrowed"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
        />
      </View>
    )
  }
}

class BookListView8_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books : [
        {isbn:1,title:"foo",bucket:"liked"},
        {isbn:2,title:"bar",bucket:"done" },
        {isbn:3,bucket:"liked"},
      ]
    }
  }
  render(){
    const onCloseStart=(target,rowData,sectionID,rowID, highlightRow)=>{
      //keep order when close start
      //this.dataBlob =
      this.setState({
        books: this.state.books.map((book)=>
          book.isbn === rowData.isbn ? {...book, bucket : null}: book)
      })
    }
    const onCloseEnd=(target,rowData,sectionID,rowID, highlightRow)=>{
      this.setState({
        books: [{...rowData,bucket:target},
                ...this.state.books.filter((book)=>book.isbn!==rowData.isbn)
        ]
      })
      //console.log("th",this.dataBlob,target)
    }

    return (
      <BooksDataSource
        books={this.state.books}
        renderListView={(dataSource)=>{
            return(
              <View
        style={{paddingTop:20,
                backgroundColor: '#1A237E'}}>
                <BookListView2
          dataSource={dataSource}
          bucket="liked"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
          onSelectSection={(section)=>console.log("se:",section)}
            />
                <BookListView2
          dataSource={dataSource}
          bucket="done"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
                     />
                <BookListView2
          dataSource={dataSource}
          bucket="borrowed"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
                     />
              </View>
            )
          }}
      />
    )
  }
}

class BookListView9_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [
        {isbn:1,title:"foo",bucket:"liked"},
        {isbn:2,title:"bar",bucket:"done" },
        {isbn:3,bucket:"done"},
        {isbn:4,bucket:"done"},
        {isbn:5,bucket:"done"},
        {isbn:6,bucket:"done"},
        {isbn:7,bucket:"done"},
        {isbn:8,bucket:"done"},
        {isbn:9,bucket:"done"},
        {isbn:10,bucket:"done"},
      ],
      selectedSection: null
    }
    this.positionY=0;
  }
  render(){
    const onCloseStart=(target,rowData,sectionID,rowID, highlightRow)=>{
      //keep order when close start
      //this.dataBlob =
      this.setState({
        books: this.state.books.map((book)=>
          book.isbn === rowData.isbn ? {...book, bucket : null}: book)
      })
    }
    const onCloseEnd=(target,rowData,sectionID,rowID, highlightRow)=>{
      this.setState({
        books: [{...rowData,bucket:target},
                ...this.state.books.filter((book)=>book.isbn!==rowData.isbn)
        ]
      })
      //console.log("th",this.dataBlob,target)
    }
    const onCloseSection=()=>{
      const scrollResponder = this.scroll.getScrollResponder();
      scrollResponder.scrollTo({x:0,y:0})
      //InteractionManager.runAfterInteractions(()=>{
      this.setState({selectedSection:null})
      //})
    }

    return (
      <BooksDataSource
        books={this.state.books}
        renderListView={(dataSource)=>{
            return(
              <ScrollView
                       ref={(scroll)=>this.scroll=scroll}
                 scrollEnabled={!this.state.selectedSection}
        style={{//paddingTop:20,//for ios
                backgroundColor: '#1A237E'}}>
                <BookListView2
          dataSource={dataSource}
          bucket="liked"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
          selectedSection={this.state.selectedSection}
          onSelectSection={(selectedSection)=>this.setState({selectedSection})}
                          />
                <BookListView2
          dataSource={dataSource}
          bucket="done"
                  ref={(listview)=>this.done=listview}
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
          selectedSection={this.state.selectedSection}
          onCloseSection={onCloseSection}
          onSelectSection={(selectedSection)=>{
              //params selectedSection,node
              //cannot measure position directory when in ScrollView
              //return this.setState({selectedSection})
              const handle = findNodeHandle(this.done)
              const scrollResponder = this.scroll.getScrollResponder();
              UIManager.measureLayoutRelativeToParent(
                handle,
                (e)=>console.log(e),
                //this.done.measure(
                (x,y,w,h,px,py)=>{
                  //console.log("x,y:",x,y,w,h,px,py)
                  this.setState({selectedSection},()=>
                    //expand view
                    InteractionManager.runAfterInteractions(()=>{
                      scrollResponder.scrollTo({x,y})
                    })
                  )
                }
              )
            }}
                          />
                <BookListView2
          dataSource={dataSource}
          bucket="borrowed"
          onCloseStart={onCloseStart}
          onCloseEnd={onCloseEnd}
          selectedSection={this.state.selectedSection}
          onSelectSection={(selectedSection)=>this.setState({selectedSection})}
                     />
              </ScrollView>
            )
          }}
      />
    )
  }
}

storiesOf('BookListView2', module)
  .add('BookListView2',() => {
    return(<BookListView2_test />)
  })
  .add('BookListView3',() => {
    return(<BookListView3_test />)
  })
  .add('BookListView4',() => {
    return(<BookListView4_test />)
  })
  .add('BookListView5',() => {
    return(<BookListView5_test />)
  })
  .add('BookListView6',() => {
    return(<BookListView6_test />)
  })
  .add('BookListView7',() => {
    return(<BookListView7_test />)
  })
  .add('BookListView8',() => {
    return(<BookListView8_test />)
  })
  .add('BookListView9',() => {
    return(<BookListView9_test />)
  })
