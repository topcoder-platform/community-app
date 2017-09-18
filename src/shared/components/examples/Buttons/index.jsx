import React from 'react';
import {
  Button,
  DangerButton,
  PrimaryButton,
  SecondaryButton,
} from 'components/buttons';
import { ThemeProvider } from 'react-css-super-themr';

import primaryDataScienceButtonStyle from '../../buttons/primaryDataScience.scss';
import primaryDevelopButtonStyle from '../../buttons/primaryDevelop.scss';

import style from './style.scss';

export default function Buttons() {
  return (
    <div styleName="style.page">
      <h1>Buttons</h1>
      <p>
        All buttons in this page are instances of the generic button,
        implemented in <code>/src/components/buttons</code> and wrapped
        into different style themes with help
        of <code>react-css-themr</code>.
      </p>

      <h3>Default Button</h3>
      <Button>Button</Button>
      <Button to=".">Link Button</Button>
      <Button disabled>Disabled Button</Button>

      <h3>Button Dimensions</h3>
      <Button theme={{ button: style.btnXS }}>Extra-Small Button</Button>
      <Button theme={{ button: style.btnSM }}>Small Button</Button>
      <Button>Medium Button (default)</Button>
      <Button theme={{ button: style.btnLG }}>Large Button</Button>

      <h3>Primary Button</h3>

      <p>Default &mdash; design color sheme:</p>
      <PrimaryButton>Button</PrimaryButton>
      <PrimaryButton to=".">Link Button</PrimaryButton>
      <PrimaryButton disabled>Disabled Button</PrimaryButton>

      <p>Develop color scheme (underlying source code also
        demonstrates the proper context theming in action):</p>

      <p><em>NOTE:</em> It turns out that it is not necessary to change colors
        of primary buttons depending on challenge tracks. Thus, you should not
        use the green and orange button themes. Hovewer, as they are already
        implemented, and also show how <code>ThemeProvider</code> should be
        used to style some elements according to the track, we keep them in
        the repo and on this example page.</p>
      <ThemeProvider
        theme={{ PrimaryButton: primaryDevelopButtonStyle }}
      >
        <div>
          <PrimaryButton>Button</PrimaryButton>
          <PrimaryButton to=".">Link Button</PrimaryButton>
          <PrimaryButton disabled>Disabled Button</PrimaryButton>
        </div>
      </ThemeProvider>

      <p>Data science color scheme:</p>
      <ThemeProvider
        theme={{ PrimaryButton: primaryDataScienceButtonStyle }}
      >
        <div>
          <PrimaryButton>Button</PrimaryButton>
          <PrimaryButton to=".">Link Button</PrimaryButton>
          <PrimaryButton disabled>Disabled Button</PrimaryButton>
        </div>
      </ThemeProvider>

      <h3>Secondary Button</h3>
      <SecondaryButton>Button</SecondaryButton>
      <SecondaryButton to=".">Link Button</SecondaryButton>
      <SecondaryButton disabled>Disabled Button</SecondaryButton>

      <h3>Danger Button</h3>
      <DangerButton>Button</DangerButton>
      <DangerButton to=".">Link Button</DangerButton>
      <DangerButton disabled>Disabled Button</DangerButton>
    </div>
  );
}
