import React from 'react';
import { useOptimizelyClient } from '@optimizely/react-sdk';

/**
 * Compatibility wrapper for class components that still consume the
 * Optimizely client through an injected prop.
 *
 * @param {React.ComponentType} Component component receiving `optimizely`
 * @returns {React.ComponentType} wrapped component
 */
export default function withOptimizely(Component) {
  function WithOptimizely(props) {
    const optimizely = useOptimizelyClient();

    return <Component {...props} optimizely={optimizely} />;
  }

  WithOptimizely.displayName = `withOptimizely(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithOptimizely;
}
