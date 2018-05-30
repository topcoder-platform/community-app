/**
 * Static implementation of Home page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */
/* eslint-disable max-len */

import React from 'react';
import Section from 'components/tc-communities/Section';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';

import { services } from 'topcoder-react-lib';

import style from './style.scss';

const { getApiV2 } = services.api;
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


Home.propTypes = {
  tokenV2: PT.string.isRequired,
};

