import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Section from 'components/tc-communities/Section';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Section>
      <div>content</div>
    </Section>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <Section
      title="Section title"
      link={{
        title: 'link',
        url: '#',
      }}
      theme={{
        container: 'container',
        title: 'title',
        content: 'content',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    >
      <div>content</div>
    </Section>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
