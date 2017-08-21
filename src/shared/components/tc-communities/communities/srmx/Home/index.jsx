/**
 * Static implementation of Home page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import Section from 'components/tc-communities/Section';
import Banner from 'components/tc-communities/Banner';
import ImageText from 'components/tc-communities/ImageText';
import ResourceCard from 'components/tc-communities/ResourceCard';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import NewsSection from 'components/tc-communities/NewsSection';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';

import CommunityStats from 'containers/tc-communities/CommunityStats';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';

import { getApiV2 } from 'services/api';

import IconRocket from '../../../../../../assets/images/tc-communities/rocket.svg';
import IconNetwork from '../../../../../../assets/images/tc-communities/network.svg';
import IconMedal from '../../../../../../assets/images/tc-communities/medal.svg';

import style from './style.scss';

const INFO_ID = '30058834';

/**
 * NOTE: There is some reason to turn this component into container. This is
 * a temporary hacky solution of one particular problem, do not take it as an
 * example, and just ignore the fact that it is located under components
 * section of the app code. It is a temporary exception.
 */
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgHtml: '',
    };
  }

  componentDidMount() {
    getApiV2(this.props.tokenV2)
      .fetch(`/challenges/${INFO_ID}`)
      .then(res => res.json())
      .then(res => this.setState({ msgHtml: res.detailedRequirements }));
  }

  render() {
    return (
      <main>


        <Section
          theme={{
            container: style.linksContainer,
          }}
        >
          {
            /* eslint-disable react/no-danger */
            this.state.msgHtml
              ? <div dangerouslySetInnerHTML={{ __html: this.state.msgHtml }} />
              : <LoadingIndicator />
            /* eslint-enable react/no-danger */
          }
        </Section>

      </main>
    );
  }
}

Home.defaultProps = {
  news: [],
};

Home.propTypes = {
  news: PT.arrayOf(PT.shape()),
  tokenV2: PT.string.isRequired,
};

