import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { getService } from 'services/contentful-cms';

import style from './style.scss';

const STATES = {
  LOADED: 'LOADED',
  LOADING: 'LOADING',
};

/* Implemented as a stateful component, because it is a rapid POC of the CMS
 * integration, thus no need to spend time on proper Redux integration right
 * now. */
export default class Announcement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { state: STATES.LOADING };
  }

  componentDidMount() {
    const { id, preview } = this.props;
    const service = getService(preview);
    service.getContentEntry(id)
      .then((res) => {
        const imageId = _.get(res, 'fields.backgroundImage.sys.id');
        if (imageId) {
          return service.getAsset(imageId)
            .then((asset) => {
              res.fields.backgroundImage = asset.fields.file.url;
              return res;
            });
        }
        return res;
      }).then(res => this.setState({
        ...res,
        state: STATES.LOADED,
      }));
  }

  render() {
    const st = this.state;

    if (st.state === STATES.LOADING) {
      return (
        <div styleName="container">
          <LoadingIndicator />
        </div>
      );
    }

    const {
      createdAt,
      revision,
      updatedAt,
    } = st.sys;

    const {
      backgroundImage,
      endDate,
      fontColor,
      readMore,
      startDate,
      text,
      title,
      type,
    } = st.fields;

    const announcement = (
      <div
        styleName="container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <h1
          styleName="title"
          style={{ color: fontColor }}
        >{title}</h1>
        <div
          styleName="text"
          style={{ color: fontColor }}
        >{text}</div>
        { type ? <div styleName="type">{type}</div> : null }
        {
          readMore ? (
            <PrimaryButton
              size="sm"
              theme={{
                button: style.readMore,
              }}
              to={readMore}
            >Read more</PrimaryButton>
          ) : null
        }
      </div>
    );

    if (!this.props.preview) return announcement;

    return (
      <div>
        {
          this.props.preview ? (
            <div>
              <div>Created: {createdAt}</div>
              <div>Last updated: {updatedAt}</div>
              <div>Revision: {revision}</div>
              <div>
                Visibility start: {
                  startDate ? moment(startDate).toLocaleString() : 'always'
                }
              </div>
              <div>
                Visibility end: {
                  endDate ? moment(endDate).toLocaleString() : 'always'
                }
              </div>
            </div>
          ) : null
        }
        {announcement}
      </div>
    );
  }
}

Announcement.defaultProps = {
  preview: false,
};

Announcement.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
