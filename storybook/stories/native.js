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
import {SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

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
