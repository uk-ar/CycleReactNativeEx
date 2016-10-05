import React from 'react';

import {
  View,
  // TouchableHighlight,
  // TouchableNativeFeedback
  StyleSheet
} from 'react-native';

import { AnimView } from './AnimView';
import { MeasureableView } from './SwipeableRow';
const ReactTransitionGroup = require('react-addons-transition-group');

// https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775#gistcomment-1574787
class CloseableView extends React.Component {
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
                { overflow: 'hidden'}]}
        ref={c => this.outer = c}
      >
        <View
          collapsable={false}
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
      layouted: props.disable ? true : false
    };
  }
  render(){
    //this.props.data.length
    const { disable, onLayout, ...props } = this.props
    //const {transform,...otherStyle} = this.state.style
    return (
      <CloseableView
        ref={ c => this.closable = c }
        close={this.state.layouted ? false : true}
        onLayout={(...args)=>{
            if(!this.state.layouted){
              this.setState({layouted:true})
            }
            onLayout(...args)
          }}
        {...props}
      />
    )
  }
}

//const LayoutableView = makeLayoutableComponent(AnimView);

LayoutableView.propTypes = {
  ...View.propTypes,//  ...Closable.propTypes,
  onLayout:React.PropTypes.func,
};

LayoutableView.defaultProps = {
  ...View.defaultProps,
  onLayout:function(){},
};

module.exports = { CloseableView, LayoutableView };
