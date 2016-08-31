/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import AppContainer from './AppContainer';

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = true;

describe('Component: <AppContainer />', () => {
  it('shallow render of AppContainer length', () => {
    const wrapper = shallow(
      <Provider
        store={{ insertCss: () => {}, subscribe: () => {},
        dispatch: () => {}, getState: () => {} }}
      >
        <div>
          <AppContainer />
        </div>
      </Provider>
    );
    expect(wrapper.length).to.be.equal(1);
    expect(wrapper.children().length).to.equal(1); // Shallow wrapper returns only one child
  });

  it('Should have carouselData props', () => {
    const wrapper = shallow(
      <Provider
        store={{ insertCss: () => {}, subscribe: () => {},
        dispatch: () => {}, getState: () => {} }}
      >
        <div>
          <AppContainer />
        </div>
      </Provider>
    );
    expect(wrapper.props().saveTopBarData).to.be.defined;
    expect(wrapper.props().isMenuBarOpen).to.be.defined;
  });
  it('Should have <div> tag', () => {
    const wrapper = shallow(
      <Provider
        store={{ insertCss: () => {}, subscribe: () => {},
        dispatch: () => {}, getState: () => {} }}
      >
        <div>
          <AppContainer />
        </div>
      </Provider>
    );
    expect(wrapper.find('div').length).to.equal(1);
  });
});
