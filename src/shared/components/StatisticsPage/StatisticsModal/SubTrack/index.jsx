/**
 * Badges Popup Component.  Renders a tooltip to show the date a badge was earned.
 */
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './styles.scss';

import './styles.scss';

class SubTrack extends React.Component {
    render() {
        const {
          theme,
          name,
          numberColor,
          number,
          tag,
        } = this.props;
        return(
            <div className={theme.subtrack}>
                <div className={theme.name}>{name}</div>
                <div className={theme.ranking}>
                    <div style={{color: numberColor}} className={theme.number}>{number}</div>
                    <div className={theme.tag}>{tag}</div>
                </div>
                <img className={theme.arrow} src="https://s3.amazonaws.com/app.topcoder.com/50cf8df299c1445d7c9fdad8d064fc3f.svg"/>
            </div>
        );
    }
}

SubTrack.defaultProps = {
  theme: {},
  name: "",
  numberColor: null,
  number: null,
  tag: "",
};

SubTrack.propTypes = {
  theme: PT.shape(),
  name: "",
  numberColor: null,
  number: 0,
  tag: "",
};

export default themr('SubTrack', defaultStyle)(SubTrack);
