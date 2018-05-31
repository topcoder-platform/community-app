import Announcements from 'components/sandbox/cms/dashboard/Announcements';
import ContentfulLoader from 'containers/ContentfulLoader';
import moment from 'moment';
import React from 'react';

import { connect } from 'react-redux';

class AnnouncementsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.now = moment().format();
  }

  render() {
    return (
      <ContentfulLoader
        entryQueries={{
          content_type: 'dashboardAnnouncement',
          'fields.endDate': { gt: this.now },
        }}
        render={(data) => {
          const announcements = data.entries.matches[0].items.map(id =>
            data.entries.items[id]);
          return <Announcements announcements={announcements} />;
        }}
        renderPlaceholder={<Announcements loading />}
      />
    );
  }
}

export default connect()(AnnouncementsContainer);
