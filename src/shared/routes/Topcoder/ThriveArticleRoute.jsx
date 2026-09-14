/** Loads a public Thrive article or its authenticated Payload Live Preview graph. */
import _ from 'lodash';
import Article from 'components/Contentful/Article';
import LivePreview, {
  isThriveLivePreview,
} from 'components/Contentful/Article/LivePreview';
import Error404 from 'components/Error404';
import LoadingIndicator from 'components/LoadingIndicator';
import ContentfulLoader from 'containers/ContentfulLoader';
import PT from 'prop-types';
import React from 'react';
import { isomorphy } from 'topcoder-react-utils';

/** Route implementation shared by server rendering and client navigation. */
export default function ThriveArticleRoute(props) {
  const { location, match } = props;
  if (isThriveLivePreview(location.search)) {
    return (
      <LivePreview>
        <LoadingIndicator />
      </LivePreview>
    );
  }

  const { articleTitle } = match.params;
  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'article',
        'fields.slug': articleTitle,
      }}
      spaceName="EDU"
      render={(data) => {
        if (_.isEmpty(data.entries.items)) {
          // Legacy articles used their title as the route before slugs were introduced.
          return (
            <ContentfulLoader
              entryQueries={{
                content_type: 'article',
                'fields.title[match]': articleTitle,
              }}
              spaceName="EDU"
              render={(dataTitle) => {
                if (_.isEmpty(dataTitle.entries.items)) return <Error404 />;
                let id = dataTitle.entries.matches[0].items[0];
                if (dataTitle.entries.matches[0].total !== 1) {
                  const matchedId = _.findKey(
                    dataTitle.entries.items,
                    article => article.fields.title.toLocaleLowerCase()
                      === articleTitle.toLocaleLowerCase(),
                  );
                  id = matchedId || id;
                }
                const { externalArticle, contentUrl } = dataTitle.entries.items[id].fields;
                if (externalArticle && contentUrl && isomorphy.isClientSide()) {
                  window.location.href = contentUrl;
                  return null;
                }
                return <Article id={id} spaceName="EDU" />;
              }}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }
        const id = data.entries.matches[0].items[0];
        const { externalArticle, contentUrl } = data.entries.items[id].fields;
        if (externalArticle && contentUrl && isomorphy.isClientSide()) {
          window.location.href = contentUrl;
          return null;
        }
        return <Article id={id} spaceName="EDU" />;
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ThriveArticleRoute.propTypes = {
  location: PT.shape({ search: PT.string }).isRequired,
  match: PT.shape({
    params: PT.shape({ articleTitle: PT.string.isRequired }).isRequired,
  }).isRequired,
};
