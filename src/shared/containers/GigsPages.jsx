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

const optimizelyClient = createInstance({
  sdkKey: config.OPTIMIZELY.SDK_KEY,
});
export default function GigsPagesContainer(props) {
  const { match } = props;
  const { id, type } = match.params;
  const isApply = `${config.GIGS_PAGES_PATH}/${id}/apply` === match.url;
  const title = 'Gig Work | Topcoder Community | Topcoder';
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
      />
      <Header />
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
          <Viewport
            id="3X6GfJZl3eDU0m4joSJZpN"
            baseUrl={config.GIGS_PAGES_PATH}
          />
        ) : null
      }
      <Footer />
    </div>
  );
  return isomorphy.isClientSide() ? (
    <OptimizelyProvider optimizely={optimizelyClient} user={{ id: 123 }}>
      {inner}
    </OptimizelyProvider>
  ) : inner;
}

GigsPagesContainer.defaultProps = {
};

GigsPagesContainer.propTypes = {
  match: PT.shape().isRequired,
};
