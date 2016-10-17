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
import { CloseableView, LayoutableView } from '../../Closeable';
import { Stylish } from '../../Stylish';

import {withDebug} from './common';
const CloseableViewDebug = withDebug(CloseableView)

storiesOf('CloseableView', module)
/* .addDecorator(getStory => (
 *   <CenterView>{getStory()}</CenterView>
 * ))*/
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
/* style={[style, {
 *   flexDirection: 'row',
 *   justifyContent: this.state.positiveSwipe ?
 *                   'flex-start' : 'flex-end',
 *   overflow: 'hidden',
 *   alignItems: 'stretch'
 * }]}*/
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
      <LayoutableView>
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
  .add('with center', () => (
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
  .add('with disable', () => (
    <View>
      <LayoutableView
        style={{backgroundColor:"green"}}
        disable={true}>
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
/* .add('with appear', () => (
 *   <Appear />
 * ))*/
