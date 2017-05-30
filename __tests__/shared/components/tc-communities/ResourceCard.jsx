import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import ResourceCard from 'components/tc-communities/ResourceCard';

const rnd = new Rnd();

function Icon() {
  return <div />;
}

test('Snapshot match', () => {
  rnd.render((
    <ResourceCard
      icon={Icon}
      title="Take the First Steps to Stand Out in the Community"
      text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris."
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ResourceCard
      icon={Icon}
      title="Take the First Steps to Stand Out in the Community"
      text="Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet mauris."
      link={{
        title: 'Learn about badges',
        url: '#',
      }}
      theme={{
        container: 'container',
        icon: 'image',
        title: 'title',
        text: 'text',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
