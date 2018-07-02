/**
 * Client-side loading indicator animation.  <LoadingIndicator> will often be rendered
 * server-side and animation code contained in the React component will not be loaded into
 * the browser.  The following approach should animate any <LoadingIndicators> present
 * regardless of how they were rendered.
 * It might be possible to change the code to be class based rather than id based
 * so that multiple LoadingIndicators could be animated simulataneously
 * however it's difficult to determine what the class names will be due to the
 * automatic React class namespacing.
 */

/* eslint-env browser */

function animateLoadingIndicators(timestamp) {
  const updateCircle = (circle, offset) => {
    const phase1 = ((timestamp / 1000 / 2) + offset) % 1;
    circle.setAttribute('r', 28 * phase1 * (2.0 - phase1));
    circle.setAttribute('opacity', 1.0 - (phase1 * phase1));
  };

  const circle1 = document.querySelectorAll('circle[id="loading-indicator-circle1"]');
  const circle2 = document.querySelectorAll('circle[id="loading-indicator-circle2"]');

  circle1.forEach(x => updateCircle(x, 0));
  circle2.forEach(x => updateCircle(x, 0.5));

  window.requestAnimationFrame(animateLoadingIndicators);
}

window.requestAnimationFrame(animateLoadingIndicators);
