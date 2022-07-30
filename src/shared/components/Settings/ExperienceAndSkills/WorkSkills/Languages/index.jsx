/**
 * Child component of Settings/Profile/ renders the
 * 'Language' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';
import ConsentComponent from 'components/Settings/ConsentComponent';
import ErrorMessage from 'components/Settings/ErrorMessage';
import ConfirmationModal from 'components/Settings//ConfirmationModal';
import FormField from 'components/Settings/FormField';
import FormInputSelect from 'components/Settings/FormInputSelect';
import AddItemIcon from 'assets/images/settings-add-item.svg';
import { SettingBannerV2 as Collapse } from 'components/Settings/SettingsBanner';
import LanguageList from './List';
import dropdowns from './dropdowns.json';

import styles from './styles.scss';


export default class Languages extends ConsentComponent {
  constructor(props) {
    super(props);
    this.onHandleDeleteLanguage = this.onHandleDeleteLanguage.bind(this);
    this.onDeleteLanguage = this.onDeleteLanguage.bind(this);
    this.onEditLanguage = this.onEditLanguage.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadLanguageTrait = this.loadLanguageTrait.bind(this);
    this.onHandleAddLanguage = this.onHandleAddLanguage.bind(this);
    this.onAddLanguage = this.onAddLanguage.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.loadPersonalizationTrait = this.loadPersonalizationTrait.bind(this);
    this.onCancelEditStatus = this.onCancelEditStatus.bind(this);

    const { userTraits } = props;
    this.state = {
      formInvalid: false,
      languageNameInvalid: false,
      languageNameInvalidMsg: '',
      languageTrait: this.loadLanguageTrait(userTraits),
      personalizationTrait: this.loadPersonalizationTrait(userTraits),
      newLanguage: {
        language: '',
        spokenLevel: '',
        writtenLevel: '',
      },
      isEdit: false,
      indexNo: null,
      showConfirmation: false,
      isSubmit: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const languageTrait = this.loadLanguageTrait(nextProps.userTraits);
    const personalizationTrait = this.loadPersonalizationTrait(nextProps.userTraits);
    this.setState({
      languageTrait,
      personalizationTrait,
      formInvalid: false,
      languageNameInvalid: false,
      languageNameInvalidMsg: '',
      newLanguage: {
        language: '',
        spokenLevel: '',
        writtenLevel: '',
      },
      isSubmit: false,
    });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newLanguage: oldLanguage } = this.state;
    const newLanguage = { ...oldLanguage };
    newLanguage[e.target.name] = e.target.value.trim();
    this.setState({ newLanguage, isSubmit: false });
  }

  onHandleDeleteLanguage(indexNo) {
    this.setState({
      showConfirmation: true,
      indexNo,
    });
  }

  /**
   * Delete language by index
   * @param indexNo the language index no
   */
  onDeleteLanguage(indexNo) {
    const { languageTrait } = this.state;
    const newLanguageTrait = { ...languageTrait };
    newLanguageTrait.traits.data.splice(indexNo, 1);
    this.setState({
      languageTrait: newLanguageTrait,
      isEdit: false,
      formInvalid: false,
      languageNameInvalid: false,
      languageNameInvalidMsg: '',
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newLanguageTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'languages', newLanguageTrait.traits.data, tokenV3);
    } else {
      deleteUserTrait(handle, 'languages', tokenV3);
    }
    this.setState({
      showConfirmation: false,
      indexNo: null,
      isSubmit: false,
    });
  }

  /**
   * Edit language by index
   * @param indexNo the language index no
   */
  onEditLanguage(indexNo) {
    const { languageTrait } = this.state;
    this.setState({
      newLanguage: {
        language: languageTrait.traits.data[indexNo].language,
        spokenLevel: _.isEmpty(languageTrait.traits.data[indexNo].spokenLevel) ? '' : languageTrait.traits.data[indexNo].spokenLevel,
        writtenLevel: _.isEmpty(languageTrait.traits.data[indexNo].writtenLevel) ? '' : languageTrait.traits.data[indexNo].writtenLevel,
      },
      isEdit: true,
      indexNo,
      formInvalid: false,
      languageNameInvalid: false,
      languageNameInvalidMsg: '',
      isSubmit: false,
    });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   */
  onCheckFormValue() {
    const {
      languageTrait, newLanguage, isEdit, indexNo,
    } = this.state;

    let invalid = false;
    let languageNameInvalid = false;
    let languageNameInvalidMsg = '';

    if (_.isEmpty(newLanguage.language.trim())) {
      invalid = true;
      languageNameInvalid = true;
      languageNameInvalidMsg = 'Language cannot be empty';
    }

    if (isEdit) {
      const result = _.filter(languageTrait.traits.data, (item, index) => (
        item.language.toLowerCase() === newLanguage.language.toLowerCase() && index !== indexNo
      ));

      if (result && result.length > 0) {
        invalid = true;
        languageNameInvalid = true;
        languageNameInvalidMsg = 'Language already added';
      }
    } else if (!_.isEmpty(languageTrait)) {
      const result = _.filter(languageTrait.traits.data, item => (
        item.language.toLowerCase() === newLanguage.language.toLowerCase()
      ));

      if (result && result.length > 0) {
        invalid = true;
        languageNameInvalid = true;
        languageNameInvalidMsg = 'Language already added';
      }
    }

    this.setState({
      formInvalid: invalid,
      languageNameInvalid,
      languageNameInvalidMsg,
    });
    return invalid;
  }

  onHandleAddLanguage(e) {
    if (e) e.preventDefault();
    this.setState({ isSubmit: true });
    if (this.onCheckFormValue()) {
      return;
    }
    this.showConsent(this.onAddLanguage.bind(this));
  }

  /**
   * Add new language
   * @param e form submit event
   * @param answer user consent answer value
   */
  onAddLanguage(answer) {
    const {
      newLanguage, personalizationTrait, isEdit, indexNo,
    } = this.state;

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { languageTrait } = this.state;
    const language = _.clone(newLanguage);
    if (_.isEmpty(language.spokenLevel)) {
      delete language.spokenLevel;
    }
    if (_.isEmpty(language.writtenLevel)) {
      delete language.writtenLevel;
    }
    if (languageTrait.traits && languageTrait.traits.data.length > 0) {
      const newLanguageTrait = _.cloneDeep(languageTrait);

      if (isEdit) {
        newLanguageTrait.traits.data.splice(indexNo, 1, language);
      } else {
        newLanguageTrait.traits.data.push(language);
      }

      updateUserTrait(handle, 'languages', newLanguageTrait.traits.data, tokenV3);
    } else {
      const newLanguages = [];
      newLanguages.push(language);
      addUserTrait(handle, 'languages', newLanguages, tokenV3);
    }
    const empty = {
      language: '',
      spokenLevel: '',
      writtenLevel: '',
    };
    this.setState({
      newLanguage: empty,
      isEdit: false,
      indexNo: null,
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
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newLanguage: oldLanguage } = this.state;
      const newLanguage = { ...oldLanguage };
      newLanguage[option.key] = option.name;
      this.setState({ newLanguage, isSubmit: false });
    }
  }

  onCancelEditStatus() {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({
        isEdit: false,
        indexNo: null,
        isSubmit: false,
        formInvalid: false,
        languageNameInvalid: false,
        languageNameInvalidMsg: '',
        newLanguage: {
          language: '',
          spokenLevel: '',
          writtenLevel: '',
        },
      });
    }
  }

  /**
   * Get language trait
   * @param userTraits the all user traits
   */
  loadLanguageTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'languages');
    const languages = trait.length === 0 ? {} : trait[0];
    return _.assign({}, languages);
  }

  /**
   * Get personalization trait
   * @param userTraits the all user traits
   */
  loadPersonalizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    const personalization = trait.length === 0 ? {} : trait[0];
    return _.assign({}, personalization);
  };

  render() {
    const {
      languageTrait,
      isEdit,
      formInvalid,
      showConfirmation,
      indexNo,
      languageNameInvalid,
      languageNameInvalidMsg,
      isSubmit,
    } = this.state;
    const languageItems = languageTrait.traits
      ? languageTrait.traits.data.slice() : [];
    const { newLanguage } = this.state;

    return (
      <React.Fragment/*  styleName={containerStyle} */>
        {
          this.shouldRenderConsent() && this.renderConsent()
        }
        {
          showConfirmation && (
            <ConfirmationModal
              onConfirm={() => this.showConsent(this.onDeleteLanguage.bind(this, indexNo))}
              onCancel={() => this.setState({
                showConfirmation: false,
                indexNo: null,
              })}
              name={languageTrait.traits.data[indexNo].language}
            />
          )
        }
        <div styleName="form-container">
          <Collapse>
            <h2 styleName="form-title">
              Language Skills
            </h2>
            {
              languageItems.length > 0
              && (
                <LanguageList
                  languageList={{ items: languageItems }}
                  onDeleteItem={this.onHandleDeleteLanguage}
                  onEditItem={this.onEditLanguage}
                />
              )
            }
            <div styleName="form-content">
              <div styleName="form-label">
                Let customers know the langagues you speak.
                Multilingual? Magnifique.
              </div>
              <div styleName="form-body">
                <form styleName="language-form" noValidate autoComplete="off">
                  <FormField label="Language *" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="language"
                      options={dropdowns.language}
                      value={newLanguage.language}
                      onChange={this.onUpdateSelect}
                      placeholder="Language"
                      labelKey="name"
                      valueKey="name"
                      clearable={false}
                    />
                    { isSubmit && formInvalid && (
                      <ErrorMessage
                        invalid={languageNameInvalid}
                        message={languageNameInvalidMsg}
                        addMargin
                      />
                    )
                    }
                  </FormField>

                  <FormField label="Spoken Level" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="spokenLevel"
                      options={dropdowns.spokenLevel}
                      value={newLanguage.spokenLevel}
                      onChange={(option) => {
                        if (option) {
                          this.onUpdateSelect(option);
                        } else {
                          this.onUpdateSelect({ key: 'spokenLevel', name: '' });
                        }
                      }}
                      placeholder="Level"
                      labelKey="name"
                      valueKey="name"
                      clearable={false}
                    />
                  </FormField>

                  <FormField label="Written Level" style={{ flex: '0 0 100%' }}>
                    <FormInputSelect
                      name="writtenLevel"
                      options={dropdowns.writtenLevel}
                      value={newLanguage.writtenLevel}
                      onChange={(option) => {
                        if (option) {
                          this.onUpdateSelect(option);
                        } else {
                          this.onUpdateSelect({ key: 'writtenLevel', name: '' });
                        }
                      }}
                      placeholder="Level"
                      labelKey="name"
                      valueKey="name"
                      clearable={false}
                    />
                  </FormField>
                </form>
              </div>
              <div styleName="form-footer">
                {!isEdit && (
                  <PrimaryButton
                    theme={{ button: styles.button }}
                    onClick={this.onHandleAddLanguage}
                  >
                    <AddItemIcon styleName="icon" /> Add language to your list
                  </PrimaryButton>
                )}

                { isEdit && (
                  <React.Fragment>
                    <PrimaryButton
                      theme={{ button: styles.button }}
                      onClick={this.onHandleAddLanguage}
                    >
                      Edit language to your list
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

Languages.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  // settingsUI: PT.shape().isRequired,
};
