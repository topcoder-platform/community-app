/**
 * Renders the section with content from ConsenSys blog at Medium.
 */

import PT from 'prop-types';
import React from 'react';
import Section from 'components/tc-communities/Section';

import Card from './Card';
import style from './style.scss';


export default function ConsenSysAtMedium({ consenSysRss }) {
  const cards = consenSysRss.data.item
    .filter(item => Boolean(item.category))
    .slice(0, 3)
    .map((item, index) => (
      <Card fullWidth={!index} item={item} />
    ));

  return (
    <Section
      theme={{
        content: style.content,
      }}
      title="ConsenSys @ Medium"
    >
      {cards}
    </Section>
  );
}

ConsenSysAtMedium.propTypes = {
  consenSysRss: PT.shape({
    data: PT.shape({
      item: PT.arrayOf(PT.object).isRequired,
    }).isRequired,
  }).isRequired,
};
