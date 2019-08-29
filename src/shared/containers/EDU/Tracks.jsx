/**
 * Container for EDU Portal tracks page.
 */
import _ from 'lodash';
import React from 'react';
import { config, isomorphy } from 'topcoder-react-utils';
import Viewport from 'components/Contentful/Viewport';
import SearchBar from 'components/Contentful/SearchBar/SearchBar';
import { getService } from 'services/contentful';
import { tracksTreeBuilder } from 'utils/contentful';
import { updateQuery } from 'utils/url';
import qs from 'qs';
import TracksTree from 'components/Contentful/TracksTree/TracksTree';
import LoadingIndicator from 'components/LoadingIndicator';
import TracksFilter from 'components/Contentful/TracksFilter/TracksFilter';
// SVGs & Assets
import Dev from 'assets/images/img-development.png';
import Design from 'assets/images/img_design.png';
import DS from 'assets/images/img-data-science.png';
import Algo from 'assets/images/img-algorithm.png';
import QA from 'assets/images/img-QA.png';
// CSS
import tracksTheme from './styles/tracks.scss';

const DEFAULT_TRACK = 'Development';
const TRACK_COLORS = {
  Development: '#35AC35',
  Design: '#2C95D7',
  'Data Science': '#F46500',
  'Competitive Programming': '#FD7D01',
  QA: '#4CC94C',
};
const TRACK_IMAGES = {
  Development: Dev,
  Design,
  'Data Science': DS,
  'Competitive Programming': Algo,
  QA,
};

export default class EDUTracks extends React.Component {
  constructor(props) {
    super(props);
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
    // init state
    this.state = {
      query: {
        track: DEFAULT_TRACK,
        tags: [],
      },
      tree: [],
      isShowFilter: false,
    };
    // bindings
    this.onTreeClick = this.onTreeClick.bind(this);
  }

  componentDidMount() {
    // set current query
    let urlQuery = {};
    if (isomorphy.isClientSide()) {
      urlQuery = qs.parse(window.location.search.slice(1));
      urlQuery.track = urlQuery.track ? urlQuery.track : DEFAULT_TRACK;
      urlQuery.tags = _.isArray(urlQuery.tags) ? urlQuery.tags : [urlQuery.tags];
      this.setState({
        query: urlQuery,
      });
    }
    // Fire API requests
    // Get the EDU taxonomy
    this.apiService.getEDUTaxonomy()
      .then((taxonomy) => {
        const { query } = this.state;
        const tree = tracksTreeBuilder(taxonomy, query);
        this.setState({
          tree,
        });
      });
    // Get counters
    this.apiService.getEDUContent({
      track: urlQuery.track,
    })
      .then((content) => {
        this.setState({
          articleCnt: content.Article.total,
          videoCnt: content.Video.total,
          forumCnt: content['Forum post'].total,
        });
      });
  }

  /**
   * Tracks tree click on items
   * @param {Object} selectedItem
   */
  onTreeClick(selectedItem) {
    // Update the counters
    const { query } = this.state;
    if (query.track !== selectedItem.track) {
      this.apiService.getEDUContent({
        track: selectedItem.track,
      })
        .then((content) => {
          this.setState({
            articleCnt: content.Article.total,
            videoCnt: content.Video.total,
            forumCnt: content['Forum post'].total,
          });
        });
    }
    // Update the state
    this.setState({
      query: {
        track: selectedItem.track,
        tax: selectedItem.title,
      },
    });
    // Update the url query
    updateQuery({
      track: selectedItem.track,
      tax: selectedItem.title,
    });
  }

  render() {
    const {
      query, tree, isShowFilter,
      articleCnt, videoCnt, forumCnt,
    } = this.state;
    return (
      <div className={tracksTheme.container}>
        {/* Banner */}
        <div
          className={tracksTheme.bannerContainer}
          style={{ backgroundColor: TRACK_COLORS[query.track] || TRACK_COLORS[DEFAULT_TRACK] }}
        >
          {
            TRACK_IMAGES[query.track] ? (
              <img src={TRACK_IMAGES[query.track]} alt="Track banner" className={tracksTheme.bannerImage} />
            ) : null
          }
          <div className={tracksTheme.bannerWrapp}>
            <h1 className={tracksTheme.bannerText}>{query.track}</h1>
            <div className={tracksTheme.bannerCounters}>
              <div className={tracksTheme.bannerCounterWrap}>
                <div className={tracksTheme.bannerCount}>{articleCnt}</div>
                <div className={tracksTheme.bannerCountLabel}>articles</div>
              </div>
              <div className={tracksTheme.bannerCounterWrap}>
                <div className={tracksTheme.bannerCount}>{videoCnt}</div>
                <div className={tracksTheme.bannerCountLabel}>videos</div>
              </div>
              <div className={tracksTheme.bannerCounterWrap}>
                <div className={tracksTheme.bannerCount}>{forumCnt}</div>
                <div className={tracksTheme.bannerCountLabel}>forum posts</div>
              </div>
            </div>
          </div>
          <div className={tracksTheme.searchBarWrapp}>
            <SearchBar />
          </div>
        </div>
        <div className={tracksTheme.shapeBanner} />
        {/* Main track content */}
        <div className={tracksTheme.main}>
          <div className={tracksTheme.tracksTree}>
            {
              tree.length ? (
                <TracksTree
                  list={tree}
                  onItemClick={this.onTreeClick}
                />
              ) : <LoadingIndicator />
            }
          </div>
          <div className={tracksTheme.tracksContent}>
            <div className={tracksTheme.tracksContentTop}>
              <h3 className={tracksTheme.trackTitle}>{query.tax || query.track}</h3>
              <button
                className={tracksTheme.filterToggle}
                type="button"
                onClick={() => { this.setState({ isShowFilter: !isShowFilter }); }}
              >
                {isShowFilter ? 'Hide filter' : 'Show filter'}
              </button>
            </div>
            <div className={isShowFilter ? tracksTheme.filterVisible : tracksTheme.filterHidden}>
              <TracksFilter
                onClose={() => this.setState({ isShowFilter: false })}
                selectedAuthor={query.author}
                tags={query.tags}
                startDate={query.startDate}
                endDate={query.endDate}
              />
            </div>
          </div>
        </div>
        {/* Top Design Videos & Recommended for you sections are Contentful editable via ID */}
        <Viewport
          id="CS6tscFxLUCZoPzWNB9Hv"
          spaceName="EDU"
          baseUrl={config.TC_EDU_BASE_PATH}
        />
      </div>
    );
  }
}
