/**
 * Connects the Redux store to the GigsPages component.
 */
import React from 'react';
import PT from 'prop-types';
import Header from 'containers/TopcoderHeader';
import Footer from 'components/TopcoderFooter';
import Viewport from 'components/Contentful/Viewport';
import { config, MetaTags } from 'topcoder-react-utils';
import RecruitCRMJobDetails from 'containers/Gigs/RecruitCRMJobDetails';


export default function GigsPagesContainer(props) {
  const { match } = props;
  const { id } = match.params;
  return (
    <div>
      <MetaTags title="Topcoder - Gig Work Opportunities" />
      <Header />
      {
        id ? (
          <RecruitCRMJobDetails
            id={id}
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
