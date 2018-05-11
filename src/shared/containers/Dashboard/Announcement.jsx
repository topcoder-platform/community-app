/**
 * Container for dashboard announcement.
 */

import _ from 'lodash';
import actions from 'actions/cms/dashboard/announcements';
import Announcement from 'components/Dashboard/Announcement';
import ContentfulLoader from 'containers/ContentfulLoader';
import cookies from 'browser-cookies';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';
import uiActions from 'actions/page/dashboard';
import { connect } from 'react-redux';

const COOKIE = 'lastSeenDashboardAnnouncement';
const MAXAGE = 10 * 60 * 1000;

class AnnouncementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.now = moment().format();
  }

  componentDidMount() {
    const {
      activeLoading,
      activeTimestamp,
      getActive,
      getPreview,
      previewId,
    } = this.props;

    if (previewId) getPreview(previewId);
    else {
      const now = Date.now();
      if (now - activeTimestamp > MAXAGE
      && !activeLoading) getActive();
    }

    this.hideIfNecessary(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const id = _.get(this.props.active, 'sys.id');
    const nextId = _.get(nextProps.active, 'sys.id');
    if (id !== nextId) this.hideIfNecessary(nextProps);
    else if (!nextProps.show && this.props.show && !nextProps.previewId) {
      cookies.set(COOKIE, nextId, {
        expires: 365,
      });
    }
  }

  hideIfNecessary(props) {
    if (props.previewId) return;
    const { active, show, switchShowAnnouncement } = props;
    if (show) {
      const lastSeen = cookies.get(COOKIE);
      if (lastSeen === _.get(active, 'sys.id')) switchShowAnnouncement(false);
    }
    _.noop(this);
  }

  render() {
    const {
      hidePreviewMetaData,
      previewId,
      show,
      switchShowAnnouncement,
    } = this.props;

    return (
      <ContentfulLoader
        entryQueries={{
          content_type: 'dashboardAnnouncement',
          'fields.startDate': {
            lt: this.now,
          },
          'fields.endDate': {
            gt: this.now,
          },
          limit: 1,
          order: '-fields.startDate',
        }}
        preview={Boolean(previewId)}
        render={(data) => {
          let announcement = data.entries.matches[0].items[0];
          if (!announcement) return null;
          announcement = data.entries.items[announcement];
          const backgroundAssetId =
            _.get(announcement.fields.backgroundImage, 'sys.id');
          return (
            <ContentfulLoader
              assetIds={backgroundAssetId}
              preview={data.preview}
              render={data2 => (
                <Announcement
                  assets={data2.assets.items}
                  announcement={announcement}
                  hidePreviewMetaData={hidePreviewMetaData}
                  loading={false}
                  preview={data.preview}
                  show={show}
                  switchShow={switchShowAnnouncement}
                />
              )}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

AnnouncementContainer.defaultProps = {
  hidePreviewMetaData: false,
  previewId: '',
};

AnnouncementContainer.propTypes = {
  active: PT.shape().isRequired,
  activeLoading: PT.bool.isRequired,
  activeTimestamp: PT.number.isRequired,
  hidePreviewMetaData: PT.bool,
  getActive: PT.func.isRequired,
  getPreview: PT.func.isRequired,
  previewId: PT.string,
  show: PT.bool.isRequired,
  switchShowAnnouncement: PT.func.isRequired,
};

function mapStateToProps(state, props) {
  const a = state.cms.dashboard.announcements;
  return {
    active: a.active.data,
    activeAssets: a.active.assets,
    activeLoading: Boolean(a.active.loadingUuid),
    activeTimestamp: a.active.timestamp,
    hidePreviewMetaData: props.hidePreviewMetaData,
    preview: a.preview.data,
    previewAssets: a.preview.assets,
    previewLoading: Boolean(a.preview.loadingUuid),
    previewId: props.previewId,
    show: state.page.dashboard.showAnnouncement,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.cms.dashboard.announcements;
  return {
    getActive: () => {
      const uuid = shortId();
      dispatch(a.getActiveInit(uuid));
      dispatch(a.getActiveDone(uuid));
    },
    getPreview: (id) => {
      const uuid = shortId();
      dispatch(a.getPreviewInit(uuid));
      dispatch(a.getPreviewDone(id, uuid));
    },
    switchShowAnnouncement: show =>
      dispatch(uiActions.page.dashboard.showAnnouncement(show)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnouncementContainer);
