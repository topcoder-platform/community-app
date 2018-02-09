import React from 'react';

import Color from './Color';
import Group from '../SampleGroup';

import './style.scss';

export default function ColorMixins() {
  return (
    <div styleName="container">
      <h1 styleName="title">Color Mixins</h1>
      <div styleName="text">
        The numeral suffixes of color constants indicate mix levels of black
        and white. <code>100</code> means the base color (and the base colors
        are aliased under the same names without suffixes); levels below
        &zwnj;<code>100</code> mean the mix of base with white; levels above
        &zwnj;<code>100</code> mean the mix of base with black.
      </div>
      <div styleName="text">
        In general, colors with <code>110</code> suffix should be used for text
        only. For the Metals, <code>110</code> should be used for the normal and
        larger text above the metal, and <code>130</code> should be used for
        text with small font, for better visibility.
      </div>
      <div styleName="text">
          For convenience, all base colors are aliased under the same names
          without any suffix (see Brand Colors section).
      </div>
      <div styleName="content">
        <Group title="Grayscale">
          <Color name="tc-black" />
          <Color name="tc-gray-90" />
          <Color name="tc-gray-80" />
          <Color name="tc-gray-70" />
          <Color name="tc-gray-60" />
          <Color name="tc-gray-50" />
          <Color name="tc-gray-40" />
          <Color name="tc-gray-30" />
          <Color name="tc-gray-20" />
          <Color name="tc-gray-10" />
          <Color name="tc-gray-neutral-dark" />
          <Color name="tc-gray-neutral-light" />
          <Color name="tc-white" />
        </Group>
        <Group title="Brand Color">
          <Color name="tc-dark-blue" />
          <Color name="tc-green" />
          <Color name="tc-light-blue" />
          <Color name="tc-orange" />
          <Color name="tc-purple" />
          <Color name="tc-red" />
          <Color name="tc-yellow" />
        </Group>
        <Group title="Dark Blue Shades">
          <Color name="tc-dark-blue-110" />
          <Color name="tc-dark-blue-100" />
          <Color name="tc-dark-blue-70" />
          <Color name="tc-dark-blue-30" />
          <Color name="tc-dark-blue-10" />
        </Group>
        <Group title="Light Blue Shades">
          <Color name="tc-light-blue-110" />
          <Color name="tc-light-blue-100" />
          <Color name="tc-light-blue-70" />
          <Color name="tc-light-blue-30" />
          <Color name="tc-light-blue-10" />
        </Group>
        <Group title="Orange Shades">
          <Color name="tc-orange-110" />
          <Color name="tc-orange-100" />
          <Color name="tc-orange-70" />
          <Color name="tc-orange-30" />
          <Color name="tc-orange-10" />
        </Group>
        <Group title="Red Shades">
          <Color name="tc-red-110" />
          <Color name="tc-red-100" />
          <Color name="tc-red-70" />
          <Color name="tc-red-30" />
          <Color name="tc-red-10" />
        </Group>
        <Group title="Yellow Shades">
          <Color name="tc-yellow-110" />
          <Color name="tc-yellow-100" />
          <Color name="tc-yellow-70" />
          <Color name="tc-yellow-30" />
          <Color name="tc-yellow-10" />
        </Group>
        <Group title="Green Shades">
          <Color name="tc-green-110" />
          <Color name="tc-green-100" />
          <Color name="tc-green-70" />
          <Color name="tc-green-30" />
          <Color name="tc-green-10" />
        </Group>
        <Group title="Purple Shades">
          <Color name="tc-purple-110" />
          <Color name="tc-purple-100" />
          <Color name="tc-purple-70" />
          <Color name="tc-purple-30" />
          <Color name="tc-purple-10" />
        </Group>
        <Group title="Metal Colors">
          <Color name="tc-gold" />
          <Color name="tc-silver" />
          <Color name="tc-bronze" />
          <Color name="tc-gold-130" />
          <Color name="tc-gold-110" />
          <Color name="tc-gold-100" />
          <Color name="tc-silver-130" />
          <Color name="tc-silver-110" />
          <Color name="tc-silver-100" />
          <Color name="tc-bronze-130" />
          <Color name="tc-bronze-110" />
          <Color name="tc-bronze-100" />
        </Group>
        <Group title="Pastel Colors">
          <Color name="tc-pastel-blue" />
          <Color name="tc-pastel-crimson" />
          <Color name="tc-pastel-green" />
          <Color name="tc-pastel-yellow" />
        </Group>
        <Group title="Community Achievement Colors">
          <Color name="tc-level-1" />
          <Color name="tc-level-2" />
          <Color name="tc-level-3" />
          <Color name="tc-level-4" />
          <Color name="tc-level-5" />
        </Group>
      </div>
    </div>
  );
}
