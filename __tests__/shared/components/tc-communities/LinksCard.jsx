import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import LinksCard from 'components/tc-communities/LinksCard';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <LinksCard
      title="Videos"
      links={[{
        title: 'Tristique ullamcorper id vitae',
        url: '#',
      }, {
        title: 'Nulla mollis sapien sollicitudin',
        url: '#',
      }, {
        title: 'Vivamus facilisis dolor et massa',
        url: '#',
      }, {
        title: 'Vestibulum nisl egestas',
        url: '#',
      }]}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <LinksCard
      title="Videos"
      links={[{
        title: 'Tristique ullamcorper id vitae',
        url: '#',
      }, {
        title: 'Nulla mollis sapien sollicitudin',
        url: '#',
      }, {
        title: 'Vivamus facilisis dolor et massa',
        url: '#',
      }, {
        title: 'Vestibulum nisl egestas',
        url: '#',
      }]}
      theme={{
        container: 'container',
        title: 'title',
        list: 'list',
        item: 'item',
        link: 'link',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
