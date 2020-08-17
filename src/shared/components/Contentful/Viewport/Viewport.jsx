/**
 * Themed Viewport Component
 */
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import { getHash } from 'utils/url';


/* Loads viewport content assets. */
const Viewport = ({
  children,
  extraStylesForContainer,
  theme,
  viewportId,
  animation,
}) => {
  const hash = getHash();
  if (hash && hash.vid && hash.vid === viewportId) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const section = document.getElementById(viewportId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
  // Animated on scroll viewport?
  if (animation.animateOnScroll) {
    return (
      <div
        id={viewportId}
        className={theme.container}
        style={extraStylesForContainer}
        role="main"
        data-aos={animation.animateOnScroll}
        data-aos-once={animation.animateOnScrollOnce}
        data-aos-delay={animation.animateOnScrollDelay}
        data-aos-duration={animation.animateOnScrollDuration}
        data-aos-easing={animation.animateOnScrollEasing}
        data-aos-mirror={animation.animateOnScrollMirror}
        data-aos-anchor-placement={animation.animateOnScrollAnchor}
        data-aos-offset={animation.animateOnScrollOffset}
      >
        {children}
      </div>
    );
  }
  return (
    <div id={viewportId} className={theme.container} style={extraStylesForContainer} role="main">
      {children}
    </div>
  );
};

Viewport.defaultProps = {
  extraStylesForContainer: {},
  animation: {},
};

Viewport.propTypes = {
  viewportId: PT.string.isRequired,
  children: PT.node.isRequired,
  extraStylesForContainer: PT.shape(),
  theme: PT.shape({
    container: PT.string.isRequired,
  }).isRequired,
  animation: PT.shape(),
};

export default themr('Viewport')(Viewport);
