//importing 'react-native' seems to break Promise and setTimeout.
//use require() instead of import, so we can save these first, and restore them after require('react-native')
//https://github.com/facebook/react-native/issues/6104#issuecomment-245827616
const SavePromise = Promise;
const saveSetTimeout = setTimeout;

var Animated = require('Animated');
var { AnimView } = require('../AnimView');

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
      <AnimView style={initialStyle}/>
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
  it('renders correctly2', () => {
    const initialStyle = {
      width:1,
      height:2
    }
    let c = new AnimView({style:initialStyle});
    //c.props = {style:initialStyle}
    expect(c.state).toEqual({
      animatedStyle:initialStyle });
    const nextStyle = {
      width:3,
      height:4
    }
    c.props = {style:nextStyle}
    //c.componentWillReceiveProps({style:nextStyle})
    //console.log(c)
    /* const tree = renderer.create(
     *   <AnimView style={{width:1,height:2}}/>
     * )//.toJSON();
     * console.log(tree)
     * tree.componentWillReceiveProps(
     *   {style:{width:1,height:2}})
     * //tree.state.
     * //expect(tree.props.style).toEqual({});
     * expect(tree.toJSON()).toMatchSnapshot();*/
  });
});
