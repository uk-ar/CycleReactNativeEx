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
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lock:false };
  }
  render(){
    const { leftActions, rightActions } = genActions('search');
    return(
      <View style={{paddingTop:20}}>
        <SwipeableRow3
          ref={c => this.row = c}
          renderLeftActions={(width)=>
            <SwipeableActions
            ref={c => this.leftActions = c}
            actions={leftActions}
            lock={this.state.lock}
                 />
                            }
          renderRightActions={(width)=>
            <SwipeableActions
             ref={c => this.rightActions = c}
             actions={rightActions}
             lock={this.state.lock}
                  />
                             }
          onSwipeEnd={(evt, gestureState)=>{
              console.log("st:",gestureState.vx,gestureState.vy)
              if(0 < gestureState.dx){
                this.setState({lock:true},()=>{
                  if(this.leftActions.state.index == 0){
                    this.row.swipeToFlat(gestureState.vx)
                    this.setState({lock:false})
                  } else {
                    this.row.swipeToMax(gestureState.vx)
                        .then(()=> this.row.close())
                  }
                })
              }else{
                //this.rightActions.props.onSwipeEnd(this.row)
              }
            }}
        >
            <Text>bar</Text>
        </SwipeableRow3>
      </View>
    )
  }
}

storiesOf('SwipeableRow3', module)
  .add('with book', () => (
    <SwipeableRow3
      renderLeftActions={()=><Text>foo1</Text>}
      renderRightActions={()=><Text>foo2</Text>}>
      <Text>foo</Text>
    </SwipeableRow3>
  ))
  .add('with callback', () => (
    <SwipeableRow3
      onSwipe={action('move')}
      onSwipeStart={action('start')}
      onSwipeEnd={action('end')}
      renderLeftActions={()=><Text>foo1</Text>}
      renderRightActions={()=><Text>foo2</Text>}
      style={{marginTop:20}}>
      <Text>bar</Text>
    </SwipeableRow3>
  ))
  .add('with release', () => (
    <SwipeableRow3
      renderLeftActions={(width)=>
        <Animated.View style={{width:width}}>
          <Text numberOfLines={1}>foo1</Text>
        </Animated.View>}
      renderRightActions={(width)=>
        <Animated.View style={{width:width}}>
          <Text numberOfLines={1}>foo2</Text>
        </Animated.View>}
      onSwipeEnd={(evt, gestureState)=>{
          0 < gestureState.dx ?
          action('left action')(evt, gestureState) :
          action('right action')(evt, gestureState)
        }}
      style={{marginTop:20}}>
        <Text>bar</Text>
    </SwipeableRow3>
  ))
  .add('with actions', () => {
    const { leftActions, rightActions } = genActions('liked');
    return(
      <SwipeableRow3
        renderLeftActions={(width)=>
          <SwipeableActions
            style={{width:width}}
            actions={leftActions}/>
                          }
        renderRightActions={(width)=>
          <SwipeableActions
             style={{width:width}}
             actions={rightActions}/>
                           }
        onSwipeEnd={(evt, gestureState)=>{
            0 < gestureState.dx ?
            action('left action')(evt, gestureState) :
            action('right action')(evt, gestureState)
          }}
        style={{marginTop:20}}>
          <Text>bar</Text>
      </SwipeableRow3>
    )})
  .add('with row', () =>(
      <Row />
  ))
