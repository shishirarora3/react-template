import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.scss';
import _ from 'lodash';

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
        const {data} = this.props;
        console.log(s.childContainer);
        return (
            <div
                className={s.container}>
                {Object.keys(data).map((k, i)=><div
                        key={i}
                        data-key={k}
                        className={s.childContainer}>
                        {data[k]}
                    </div>
                )}
            </div>
        );
    }

}

Home.propTypes = {
    data: PropTypes.object
};

Home.contextTypes = {};

export default withStyles(s)(Home);
