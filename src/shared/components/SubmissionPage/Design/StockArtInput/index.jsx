import PT from 'prop-types';
import React from 'react';
import { config } from 'topcoder-react-utils';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import InputBlock from './InputBlock';
import './style.scss';

export default function StockArtInput({
  setStockArtRecord,
  stockArtRecords,
}) {
  return (
    <div styleName="row">
      <div styleName="left">
        <h4>
DID YOU USE STOCK ART?
        </h4>
        <p>
          If you used any stock photos in your design mocks, please
          provide the location and details so that the client can obtain
          them. Follow the guidelines at our
          &zwnj;
          {
            <a
              href={config.URL.INFO.STOCK_ART_POLICY}
              target="_blank"
              rel="noreferrer noopener"
            >
              Studio Stock Art Policy
            </a>
          }
.
        </p>
        <p>
          Note that you can paste a list of URL separated by any space-likes
          characters to rapidly add multiple stock art references.
        </p>
      </div>
      <div styleName="right">
        {
          stockArtRecords.map((rec, id) => (
            <InputBlock
              add={newRec => setStockArtRecord(null, newRec)}
              key={rec.key}
              record={rec}
              set={newRec => setStockArtRecord(id, newRec)}
            />
          ))
        }
        <PrimaryButton
          onClick={(e) => {
            setStockArtRecord(null, { url: '' });

            /* TODO: We need these at the moment just because somebody though
             * that wrapping everything in a form is a good idea, which was not.
             */
            e.stopPropagation();
            e.preventDefault();
          }}
        >
+ Add Stock Art Record
        </PrimaryButton>
      </div>
    </div>
  );
}

StockArtInput.propTypes = {
  setStockArtRecord: PT.func.isRequired,
  stockArtRecords: PT.arrayOf(PT.shape({
    key: PT.string.isRequired,
  })).isRequired,
};
