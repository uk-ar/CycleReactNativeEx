import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';
import {genActions,Action,BookCell} from '../../BookCell';
import {AnimView} from '../../AnimView';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';


import {withDebug} from './common';

const AnimViewDebug = withDebug(AnimView)
storiesOf('AnimView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with children', () => (
    //style={{width:100,flexDirection:"row"}}
    <AnimViewDebug
      data={[{style:{height:10,backgroundColor:"red"}},
             {style:{height:10,backgroundColor:"green"}}]}
    >
      <Text>foo</Text>
    </AnimViewDebug>
  ))
  .add('with props', () => (
    //style={{width:100,flexDirection:"row"}}
    <AnimViewDebug
      data={[{style:{height:10,backgroundColor:"red"}},
             {style:{height:10,backgroundColor:"green"}}]}
    />
  ))
  .add('with transform props', () => (
    //style={{width:100,flexDirection:"row"}}
    <AnimViewDebug
      data={[{style:{height:10,backgroundColor:"red",transform:[{scale:1}]}},
             {style:{height:10,backgroundColor:"red",transform:[{scale:2}]}}]}
    />
  ))
  .add('with animateTo', () => (
    <AnimViewDebug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          //console.log(self)
          self.animateTo({height:20,backgroundColor:"red"})
        }}/>
  ))
  .add('with merge animateTo', () => (
    <AnimViewDebug
      data={[{style:{height:10,backgroundColor:"red"}}]}
      onPress={(props,self)=>{
          //console.log(self)
          self.animateTo({height:20})
        }}/>
  ))
  .add('with hide & show', () => (
    //opacity:0 or scale 0 cause problems
    <AnimViewDebug
      data={[{style:{height:0.1,opacity:0.1,transform:[{scale:0.1}]}},
             {style:{height:10 ,opacity:1,transform:[{scale:1}]}}
        ]}
    >
      <Text style={{backgroundColor:"red"}}>foo</Text>
    </AnimViewDebug>
  ))
