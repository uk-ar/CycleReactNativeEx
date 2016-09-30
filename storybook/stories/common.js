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

function withDebug(MyComponent){
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { index:0 }
      this.root
    }
    render(){
      //this.props.data.length
      return (
        <TouchableHighlight
          onPress={()=>{
              if(1<this.props.data.length){
                this.setState(
                  {index:(this.state.index+1) % this.props.data.length })
              }
              this.props.onPress &&
              this.props.onPress(this.props.data[this.state.index],this.root)
            }}>
          <View>
            <MyComponent
              ref={c=>this.root =c}
              {...this.props.data[this.state.index]}
              children={this.props.children}
            />
          </View>
        </TouchableHighlight>)
      //              {...this.props.data[this.state.index]}
    }
  }
}

module.exports = {withDebug}
