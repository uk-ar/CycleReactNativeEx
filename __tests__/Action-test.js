const { Action, genActions2 } = require('../Action');

const {
  View,
  //Animated
} = require('react-native');

import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest
  .disableAutomock()

describe('Action tests', () => {
  beforeEach(() => {
    //jest.resetModules();
  });

  it('renders 1 CloseableView component', () => {
    const tree = renderer.create(<Action/>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  /* it('renders children when passed in', () => {
   *   const tree = renderer.create(
   *     <Action>
   *       <View key="foo"/>
   *     </CloseableView>);
   *   expect(tree.toJSON()).toMatchSnapshot();
   * });*/
});
