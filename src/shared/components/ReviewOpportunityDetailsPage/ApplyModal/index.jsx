/**
 * Modal that displays a list of available reviewer roles and allows user to select and apply
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton, Button } from 'topcoder-react-ui-kit';

import { activeRoleIds, openPositionsByRole } from 'utils/reviewOpportunities';
import Modal from 'components/Modal';

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
      details, handle, onApply, onCancel, toggleRole, selectedRoles,
    } = this.props;
    const positions = openPositionsByRole(details);
    const previousRoles = activeRoleIds(details, handle);
    const hasApplied = Boolean(previousRoles.length);
    const hasChanged = !_.isEqual(new Set(selectedRoles), new Set(previousRoles));

    return (
      <Modal onCancel={onCancel} theme={theme}>
        <h1>
          {hasApplied ? 'Manage Applications' : 'Apply Reviewer Positions'}
        </h1>
        <p>
          Select the review roles you would like to apply for and click the button.
          The system will assign members that best meet the review requirements for this contest.
          Although you will be assigned to at most one review position,
          applying for multiple roles increases your chances of being selected.
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
          <div styleName="col-4" />
        </div>
        <div styleName="body">
          {
            positions.map(position => (
              <div styleName="row" key={`${position.role}`}>
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
                <div styleName="col-4">
                  <div styleName="tc-checkbox">
                    <input
                      checked={_.includes(selectedRoles, position.roleId)}
                      disabled={position.openPositions <= 0}
                      id={`${position.roleId}-checkbox`}
                      onChange={() => toggleRole(position.roleId)}
                      type="checkbox"
                    />
                    <label htmlFor={`${position.roleId}-checkbox`}>
                      <div styleName="tc-checkbox-label" />
                    </label>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <p>
*Depends on the number of submissions, the actual payment may differ.
        </p>
        <div styleName="buttons">
          <Button onClick={onCancel}>
Cancel
          </Button>
          <PrimaryButton
            disabled={!hasChanged}
            onClick={onApply}
          >
            {hasApplied ? 'Update' : 'Apply Now'}
          </PrimaryButton>
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
  toggleRole: PT.func.isRequired,
  selectedRoles: PT.arrayOf(PT.number),
};

export default ApplyModal;
