import 'react-native';
import React from 'react';

/* jest
 *   .disableAutomock()*/

//var Animated = require('Animated');
var { AnimView, MeasureableView } = require('../SwipeableRow');
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//jest
  //.mock('Animated.View');
  //.mock('View');
/* jest
 *   .disableAutomock()
 * //.setMock('Text', {})
 *   .setMock('Animated', {})*/
//.setMock('Image', {})
//.setMock('ScrollView', {})
//.setMock('React', {Component: class {}})
/* .mock('AnimView', () => {
 *   const jestReactNative = require('jest-react-native');
 *   return jestReactNative.mockComponent('AnimView');
 * });*/

describe('Animated tests', () => {
  beforeEach(() => {
    //jest.resetModules();
  });

  /* it('works end to end', () => {
   *   var anim = new Animated.Value(0);

   *   var callback = jest.fn();

   *   var node = new Animated.__PropsOnlyForTests({
   *     style: {
   *       backgroundColor: 'red',
   *       opacity: anim,
   *       transform: [
   *         {translateX: anim.interpolate({
   *           inputRange: [0, 1],
   *           outputRange: [100, 200],
   *         })},
   *         {scale: anim},
   *       ]
   *     }
   *   }, callback);

   *   expect(anim.__getChildren().length).toBe(3);

   *   expect(node.__getValue()).toEqual({
   *     style: {
   *       backgroundColor: 'red',
   *       opacity: 0,
   *       transform: [
   *         {translateX: 100},
   *         {scale: 0},
   *       ],
   *     },
   *   });

   *   anim.setValue(0.5);

   *   expect(callback).toBeCalled();

   *   expect(node.__getValue()).toEqual({
   *     style: {
   *       backgroundColor: 'red',
   *       opacity: 0.5,
   *       transform: [
   *         {translateX: 150},
   *         {scale: 0.5},
   *       ],
   *     },
   *   });

   *   node.__detach();
   *   expect(anim.__getChildren().length).toBe(0);

   *   anim.setValue(1);
   *   expect(callback.mock.calls.length).toBe(1);
   * });*/
  /* it('does not detach on updates', () => {
   *   var c = new AnimView();
   *   c.props = {
   *     style: {
   *       opacity: 0,
   *     },
   *   };
   *   c.componentWillMount();

   *   //expect(anim.__detach).not.toBeCalled();
   *   c._component = {};
   *   c.componentWillReceiveProps({
   *     style: {
   *       opacity: anim,
   *     },
   *   });
   *   //expect(anim.__detach).not.toBeCalled();

   *   c.componentWillUnmount();
   *   //expect(anim.__detach).toBeCalled();
   * });*/

  it('renders correctly', () => {
    const tree = renderer.create(
      <AnimView />
    ).toJSON();
    //tree.state.
    //expect(tree.props.style).toEqual({});
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly2', () => {
    var c = new AnimView({
      style: {
        width:1,
        height:2
      }});
    c.componentWillMount();
    /* c.props = {
     *   
     * };*/
    c.componentWillReceiveProps({style:{width:3,height:4}});
    console.log(c)
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
