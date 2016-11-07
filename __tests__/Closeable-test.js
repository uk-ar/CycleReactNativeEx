//importing 'react-native' seems to break Promise and setTimeout.
//use require() instead of import, so we can save these first, and restore them after require('react-native')
//https://github.com/facebook/react-native/issues/6104#issuecomment-245827616
const SavePromise = Promise;
const saveSetTimeout = setTimeout;

const { CloseableView } = require('../Closeable');

const {
  View,
  //Animated
} = require('react-native');

import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

Promise = SavePromise;
setTimeout = saveSetTimeout;

jest
  .disableAutomock()
  .useFakeTimers()

describe('Closeable tests', () => {
  beforeEach(() => {
    //jest.resetModules();
  });

  it('renders 1 CloseableView component', () => {
    const tree = renderer.create(<CloseableView/>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders children when passed in', () => {
    const tree = renderer.create(
      <CloseableView>
        <View key="foo"/>
      </CloseableView>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('with close props true', async () => {
    const tree = renderer.create(
      <CloseableView close={true}/>
    );
    const inst = tree.getInstance();
    jest.runAllTimers();
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('with close props false', async () => {
    const tree = renderer.create(
      <CloseableView close={false}/>
    );
    const inst = tree.getInstance();
    jest.runAllTimers();
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('animate correctly by open()', async () => {
    const tree = renderer.create(
      <CloseableView close={true}/>
    );
    const inst = tree.getInstance();
    const callback = jest.fn();
    const foo = inst.open(callback)
    jest.runAllTimers();
    //expect(callback).toBeCalled();
    expect(tree.toJSON()).toMatchSnapshot();
  })
  it('animate correctly by props change', async () => {
    const tree = renderer.create(
      <CloseableView close={true}/>
    );
    tree.update(
      <CloseableView close={false}/>
    );
    jest.runAllTimers();
    //expect(callback).toBeCalled();
    const inst = tree.getInstance();

    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders onPress to be called', () => {
    const callback = jest.fn();
    const tree = renderer.create(<CloseableView onPress={callback}/>);
    tree.getInstance().props.onPress()
    expect(callback).toBeCalled();
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
