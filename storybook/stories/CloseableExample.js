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
import { AnimView } from '../../AnimView';

import {withDebug} from './common';
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

class Appear extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {style:{height:40,backgroundColor:"red"}}
    this.state = {style:{height:0.1,opacity:0.1,transform:[{scale:0.1}],
                         backgroundColor:"red"}}
  }
  render(){
    return (
      <LayoutableView
        ref={c => this.root = c}
        onFirstLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
            //this.setState({style:{height:50,backgroundColor:"red"}})
            console.log("foo")
            this.root.animateTo(
              {height:100,opacity:1,transform:[{scale:1}],backgroundColor:"red"})
            /* this.root.animate(
            {height:0.1,opacity:0.1,transform:[{scale:0.1}]},
            {height:100,opacity:1,transform:[{scale:1}]}
            ) */
            //this.root.toggle()
          }}
        onLayout={action("onLayout")}
        style={this.state.style}
      >
        <TouchableHighlight
          onPress={() => {
            this.anim.animateTo(
              {height:0.1,opacity:0.1,transform:[{scale:0.1}]})
            // console.log("press:",this.state.toggle)
          }}>
        <AnimView
          ref={c => this.anim = c}
          animationConfig={{duration:10000}}>
        <Text>
          foo
        </Text>
        </AnimView>
        </TouchableHighlight>
      </LayoutableView>
    )
  }
}

storiesOf('LayoutableView', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with close props', () => (
    <LayoutableView
      onLayout={action("onLayout")}
      onFirstLayout={action("onFirstLayout")}>
      <Text style={{height:50,backgroundColor:"red"}}>
        foo
      </Text>
    </LayoutableView>
  ))
  .add('with appear', () => (
    <Appear />
  ))
