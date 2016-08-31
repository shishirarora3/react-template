import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.scss';

class Home extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props, context) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getRecommendations(token) {
  }

  render() {
    return (
      <div className={s.container}>
        ..container
      </div>
    );
  }

}

Home.propTypes = {
};

Home.contextTypes = {};

export default withStyles(s)(Home);
