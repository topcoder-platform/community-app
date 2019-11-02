import _ from 'lodash';
import moment from 'moment';
import React, { Fragment } from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

/* Date/time format to use in the link. */
const FORMAT = 'MMM DD, HH:mm';

function NewsletterArchive({
  archive,
}) {
// console.log(archive)
  return _.map(
    archive.campaigns,
    (link, indx) => (
      <Fragment key={`f${indx}`}>
        <a href={link.archive_url} key={`l${indx}`} styleName="archive-link" target="_blank" rel="noopener noreferrer">
          {link.settings.title}
        </a>
        <small key={`d${indx}`} styleName="archive-date"><strong>Sent:</strong> {moment(link.send_time).format(FORMAT)}</small>
      </Fragment>
    ),
  );
}

NewsletterArchive.defaultProps = {
  token: null,
};

NewsletterArchive.propTypes = {
  archive: PT.shape().isRequired,
};

export default themr('NewsletterArchive', defaultStyle)(NewsletterArchive);
