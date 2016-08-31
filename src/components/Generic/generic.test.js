/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { Generic } from './generic';

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = true;

describe('Component: <Generic />', () => {
  it('shallow render of Generic', () => {
    const wrapper = shallow(
      <Generic />
      );
    expect(wrapper.length).to.be.equal(1);
    expect(wrapper.children().length).to.equal(1); // Shallow wrapper returns only one child
  });
  it('should have props', () => {
     const wrapper = shallow(
      <Generic />
    );
    expect(wrapper.props().applyGeneric).to.be.defined;
    expect(wrapper.props().cancelGeneric).to.be.defined;
  });
  it('mount render in Generic section', () => {
    const wrapper = mount(
      <Generic />
    );
    expect(wrapper.find('a').text()).to.be.equal('Have a Promo Code?');
  });
});
