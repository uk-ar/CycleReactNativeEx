
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Animated
} from 'react-native';
/* 
enzyme(react-native-mock) problems
- cannot getvalue from animatedvalue
- cannot mock timer
*/
import { shallow,render,mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

//"test":"mocha --require react-native-mock/mock.js --compilers js:babel-core/register --recursive -w test/MyComponent.js"
import { AnimView } from '../AnimView';

//https://medium.com/@thisbejim/testing-react-native-components-with-enzyme-d46bf735540#.h5z3bfmbl
//http://airbnb.io/enzyme/#-shallow-rendering-docs-api-shallow-md

describe('<AnimView />', () => {
  it('renders 1 animated.view component', () => {
    const wrapper = shallow(<AnimView/>);
    expect(wrapper.find(Animated.View)).to.have.length(1);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow(
      <AnimView>
        <View key="foo"/>
      </AnimView>);
    expect(wrapper.contains(<View key="foo"/>)).to.equal(true);
  });

  it('has animatedStyle state', () => {
    const wrapper = shallow(<AnimView/>);
    expect(wrapper.state().animatedStyle).to.equal(undefined);
  });
  
  const initialStyle = {width:1, height:2}
  const nextStyle    = {width:3, height:4}
  
  it('has animatedStyle when passed in?', () => {
    const wrapper = shallow(
      <AnimView style={initialStyle}/>
    ).instance();
    expect(wrapper.state.animatedStyle).to.deep.equal(initialStyle);
    expect(wrapper.prevStyle).to.deep.equal(initialStyle);
  });

  //https://github.com/facebook/react-native/blob/master/Libraries/Experimental/WindowedListView.js
  //https://github.com/facebook/react-native/blob/master/Libraries/Experimental/IncrementalExample.js
  it('has animatedStyle when changed style props', () => {
    const wrapper = shallow(
      <AnimView style={initialStyle}/>
    )
    const inst = wrapper.instance();
    wrapper.setProps({style:nextStyle})
    expect(inst.state.animatedStyle.width).to.equal(nextStyle);
    //expect(wrapper.state().animatedStyle.width).to.equal(nextStyle);
    //expect(inst.prevStyle).to.deep.equal(nextStyle);
    /* return inst.animateTo(nextStyle).then((foo)=>{
     *   //expect(inst.state.animatedStyle.width).to.equal(nextStyle);
     *   //expect(inst.prevStyle).to.deep.equal(nextStyle);
     * })*/
  });

  it('has animatedStyle when animateTo', () => {
    const wrapper = shallow(
      <AnimView style={initialStyle}/>
    )
    const inst = wrapper.instance();
    //wrapper.setProps({style:nextStyle})
    
    return inst.animateTo(nextStyle).then((foo)=>{
      expect(inst.state.animatedStyle.width).to.equal(nextStyle);
      //expect(inst.prevStyle).to.deep.equal(nextStyle);
    })
  });
  
  it('simulates press events', () => {
    const onPress = sinon.spy();
    const wrapper = shallow(
      <AnimView onPress={onPress} />
    );
    expect(wrapper.find(Animated.View)).to.have.length(1);
    wrapper.find(Animated.View).simulate('press');
    expect(onPress).to.have.property('callCount', 1);
  });
});
