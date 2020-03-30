import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import { AppChunk } from 'topcoder-react-utils';

export default function NotificationsRoute(props) {
  return (
    <AppChunk
      chunkName="notifications/chunk"
      exact
      path="/notifications"
      renderClientAsync={() => import(/* webpackChunkName: "notifications/chunk" */'containers/Notifications')
        .then(({ default: Notifications }) => (
          <Notifications {...props} />
        ))
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}
