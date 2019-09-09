/* eslint-disable react/destructuring-assignment */
/**
 * Container for EDU Portal home page.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { getService } from 'services/contentful';
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from 'react-tabs';
import ArticleCard from 'components/Contentful/ArticleCard/ArticleCard';
import LoadingIndicator from 'components/LoadingIndicator';
// CSS
import articleLargeTheme from 'components/Contentful/ArticleCard/themes/article_large.scss';
import forumPostTheme from 'components/Contentful/ArticleCard/themes/forum_post.scss';
import videoTheme from 'components/Contentful/ArticleCard/themes/video.scss';
import theme from '../styles/tabs.scss';

const THEMES = {
  'Article large': articleLargeTheme,
  'Forum post': forumPostTheme,
  Video: videoTheme,
};

export default class ResultTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      taxonomy: props.taxonomy,
      query: _.cloneDeep(props.query),
      articles: { total: 0 },
      videos: { total: 0 },
      posts: { total: 0 },
    };
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
  }

  componentDidMount() {
    const { query, taxonomy } = this.state;
    this.apiService.getEDUContent({ ...query, taxonomy })
      .then((data) => {
        this.setState({
          loading: false,
          articles: data.Article,
          videos: data.Video,
          posts: data['Forum post'],
        });
      });
  }

  componentDidUpdate() {
    const newQuery = { ...this.props.query };
    const oldQuery = { ...this.state.query };
    // When input query from props change
    // we need to update the data loaded to the tabs
    if (!_.isEqual(newQuery, oldQuery)) {
      this.apiService.getEDUContent({ ...newQuery, taxonomy: this.state.taxonomy })
        .then((data) => {
          this.setState({
            loading: false,
            query: _.cloneDeep(newQuery),
            articles: data.Article,
            videos: data.Video,
            posts: data['Forum post'],
          });
        });
    }
  }

  loadMore(type) {
    const tabData = this.state[type];
    const { query, taxonomy } = this.state;
    const contTypesMap = {
      articles: 'Article',
      videos: 'Video',
      posts: 'Forum post',
    };
    this.apiService.getEDUContent({
      ...query,
      taxonomy,
      limit: tabData.limit,
      skip: tabData.skip + tabData.limit,
      types: [contTypesMap[type]],
    })
      .then((data) => {
        const stateUpdate = {};
        const newData = data[contTypesMap[type]];
        tabData.includes.Asset = _.concat(tabData.includes.Asset, newData.includes.Asset);
        tabData.includes.Entry = _.concat(tabData.includes.Entry, newData.includes.Entry);
        tabData.items = _.concat(tabData.items, newData.items);
        tabData.limit = newData.limit;
        tabData.skip = newData.skip;
        stateUpdate[contTypesMap[type]] = tabData;
        this.setState(stateUpdate);
      });
  }

  render() {
    const {
      articles, videos, posts, loading,
    } = this.state;
    if (loading) return <LoadingIndicator />;
    return (
      <Tabs
        className={theme.container}
        selectedTabClassName={theme.selected}
      >
        <div className={theme.tabListWrap}>
          <TabList className={theme.tablist}>
            <Tab className={theme.tab}>
              Articles <span className={theme.tabCount}>{articles.total}</span>
            </Tab>
            <Tab className={theme.tab}>
              Videos <span className={theme.tabCount}>{videos.total}</span>
            </Tab>
            <Tab className={theme.tab}>
              Forum posts <span className={theme.tabCount}>{posts.total}</span>
            </Tab>
          </TabList>
        </div>
        <TabPanel
          className={theme.tabpannel}
          selectedClassName={theme.selectedTabPanel}
        >
          {
            articles.items.length ? (
              _.map(articles.items, article => (
                <ArticleCard
                  key={article.sys.id}
                  id={article.sys.id}
                  article={article.fields}
                  articleCard={{}}
                  featuredImage={article.fields.featuredImage ? (
                    _.find(articles.includes.Asset, ['sys.id', article.fields.featuredImage.sys.id]).fields
                  ) : null}
                  theme={THEMES['Article large']}
                  themeName="Article large"
                  contentAuthor={[
                    _.find(articles.includes.Entry, ['sys.id', article.fields.contentAuthor[0].sys.id]).fields,
                  ]}
                />
              ))
            ) : (<h3>Nothing Found</h3>)
          }
          {
            articles.total > articles.items.length ? (
              <button type="button" className={theme.loadMoreBtn} onClick={this.loadMore.bind(this, 'articles')}>Show More</button>
            ) : null
          }
        </TabPanel>
        <TabPanel
          className={theme.tabpannel}
          selectedClassName={theme.selectedTabPanel}
        >
          {
            videos.items.length ? (
              <div className={theme.videosTabPannel}>
                {
                  _.map(videos.items, video => (
                    <ArticleCard
                      key={video.sys.id}
                      id={video.sys.id}
                      article={video.fields}
                      articleCard={{}}
                      featuredImage={video.fields.featuredImage ? (
                        _.find(videos.includes.Asset, ['sys.id', video.fields.featuredImage.sys.id]).fields
                      ) : null}
                      theme={THEMES.Video}
                      themeName="Video"
                    />
                  ))
                }
              </div>
            ) : (<h3>Nothing Found</h3>)
          }
          {
            videos.total > videos.items.length ? (
              <button type="button" className={theme.loadMoreBtn} onClick={this.loadMore.bind(this, 'videos')}>Show More</button>
            ) : null
          }
        </TabPanel>
        <TabPanel
          className={theme.tabpannel}
          selectedClassName={theme.selectedTabPanel}
        >
          {
            posts.items.length ? (
              _.map(posts.items, (post) => {
                const author = _.find(posts.includes.Entry, ['sys.id', post.fields.contentAuthor[0].sys.id]).fields;
                if (author.avatar) {
                  author.file = _.find(posts.includes.Asset, ['sys.id', author.avatar.sys.id]).fields.file;
                }
                author.key = post.fields.contentAuthor[0].sys.id;
                return (
                  <ArticleCard
                    key={post.sys.id}
                    id={post.sys.id}
                    article={post.fields}
                    articleCard={{}}
                    contentAuthor={[author]}
                    theme={THEMES['Forum post']}
                    themeName="Forum post"
                  />
                );
              })
            ) : (<h3>Nothing Found</h3>)
          }
          {
            posts.total > posts.items.length ? (
              <button type="button" className={theme.loadMoreBtn} onClick={this.loadMore.bind(this, 'posts')}>Show More</button>
            ) : null
          }
        </TabPanel>
      </Tabs>
    );
  }
}

ResultTabs.propTypes = {
  query: PT.shape().isRequired,
  taxonomy: PT.shape().isRequired,
};
