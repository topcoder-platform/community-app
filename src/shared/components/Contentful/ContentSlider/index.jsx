/**
 * Renders an ContentSlider/FAQ with data from Contentful
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';

import ContentSlider from './ContentSlider';
import ContentSliderItem from './ContentSliderItem';

/* eslint-disable global-require */
const THEMES = {
  Default: require('./themes/default.scss'),
};
/* eslint-enable global-require */

function ContentSliderItemsLoader(props) {
  const {
    ids,
    preview,
    autoStart,
    duration,
    theme,
    sliderId,
    containerStyle,
  } = props;

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      render={data => (
        <ContentSlider
          autoStart={autoStart}
          duration={duration}
          theme={THEMES[theme]}
          id={sliderId}
          containerStyle={containerStyle}
        >
          {
            ids.map(itemId => (
              <ContentSliderItem
                key={itemId}
                itemId={itemId}
                title={data.entries.items[itemId].fields.name}
                type={data.entries.items[itemId].sys.contentType.sys.id}
                preview={preview}
              />
            ))
          }
        </ContentSlider>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentSliderItemsLoader.defaultProps = {
  autoStart: true,
  duration: 5, // 5sec
  containerStyle: null,
};

ContentSliderItemsLoader.propTypes = {
  sliderId: PT.string.isRequired,
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  autoStart: PT.bool,
  duration: PT.number,
  theme: PT.string.isRequired,
  containerStyle: PT.shape(),
};

export default function ContentfulSlider(props) {
  const {
    id,
    preview,
  } = props;

  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        if (!fields) return null;
        return (
          <ContentSliderItemsLoader
            sliderId={id}
            ids={_.map(fields.items, 'sys.id')}
            preview={preview}
            autoStart={fields.autoStart}
            duration={fields.duration}
            theme={fields.theme}
            containerStyle={fields.extraStylesForContainer}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulSlider.defaultProps = {
  preview: false,
};

ContentfulSlider.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
