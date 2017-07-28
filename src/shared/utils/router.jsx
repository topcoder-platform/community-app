/**
 * Various utils that faciliate usage of react-router.
 */

import PT from 'prop-types';
import React from 'react';
import URL from 'url-parse';
import { connect } from 'react-redux';
import { Link as RRLink, NavLink as RRNavLink } from 'react-router-dom';

/**
 * Here are enhanced versions of react-router's <Link> and <NavLink> components.
 * Original components work properly only with URLs reffering routes within the
 * app. Our versions of <Link> and <NavLink> compare the URL hostname with the
 * hostname of the page where they are rendered:
 * 1) If the same, the hyper-reference is rendered as react-router's <Link> or
 *    <NavLink>, thus avoiding re-load of the app;
 * 2) If different, the hyper-reference is rendered as HTML <a> element, thus
 *    properly leading visitors outside of the app.
 *
 * NOTE that assumption (1) can be wrong (i.e. we can configure our server in
 * such way that different endpoints in the same domain are served by different
 * web applications). However, in many use cases the assumption (1) holds, and
 * as it allows an elegant solution, we implement it here.
 */

function RRLinkWrapper(props) {
  const url = new URL(props.to);
  if ((props.hostname !== url.hostname)
  || props.to.startsWith('#')) {
    return (
      <a
        className={props.className}
        href={props.to}
        target={props.openExternalLinkInNewPage ? '_blank' : ''}
      >{props.children}</a>
    );
  }
  return (
    <RRLink
      className={props.className}
      onClick={props.onClick}
      replace={props.replace}
      to={props.to}
    >{props.children}</RRLink>
  );
}

RRLinkWrapper.defaultProps = {
  children: null,
  className: null,
  onClick: null,
  openExternalLinkInNewPage: false,
  replace: false,
};

RRLinkWrapper.propTypes = {
  children: PT.node,
  className: PT.string,
  hostname: PT.string.isRequired,
  onClick: PT.func,
  openExternalLinkInNewPage: PT.bool,
  replace: PT.bool,
  to: PT.oneOfType([PT.object, PT.string]).isRequired,
};

export const Link = connect(state => ({
  hostname: state.hostname,
}))(RRLinkWrapper);

function RRNavLinkWrapper(props) {
  const url = new URL(props.to);
  if ((props.hostname !== url.hostname)
  || props.to.startsWith('#')) {
    return (
      /* NOTE: Currently we don't handle isActive check here. Though, as this
       * <a> element is a fallback for URLs leading outside of the app, in
       * usual use cases it never should be rendered as active within the app.
       */
      <a
        className={props.className}
        href={props.to}
        target={props.openExternalLinkInNewPage ? '_blank' : ''}
      >{props.children}</a>
    );
  }
  return (
    <RRNavLink
      activeClassName={props.activeClassName}
      activeStyle={props.activeStyle}
      className={props.className}
      exact={props.exact}
      isActive={props.isActive}
      location={props.location}
      replace={props.replace}
      strict={props.strict}
      to={props.to}
    >{props.children}</RRNavLink>
  );
}

RRNavLinkWrapper.defaultProps = {
  activeClassName: null,
  activeStyle: null,
  children: null,
  className: null,
  exact: false,
  location: null,
  openExternalLinkInNewPage: false,
  replace: false,
  strict: false,
};

RRNavLinkWrapper.propTypes = {
  activeClassName: PT.string,
  activeStyle: PT.shape(),
  children: PT.node,
  className: PT.string,
  exact: PT.bool,
  hostname: PT.string.isRequired,
  isActive: PT.func.isRequired,
  location: PT.shape(),
  openExternalLinkInNewPage: PT.bool,
  replace: PT.bool,
  strict: PT.bool,
  to: PT.string.isRequired,
};

export const NavLink = connect(state => ({
  hostname: state.hostname,
}))(RRNavLinkWrapper);

export default undefined;
