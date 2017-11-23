import React from 'react';
import {
  Button,
  DangerButton,
  GhostButton,
  PrimaryButton,
  SecondaryButton,
} from 'components/buttons';

import style from './style.scss'; // eslint-disable-line no-unused-vars

export default function Buttons() {
  return (
    <div styleName="style.container">
      <h1 styleName="style.title">Buttons</h1>
      <p>
        All buttons in this page are instances of the generic button,
        implemented in <code>/src/components/buttons</code> and wrapped
        into different style themes with help
        of <code>react-css-super-themr</code>.
      </p>

      <h3>Default Button</h3>
      <div>
        <Button>Button</Button>
        <Button to=".">Link Button</Button>
        <Button disabled>Disabled Button</Button>
      </div>

      <div>
        <Button size="xs">Extra-Small Button</Button>
        <Button size="sm">Small Button</Button>
        <Button size="md">Medium Button (default)</Button>
        <Button size="lg">Large Button</Button>
      </div>

      <div>
        <Button size="xs" to=".">Extra-Small Link Button</Button>
        <Button size="sm" to=".">Small Link Button</Button>
        <Button size="md" to=".">Medium Link Button (default)</Button>
        <Button size="lg" to=".">Large Link Button</Button>
      </div>

      <div>
        <Button disabled size="xs">Extra-Small Button</Button>
        <Button disabled size="sm">Small Button</Button>
        <Button disabled size="md">Medium Button (default)</Button>
        <Button disabled size="lg">Large Button</Button>
      </div>

      <h3>Primary Button</h3>

      <PrimaryButton>Button</PrimaryButton>
      <PrimaryButton to=".">Link Button</PrimaryButton>
      <PrimaryButton disabled>Disabled Button</PrimaryButton>

      <div>
        <PrimaryButton size="xs">Extra-Small Button</PrimaryButton>
        <PrimaryButton size="sm">Small Button</PrimaryButton>
        <PrimaryButton size="md">Medium Button (default)</PrimaryButton>
        <PrimaryButton size="lg">Large Button</PrimaryButton>
      </div>

      <div>
        <PrimaryButton size="xs" to=".">Extra-Small Link Button</PrimaryButton>
        <PrimaryButton size="sm" to=".">Small Link Button</PrimaryButton>
        <PrimaryButton size="md" to=".">
          Medium Link Button (default)
        </PrimaryButton>
        <PrimaryButton size="lg" to=".">Large Link Button</PrimaryButton>
      </div>

      <div>
        <PrimaryButton disabled size="xs">Extra-Small Button</PrimaryButton>
        <PrimaryButton disabled size="sm">Small Button</PrimaryButton>
        <PrimaryButton disabled size="md">
          Medium Button (default)
        </PrimaryButton>
        <PrimaryButton disabled size="lg">Large Button</PrimaryButton>
      </div>

      <h3>Secondary Button</h3>
      <SecondaryButton>Button</SecondaryButton>
      <SecondaryButton to=".">Link Button</SecondaryButton>
      <SecondaryButton disabled>Disabled Button</SecondaryButton>

      <div>
        <SecondaryButton size="xs">Extra-Small Button</SecondaryButton>
        <SecondaryButton size="sm">Small Button</SecondaryButton>
        <SecondaryButton size="md">Medium Button (default)</SecondaryButton>
        <SecondaryButton size="lg">Large Button</SecondaryButton>
      </div>

      <div>
        <SecondaryButton size="xs" to=".">
          Extra-Small Link Button
        </SecondaryButton>
        <SecondaryButton size="sm" to=".">Small Link Button</SecondaryButton>
        <SecondaryButton size="md" to=".">
          Medium Link Button (default)
        </SecondaryButton>
        <SecondaryButton size="lg" to=".">Large Link Button</SecondaryButton>
      </div>

      <div>
        <SecondaryButton disabled size="xs">Extra-Small Button</SecondaryButton>
        <SecondaryButton disabled size="sm">Small Button</SecondaryButton>
        <SecondaryButton disabled size="md">
          Medium Button (default)
        </SecondaryButton>
        <SecondaryButton disabled size="lg">Large Button</SecondaryButton>
      </div>

      <h3>Danger Button</h3>
      <DangerButton>Button</DangerButton>
      <DangerButton to=".">Link Button</DangerButton>
      <DangerButton disabled>Disabled Button</DangerButton>

      <div>
        <DangerButton size="xs">Extra-Small Button</DangerButton>
        <DangerButton size="sm">Small Button</DangerButton>
        <DangerButton size="md">Medium Button (default)</DangerButton>
        <DangerButton size="lg">Large Button</DangerButton>
      </div>

      <div>
        <DangerButton size="xs" to=".">
          Extra-Small Link Button
        </DangerButton>
        <DangerButton size="sm" to=".">Small Link Button</DangerButton>
        <DangerButton size="md" to=".">
          Medium Link Button (default)
        </DangerButton>
        <DangerButton size="lg" to=".">Large Link Button</DangerButton>
      </div>

      <div>
        <DangerButton disabled size="xs">Extra-Small Button</DangerButton>
        <DangerButton disabled size="sm">Small Button</DangerButton>
        <DangerButton disabled size="md">
          Medium Button (default)
        </DangerButton>
        <DangerButton disabled size="lg">Large Button</DangerButton>
      </div>

      <h3>Ghost Button</h3>
      <GhostButton>Button</GhostButton>
      <GhostButton to=".">Link Button</GhostButton>
      <GhostButton disabled>Disabled Button</GhostButton>

      <div>
        <GhostButton size="xs">Extra-Small Button</GhostButton>
        <GhostButton size="sm">Small Button</GhostButton>
        <GhostButton size="md">Medium Button (default)</GhostButton>
        <GhostButton size="lg">Large Button</GhostButton>
      </div>

      <div>
        <GhostButton size="xs" to=".">
          Extra-Small Link Button
        </GhostButton>
        <GhostButton size="sm" to=".">Small Link Button</GhostButton>
        <GhostButton size="md" to=".">
          Medium Link Button (default)
        </GhostButton>
        <GhostButton size="lg" to=".">Large Link Button</GhostButton>
      </div>

      <div>
        <GhostButton disabled size="xs">Extra-Small Button</GhostButton>
        <GhostButton disabled size="sm">Small Button</GhostButton>
        <GhostButton disabled size="md">
          Medium Button (default)
        </GhostButton>
        <GhostButton disabled size="lg">Large Button</GhostButton>
      </div>
    </div>
  );
}
