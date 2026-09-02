import ContentfulLoader from 'containers/ContentfulLoader';
import LivePreview from 'components/Contentful/Article/LivePreview';
import LoadingIndicator from 'components/LoadingIndicator';
import ThriveArticleRoute from 'routes/Topcoder/ThriveArticleRoute';

const routeProps = search => ({
  location: { search },
  match: { params: { articleTitle: 'brand-new-article' } },
});

describe('Thrive article route', () => {
  test('uses the authenticated graph before querying an unpublished slug', () => {
    const output = ThriveArticleRoute(routeProps('?payloadLivePreview=1'));

    expect(output.type).toBe(LivePreview);
    expect(output.props.children.type).toBe(LoadingIndicator);
  });

  test('keeps ordinary routes on the published compatibility query', () => {
    const output = ThriveArticleRoute(routeProps(''));

    expect(output.type).toBe(ContentfulLoader);
    expect(output.props.entryQueries).toEqual({
      content_type: 'article',
      'fields.slug': 'brand-new-article',
    });
    expect(output.props.spaceName).toBe('EDU');
  });
});
