import React from 'react';
import { Text,View } from 'react-native';
import { shallow } from 'enzyme';
import LibraryStatus from '../BookCell';
import { expect } from 'chai';

describe('<LibraryStatus />', () => {
  it('should render stuff', () => {
    const wrapper = shallow(<View />);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.contains(<Text>I wonder if there will be any problems...</Text>)).to.equal(true);
  });
});
