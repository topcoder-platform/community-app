import actions from 'actions/cms/dashboard/announcements';
import Announcements from 'components/sandbox/cms/dashboard/Announcements';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';

import { connect } from 'react-redux';

class AnnouncementsContainer extends React.Component {
  componentDidMount() {
    this.props.getScheduledAnnouncements();
  }

  render() {
    const {
      loadingScheduledAnnouncements,
      scheduledAnnouncements,
    } = this.props;
    return (
      <Announcements
        announcements={scheduledAnnouncements}
        loading={loadingScheduledAnnouncements}
      />
    );
  }
}

AnnouncementsContainer.propTypes = {
  getScheduledAnnouncements: PT.func.isRequired,
  loadingScheduledAnnouncements: PT.bool.isRequired,
  scheduledAnnouncements: PT.arrayOf(PT.object).isRequired,
};

function mapStateToProps(state) {
  const st = state.cms.dashboard.announcements;
  return {
    loadingScheduledAnnouncements: Boolean(st.scheduled.loadingUuid),
    scheduledAnnouncements: st.scheduled.data,
    scheduledAnnouncementsTimestamp: st.scheduled.timestamp,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.cms.dashboard.announcements;
  return {
    getScheduledAnnouncements: () => {
      const uuid = shortId();
      dispatch(a.getScheduledInit(uuid));
      dispatch(a.getScheduledDone(uuid));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnouncementsContainer);
