import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  ListView
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Stylish from 'react-native-stylish';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import { CloseableView, LayoutableView } from '../../Closeable';
import { BookListView } from '../../BookListView';
import { genActions2 } from '../../Action';

import {TestSectionListView,debugView,withDebug,TestListView} from './common';
const CloseableViewDebug = withDebug(CloseableView)

storiesOf('CloseableView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with close props', () => (
    <CloseableViewDebug
      data={[{close:"true"},
             {close:"false"}]}
    >
      <Text>foo</Text>
    </CloseableViewDebug>
  ))
  .add('with toggle', () => (
    <CloseableViewDebug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          self.toggle();
          //console.log(self);
          //self.animateTo({height:20,backgroundColor:"red"})
        }}/>
  ))
  .add('with toggle 2', () => (
    <View style={{marginTop:20}}>
      <CloseableViewDebug
        data={[{style:{height:100,backgroundColor:"red"},close:true}]}
        onPress={(props,self)=>{
            self.toggle();
            //console.log(self);
            //self.animateTo({height:20,backgroundColor:"red"})
          }}/>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </View>
  ))
  .add('with scrollview', () => (
    <ScrollView style={{marginTop:20}}>
      <CloseableViewDebug
        data={[{style:{height:100,backgroundColor:"red"},close:true}]}
        onPress={(props,self)=>{
            self.toggle();
            //console.log(self);
            //self.animateTo({height:20,backgroundColor:"red"})
          }}/>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </ScrollView>
  ))
  .add('multiple set', () => (
    <ScrollView style={{marginTop:20}}>
      <CloseableViewDebug
        data={[{style:{height:100,backgroundColor:"red"},close:true}]}
        onPress={(props,self)=>{
            self.toggle();
            //console.log(self);
            //self.animateTo({height:20,backgroundColor:"red"})
          }}/>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </ScrollView>
  ))
//input close open
/* style={[style, {
 *   flexDirection: 'row',
 *   justifyContent: this.state.positiveSwipe ?
 *                   'flex-start' : 'flex-end',
 *   overflow: 'hidden',
 *   alignItems: 'stretch'
 * }]}*/

class TestLayoutableView extends React.Component {
  render() {
    return (
      <View
        style={{marginTop:20}}>
      <Text onPress={()=>{
          //console.log("foo")
          this.closeable1.close()
          this.closeable2.close()
        }}>
        pressMe
      </Text>
      <CloseableView
        ref={c => this.closeable1 = c}>
        <LayoutableView
          transitionEnter={true}
        >
          <Text style={{height:50,backgroundColor:"red"}}>
            foo
          </Text>
        </LayoutableView>
      </CloseableView>
      <LayoutableView
        transitionEnter={true}
      >
        <CloseableView
          ref={c => this.closeable2 = c}>
          <Text style={{height:50,backgroundColor:"green"}}>
            foo
          </Text>
        </CloseableView>
      </LayoutableView>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
      </View>)
  }
}
storiesOf('LayoutableView', module)
/* .addDecorator(getStory => (
 *   <CenterView>{getStory()}</CenterView>
 * ))*/
  .add('with top', () => (
    <View>
      <LayoutableView transitionEnter={true}>
        <Text style={{height:50,backgroundColor:"red"}}>
          foo
        </Text>
      </LayoutableView>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </View>
  ))
  .add('with scroll', () => (
    <ScrollView>
      <LayoutableView transitionEnter={true}>
        <Text style={{height:50,backgroundColor:"red"}}>
          foo
        </Text>
      </LayoutableView>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </ScrollView>
  ))
  .add('with center & defaultProps', () => (
    <View
      style={{
        justifyContent:"center",
        flex:1,
      }}>
      <View>
        <LayoutableView>
        <View
          style={{
            //alignItems:"center",
            //justifyContent:"center",
            height:50,
            flex:1,
            backgroundColor:"red"}}>
          <Text>
            foo
          </Text>
        </View>
      </LayoutableView>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </View>
    </View>
  ))
  .add('with disable by transitionEnter', () => (
    <View>
      <LayoutableView
        style={{backgroundColor:"green"}}
        transitionEnter={false}
      >
        <Text style={{height:50,backgroundColor:"red"}}>
          foo
        </Text>
      </LayoutableView>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </View>
  ))
  .add('with toggle', () => (
    <TestLayoutableView />
  ))
  .add('Scrollview & transitionEnter', () => (
    <ScrollView
      style={{marginTop:20}}
    >
      <Text onPress={()=>{
          this.l.close()
        }}>
        press to close
      </Text>
      <LayoutableView
        style={{backgroundColor:"green"}}
        transitionEnter={true}
        ref={c => this.l = c}
      >
        <Text style={{height:50,backgroundColor:"red"}}>
          foo
        </Text>
      </LayoutableView>
      <View
        style={{
          height:50,
          backgroundColor:"yellow"}} />
    </ScrollView>
  ))
  .add('ListView & transitionEnter', () => (
    <View
      style={{marginTop:20}}
    >
      <Text onPress={()=>{
          this.l.close()
        }}>
        press to close
      </Text>
    <TestListView>
      {(dataSource)=>
        <ListView
          style={{paddingTop:20,flex:1}}
          dataSource={dataSource}
          renderRow={(rowData,rowID,sectionID) =>
            <LayoutableView
                    transitionEnter={true}
                    ref={c => this.l = c}
                        >
              <View>
                    {debugView("row")(rowData,rowID,sectionID)}
              </View>
            </LayoutableView>
                    }
        />
      }
    </TestListView>
    <View
      style={{
        height:50,
        backgroundColor:"yellow"}} />
    </View>
  ))
//BookListView is broken because BookListView1 only accept dataBlob
/* .add('section ListView & transitionEnter', () => {

 *   return (<View
 *           style={{marginTop:20}}
 *   >
 *     <Text onPress={()=>{
 *       //this["r1"].close()
 *       this.listview.close("s1","r1")
 *       }}>
 *       press to close
 *     </Text>
 *     <TestSectionListView>
 *       {(dataSource)=>
 *         <BookListView
 *           style={{flex:1}}
 *           ref={c => this.listview = c}
 *           dataSource={dataSource}
 *           generateActions={()=>genActions2('search')}
 *           renderRow={(rowData,sectionID,rowID) =>
 *             <View>
 *             <LayoutableView
 *                   transitionEnter={true}
 *                   ref={c => this[rowID] = c}
 *                       >
 *                       {debugView("row")(rowData,rowID,sectionID)}
 *             </LayoutableView>
 *             </View>
 *                     }
 *           renderSectionHeader={(rowData,sectionID) =>
 *             debugView("section")(rowData,sectionID)
 *                               }
 *         />
 *       }
 *     </TestSectionListView>
 *     <View
 *       style={{
 *         height:50,
 *         backgroundColor:"yellow"}} />
 *   </View>)
 * })*/
