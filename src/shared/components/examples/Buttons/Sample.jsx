/**
 * A simple panel showcasing the specified button element.
 */

import PT from 'prop-types';
import React from 'react';
import SampleGroup from 'components/examples/SampleGroup';

export default function Sample({ Button, theme, title }) {
  const name = encodeURIComponent(title);
  const ref = `#${name}`;
  const titleRef = <a name={name}>{title}</a>;
  return (
    <SampleGroup title={titleRef}>
      <div>
        <Button theme={theme}>Button</Button>
        <Button theme={theme} to={ref}>Link Button</Button>
        <Button disabled theme={theme}>Disabled Button</Button>
      </div>

      <div>
        <Button size="xs" theme={theme}>Extra-Small Button</Button>
        <Button size="sm" theme={theme}>Small Button</Button>
        <Button size="md" theme={theme}>Medium Button (default)</Button>
        <Button size="lg" theme={theme}>Large Button</Button>
      </div>

      <div>
        <Button
          size="xs"
          theme={theme}
          to={ref}
        >Extra-Small Link Button</Button>
        <Button
          size="sm"
          theme={theme}
          to={ref}
        >Small Link Button</Button>
        <Button
          size="md"
          theme={theme}
          to={ref}
        >Medium Link Button (default)</Button>
        <Button
          size="lg"
          theme={theme}
          to={ref}
        >Large Link Button</Button>
      </div>

      <div>
        <Button
          disabled
          size="xs"
          theme={theme}
        >Extra-Small Button</Button>
        <Button
          disabled
          size="sm"
          theme={theme}
        >Small Button</Button>
        <Button
          disabled
          size="md"
          theme={theme}
        >Medium Button (default)</Button>
        <Button
          disabled
          size="lg"
          theme={theme}
        >Large Button</Button>
      </div>
    </SampleGroup>
  );
}

Sample.defaultProps = {
  theme: {},
};

Sample.propTypes = {
  Button: PT.func.isRequired,
  theme: PT.shape(),
  title: PT.string.isRequired,
};
