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

function AccordionItemsLoader(props) {
  const {
    ids,
    preview,
    title,
  } = props;

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      render={data => (
        <Accordion title={title}>
          {
            ids.map(itemId => (
              <AccordionItem
                key={itemId}
                title={
                  data.entries.items[itemId].fields.label
                  || data.entries.items[itemId].fields.name
                 }
              >
                <MarkdownRenderer markdown={data.entries.items[itemId].fields.text} />
              </AccordionItem>
            ))
          }
        </Accordion>
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

AccordionItemsLoader.propTypes = {
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool.isRequired,
  title: PT.string.isRequired,
};

export default function ContentfulAccordion(props) {
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
          <AccordionItemsLoader
            ids={_.map(fields.items, 'sys.id')}
            preview={preview}
            title={fields.title || fields.name}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulAccordion.defaultProps = {
  preview: false,
};

ContentfulAccordion.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
};
