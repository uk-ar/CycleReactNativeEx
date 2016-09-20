// __tests__/BookCell-test.js
import 'react-native';
import React from 'react';

//import '../auto_mock_off';
//import { BookRow, LibraryStatus,BookCell } from '../BookCell';
//import LibraryStatus from '../BookCell';
// Note: test renderer must be required after react-native.

/* jest
 *   .disableAutomock()
 *   .setMock('Icon', {})*/
/* jest.mock('Icon', () => {
 *   const jestReactNative = require('jest-react-native');
 *   return jestReactNative.mockComponent('Icon');
 * });*/
//jest.mock('Icon')
//jest.enableAutomock() 

//var FAIcon = require('react-native-vector-icons/FontAwesome');
var {BookRow, LibraryStatus,BookCell} = require('../BookCell');

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <LibraryStatus />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
