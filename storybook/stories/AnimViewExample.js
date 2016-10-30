import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  ListView,
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import {BookCell} from '../../BookCell';
import Stylish from '../../Stylish';
//import Stylish from 'react-native-stylish';
//import {hello} from 'react-native-stylish'

import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';


import {withDebug} from './common';

const StylishViewDebug = withDebug(Stylish.View)
const StylishListViewDebug = withDebug(Stylish.ListView)

storiesOf('StylishView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with children', () => (
    //style={{width:100,flexDirection:"row"}}
    <StylishViewDebug
      data={[{style:{height:10,backgroundColor:"red"}},
             {style:{height:10,backgroundColor:"green"}}]}
    >
      <Text>foo</Text>
    </StylishViewDebug>
  ))
  .add('with props', () => (
    //style={{width:100,flexDirection:"row"}}
    <StylishViewDebug
      data={[{style:{height:10,backgroundColor:"red"}},
             {style:{height:10,backgroundColor:"green"}}]}
    />
  ))
  .add('with transform props', () => (
    //style={{width:100,flexDirection:"row"}}
    <StylishViewDebug
      data={[{style:{height:10,backgroundColor:"red",transform:[{scale:1}]}},
             {style:{height:10,backgroundColor:"red",transform:[{scale:2}]}}]}
    />
  ))
  .add('with animateTo', () => (
    <StylishViewDebug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          //console.log(self)
          self.animateTo({height:20,backgroundColor:"red"})
        }}/>
  ))
  .add('with merge animateTo', () => (
    <StylishViewDebug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          //console.log(self)
          self.animateTo({height:20})
        }}/>
  ))
  .add('with hide & show', () => (
    //opacity:0 or scale 0 cause problems
    <StylishViewDebug
      data={[{style:{height:0.1,opacity:0.1,transform:[{scale:0.1}]}},
             {style:{height:10 ,opacity:1,transform:[{scale:1}]}}
        ]}
    >
      <Text style={{backgroundColor:"red"}}>foo</Text>
    </StylishViewDebug>
  ))
  .add('with animationConfig', () => (
    //opacity:0 or scale 0 cause problems
    <StylishViewDebug
      data={[{style:{height:10, backgroundColor:"red" },
              animationConfig:{duration:1000}},
             {style:{height:10, backgroundColor:"green"},
              animationConfig:{duration:1000}}]}
    />
  ))
  .add('with ListView', () => {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    return(
      <StylishListViewDebug
        data={[{style:{height:10,backgroundColor:"red"},
                dataSource:ds.cloneWithRows(["a","b"]),
                renderRow:(rowData) => <Text>{rowData}</Text>},
               {style:{height:20,backgroundColor:"green"},
                dataSource:ds.cloneWithRows(["a","b"]),
                renderRow:(rowData) => <Text>{rowData}</Text>}]}
      />)
  }
  )
