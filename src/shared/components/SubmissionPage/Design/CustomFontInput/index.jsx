import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { config } from 'topcoder-react-utils';
import '../styles.scss';
import InputBlock from './InputBlock';

export default function CustomFontInput({
  customFontRecords,
  setCustomFontRecord,
}) {
  return (
    <div styleName="row">
      <div styleName="left">
        <h4>
DID YOU USE CUSTOM FONTS?
        </h4>
        <p>
          Check to see if your font is on the Studio Standard Fonts list.
          If it is, leave the URL field
        </p>
        <p>
          Read the
          &zwnj;
          {
            <a
              href={config.URL.INFO.STUDIO_FONTS_POLICY}
              target="_blank"
              rel="noopener noreferrer"
            >
              Studio Fonts Policy
            </a>
          }
.
        </p>
        <p>
          If your fonts is not on the list, you must provide the URL
          to the font page (not file) from one of the approved
          font websites in the dropdown box.
        </p>
      </div>
      <div styleName="right">
        {
          customFontRecords.map((rec, id) => (
            <InputBlock
              key={rec.key}
              record={rec}
              add={newRec => setCustomFontRecord(null, newRec)}
              set={newRec => setCustomFontRecord(id, newRec)}
            />
          ))
        }
        <PrimaryButton
          onClick={(e) => {
            setCustomFontRecord(null, {
              active: true,
              name: '',
              url: '',
              source: 'STUDIO_STANDARD_FONTS_LIST',
            });
            e.stopPropagation();
            e.preventDefault();
          }}
          disabled={customFontRecords.some(x => !_.isEmpty(x.errors))}
        >
+ Add Font
        </PrimaryButton>
      </div>
    </div>
  );
}

CustomFontInput.propTypes = {
  customFontRecords: PT.arrayOf(PT.shape()).isRequired,
  setCustomFontRecord: PT.func.isRequired,
};
