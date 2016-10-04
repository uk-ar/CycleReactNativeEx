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
import {AnimView} from '../../AnimView';

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

class LifeCycleView extends React.Component {
  constructor(props) {
    super(props);
    action("constructor1")()
    this.state = {
      fadeAnim: new Animated.Value(0),
      heightAnim: new Animated.Value(0),
      layouted: false,
      //{style:{height:0.1,opacity:0.1,transform:[{scale:0.1}]}}
      style:{
        opacity: 0,
        height: 0.1,
        transform:[{scale: 0.1}],//BUG:when scale 0
        //backgroundColor:"red",
      }
    };
  }
  componentWillMount() {
    action("componentWillMount2")()
  }
  animate(){
    console.log("ro",this.root)
    this.root.measure(
      (x, y, width, height) => {
        //console.log("ro:",height)
        /* this.setState({
         *   style: {
         *     opacity: this.state.fadeAnim,
         *     transform:[{
         *       scale: this.state.fadeAnim
         *     }],
         *     height: this.state.fadeAnim.interpolate({
         *       inputRange:[0,1],
         *       outputRange:[0.1,height]
         *     }),
         *     //backgroundColor:"red",
         *   }})
         * Animated.timing(
         *   this.state.fadeAnim, {
         *     toValue: 1,
         *     duration: 3000
         *   }
         * ).start();*/
        this.setState({
          style: {
            opacity: 1,
            transform:[{
              scale: 1
            }],
            height: height
          }})
      }
    )
  }
  componentDidMount() {
    action("componentDidMount4")()
  }
  render(){
    //this.props.data.length
    return (
      <View>
        <AnimView
          ref={()=>action("ref3")()}
          onLayout={()=>{
              if(!this.state.layouted){
                action("onFirstLayout5")()
                this.animate()
                this.setState({layouted:true})
              }
            }}
          style={this.state.style}
        >
          <View
            ref={c => this.root = c}
            style={{
              position:"absolute",//to measure
              }}>
            {this.props.children}
          </View>
        </AnimView>
        <View
          style={{
            alignSelf:"center",
            height:50,
            width:200,
            backgroundColor:"yellow"}} />
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
  .add('lifecycle ', () => (
    <LifeCycleView>
      <View
        style={{
          width:100,height:100,
          backgroundColor:"green"}}/>
    </LifeCycleView>
  ))
