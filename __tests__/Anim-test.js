//importing 'react-native' seems to break Promise and setTimeout.
//use require() instead of import, so we can save these first, and restore them after require('react-native')
//https://github.com/facebook/react-native/issues/6104#issuecomment-245827616
const SavePromise = Promise;
const saveSetTimeout = setTimeout;

var Animated = require('Animated');
var { Stylish } = require('../Stylish');

jest
  .disableAutomock()
  .setMock('Text', {})
  .setMock('View', {})
  .setMock('Image', {})
  .setMock('ScrollView', {})

import React from 'react';
const {
  Platform,
  //Animated
} = require('react-native');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

Promise = SavePromise;
setTimeout = saveSetTimeout;

describe('Animated tests', () => {
  beforeEach(() => {
    //jest.resetModules();
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
      <Stylish.View style={initialStyle}/>
    );
    const inst = tree.getInstance();
    expect(inst.state.animatedStyle)
      .toEqual(initialStyle);
    expect(inst.prevStyle)
      .toEqual(initialStyle);

    const callback = jest.fn();
    const foo = inst.animateTo(nextStyle)//.then(callback);
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
      <Stylish.View style={initialStyle}/>
    );
    tree.update(
      <Stylish.View style={nextStyle}/>
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
  /* it('renders correctly2', () => {
   *   let c = new AnimView({style:initialStyle});
   *   //unmounted component cannot update state
   * });*/
});
