/**
 * Renders the section with content from ConsenSys blog at Medium.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Section from 'components/tc-communities/Section';

import Newsletter from './Newsletter';

import Card from './Card';
import style from './style.scss';

export default function ConsenSysAtMedium({ consenSysRss }) {
  let cards = _.get(consenSysRss, 'data.item');
  cards = cards && cards
    .filter(item => Boolean(item.category))
    .slice(0, 3)
    .map((item, index) => (
      <Card fullWidth={!index} item={item} key={item.link} />
    ));

  return (
    <Section
      theme={{
        content: style.content,
      }}
      title="ConsenSys @ Medium"
    >
      {cards || <LoadingIndicator />}
      <Newsletter />
    </Section>
  );
}

ConsenSysAtMedium.defaultProps = {
  consenSysRss: null,
};

ConsenSysAtMedium.propTypes = {
  consenSysRss: PT.shape({
    data: PT.shape({
      item: PT.arrayOf(PT.shape({
        link: PT.string.isRequired,
      })).isRequired,
    }),
  }),
};
