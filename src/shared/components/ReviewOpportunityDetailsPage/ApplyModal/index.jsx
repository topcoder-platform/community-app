/**
 * Modal that displays a list of available reviewer roles and allows user to select and apply
 */
import React from 'react';
import PT from 'prop-types';
import { Modal, PrimaryButton, Button } from 'topcoder-react-ui-kit';

import { activeRoleIds, openPositionsByRole } from 'utils/reviewOpportunities';

import theme from './styles.scss';

/**
 * ApplyModal Component
 */
class ApplyModal extends React.Component {
  componentDidMount() {
    const {
      details,
      handle,
      setRoles,
    } = this.props;

    setRoles(activeRoleIds(details, handle));
  }

  render() {
    const {
      details, handle, onApply, onCancel, selectedRoles,
    } = this.props;
    const positions = openPositionsByRole(details);
    const position = positions[0];
    const previousRoles = activeRoleIds(details, handle);
    const hasApplied = Boolean(previousRoles.length);

    const onHandleApply = () => {
      const updatedRoles = [...selectedRoles];
      if (position.role === 'Reviewer') {
        updatedRoles.push(position.roleId);
      }
      onApply(updatedRoles);
    };

    return (
      <Modal onCancel={onCancel} theme={theme}>
        <h1>
          {hasApplied ? 'Reviewer Application' : 'Apply Reviewer Position'}
        </h1>
        <p>
          Click Apply Now to apply as a Reviewer for this challenge.
          Payment and positions are shown below.
        </p>
        <div styleName="head">
          <div styleName="col-1">
            Role
          </div>
          <div styleName="col-2">
            Positions
          </div>
          <div styleName="col-3">
            Payment
          </div>
        </div>
        <div styleName="body">
          <div styleName="row">
            <div styleName="col-1">
              <span styleName="role">
                {position.role}
              </span>
            </div>
            <div styleName="col-2">
              {position.openPositions}
            </div>
            <div styleName="col-3">
              $
              {position.payment}
              .00*
            </div>
          </div>
        </div>
        <p>
          *Depends on the number of submissions, the actual payment may differ.
        </p>
        <div styleName="buttons">
          <Button onClick={onCancel}>
            Cancel
          </Button>
          {!hasApplied
          && (
          <PrimaryButton
            disabled={position.openPositions <= 0}
            onClick={onHandleApply}
          >
            Apply Now
          </PrimaryButton>
          )
          }

        </div>
      </Modal>
    );
  }
}

/**
 * Default values for Props
 */
ApplyModal.defaultProps = {
  selectedRoles: [],
};

/**
 * Prop Validation
 */
ApplyModal.propTypes = {
  details: PT.shape().isRequired,
  handle: PT.string.isRequired,
  onApply: PT.func.isRequired,
  onCancel: PT.func.isRequired,
  setRoles: PT.func.isRequired,
  selectedRoles: PT.arrayOf(PT.number),
};

export default ApplyModal;
