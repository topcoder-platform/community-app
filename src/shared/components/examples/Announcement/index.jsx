import Announcement from 'containers/Dashboard/Announcement';
import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function AnnouncementExample(props) {
  return (
    <div styleName="container">
      <h1>Announcement Preview</h1>
      <Announcement previewId={props.match.params.id} />
    </div>
  );
}

AnnouncementExample.propTypes = {
  match: PT.shape({
    params: PT.shape({
      id: PT.string.isRequired,
    }).isRequired,
  }).isRequired,
};
