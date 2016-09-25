import React from 'react';

import {
  StyleSheet,
  Animated
} from 'react-native';

class AnimView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedStyle: props && props.style &&
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
      Object.assign({}, next);
    // check for initial
    next &&
      Object.keys(next).map((key) => {
        // remove if with filter & merge
        // console.log("k:",key,typeof next[key] === "number",key == "backgroundColor" || key == "color",current[key] != next[key],current[key],next[key])
        if (((typeof current[key] === 'number' && typeof next[key] === 'number') |
             key.endsWith('Color') ||
             key == 'color')
            && current[key] !== next[key]
        ) {
          // console.log("an",current[key],next[key]);
          animatedStyle[key] = this.counter.interpolate({
            inputRange: [0, 1],
            outputRange: [current[key], next[key]],
          });
        } else if (key === 'transform' && current.transform) {
          // current next
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
        }
      });

    this.prevStyle = next;
    return new Promise((resolve, reject) => {
      // resolve("done");
      this.setState({ animatedStyle }, () => {
        Animated.timing(
          this.counter,
          { toValue: 1,
            duration: (this.props.anim && this.props.anim.duration)
                   || 500, //180,
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
    // console.log("rend anim,view1,view2",this.state.animatedStyle,this.props.style)
    return (
      // style={[this.state.style,]}
      <Animated.View
        ref="root"
        {...this.props}
        style={[this.state.animatedStyle]}
      >
        {this.props.children}
      </Animated.View>);
  }
}

module.exports = { AnimView };
