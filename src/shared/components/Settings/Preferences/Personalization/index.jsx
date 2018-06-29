/**
 * Personalization component.
 */
import React from 'react';
import PT from 'prop-types';

import ToggleableItem from 'components/Settings/ToggleableItem';

import './styles.scss';

export default function Personalization({
  addUserTrait,
  handle,
  tokenV3,
  updateUserTrait,
  userTraits,
}) {
  const primaryText = 'User Consent';
  const secondaryText = 'I allow Topcoder to use my information to make my experience more personal.';

  const getTraitData = () => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    if (trait.length !== 0) {
      return trait[0].traits.data[0];
    }
    return null;
  };

  const getUserConsent = () => {
    const traitData = getTraitData();

    if (traitData && typeof traitData.userConsent === 'boolean') {
      return traitData.userConsent;
    }
    // by default, when personalization user trait hasn't been
    // created yet, user doesn't give consent
    return false;
  };

  const updateConsent = () => {
    const traitData = getTraitData();

    // personalization data might not have been created yet; if so, add new trait
    if (traitData && typeof traitData.userConsent === 'boolean') {
      const personalizationData = { userConsent: !traitData.userConsent };
      updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else if (!traitData) {
      // update the default (userConsent: false) when creating the new trait
      const personalizationData = { userConsent: true };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    }
  };

  return (
    <div styleName="Personalization">
      <h1 styleName="title">
Personalization
      </h1>
      <div styleName="user-consent-container">
        <ToggleableItem
          id="user-consent"
          value="user-consent"
          checked={getUserConsent()}
          primaryText={primaryText}
          secondaryText={secondaryText}
          onToggle={updateConsent}
        />
      </div>
    </div>
  );
}

Personalization.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.arrayOf(PT.shape()).isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
};
