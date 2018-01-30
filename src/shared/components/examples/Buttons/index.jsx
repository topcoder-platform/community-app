import React from 'react';
import {
  Button,
  DangerButton,
  GhostButton,
  PrimaryButton,
  SecondaryButton,
} from 'topcoder-react-ui-kit';

import { Button as GenericButton } from 'topcoder-react-utils';

import outlineRoundAkkuratDanger from
  'components/buttons/outline/round/akkurat/danger.scss';
import outlineRoundAkkuratDefault from
  'components/buttons/outline/round/akkurat/default.scss';
import outlineRoundAkkuratPrimary from
  'components/buttons/outline/round/akkurat/primary.scss';

import outlineRoundOpenSansDefault from
  'components/buttons/outline/round/open-sans/default.scss';
import outlineRoundOpenSansBlueUppercase from
  'components/buttons/outline/round/open-sans/blue-uppercase.scss';
import outlineRoundOpenSansGreenUppercase from
  'components/buttons/outline/round/open-sans/green-uppercase.scss';
import outlineRoundOpenSansRedUppercase from
  'components/buttons/outline/round/open-sans/red-uppercase.scss';

import Sample from './Sample';
import style from './style.scss'; // eslint-disable-line no-unused-vars

export default function Buttons() {
  return (
    <div styleName="style.container">
      <h1 styleName="style.title">Buttons</h1>

      <p styleName="style.text">
        All buttons in this page are instances of the generic button,
        implemented in <code>/src/topcoder-react-ui-kit</code> and wrapped
        into different style themes with help
        of <code>react-css-super-themr</code>.
      </p>

      <h2 styleName="style.subsection">Standard Buttons from TC UI Kit</h2>

      <Sample Button={Button} title="Default Button" />
      <Sample Button={PrimaryButton} title="Primary Button" />
      <Sample Button={SecondaryButton} title="Secondary Button" />
      <Sample Button={DangerButton} title="Danger Button" />
      <Sample Button={GhostButton} title="Ghost Button" />

      <h2 styleName="style.subsection">Outline Buttons</h2>

      <p styleName="style.text">
        Various styles of outline buttons, that are not a part of the official
        TC UI Kit, but they are used in some TC sub-communities, so we have them
        globally available to not re-invent a wheel, if we want a similar style
        elsewhere.
      </p>

      <Sample
        Button={GenericButton}
        theme={outlineRoundAkkuratDefault}
        title="outline/round/akkurat/default"
      />
      <Sample
        Button={GenericButton}
        theme={outlineRoundAkkuratDanger}
        title="outline/round/akkurat/danger"
      />
      <Sample
        Button={GenericButton}
        theme={outlineRoundAkkuratPrimary}
        title="outline/round/akkurat/primary"
      />

      <Sample
        Button={GenericButton}
        theme={outlineRoundOpenSansDefault}
        title="outline/round/open-sans/default"
      />
      <Sample
        Button={GenericButton}
        theme={outlineRoundOpenSansBlueUppercase}
        title="outline/round/open-sans/blue-uppercase"
      />
      <Sample
        Button={GenericButton}
        theme={outlineRoundOpenSansGreenUppercase}
        title="outline/round/open-sans/green-uppercase"
      />
      <Sample
        Button={GenericButton}
        theme={outlineRoundOpenSansRedUppercase}
        title="outline/round/open-sans/red-uppercase"
      />
    </div>
  );
}
