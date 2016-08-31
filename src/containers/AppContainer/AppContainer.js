import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AppContainer.scss';
import { connect } from 'react-redux';

class AppContainer extends Component {

  render() {
    return (
      <div>
        <div className={s.childContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

AppContainer.propTypes = {
};

export default withStyles(s)(
  connect(( ) => {
    return {
    };
  }, {
  })(AppContainer));
