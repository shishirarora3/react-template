import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './generic.scss';

export class Generic extends Component {
  constructor(props) {
    super(props);

  }

  componentWillReceiveProps(nextProps) {

  }


  render() {
    return <div>
        hello generic
      </div>;
  }
}



export default withStyles(s)(Generic);
