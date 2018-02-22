import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import YouTubeVideo from 'components/YouTubeVideo';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function Announcement({
  assets,
  announcement,
  loading,
  show,
  switchShow,
}) {
  if (loading) {
    return (
      <div styleName="loading">
        <LoadingIndicator />
      </div>
    );
  }

  if (!announcement.fields) return null;

  console.log(announcement, assets);

  const {
    backgroundImage,
    fontColor,
    readMore,
    text,
    title,
    type,
    youTubeVideoUrl,
  } = announcement.fields;

  if (!show) {
    return (
      <div styleName="hidden">
        <div
          onClick={() => switchShow(true)}
          role="button"
          styleName="hide"
          tabIndex={0}
        >+</div>
        { type ? <div styleName="type">{type}</div> : null }
        <h1
          styleName="title"
          style={{ color: fontColor }}
        >{title}</h1>
        <div
          styleName="text"
          style={{ color: fontColor }}
        >{text}</div>
      </div>
    );
  }

  let background = _.get(backgroundImage, 'sys.id');
  if (background) background = assets[background].fields.file.url;

  const res = (
    <div
      styleName="container"
      style={{
        backgroundImage: background && `url(${background})`,
      }}
    >
      <div styleName="details">
        <div
          onClick={() => switchShow(false)}
          role="button"
          styleName="hide"
          tabIndex={0}
        >&times;</div>
        { type ? <div styleName="type">{type}</div> : null }
        <h1
          styleName="title"
          style={{ color: fontColor }}
        >{title}</h1>
        <div
          styleName="text"
          style={{ color: fontColor }}
        >{text}</div>
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
      {
        youTubeVideoUrl ? (
          <YouTubeVideo
            autoplay
            src={youTubeVideoUrl}
            styleName="video"
          />
        ) : null
      }
    </div>
  );

  return res;
}

Announcement.propTypes = {
  assets: PT.shape.isRequired,
  announcement: PT.shape({
    backgroundImage: PT.shape({
      sys: PT.shape({
        id: PT.string.isRequired,
      }).isRequired,
    }),
    fontColor: PT.string,
    readMore: PT.string,
    text: PT.string,
    title: PT.string,
    type: PT.string,
    youTubeVideoUrl: PT.string,
  }).isRequired,
  loading: PT.bool.isRequired,
};


/* Implemented as a stateful component, because it is a rapid POC of the CMS
 * integration, thus no need to spend time on proper Redux integration right
 * now. */
/*
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
*/