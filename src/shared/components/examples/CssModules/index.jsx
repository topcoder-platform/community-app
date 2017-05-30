/**
 * This modules provide a demo/test of CSS modules in action.
 */

import React from 'react';
import A from './ComponentA';
import B from './ComponentB';

export default function CssModules() {
  return (
    <div>
      <h1>CSS Modules</h1>
      <p>Here is a simple demo/test of CSS modules in action.</p>
      <A />
      <B />
    </div>
  );
}
