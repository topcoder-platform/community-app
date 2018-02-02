import _ from 'lodash';
import React from 'react';
import {
  Tag,
  DataScienceTrackEventTag,
  DataScienceTrackTag,
  DesignTrackEventTag,
  DesignTrackTag,
  DevelopmentTrackEventTag,
  DevelopmentTrackTag,
} from 'topcoder-react-ui-kit';

import style from './style.scss';

_.noop(style);

export default function Tags() {
  return (
    <div styleName="style.page">
      <h1>Tags</h1>
      <p>
        All tags in this page are instances of the generic tag,
        implemented in <code>/src/components/tags</code> and wrapped
        into different style themes with help
        of <code>react-css-themr</code>.
      </p>

      <h3><a name="default-tag">Default Tag</a></h3>
      <Tag>Tag</Tag>
      <Tag to="#default-tag">Link Tag</Tag>

      <h3>Track-specific tags</h3>

      <DataScienceTrackTag>Data science track tag</DataScienceTrackTag>
      <DataScienceTrackEventTag>
        Data science track event tag
      </DataScienceTrackEventTag>
      <DesignTrackTag>Design track tag</DesignTrackTag>
      <DesignTrackEventTag>Design track event tag</DesignTrackEventTag>
      <DevelopmentTrackTag>Development track tag</DevelopmentTrackTag>
      <DevelopmentTrackEventTag>
        Development track event tag
      </DevelopmentTrackEventTag>
    </div>
  );
}
