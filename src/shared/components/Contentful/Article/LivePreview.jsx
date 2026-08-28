/**
 * Payload Live Preview bridge for the existing Thrive article renderer.
 */
import PT from 'prop-types';
import React from 'react';

import Article from './Article';
import theme from './themes/default.scss';

const LIVE_PREVIEW_COLLECTION = 'thrive-articles';
const LIVE_PREVIEW_MARKER = 'payloadLivePreview';

/**
 * Determines whether a route was opened explicitly by Payload Live Preview.
 * @param {String} search Browser location search string.
 * @return {Boolean} True only for the exact opt-in query marker.
 */
export function isThriveLivePreview(search) {
  return new RegExp(`(?:^|[?&])${LIVE_PREVIEW_MARKER}=1(?:&|$)`).test(search || '');
}

/**
 * Selects the CMS origin paired with the current Topcoder hostname.
 * @param {String} hostname Current browser hostname.
 * @return {String|null} Trusted CMS origin, or null for an unknown host.
 */
export function thriveLivePreviewCmsOrigin(hostname) {
  if (hostname === 'topcoder-dev.com' || hostname.endsWith('.topcoder-dev.com')) {
    return 'https://cms.topcoder-dev.com';
  }
  if (hostname === 'topcoder.com' || hostname.endsWith('.topcoder.com')) {
    return 'https://cms.topcoder.com';
  }
  return null;
}

/**
 * Narrows an arbitrary JSON value to a string-keyed object.
 * @param {*} value Candidate JSON value.
 * @return {Boolean} True for non-array objects.
 */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks the minimal Contentful resource contract used by the legacy renderer.
 * @param {*} value Candidate resource.
 * @param {String} kind Expected Entry or Asset kind.
 * @return {Boolean} True when system identity and fields are present.
 */
function isResource(value, kind) {
  return isRecord(value)
    && isRecord(value.sys)
    && value.sys.type === kind
    && typeof value.sys.id === 'string'
    && isRecord(value.fields);
}

/**
 * Checks whether a value is a Contentful Entry or Asset relationship Link.
 * @param {*} value Candidate field value.
 * @return {Boolean} True for a supported relationship Link.
 */
function isLink(value) {
  return isRecord(value)
    && isRecord(value.sys)
    && value.sys.type === 'Link'
    && (value.sys.linkType === 'Entry' || value.sys.linkType === 'Asset')
    && typeof value.sys.id === 'string';
}

/**
 * Resolves Contentful Links from the flat authenticated preview graph.
 * @param {*} value Current value or descendant.
 * @param {Object} catalog Entry and Asset maps keyed by source ID.
 * @param {Set} ancestors Resource keys already being resolved.
 * @return {*} A detached value with reachable relationships populated.
 */
function resolveValue(value, catalog, ancestors) {
  if (Array.isArray(value)) {
    return value
      .map(item => resolveValue(item, catalog, ancestors))
      .filter(item => item !== undefined);
  }
  if (!isRecord(value)) return value;
  if (isLink(value)) {
    const kind = value.sys.linkType;
    const target = catalog[kind][value.sys.id];
    if (!target) return undefined;
    const key = `${kind}:${value.sys.id}`;
    if (ancestors.has(key)) return target;
    const nextAncestors = new Set(ancestors);
    nextAncestors.add(key);
    return resolveValue(target, catalog, nextAncestors);
  }
  return Object.keys(value).reduce((result, key) => ({
    ...result,
    [key]: resolveValue(value[key], catalog, ancestors),
  }), {});
}

/**
 * Validates and resolves the CMS graph into props accepted by the current Article component.
 * @param {*} value Parsed CMS response.
 * @return {Object|null} Resolved article and sub-data maps, or null when malformed.
 */
export function resolveThriveLivePreviewGraph(value) {
  if (!isRecord(value)
    || typeof value.rootId !== 'string'
    || !Array.isArray(value.entries)
    || !Array.isArray(value.assets)
    || !value.entries.every(entry => isResource(entry, 'Entry'))
    || !value.assets.every(asset => isResource(asset, 'Asset'))) return null;

  const entries = value.entries.reduce((result, entry) => ({
    ...result,
    [entry.sys.id]: entry,
  }), {});
  const assets = value.assets.reduce((result, asset) => ({
    ...result,
    [asset.sys.id]: asset,
  }), {});
  const root = entries[value.rootId];
  if (!root
    || !isRecord(root.sys.contentType)
    || !isRecord(root.sys.contentType.sys)
    || root.sys.contentType.sys.id !== 'article') return null;

  const catalog = { Asset: assets, Entry: entries };
  const resolvedEntries = Object.keys(entries).reduce((result, id) => ({
    ...result,
    [id]: resolveValue(entries[id], catalog, new Set([`Entry:${id}`])),
  }), {});
  const resolvedAssets = Object.keys(assets).reduce((result, id) => ({
    ...result,
    [id]: resolveValue(assets[id], catalog, new Set([`Asset:${id}`])),
  }), {});
  return {
    article: resolvedEntries[value.rootId],
    subData: {
      assets: { items: resolvedAssets },
      entries: { items: resolvedEntries },
      preview: true,
    },
  };
}

/**
 * Subscribes only inside Payload's iframe and swaps in the existing Article renderer.
 */
export default class ThriveArticleLivePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { preview: null };
    this.cmsOrigin = null;
    this.requestSequence = 0;
    this.handleMessage = this.handleMessage.bind(this);
  }

  /** Registers the exact-origin message listener and tells Payload the iframe is ready. */
  componentDidMount() {
    if (!isThriveLivePreview(window.location.search)) return;
    this.cmsOrigin = thriveLivePreviewCmsOrigin(window.location.hostname);
    if (!this.cmsOrigin) return;
    window.addEventListener('message', this.handleMessage);
    const previewWindow = window.opener || window.parent;
    previewWindow.postMessage({ ready: true, type: 'payload-live-preview' }, this.cmsOrigin);
  }

  /** Removes the message listener when React unmounts the Thrive route. */
  componentWillUnmount() {
    if (this.cmsOrigin) window.removeEventListener('message', this.handleMessage);
  }

  /**
   * Resolves one unsaved Payload event through the authenticated compatibility endpoint.
   * @param {MessageEvent} event Exact-origin Payload Live Preview message.
   * @return {Promise<void>} Resolves after the newest valid graph has been applied.
   */
  async handleMessage(event) {
    if (event.origin !== this.cmsOrigin
      || !isRecord(event.data)
      || event.data.type !== 'payload-live-preview'
      || event.data.collectionSlug !== LIVE_PREVIEW_COLLECTION
      || !isRecord(event.data.data)) return;

    const requestSequence = this.requestSequence + 1;
    this.requestSequence = requestSequence;
    try {
      const response = await fetch(`${this.cmsOrigin}/api/live-preview/page`, {
        body: JSON.stringify({
          collectionSlug: LIVE_PREVIEW_COLLECTION,
          document: event.data.data,
          locale: event.data.locale,
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (!response.ok) return;
      const preview = resolveThriveLivePreviewGraph(await response.json());
      if (preview && requestSequence === this.requestSequence) this.setState({ preview });
    } catch (error) {
      // Retain the last valid graph during a transient request or parse failure.
    }
  }

  /** Renders unchanged SSR children until a valid unsaved graph has arrived. */
  render() {
    const { children } = this.props;
    const { preview } = this.state;
    if (!preview) return children;
    return (
      <Article
        fields={preview.article.fields}
        id={preview.article.sys.id}
        preview
        spaceName="EDU"
        subData={preview.subData}
        theme={theme}
      />
    );
  }
}

ThriveArticleLivePreview.propTypes = {
  children: PT.node.isRequired,
};
