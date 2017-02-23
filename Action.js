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
    /* {
     *   //passed
     *   flexDirection:"row-reverse",
     *   alignItems:"center",
     *   flex:1, //verticalCenter
     *   padding:10,
     *   paddingRight:0,
     *   //backgroundColor:backgroundColor,
     * },*/
    <Stylish.View
      {...props}
      style={style}>
      <FAIcon
        name={icon} size={20}
        style={{
          //margin:5,
        }}
      />
      <View style={{
        width:5,
        backgroundColor:"yellow"
      }}/>
      <Text
        style={{
          //numberOfLines={1}
          alignSelf:"center",
          //position:"absolute",
        }}
      >
        {text || ""}
      </Text>
    </Stylish.View>
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
        backgroundColor: nop.backgroundColor,
        //justifyContent: 'flex-end'
      } },
    { ...getProps(bucket, 'liked'),
      style: {
        flexDirection: 'row',
        width: width / 2,
        backgroundColor: getProps(bucket, 'liked').backgroundColor,
      } },
    { ...getProps(bucket, 'borrowed'),
      style: {
        flexDirection: 'row',
        width,
        backgroundColor: getProps(bucket, 'borrowed').backgroundColor,
      } }
  ];
  const rightActions = [
    { ...getProps(bucket, 'done'),
      ...nop,
      style: {
        flexDirection: 'row-reverse',
        backgroundColor: nop.backgroundColor,
        //justifyContent: 'flex-end'
      } },
    { ...getProps(bucket, 'done'),
      style: {
        flexDirection: 'row-reverse',
        width,
        backgroundColor: getProps(bucket, 'done').backgroundColor,
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
    const {leftActions,rightActions} = genActions2(props.bucket);
    //this.leftActions = leftActions;
    //this.rightActions = rightActions;
    this.actionProps = props.left ? leftActions : rightActions
  }
  render() {
    //console.log(this.props)
    const { index, left, indexLock, ...props } = this.props
    //onBackgroundColorChange(actionProps[index].backgroundColor)
    //console.log("ba",index,this.actionProps[index].backgroundColor,this.styles)
    return (
      <Stylish.View
        style={[{
          backgroundColor:this.actionProps[index].backgroundColor,
          flex:1, //verticalCenter
          paddingVertical:10,
          }, left ? {paddingLeft:10} : {paddingRight:10}
          ]}
        animationConfig={{duration:300}}
      >
        <View style={{flex:1}}/>
        <View
          style={indexLock && {width:WIDTH}}>
          <Action {...this.actionProps[index]}
            style={this.actionProps[index].style}/>
        </View>
        <View style={{flex:1}}/>
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

//TODO:
class Action3 extends React.PureComponent {
  render(){
    const { left, icon, text, backgroundColor, target, ...props } = this.props
    return (
      <Stylish.View
        style={[{
            backgroundColor:backgroundColor,
            flex:1, //verticalCenter
            paddingVertical:10,
          },left ? {paddingLeft:10} : {paddingRight:10}]}
        animationConfig={{duration:300}}
      >
        <View style={{flex:1}}/>
        <View
          style={left ?
                 {flexDirection:"row"} :
                 {flexDirection:"row-reverse"}
            /* row or row-reverse */}>
          <FAIcon
            name={icon} size={20}
            style={{
              //margin:5,
            }}
          />
          <View style={{width:5}}></View>
          <Text
            style={{
              //numberOfLines={1}
              alignSelf:"center",
              //position:"absolute",
            }}
          >
            {text || ""}
          </Text>
        </View>
        <View style={{flex:1}}/>
      </Stylish.View>
    );
  }
}

module.exports = { Action, Action2,Action3, genActions2 };
