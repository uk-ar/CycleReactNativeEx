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
import {BookCell} from '../../BookCell';
import {SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

class ScrollPositionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggle: true };
  }
  render() {
    return (
      <ScrollView
        ref={c => this.scrollview = c}
        removeClippedSubview={false}
        onContentSizeChange={
          (contentWidth, contentHeight) => {
            // this.scrollview.scrollTo({x:0,y:-1,animated:true});
            // console.log(contentHeight,this.scrollview);
            // this.scrollview.forceUpdate()
          }}
        contentContainerStyle={{
          // flex:1,
          justifyContent: 'center'
        }}
      >
        <View style={{ height: this.state.toggle ? null : 0.1, overflow: 'hidden' }}>
          <Text style={{ fontSize: 96 }}>Scroll me plz</Text>

          <TouchableHighlight onPress={() => console.log('press:')}>
            <Text style={{ fontSize: 96 }}>If you like</Text>
          </TouchableHighlight>
          <Text style={{ fontSize: 96 }}>Scrolling down</Text>
          <Text style={{ fontSize: 96 }}>What's the best</Text>
          <Text style={{ fontSize: 96 }}>Framework around?</Text>
          <Text style={{ fontSize: 80 }}>React Native</Text>
        </View>
        <TouchableHighlight onPress={() => {
            this.setState({ toggle: !this.state.toggle }, () => {
              this.scrollview.scrollTo({ x: 0, y: 0, animated: true });
            });
            // console.log("press:",this.state.toggle)
          }}>
          <Text style={{ fontSize: 96, color: 'red' }}>If you like</Text>
        </TouchableHighlight>
        <Text style={{ fontSize: 96 }}>wn</Text>
        <Text style={{ fontSize: 96 }}>est</Text>
        <Text style={{ fontSize: 96 }}>ound?</Text>
        <Text style={{ fontSize: 80 }}>2</Text>
        <Text style={{ fontSize: 96 }}>wn</Text>
        <Text style={{ fontSize: 96 }}>est</Text>
        <Text style={{ fontSize: 96 }}>ound?</Text>
        <Text style={{ fontSize: 80 }}>2</Text>

      </ScrollView>
    );
  }
}

storiesOf('Scroll View', module)
  .add('contentContainerStyle', () => (
    //contentContainerStyle=
    <ScrollView
      style={{borderWidth:10,borderColor:"red"}/*out*/}
      contentContainerStyle={{borderWidth:10,borderColor:"green"}/*in*/}
    >
      <Text style={{fontSize:96}}>Scroll me plzaaaaaaaaaaaaaaaaaaaa</Text>
    </ScrollView>
  ))
  .add('scroll position', () => (
    <ScrollPositionView
    />
  ))

class NestedView extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    //this.props.data.length
    return (
      <View
        ref={c=>this.out=c}
        style={{
          width:50,height:50,
          backgroundColor:"red",

          overflow:"hidden",
        }}>
        <View
          ref={c=>this.in=c}
          style={{
            width:100,height:100,
            backgroundColor:"green",

            position:"absolute"
          }}>
        </View>
      </View>
    )
  }
}
import {withDebug} from './common';
const NestedViewDebug = withDebug(NestedView)

storiesOf('View', module)
  .add('nested ', () => (
    <NestedViewDebug data={[{foo:"bar"}]}
      onPress={(props,self)=>{
          self.in.measure((x,y,width,height)=>{
            console.log("in",x,y,width,height)
          })
          self.out.measure((x,y,width,height)=>{
            console.log("out",x,y,width,height)
          })
          //console.log("baz",self)
        }}
    />
  ))
