/**
 * Various utils that faciliate the usage of react-router.
 */

/* global document, window */

import PT from 'prop-types';
import React from 'react';
import URL from 'url-parse';
import { Link as RRLink, NavLink as RRNavLink } from 'react-router-dom';

import SplitRoute from './SplitRoute';

export { SplitRoute };

/**
 * Here are enhanced versions of react-router's <Link> and <NavLink> components.
 * Original components work properly only with URLs reffering routes within the
 * app. Our versions of <Link> and <NavLink> compare the URL hostname with the
 * hostname of the page where they are rendered:
 *
 * 1) If the same, the hyper-reference is rendered as react-router's <Link> or
 *    <NavLink>, thus avoiding re-load of the app;
 *
 * 2) If different, the hyper-reference is rendered as HTML <a> element, thus
 *    properly leading visitors outside of the app.
 *
 * 3) Additionally, the links are rendered as HTML <a> element if "openNewTab"
 *    prop is passed in (in this case target="_blank" is passed into <a>, to
 *    make sure that the link will be opened in a new browser tab). Also, the
 *    link is rendered as <a> if it starts with # symbol (i.e. it is supposed
 *    to scroll the currenty page to an ankor point).
 *
 * NOTE that assumption (1) can be wrong (i.e. we can configure our server in
 * such way that different endpoints in the same domain are served by different
 * web applications). However, in many use cases the assumption (1) holds, and
 * as it allows an elegant solution, we implement it here.
 */

export function Link({
  children,
  className,
  enforceA,
  onClick,
  onMouseDown,
  openNewTab,
  replace,
  to,
}) {
  const url = new URL(to);
  if (enforceA || openNewTab || to.startsWith('#')) {
    return (
      <a
        className={className}
        href={to}
        onClick={onClick}
        rel={openNewTab ? 'noopener noreferrer' : ''}
        target={openNewTab ? '_blank' : ''}
      >{children}</a>
    );
  }
  return (
    <RRLink
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (url.origin !== document.location.origin) {
          document.location = to;
          e.preventDefault();
        } else window.scroll(0, 0);
      }}
      onMouseDown={onMouseDown}
      replace={replace}
      to={to}
    >{children}</RRLink>
  );
}

Link.defaultProps = {
  children: null,
  className: null,
  enforceA: false,
  onClick: null,
  onMouseDown: null,
  openNewTab: false,
  replace: false,
};

Link.propTypes = {
  children: PT.node,
  className: PT.string,
  enforceA: PT.bool,
  onClick: PT.func,
  onMouseDown: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  to: PT.oneOfType([PT.object, PT.string]).isRequired,
};

export function NavLink({
  activeClassName,
  activeStyle,
  children,
  className,
  enforceA,
  exact,
  isActive,
  location,
  onClick,
  openNewTab,
  replace,
  strict,
  to,
}) {
  const url = new URL(to);
  if (enforceA || openNewTab || to.startsWith('#')) {
    return (
      /* NOTE: Currently we don't handle isActive check here. Though, as this
       * <a> element is a fallback for URLs leading outside of the app, in
       * usual use cases it never should be rendered as active within the app.
       */
      <a
        className={className}
        href={to}
        onClick={onClick}
        rel={openNewTab ? 'noopener noreferrer' : ''}
        target={openNewTab ? '_blank' : ''}
      >{children}</a>
    );
  }
  return (
    <RRNavLink
      activeClassName={activeClassName}
      activeStyle={activeStyle}
      className={className}
      exact={exact}
      isActive={isActive}
      location={location}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (url.origin !== document.location.origin) {
          document.location = to;
          e.preventDefault();
        } else window.scroll(0, 0);
      }}
      replace={replace}
      strict={strict}
      to={to}
    >{children}</RRNavLink>
  );
}

NavLink.defaultProps = {
  activeClassName: null,
  activeStyle: null,
  children: null,
  className: null,
  enforceA: false,
  exact: false,
  location: null,
  onClick: null,
  openNewTab: false,
  replace: false,
  strict: false,
};

NavLink.propTypes = {
  activeClassName: PT.string,
  activeStyle: PT.shape(),
  children: PT.node,
  className: PT.string,
  enforceA: PT.bool,
  exact: PT.bool,
  isActive: PT.func.isRequired,
  location: PT.shape(),
  onClick: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  strict: PT.bool,
  to: PT.string.isRequired,
};

/**
 * Requires the specified module without including it into the bundle during
 * Webpack build. This function should be executed only server-side. 
 * @param {String} modulePath
 * @return Required module.
 */
export function requireWeak(modulePath) {
  /* eslint-disable global-require, import/no-dynamic-require */
  const mod = require('./require')(modulePath);
  /* eslint-enable global-require, import/no-dynamic-require */
  return mod.default || mod;
}

/**
 * Resolves provided module path with help of Babel's module resolver. As you
 * see, the function itself just returns its argument, but Babel is configured
 * to resolve the first argument of resolveWeak(..) function, so it works.
 * Note that result of this resolution may be a relative path (relative to the
 * caller module). To resolve it to an absolute path you should do
 * path.resolve(resolveWeak(modulePath)).
 * @param {String} modulePath 
 * @return {String} Module path.
 */
export function resolveWeak(modulePath) {
  return modulePath;
}

export default undefined;
