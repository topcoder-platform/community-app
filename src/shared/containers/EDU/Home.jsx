/**
 * Container for EDU Portal home page.
 */
import React from 'react';
import { config } from 'topcoder-react-utils';
import MetaTags from 'components/MetaTags';
import Viewport from 'components/Contentful/Viewport';
import SearchBar from 'components/Contentful/SearchBar/SearchBar';
import { getService } from 'services/contentful';
// SVGs
import QATrackIcon from 'assets/images/qa.svg';
import DevTrackIcon from 'assets/images/track-development.svg';
import DesignTrackIcon from 'assets/images/track-design.svg';
import MMTrackIcon from 'assets/images/track-MM.svg';
import AlgoTrackIcon from 'assets/images/track-ALGO.svg';
import TCTrackIcon from 'assets/images/tc-logo-icon.svg';
// CSS
import homeTheme from './styles/home.scss';

import TrackInfoInner from './partials/TrackInfoInner';
import TrackCards from './partials/TrackCards';

export default class EDUHome extends React.Component {
  constructor(props) {
    super(props);
    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
    // init state
    this.state = {
      taxonomy: {},
    };
  }

  componentDidMount() {
    // Fire API requests
    this.apiService.getEDUTaxonomy()
      .then((taxonomy) => {
        this.setState({
          taxonomy,
        });
      });
  }

  render() {
    const { taxonomy } = this.state;
    const title = 'Tutorials And Workshops That Matter | Thrive | Topcoder';
    const description = 'Thrive is our vault of content that we have been gathering over the years. It is full of tutorials and workshops that matter. Grow with us!';

    return (
      <div className={homeTheme.container}>
        <MetaTags
          description={description}
          title={title}
          feed={config.URL.THRIVE_FEED}
          feedTitle="Topcoder Thrive - RSS feed"
        />
        {/* Banner */}
        <div className={homeTheme.bannerContainer}>
          <div className={homeTheme.bannerImage} />
          <div className={homeTheme.bannerWrapp}>
            <h1 className={homeTheme.bannerTitle}>THRIVE</h1>
            <p className={homeTheme.bannerText}>
              Grow with us. Tutorials and workshops that matter.
            </p>
          </div>
          <div className={homeTheme.searchBarWrapp}>
            <SearchBar />
            <div className={homeTheme.infoTextWrap}>Don’t know what a challenge is? <a className={homeTheme.infoTextLink} href="/thrive/articles/all-about-topcoder-challenges-tasks-and-gig-work-opportunities" target="_blank" rel="noreferrer">Find out here</a>.</div>
          </div>
        </div>
        <div className={homeTheme.shapeBanner} />
        {/* Tracks */}
        <div className={homeTheme.tracksContainer}>
          <div className={homeTheme.trackWrapp}>
            <div className={homeTheme.trackInfos}>
              <div className={homeTheme.trackIconAlgo}><AlgoTrackIcon /></div>
              <TrackInfoInner track="Competitive Programming" theme={homeTheme} taxonomy={taxonomy} />
            </div>
            <TrackCards theme={homeTheme} track="Competitive Programming" />
          </div>
          <div className={homeTheme.trackWrapp}>
            <div className={homeTheme.trackInfos}>
              <div className={homeTheme.trackIconMM}><MMTrackIcon /></div>
              <TrackInfoInner track="Data Science" theme={homeTheme} taxonomy={taxonomy} />
            </div>
            <TrackCards theme={homeTheme} track="Data Science" />
          </div>
          <div className={homeTheme.trackWrapp}>
            <div className={homeTheme.trackInfos}>
              <div className={homeTheme.trackIconDesign}><DesignTrackIcon /></div>
              <TrackInfoInner track="Design" theme={homeTheme} taxonomy={taxonomy} />
            </div>
            <TrackCards theme={homeTheme} track="Design" />
          </div>
          <div className={homeTheme.trackWrapp}>
            <div className={homeTheme.trackInfos}>
              <div className={homeTheme.trackIconDev}><DevTrackIcon /></div>
              <TrackInfoInner track="Development" theme={homeTheme} taxonomy={taxonomy} />
            </div>
            <TrackCards theme={homeTheme} track="Development" />
          </div>
          <div className={homeTheme.trackWrapp}>
            <div className={homeTheme.trackInfos}>
              <div className={homeTheme.trackIconQA}><QATrackIcon /></div>
              <TrackInfoInner track="QA" theme={homeTheme} taxonomy={taxonomy} />
            </div>
            <TrackCards theme={homeTheme} track="QA" />
          </div>
          <div className={homeTheme.trackWrapp}>
            <div className={homeTheme.trackInfos}>
              <div className={homeTheme.trackIconTC}><TCTrackIcon /></div>
              <TrackInfoInner track="Topcoder" theme={homeTheme} taxonomy={taxonomy} />
            </div>
            <TrackCards theme={homeTheme} track="Topcoder" />
          </div>
        </div>
        {/* Latest & Recommended are Contentful editable sections */}
        <Viewport
          id="4K24asXZxb5i48wXXaWjEC"
          spaceName="EDU"
          baseUrl={config.TC_EDU_BASE_PATH}
        />
      </div>
    );
  }
}
