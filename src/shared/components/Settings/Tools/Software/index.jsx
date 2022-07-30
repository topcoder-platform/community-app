/**
 * Child component of Settings/Tools/ renders the
 * 'Software' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import ConsentComponent from 'components/Settings/ConsentComponent';
import ErrorMessage from 'components/Settings/ErrorMessage';
import FormField from 'components/Settings/FormField';
import FormInputText from 'components/Settings/FormInputText';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import FormInputSelect from 'components/Settings/FormInputSelect';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import ConfirmationModal from '../../ConfirmationModal';
import dropdowns from './dropdowns.json';
import SoftwareList from './List';

import styles from './styles.scss';


export default class Software extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteSoftware = this.onHandleDeleteSoftware.bind(this);
    this.onDeleteSoftware = this.onDeleteSoftware.bind(this);
    this.onEditSoftware = this.onEditSoftware.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadSoftwareTrait = this.loadSoftwareTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onHandleAddSoftware = this.onHandleAddSoftware.bind(this);
    this.onAddSoftware = this.onAddSoftware.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      isSubmit: false,
      softwareTrait: this.loadSoftwareTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newSoftware: {
        softwareType: '',
        name: '',
      },
      isMobileView: false,
      screenSM: 767,
      showConfirmation: false,
      indexNo: null,
      isEdit: false,
    };
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillReceiveProps(nextProps) {
    const softwareTrait = this.loadSoftwareTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      softwareTrait,
      personalizationTrait,
      formInvalid: false,
      isSubmit: false,
      newSoftware: {
        softwareType: '',
        name: '',
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  /**
   * Show User Consent Modal
   * @param e event
   */
  onHandleAddSoftware(e) {
    if (e) e.preventDefault();
    const { newSoftware } = this.state;
    this.setState({ isSubmit: true });
    if (this.onCheckFormValue(newSoftware)) {
      return;
    }
    this.showConsent(this.onAddSoftware.bind(this));
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newSoftware object
   */
  onCheckFormValue(newSoftware) {
    let invalid = false;

    if (!_.trim(newSoftware.softwareType).length) {
      invalid = true;
    }

    if (!_.trim(newSoftware.name).length) {
      invalid = true;
    }

    this.setState({ formInvalid: invalid });
    return invalid;
  }

  onHandleDeleteSoftware(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
      isSubmit: false,
    });
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
    this.setState({
      showConfirmation: false,
      indexNo: null,
      isSubmit: false,
      isEdit: false,
      formInvalid: false,
    });
  }

  /**
   * Edit software by index
   * @param indexNo the software index no
   */
  onEditSoftware(indexNo) {
    const { softwareTrait } = this.state;
    this.setState({
      newSoftware: {
        softwareType: softwareTrait.traits.data[indexNo].softwareType,
        name: softwareTrait.traits.data[indexNo].name,
      },
      isEdit: true,
      indexNo,
      isSubmit: false,
    });
  }

  /**
   * Add new software
   * @param answer user consent answer value
   */
  onAddSoftware(answer) {
    const {
      newSoftware, personalizationTrait, isEdit, indexNo,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { softwareTrait } = this.state;
    if (softwareTrait.traits && softwareTrait.traits.data.length > 0) {
      const newSoftwareTrait = _.cloneDeep(softwareTrait);
      if (isEdit) {
        newSoftwareTrait.traits.data.splice(indexNo, 1);
      }
      newSoftwareTrait.traits.data.push(newSoftware);
      updateUserTrait(handle, 'software', newSoftwareTrait.traits.data, tokenV3);
    } else {
      const newSoftwares = [];
      newSoftwares.push(newSoftware);
      addUserTrait(handle, 'software', newSoftwares, tokenV3);
    }
    const empty = {
      softwareType: '',
      name: '',
    };
    this.setState({
      newSoftware: empty,
      isEdit: false,
      indexNo: null,
      inputChanged: false,
      isSubmit: false,
    });
    // save personalization
    if (_.isEmpty(personalizationTrait)) {
      const personalizationData = { userConsent: answer };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3);
    } else {
      const trait = personalizationTrait.traits.data[0];
      if (trait.userConsent !== answer) {
        const personalizationData = { userConsent: answer };
        updateUserTrait(handle, 'personalization', [personalizationData], tokenV3);
      }
    }
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newSoftware: oldSoftware } = this.state;
    const newSoftware = { ...oldSoftware };
    newSoftware[e.target.name] = e.target.value;
    this.setState({ newSoftware, isSubmit: false });
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
      this.setState({ newSoftware, isSubmit: false });
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

  /**
   * Get personalization trait
   * @param userTraits the all user traits
   */
  loadPersonalizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    const personalization = trait.length === 0 ? {} : trait[0];
    return _.assign({}, personalization);
  }

  updatePredicate() {
    const { screenSM } = this.state;
    this.setState({ isMobileView: window.innerWidth <= screenSM });
  }

  isFormValid() {
    const { newSoftware } = this.state;
    if (newSoftware.softwareType && (newSoftware.name.trim().length !== 0)) {
      return true;
    }
    return false;
  }

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        indexNo: null,
        inputChanged: false,
        formInvalid: false,
        newSoftware: {
          softwareType: '',
          name: '',
        },
        isSubmit: false,
      });
    }
  }

  render() {
    const {
      softwareTrait, showConfirmation, indexNo, isEdit,
      formInvalid, isSubmit,
    } = this.state;
    const softwareItems = softwareTrait.traits
      ? softwareTrait.traits.data.slice() : [];
    const { newSoftware } = this.state;
    const canModifyTrait = !this.props.traitRequestCount;
    return (
      <React.Fragment>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {showConfirmation
        && (
          <ConfirmationModal
            onConfirm={() => this.showConsent(this.onDeleteServiceProvider.bind(this, indexNo))}
            onCancel={() => this.setState({ showConfirmation: false, indexNo: null })}
            name={serviceProviderTrait.traits.data[indexNo].name}
          />
        )}
        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Software
            </h2>
            {
              softwareItems.length > 0
              && (
                <SoftwareList
                  softwareList={{ items: softwareItems }}
                  onDeleteItem={this.onHandleDeleteSoftware}
                  disabled={!canModifyTrait}
                  onEditItem={this.onEditSoftware}
                />
              )
            }
            <div styleName="form-content">
              <div styleName="form-label">
                {
                  isEdit ? (<React.Fragment>Edit software</React.Fragment>)
                    : (<React.Fragment>Add a new software</React.Fragment>)
                }
              </div>
              <div styleName="form-body">
                <form styleName="software-form" noValidate autoComplete="off">
                  <FormField label="Software Type *" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="softwareType"
                      options={dropdowns.type}
                      onChange={this.onUpdateSelect}
                      value={newSoftware.softwareType}
                      placeholder="Select"
                      labelKey="name"
                      valueKey="name"
                      clearable={false}
                      disabled={!canModifyTrait}
                    />
                    {
                      isSubmit && (
                        <ErrorMessage invalid={_.isEmpty(newSoftware.softwareType) && formInvalid} addMargin message="Type cannot be empty" />
                      )
                    }
                  </FormField>

                  <FormField label="Software Name *" style={{ flex: '0 0 100%' }}>
                    <FormInputText
                      disabled={!canModifyTrait}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Type here the Software Name"
                      onChange={this.onUpdateInput}
                      value={newSoftware.name}
                      maxLength="64"
                      required
                    />
                    {
                      isSubmit && (
                        <ErrorMessage invalid={_.isEmpty(newSoftware.name.trim()) && formInvalid} message="Name cannot be empty" />
                      )
                    }
                  </FormField>
                </form>
              </div>
              <div styleName="form-footer">
                {!isEdit && (
                <PrimaryButton
                  theme={{ button: styles.button }}
                  onClick={this.onHandleAddSoftware}
                >
                  <AddItemIcon styleName="icon" /> Add Software to Your List
                </PrimaryButton>
                )}

                { isEdit && (
                <React.Fragment>
                  <PrimaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onHandleAddSoftware}
                  >
                    Edit Software to Your List
                  </PrimaryButton>
                  <SecondaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onCancelEditStatus}
                  >
                    Cancel
                  </SecondaryButton>
                </React.Fragment>
                )}
              </div>
            </div>
          </Collapse>
        </div>
      </React.Fragment>
    );
  }
}

Software.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  traitRequestCount: PT.number.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
