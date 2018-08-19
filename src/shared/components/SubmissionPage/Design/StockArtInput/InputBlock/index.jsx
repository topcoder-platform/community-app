/**
 * UI block for input of a single Stock Art description.
 */

import PT from 'prop-types';
import React from 'react';

import './style.scss';

export default function InputBlock({
  add,
  record,
  set,
}) {
  return (
    <div>
      <div styleName="container">
        <span styleName="desc">
FILE URL
        </span>
        <input
          data-type="photoNumber"
          onChange={e => set({ ...record, url: e.target.value })}
          onPaste={(e) => {
            const str = e.clipboardData.getData('text/plain');
            const urls = str.match(/\S+/g);
            if (urls) {
              set({ ...record, url: urls[0] });
              for (let i = 1; i < urls.length; i += 1) {
                add({ url: urls[i] });
              }
            } else set({ ...record, url: '' });
            e.preventDefault();
          }}
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
      >
        <span>
&#10799;
        </span>
      </button>
    </div>
  );
}

InputBlock.propTypes = {
  add: PT.func.isRequired,
  record: PT.shape({
    url: PT.string.isRequired,
    errors: PT.shape().isRequired,
  }).isRequired,
  set: PT.func.isRequired,
};
