import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {
  Text,
  View,
} from 'react-native';

import materialColor from 'material-colors';
import emptyFunction from 'fbjs/lib/emptyFunction';

import _ from 'lodash';
import Stylish from 'react-native-stylish';
import { itemsInfo } from './common';

import Dimensions from 'Dimensions';

const {
  width,
} = Dimensions.get('window');

const {
  width:WIDTH,
} = Dimensions.get('window');

// bucket,target->icon,text,backgroundColor,close,target
class Action extends React.PureComponent {
//function Action({ icon, text, backgroundColor, target, style, ...props }) {
  // backgroundColor,target are used from SwipeableActions
  //console.log("pro",style,text,icon)
  render(){
    const { icon, text, backgroundColor, target, style, ...props } = this.props
  return (
    //FIXME:backgroundColor must handle upper because of half width action
    /* <Stylish.View
        style={{backgroundColor:backgroundColor}}> */
    <View
      {...props}
      style={[{
          //passed
          flexDirection:"row-reverse",
          alignItems:"center",
          flex:1, //verticalCenter
          padding:10,
        paddingRight:0,
          //backgroundColor:backgroundColor,
        },style]}>
      <FAIcon
        name={icon} size={20}
        style={{
          //margin:5,
        }}
      />
      {text ?
       <Text
         style={{
           //numberOfLines={1}
           margin:5,
           //position:"absolute",
         }}
       >
         {text}
       </Text>
       : null }
    </View>
    //</Stylish.View>
  );
}}

Action.propTypes = {
  icon:React.PropTypes.string,
  text:React.PropTypes.string,
  backgroundColor:React.PropTypes.string,
  target:React.PropTypes.string,
};

Action.defaultProps = {
  //
};

function genActions2(bucket) {
  function getProps(self, target) {
    let { icon, text, backgroundColor } = itemsInfo[target];
    if (target === self) {
      ({ icon, text } = { text: '先頭に移動', icon: 'level-up' });
    }
    return { icon, text, backgroundColor, /* close: true, */ target };
  }
  const nop = {
    text: null, backgroundColor: materialColor.grey[300], /* close: false, */ target: null };
  const leftActions = [
    { ...getProps(bucket, 'liked'),
      ...nop,
      style: {
        flexDirection: 'row',
        //justifyContent: 'flex-end'
      } },
    { ...getProps(bucket, 'liked'),
      style: {
        flexDirection: 'row',
        width: width / 2 } },
    { ...getProps(bucket, 'borrowed'),
      style: {
        flexDirection: 'row',
        width
      } }
  ];
  const rightActions = [
    { ...getProps(bucket, 'done'),
      ...nop,
      style: {
        flexDirection: 'row-reverse',
        //justifyContent: 'flex-end'
      } },
    { ...getProps(bucket, 'done'),
      style: {
        flexDirection: 'row-reverse',
        width
      } }
  ];
  return { leftActions, rightActions };
}

class Action2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //thresholds:[],
    }
    const {leftActions,rightActions} = genActions2();
    //this.leftActions = leftActions;
    //this.rightActions = rightActions;
    this.actionProps = props.left ? leftActions : rightActions
    this.styles = this.actionProps.map((props)=>
      ({backgroundColor:props.backgroundColor}))
  }
  render() {
    console.log(this.props)
    const { index, left, indexLock, ...props } = this.props
    //onBackgroundColorChange(actionProps[index].backgroundColor)
    console.log("ba",this.actionProps[index].backgroundColor,this.styles)
    return(
      <Stylish.View
        style={this.styles[index]}>
        <View
          style={indexLock && {width:WIDTH}}>
          <Action {...this.actionProps[index]}
            style={this.actionProps[index].style}/>
        </View>
      </Stylish.View>
    )
  }
}

Action2.propTypes = {
  ...View.propTypes,
  //onBackgroundColorChange:  React.PropTypes.func.isRequired,
  //indexLock: React.PropTypes.bool,
};
Action2.defaultProps = {
  ...View.defaultProps,
  //onBackgroundColorChange: emptyFunction,
};

module.exports = { Action, Action2, genActions2 };
