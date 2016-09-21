//importing 'react-native' seems to break Promise and setTimeout.
//use require() instead of import, so we can save these first, and restore them after require('react-native')
//https://github.com/facebook/react-native/issues/6104#issuecomment-245827616
const SavePromise = Promise;
const saveSetTimeout = setTimeout;

var Animated = require('Animated');
var { AnimView } = require('../AnimView');
const {
  View,
  //Animated
} = require('react-native');

import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

Promise = SavePromise;
setTimeout = saveSetTimeout;

describe('Animated tests', () => {
  beforeEach(() => {
    //jest.resetModules();
  });
  
  /* it("promises work?", () => {
   *   return Promise.resolve().then(() => {
   *     expect(true).toBe(true)
   *   })
   * })*/
  it('renders 1 animated.view component', () => {
    const tree = renderer.create(<AnimView/>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders children when passed in', () => {
    const tree = renderer.create(
      <AnimView>
        <View key="foo"/>
      </AnimView>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  //https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/__tests__/Animated-test.js#L27
  //https://github.com/facebook/react/blob/master/src/renderers/testing/__tests__/ReactTestRenderer-test.js
  const initialStyle = {
    width:1,
    height:2
  }
  const nextStyle = {
    width:3,
    height:4
  }
  it('animate correctly by animateTo', async () => {
    const tree = renderer.create(
      <AnimView style={initialStyle}/>
    );
    const inst = tree.getInstance();
    expect(inst.state.animatedStyle)
      .toEqual(initialStyle);
    expect(inst.prevStyle)
      .toEqual(initialStyle);

    const callback = jest.fn();
    const foo = inst.animateTo(nextStyle).then(callback);
    jest.runAllTimers();
    //expect(callback).toBeCalled();
    expect(inst.state.animatedStyle.width.__getValue())
      .toEqual(3);
    expect(inst.state.animatedStyle.height.__getValue())
      .toEqual(4);
    expect(tree.toJSON()).toMatchSnapshot();
  })
  it('animate correctly by props change', async () => {
    const tree = renderer.create(
      <AnimView style={initialStyle}/>
    );
    tree.update(
      <AnimView style={nextStyle}/>
    );
    jest.runAllTimers();
    //expect(callback).toBeCalled();
    const inst = tree.getInstance();
    expect(inst.state.animatedStyle.width.__getValue())
      .toEqual(3);
    expect(inst.state.animatedStyle.height.__getValue())
      .toEqual(4);

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders onPress to be called', () => {
    const callback = jest.fn();
    const tree = renderer.create(<AnimView onPress={callback}/>);
    tree.getInstance().props.onPress()
    expect(callback).toBeCalled();
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
