/**
 * Mock redux-devtools-dock-monitor module.
 * Allows to test development-only code depending on that module even
 * in production environment, where that module is not installed.
 */

export default function ReduxDevtoolsDockMonitor() {
  return null;
}
