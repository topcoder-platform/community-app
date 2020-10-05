/**
 * Connects the Redux store to the GigsPages component.
 */
import React from 'react';
import PT from 'prop-types';
import Header from 'containers/TopcoderHeader';
import Footer from 'components/TopcoderFooter';
import Viewport from 'components/Contentful/Viewport';
import { config } from 'topcoder-react-utils';
import RecruitCRMJobDetails from 'containers/Gigs/RecruitCRMJobDetails';
import { Helmet } from 'react-helmet';


export default function GigsPagesContainer(props) {
  const { match } = props;
  const { id } = match.params;
  const isApply = `${config.GIGS_PAGES_PATH}/${id}/apply` === match.url;
  return (
    <div>
      <Helmet>
        <title>Topcoder - Gig Work Opportunities</title>
        <script type="text/javascript">{`
window._chatlio = window._chatlio||[];
!function(){ var t=document.getElementById("chatlio-widget-embed");if(t&&window.ChatlioReact&&_chatlio.init)return void _chatlio.init(t,ChatlioReact);for(var e=function(t){return function(){_chatlio.push([t].concat(arguments)) }},i=["configure","identify","track","show","hide","isShown","isOnline", "page", "open", "showOrHide"],a=0;a<i.length;a++)_chatlio[i[a]]||(_chatlio[i[a]]=e(i[a]));var n=document.createElement("script"),c=document.getElementsByTagName("script")[0];n.id="chatlio-widget-embed",n.src="https://w.chatlio.com/w.chatlio-widget.js",n.async=!0,n.setAttribute("data-embed-version","2.3");
   n.setAttribute('data-widget-id','f6584d97-111b-4fd0-635d-c8afb3fb55bd');
   c.parentNode.insertBefore(n,c);
}();
        `}
        </script>
      </Helmet>
      <Header />
      {
        id ? (
          <RecruitCRMJobDetails
            id={id}
            isApply={isApply}
          />
        ) : (
          <Viewport
            id="3X6GfJZl3eDU0m4joSJZpN"
            baseUrl={config.GIGS_PAGES_PATH}
          />
        )
      }
      <Footer />
    </div>
  );
}

GigsPagesContainer.defaultProps = {
};

GigsPagesContainer.propTypes = {
  match: PT.shape().isRequired,
};
