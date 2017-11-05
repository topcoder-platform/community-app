/**
 * UI block for input of a single Stock Art description.
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function InputBlock({
  record,
  set,
}) {
  return (
    <div>
      <div styleName="container">
        <span styleName="desc">FILE URL</span>
        <input
          data-type="photoNumber"
          onChange={e => set({ ...record, url: e.target.value })}
          type="text"
          value={record.url}
        />
        <p styleName={`error ${record.errors.INVALID_URL ? 'show' : ''}`}>
          Not a valid URL!
        </p>
        <div styleName="separator" />
      </div>
      <button
        styleName="close"
        type="button"
        onClick={() => set()}
      ><span>&#10799;</span></button>
    </div>
  );
}

InputBlock.propTypes = {
  record: PT.shape({
    url: PT.string.isRequired,
    errors: PT.shape().isRequired,
  }).isRequired,
  set: PT.func.isRequired,
};
