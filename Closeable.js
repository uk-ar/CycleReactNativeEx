import React from 'react';

import {
  View,
  // TouchableHighlight,
  // TouchableNativeFeedback
  StyleSheet
} from 'react-native';

import Stylish from 'react-native-stylish';

import { MeasureableView } from './SwipeableRow';
const ReactTransitionGroup = require('react-addons-transition-group');

// https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775#gistcomment-1574787
class CloseableView extends React.Component {
  // TODO:High Order Component can remove inner view
  constructor(props) {
    super(props);
    this.state = {
      close: this.props.close,
      style: this.props.close ? { height: 0.01 } : { height: null }
    };
    /* this.initialStyle =
     *   this.props.close ? { height: 1 } : { height: null };*/
  }
  open(onComplete) {
    //keys=['height', 'opacity', 'transform']
    //return new Promise((resolve, reject) => {
      //console.log("start open")
      this.inner.measure((x, y, width, height) => {
        // TODO:filter Props
        //this.style = { height, opacity: 1, transform: [{ scale: 1 }] };
        //this.style = { height };
        //this.style = { opacity: 1, transform: [{ scale: 1 }] };
        this.setState({
          close: false,//relative
          //style: { height, opacity: 1, transform: [{ scale: 1 }] }
        }, () => { // widen
          this.outer.animate(
            { height: 0.01, opacity: 0.1, transform: [{ scale: 0.1 }] },
            { height, opacity: 1, transform: [{ scale: 1 }] },
            //{ height: 0.01 }
            //{ opacity: 0.1, transform: [{ scale: 0.1 }]}
            () => {
              this.setState({
                style: { height: null }
              },onComplete)
            }
            )
        });
      });
    //});
  }
  close(onComplete) {
    //return new Promise((resolve, reject) => {
      //console.log("start close")
      this.inner.measure((x, y, width, height) => {
        //console.log("measure close",x, y, width, height,this,this.inner)
        //this.style = ;
        this.outer.animate(
          { height, opacity: 1, transform: [{ scale: 1 }] },
          { height: 0.01, opacity: 0.1, transform: [{ scale: 0.1 }] },
          //this.style
          () => {
            this.setState({
              close: true,// shrink//absolute
              style: { height: 0.01 }
            },onComplete);
            //console.log("finish closed")
            //resolve();
          }
        )
            //.then()
            //.catch(() => { throw new Error("foo") })
        /* this.setState({close:true},()=>{
         *   this.outer.animate(
         *     { height, opacity: 1, transform: [{ scale: 1 }] },
         *     { height: 0.01, opacity: 0.1, transform: [{ scale: 0.1 }] }
         *     //this.style
         *   )
         *       .then(() => {
         *         this.setState({ close: true });// shrink//absolute
         *         console.log("finish closed")
         *         resolve();
         *       });*/
      });
    //});
  }
  toggle() {
    return (this.state.close ? this.open() : this.close());
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.close !== nextProps.close) {
      this.toggle();
    }
  }
  /* componentDidMount() {
   *   console.log('didmount');
   * }*/
  render() {
    const { animationConfig, style, close, ...props } = this.props
    //console.log("cl",this,this.props.close,this.state.close,this.style)
    const content = (
      <Stylish.View
        ref={c => (this.outer = c)}
        collapsable={false}
      style={[//this.style,
          //this.initialStyle,
          this.state.style,
              //this.state.close ? { height: 0.01 } : { height: null },
                { overflow: 'hidden'}]}
        animationConfig={animationConfig}
      >
        <View
          ref={c => (this.inner = c)}
          collapsable={false}
          {...props}
          style={[style,
                  this.state.close ? // to measure height
                  { position: 'absolute' } : null]}
        />
      </Stylish.View>
    );
    this.initialStyle = null;
    return content;
  }
}
// willRecieveProps
// withPropsWillChange("key",(old,new)=>)
// {key1:,key2:}
// [key1,key2],func
// props to state
function willRecieveProps(key, fn) {
  // console.log("p:",key,Object.keys(key))
  return (WrappedComponent) => {
    return class extends WrappedComponent {
      render() {
        // console.log("iiHOC",this.props,this.state)
        return super.render();
      }
      componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        // this.close.bind(this)();
        fn(this);
        /* if(this.props[key] !== nextProps[key]){
         *   fn.bind(this)(this.props[key],nextProps[key]);
         * }*/
      }
    };
  };
}

function makeLayoutableComponent(BaseComponent){
  return class extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = { layouted: false };
    }
    render(){
      const { onFirstLayout, ...props } = this.props;
      //Add firstLayoutProps?
      return (
        this.state.layouted ?
        <BaseComponent {...this.props}/> :
        <BaseComponent
          {...props}
          onLayout={(...args) => {
              onFirstLayout(...args);
              this.setState({ layouted: true });
            }}
        />)
    }
  }
}

class LayoutableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //props.transitionEnter
      layouted: props.transitionEnter ? false : true
    };
  }
  close(onComplete){
    return this.closeable.close(onComplete)
  }
  open(onComplete){
    return this.closeable.open(onComplete)
  }
  render(){
    //this.props.data.length
    const { transitionEnter, onLayout, ...props } = this.props
    //const {transform,...otherStyle} = this.state.style
    //animationConfig={{delay:1000,duration:1000}}
    /* onLayout={(...args)=> {
     *   if(!this.state.layouted){
     *     this.setState({layouted:true})
     *   }
     *   //onLayout(...args)
     * }}*/
    return (
      <CloseableView
        ref={ c => this.closeable = c }
        close={this.state.layouted ? false : true}
        onLayout={this.state.layouted ? null : ()=>
          this.setState({layouted:true})}
        {...props}
      />
    )
  }
}

//const LayoutableView = makeLayoutableComponent(AnimView);

LayoutableView.propTypes = {
  ...View.propTypes,//  ...Closeable.propTypes,
};

LayoutableView.defaultProps = {
  ...View.defaultProps,
  //transitionEnter: true,
};

module.exports = { CloseableView, LayoutableView };
