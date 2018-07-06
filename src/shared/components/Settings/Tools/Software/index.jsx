/**
 * Child component of Settings/Tools/ renders the
 * 'Software' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import dropdowns from './dropdowns.json';
import SoftwareList from './List';

import './styles.scss';


export default class Software extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteSoftware = this.onDeleteSoftware.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadSoftwareTrait = this.loadSoftwareTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddSoftware = this.onAddSoftware.bind(this);

    this.state = {
      formInvalid: false,
      errorMessage: '',
      softwareTrait: this.loadSoftwareTrait(props.userTraits),
      newSoftware: {
        softwareType: '',
        name: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const softwareTrait = this.loadSoftwareTrait(nextProps.userTraits);
    this.setState({
      softwareTrait,
      formInvalid: false,
      errorMessage: '',
      newSoftware: {
        softwareType: '',
        name: '',
      },
    });
  }


  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newSoftware object
   */
  onCheckFormValue(newSoftware) {
    let invalid = false;

    let errorMessage = '';
    if (!_.trim(newSoftware.softwareType).length) {
      errorMessage += 'Software type, ';
      invalid = true;
    }

    if (!_.trim(newSoftware.name).length) {
      errorMessage += 'Name, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  /**
   * Delete software by index
   * @param indexNo the software index no
   */
  onDeleteSoftware(indexNo) {
    const { softwareTrait } = this.state;
    const newSoftwareTrait = { ...softwareTrait };
    newSoftwareTrait.traits.data.splice(indexNo, 1);
    this.setState({
      softwareTrait: newSoftwareTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newSoftwareTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'software', newSoftwareTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'software', tokenV3);
    }
  }

  /**
   * Add new software
   * @param e form submit event
   */
  onAddSoftware(e) {
    e.preventDefault();
    const { newSoftware } = this.state;
    if (this.onCheckFormValue(newSoftware)) {
      return;
    }
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { softwareTrait } = this.state;
    if (softwareTrait.traits && softwareTrait.traits.data.length > 0) {
      const newSoftwareTrait = { ...softwareTrait };
      newSoftwareTrait.traits.data.push(newSoftware);
      this.setState({ softwareTrait: newSoftwareTrait });
      updateUserTrait(handle, 'software', newSoftwareTrait.traits.data, tokenV3);
    } else {
      const newSoftwares = [];
      newSoftwares.push(newSoftware);
      const traits = {
        data: newSoftwares,
      };
      this.setState({ softwareTrait: { traits } });
      addUserTrait(handle, 'software', newSoftwares, tokenV3);
    }
    const empty = {
      softwareType: '',
      name: '',
    };
    this.setState({ newSoftware: empty });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newSoftware: oldSoftware } = this.state;
    const newSoftware = { ...oldSoftware };
    newSoftware[e.target.name] = e.target.value;
    this.setState({ newSoftware });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newSoftware: oldSoftware } = this.state;
      const newSoftware = { ...oldSoftware };
      newSoftware[option.key] = option.name;
      this.setState({ newSoftware });
    }
  }

  /**
   * Get software trait
   * @param userTraits the all user traits
   */
  loadSoftwareTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'software');
    const softwares = trait.length === 0 ? {} : trait[0];
    return _.assign({}, softwares);
  }

  render() {
    const { softwareTrait } = this.state;
    const softwareItems = softwareTrait.traits
      ? softwareTrait.traits.data.slice() : [];
    const { newSoftware, formInvalid, errorMessage } = this.state;

    return (
      <div styleName="software-container">
        <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
          { errorMessage }
        </div>
        <h1>
Software
        </h1>
        <div styleName="form-container">
          <form name="software-form" noValidate autoComplete="off">
            <div styleName="row">
              <p>
Add Software
              </p>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="softwareType">
Software Type
                </label>
                <Select
                  name="softwareType"
                  options={dropdowns.type}
                  onChange={this.onUpdateSelect}
                  value={newSoftware.softwareType}
                  placeholder="Software Type"
                  labelKey="name"
                  valueKey="name"
                  clearable={false}
                />
              </div>
              <div styleName="field col-2">
                <label htmlFor="name">
Name
                </label>
                <input id="name" name="name" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newSoftware.name} maxLength="64" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onAddSoftware}
            >
              Add Software
            </PrimaryButton>
          </div>
        </div>
        <SoftwareList
          softwareList={{ items: softwareItems }}
          onDeleteItem={this.onDeleteSoftware}
        />
      </div>
    );
  }
}

Software.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
