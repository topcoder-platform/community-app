/**
 * Connects the Redux store to the GigsPages component.
 */
import React from 'react';
import PT from 'prop-types';
import Header from 'containers/TopcoderHeader';
import Footer from 'components/TopcoderFooter';
import Viewport from 'components/Contentful/Viewport';
import { config, isomorphy } from 'topcoder-react-utils';
import RecruitCRMJobDetails from 'containers/Gigs/RecruitCRMJobDetails';
import { Helmet } from 'react-helmet';
import MetaTags from 'components/MetaTags';
import { OptimizelyProvider, createInstance } from '@optimizely/react-sdk';
import { connect } from 'react-redux';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import ChallengeTab from 'components/challenge-listing/ChallengeTab';

import './style.scss';

const optimizelyClient = createInstance({
  sdkKey: config.OPTIMIZELY.SDK_KEY,
});
const cookies = require('browser-cookies');

const GIGS_SOCIAL_SHARE_IMAGE = 'https://images.ctfassets.net/b5f1djy59z3a/4XlYNZgq5Kfa4XdwQ6pDfV/769ea7be756a88145b88ce685f050ebc/10_Freelance_Gig.png';

function GigsPagesContainer(props) {
  const {
    match,
    profile,
    history,
    location,
  } = props;
  const optProfile = {
    attributes: {},
  };
  if (!_.isEmpty(profile)) {
    optProfile.id = String(profile.userId);
    optProfile.attributes.TC_Handle = profile.handle;
    optProfile.attributes.HomeCountryCode = profile.homeCountryCode;
    optProfile.attributes.email = profile.email;
  } else if (isomorphy.isClientSide()) {
    const idCookie = cookies.get('_tc.aid');
    if (idCookie) {
      optProfile.id = JSON.parse(idCookie).aid;
    } else {
      optProfile.id = uuidv4();
      cookies.set('_tc.aid', JSON.stringify({
        aid: optProfile.id,
      }), {
        secure: true,
        domain: '',
        expires: 365, // days
      });
    }
  }
  const { id, type } = match.params;
  const isApply = `${config.GIGS_PAGES_PATH}/${id}/apply` === match.url;
  const title = 'Find Freelance Work | Gigs | Topcoder';
  const description = 'Compete and build up your profiles and skills! Topcoder members become eligible to work on Gig Work projects by first proving themselves in various skill sets through Topcoder competitions.';
  const inner = (
    <div>
      <Helmet>
        <script type="text/javascript">{`
window._chatlio = window._chatlio||[];
!function(){ var t=document.getElementById("chatlio-widget-embed");if(t&&window.ChatlioReact&&_chatlio.init)return void _chatlio.init(t,ChatlioReact);for(var e=function(t){return function(){_chatlio.push([t].concat(arguments)) }},i=["configure","identify","track","show","hide","isShown","isOnline", "page", "open", "showOrHide"],a=0;a<i.length;a++)_chatlio[i[a]]||(_chatlio[i[a]]=e(i[a]));var n=document.createElement("script"),c=document.getElementsByTagName("script")[0];n.id="chatlio-widget-embed",n.src="https://w.chatlio.com/w.chatlio-widget.js",n.async=!0,n.setAttribute("data-embed-version","2.3");
   n.setAttribute('data-widget-id','f6584d97-111b-4fd0-635d-c8afb3fb55bd');
   c.parentNode.insertBefore(n,c);
}();
        `}
        </script>
      </Helmet>
      <MetaTags
        description={description}
        title={title}
        image={GIGS_SOCIAL_SHARE_IMAGE}
      />
      <Header />
      <div styleName="ChallengeFiltersExample">
        <ChallengeTab
          history={history}
          location={location}
        />
      </div>
      {
        id ? (
          <RecruitCRMJobDetails
            id={id}
            isApply={isApply}
          />
        ) : null
      }
      {
        !id && !type ? (
          <React.Fragment>
            <Viewport
              id="3X6GfJZl3eDU0m4joSJZpN"
              baseUrl={config.GIGS_PAGES_PATH}
            />
          </React.Fragment>
        ) : null
      }
      <Footer />
    </div>
  );

  return (
    <OptimizelyProvider
      optimizely={optimizelyClient}
      user={optProfile}
      timeout={500}
      isServerSide={!isomorphy.isClientSide()}
    >
      {inner}
    </OptimizelyProvider>
  );
}

GigsPagesContainer.defaultProps = {
  profile: null,
};

GigsPagesContainer.propTypes = {
  location: PT.shape({
    search: PT.string,
    pathname: PT.string,
  }).isRequired,
  history: PT.shape().isRequired,
  match: PT.shape().isRequired,
  profile: PT.shape(),
};

function mapStateToProps(state) {
  const profile = state.auth && state.auth.profile ? { ...state.auth.profile } : {};
  return {
    profile,
  };
}

export default connect(
  mapStateToProps,
)(GigsPagesContainer);
