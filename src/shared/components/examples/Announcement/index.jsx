import Announcement from 'components/Dashboard/Announcement';
import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function AnnouncementExample(props) {
  return (
    <div styleName="container">
      <h1>Announcement Preview</h1>
      <Announcement id={props.match.params.id} preview />
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
