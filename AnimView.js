import React from 'react';

import {
  StyleSheet,
  Animated
} from 'react-native';

class AnimView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedStyle: props.style &&
                     StyleSheet.flatten(props.style)
    };
    this.prevStyle = this.state.animatedStyle;
  }
  componentWillReceiveProps(nextProps) {
    // console.log('willReceiveProps', nextProps);
    this.animateTo(nextProps.style);
  }
  animate(fromValues, toValues) {
    this.prevStyle = fromValues;
    return this.animateTo(toValues);
  }
  // https://github.com/joshwcomeau/react-flip-move#enterleave-animations
  animateTo(nextStyle) {
    // duration,easing jquery
    // console.log('animate');
    // this.animating = true;
    this.counter = new Animated.Value(0);
    const current = StyleSheet.flatten(this.prevStyle);
    const next = StyleSheet.flatten(nextStyle);
    const animatedStyle = 
      Object.keys(next)
            .filter((key) =>
              (typeof next[key] === 'number' || key.toLowerCase().endsWith('color'))
            )
            .reduce((acc,key)=>{
              console.log("key",key,acc)
              acc[key] = this.counter.interpolate({
                inputRange: [0, 1],
                outputRange: [current[key], next[key]],
              })
              return acc
            },{})
    //console.log("as",animatedStyle)
          // transform is ordered array!!
          /* console.log("ab",current['transform'],next['transform']);
           * animatedStyle['transform'] =
           *   [Object.keys(next['transform'][0])
           *         .map((transformKey)=>console.log("ke",transformKey))
           *         .filter((transformKey)=>
           *           next['transform'][0][transformKey]!==
           *             current['transform'][0][transformKey])
           *         .reduce((acc,transformKey)=>{
           *           acc[transformKey] = this.counter.interpolate({
           *             inputRange: [0, 1],
           *             outputRange: [current[key], next[key]],
           *           })
           *           return acc;
           *         },{...next['transform'][0]})] || next['transform']
           * console.log("as",animatedStyle['transform']);*/

    this.prevStyle = next;
    return new Promise((resolve, reject) => {
      // resolve("done");
      this.setState({ animatedStyle }, () => {
        Animated.timing(
          this.counter,
          { toValue: 1,
            duration: (this.props.anim && this.props.anim.duration)
                   || 180,
            delay: (this.props.anim && this.props.anim.delay) || 0
            //duration: 180,
          }
        ).start(() => {
          resolve();
        });
      });
    });
  }
  setNativeProps(props){
    //for Touchable
    this.refs.root.setNativeProps(props)
  }
  render() {
    const {style,...props} = this.props;
    return (
      // style={[this.state.style,]}
      <Animated.View
        ref="root"
        {...props}
        style={[style,this.state.animatedStyle]}
      />
    );
  }
}

module.exports = { AnimView };
