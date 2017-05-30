import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import IconStat from 'components/tc-communities/IconStat';

const rnd = new Rnd();

function Icon() {
  return <div />;
}

test('Snapshot match', () => {
  rnd.render((
    <IconStat icon={Icon} number="5" label="Projects" />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <IconStat
      icon={Icon}
      number="5"
      label="Projects"
      theme={{
        container: 'container',
        icon: 'icon',
        number: 'number',
        label: 'label',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
