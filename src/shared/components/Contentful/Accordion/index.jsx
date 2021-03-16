/**
 * Renders an Accordion/FAQ with data from Contentful
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import MarkdownRenderer from 'components/MarkdownRenderer';
import PT from 'prop-types';
import React from 'react';

import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import defaultTheme from './Accordion/style.scss';
import zurichTheme from './Accordion/zurich.scss';

const THEMES = {
  Default: defaultTheme,
  Zurich: zurichTheme,
};

function AccordionItemsLoader(props) {
  const {
    ids,
    preview,
    spaceName,
    environment,
    title,
    description,
    theme,
  } = props;

  const contentfulConfig = {
    spaceName,
    environment,
    preview,
  };
  return (
    <ContentfulLoader
      entryIds={ids}
      {...contentfulConfig}
      render={data => (
        <Accordion
          title={title}
          description={description}
          theme={THEMES[theme]}
          {...contentfulConfig}
        >
          {
            ids.map(itemId => (
              <AccordionItem
                key={itemId}
                title={
                  data.entries.items[itemId].fields.label
                  || data.entries.items[itemId].fields.name
                 }
              >
                <MarkdownRenderer
                  markdown={data.entries.items[itemId].fields.text}
                  {...contentfulConfig}
                />
              </AccordionItem>
            ))
          }
        </Accordion>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

AccordionItemsLoader.defaultProps = {
  spaceName: null,
  environment: null,
  theme: 'Default',
  title: null,
  description: null,
};

AccordionItemsLoader.propTypes = {
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
  title: PT.string,
  description: PT.string,
  theme: PT.string,
};

export default function ContentfulAccordion(props) {
  const {
    id,
    preview,
    spaceName,
    environment,
  } = props;

  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        if (!fields) return null;

        return (
          <AccordionItemsLoader
            ids={_.map(fields.items, 'sys.id')}
            preview={preview}
            spaceName={spaceName}
            environment={environment}
            title={fields.title}
            description={fields.description}
            theme={fields.theme}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulAccordion.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

ContentfulAccordion.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
