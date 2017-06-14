import React from 'react';
import Render from 'react-test-renderer';
import IconStat from 'components/tc-communities/IconStat';

function Icon() {
  return <div />;
}

test('Snapshot match', () => {
  const render = Render.create((
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
  expect(render.toJSON()).toMatchSnapshot();
});
