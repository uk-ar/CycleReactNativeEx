import React from 'react';

import {
  View,
  // TouchableHighlight,
  // TouchableNativeFeedback
} from 'react-native';

import { AnimView } from './AnimView';
import { MeasureableView } from './SwipeableRow';
const ReactTransitionGroup = require('react-addons-transition-group');

// https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775#gistcomment-1574787
class Closeable3 extends React.Component {
  // TODO:High Order Component can remove inner view
  constructor(props) {
    super(props);
    this.state = { close: this.props.close };
    this.style = this.props.close ? { height: 0.01 } : { height: null };
  }
  open() {
    return new Promise((resolve, reject) => {
      this.inner.measure((x, y, width, height) => {
        // TODO:filter Props
        this.style = { height, opacity: 1, transform: [{ scale: 1 }] };
        this.setState({ close: false }, () => { // widen
          this.outer.animate(
            { opacity: 0.1, transform: [{ scale: 0.1 }], height: 0.01 }, this.style)
              .then(() => {
                resolve();
              });
        });
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.inner.measure((x, y, width, height) => {
        this.style = { height: 0.01, opacity: 0.1, transform: [{ scale: 0.1 }] };
        this.outer.animate(
          { height, opacity: 1, transform: [{ scale: 1 }] }, this.style)
            .then(() => {
              this.setState({ close: true });// shrink
              resolve();
            });
      });
    });
  }
  toggle() {
    return (this.state.close ? this.open() : this.close());
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.close !== nextProps.close) {
      this.toggle();
    }
  }
  componentDidMount() {
    console.log('didmount');
  }
  render() {
    return (
      <AnimView
        style={[this.style,
                { overflow: 'hidden' }]}
        ref={c => this.outer = c}
      >
        <View
          ref={c => this.inner = c}
          {...this.props}
          style={[this.props.style,
                  this.state.close ?
                  { position: 'absolute' } : null]}
        >
          {this.props.children}
        </View>
      </AnimView>
    );
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
// this.toggle

// TODO:refactor
class Closeable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { layouted: false };
    /* this.initialStyle = { height: null };
     * this.closedStyle = { height: 0.01 };
     * this.state = { style: this.initialStyle };*/
  }
  close() {
    this.style = this.calcStyle(true);
    return this.refs.root.animateTo(this.style);
  }
  open() {
    this.style = this.calcStyle(false);
    return this.refs.root.animateTo(this.style);
  }
  toggle() {
    const closedStyle = this.calcStyle(true);
    if ((this.style.width === closedStyle.width) &&
        (this.style.height === closedStyle.height)) {
      this.style = this.calcStyle(false);
    } else {
      this.style = this.calcStyle(true);
    }
    console.log('st:', this.style);
    return this.refs.root.animateTo(this.style);
  }
  calcStyle(close) {
    const style = !this.state.layouted ?
                  { width: null, height: null } : close ?
                  { width: 0.01, height: 0.01 } :
                  { width: this.contentWidth, height: this.contentHeight };
    if (this.props.direction == 'horizontal') {
      // style.height = null;
      return { width: style.width };
    } else if (this.props.direction == 'vertical') {
      // style.width  = null;
      return { height: style.height };
    } else {
      return style;
    }
  }
  // horizontal
  // promise
  render() {
    // on the fly measureing cannot working when closed -> open
    this.style = this.calcStyle(this.props.close);
    console.log('st:', this.style);
    return (
      // not to optimize
      // add absolute from parent when measureing
      // first:  close -> absolute, open -> null
      // second: close -> absolute, open -> null
      <AnimView
        style={[{// .vertical closable
          overflow: 'hidden',
                 //flexDirection:"row",//not to resize text when horizontal
        }, this.style]}
        ref="root"
      >
        { /* open ? tracking view : non tracking */ }
        <MeasureableView
          onFirstLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
            console.log('h:', height);
            this.contentWidth = width;
            this.contentHeight = height;
            this.setState({ layouted: true });
          }}
          style={[this.props.style, { overflow: 'hidden' }]}
        >
          {this.props.children}
        </MeasureableView>
      </AnimView>
    );
  }
}

module.exports = { Closeable, Closeable3 };
