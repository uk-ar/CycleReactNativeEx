import React from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { shallow,render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { AnimView, MeasureableView } from '../SwipeableRow';

const Test = React.createClass({
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View>
          <Text>enzyme</Text>
          <Text>rules</Text>
        </View>
      </TouchableHighlight>
    )
  }
});

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

  it('has animatedStyle when passed in', () => {
    const wrapper = shallow(
      <AnimView style={{width:10,height:20}}/>
    );
    expect(wrapper.state().animatedStyle).to.deep.equal({width:10,height:20});
  });

  //https://github.com/facebook/react-native/blob/master/Libraries/Experimental/WindowedListView.js
  //https://github.com/facebook/react-native/blob/master/Libraries/Experimental/IncrementalExample.js
  it('has animatedStyle when changed style', () => {
    const wrapper = shallow(
      <AnimView style={{width:10,height:20}}/>
    );
    //expect(wrapper.find(View)).to.have.length(1);//not to mock Animated.View
    /* wrapper.instance().animateTo({width:0,height:0}).then(()=>
     *   expect(wrapper.state().animatedStyle).to.deep.equal(null
     *     //{width:100,height:0}
     *   )
     * )*/
    //wrapper.update().state().animatedStyle.width.__getValue()
    //expect(JSON.stringify(wrapper.update().state().animatedStyle.width.__getValue())).to.deep.equal(null)
    //wrapper.setProps({ style: });
  });

  
  it('simulates press events', () => {
    const onPress = sinon.spy();
    const wrapper = shallow(
      <Test onPress={onPress} />
    );
    expect(wrapper.find(TouchableHighlight)).to.have.length(1);
    wrapper.find(TouchableHighlight).simulate('press');
    expect(onPress).to.have.property('callCount', 1);
  });
});
