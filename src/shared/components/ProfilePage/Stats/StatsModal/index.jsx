/* eslint-env browser */
import React from 'react';
import PT from 'prop-types';
import X from 'assets/images/profile/x-mark-gray.svg';
import { getRatingColor } from 'utils/tc';
import StatsCategory from '../../StatsCategory';
import './styles.scss';


class StatsModal extends React.Component {
  componentDidMount() {
    document.body.classList.add('scrolling-disabled-by-modal');
  }

  componentWillUnmount() {
    document.body.classList.remove('scrolling-disabled-by-modal');
  }

  render() {
    const {
      info, stats, onClose, baseUrl,
    } = this.props;
    return (
      <div styleName="stats-modal">
        <div styleName="nav-top">
          <div styleName="user">
            <div styleName="avatar">
              <img src={info.photoURL} alt="user img" />
            </div>
            <div styleName="handle" style={{ color: getRatingColor(info.maxRating.rating || 0) }}>
              {info.handle}
            </div>
          </div>
          <a styleName="exit" onClick={onClose} onKeyPress={onClose} role="button" tabIndex={0}>
            <X />
          </a>
        </div>
        <hr />
        <StatsCategory handle={info.handle} stats={stats} styleName="category" baseUrl={baseUrl} inModal />
      </div>
    );
  }
}

StatsModal.defaultProps = {
  baseUrl: '',
};

StatsModal.propTypes = {
  stats: PT.shape().isRequired,
  info: PT.shape().isRequired,
  onClose: PT.func.isRequired,
  baseUrl: PT.string,
};

export default StatsModal;
