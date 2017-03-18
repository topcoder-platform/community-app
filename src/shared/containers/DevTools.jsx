/**
 * The DevTools container provides Redux monitors for use in development
 * environment.
 */

/* As this component is intended for development environment only, it is fine
 * to use dev-only dependencies. */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import LogMonitor from 'redux-devtools-log-monitor';

export default createDevTools((
  /* Additional Redux monitors can be added here. */
  <DockMonitor
    changePositionKey="ctrl-p"
    toggleVisibilityKey="ctrl-m"
  >
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
));
