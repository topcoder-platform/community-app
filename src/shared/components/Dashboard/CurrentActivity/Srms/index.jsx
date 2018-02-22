import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import SRM from '../../SRM';

import './style.scss';

export default function Srms({
  srms,
  srmsLoading,
}) {
  if (srmsLoading) {
    return (
      <div styleName="loading">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div styleName="container">
      <SRM srms={srms} />
    </div>
  );
}

Srms.propTypes = {
  srms: PT.arrayOf(PT.object).isRequired,
  srmsLoading: PT.bool.isRequired,
};
