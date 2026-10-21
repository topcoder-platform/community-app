import React from 'react';
import { shallow } from 'enzyme';
import { Modal, PrimaryButton } from 'topcoder-react-ui-kit';
import TermDetails from 'components/Terms/TermDetails';
import SwitchWithLabel from 'components/SwitchWithLabel';
import { TermsDetailPageContainer } from 'containers/terms-detail';
import { goToLogin } from 'utils/tc';

jest.mock('utils/tc', () => ({ goToLogin: jest.fn() }));

const details = {
  id: 'standard-terms',
  title: 'Standard Terms 2026',
  text: '<p>Acceptance of Terms and Conditions</p>',
  agreeabilityType: 'Electronically-agreeable',
  agreed: false,
};

/**
 * Renders the direct-link container with mocked API actions for auth regressions.
 *
 * @param {Object} overrides Props to replace, including auth and term details.
 * @returns {Object} Shallow wrapper and props used to inspect actions and UI.
 * @throws Propagates component rendering failures to Jest.
 */
function renderTerms(overrides = {}) {
  const props = {
    authTokens: {},
    termId: details.id,
    details,
    agreeTerms: jest.fn(),
    agreeTermFailure: undefined,
    agreeingTerm: '',
    getDocuSignUrl: jest.fn(),
    loadTermDetails: jest.fn(),
    history: { location: { pathname: `/challenges/terms/detail/${details.id}` } },
    theme: {
      'outer-container': 'outer-container',
      loading: 'loading',
      error: 'error',
      'terms-detail-container': 'terms-detail-container',
      'terms-acceptance-handler': 'terms-acceptance-handler',
      'terms-title': 'terms-title',
    },
    ...overrides,
  };
  return { wrapper: shallow(<TermsDetailPageContainer {...props} />), props };
}

describe('direct-link terms authentication', () => {
  beforeEach(() => jest.clearAllMocks());

  test.each([undefined, null, ''])('keeps terms read-only without a token (%s)', (tokenV3) => {
    const { wrapper, props } = renderTerms({ authTokens: { tokenV3 } });

    expect(props.loadTermDetails).toHaveBeenCalledWith({ tokenV3 }, details.id);
    expect(wrapper.find(TermDetails).prop('details')).toEqual(details);
    expect(wrapper.find(SwitchWithLabel).exists()).toBe(false);
    expect(wrapper.find(PrimaryButton).prop('children')).toBe('Log in to accept these terms');
    wrapper.find(PrimaryButton).simulate('click');
    expect(goToLogin).toHaveBeenCalledTimes(1);
    expect(props.agreeTerms).not.toHaveBeenCalled();
    expect(props.getDocuSignUrl).not.toHaveBeenCalled();
    expect(wrapper.find(Modal).exists()).toBe(false);
  });

  test('requires explicit consent and submits authenticated electronic acceptance', () => {
    const { wrapper, props } = renderTerms({ authTokens: { tokenV3: 'member-token' } });

    expect(wrapper.find(PrimaryButton).prop('children')).toBe('Accept');
    expect(wrapper.find(PrimaryButton).prop('disabled')).toBe(true);
    wrapper.find(SwitchWithLabel).prop('onSwitch')();
    expect(wrapper.find(PrimaryButton).prop('disabled')).toBe(false);
    wrapper.find(PrimaryButton).simulate('click');
    expect(props.agreeTerms).toHaveBeenCalledWith(props.authTokens, details.id);
    expect(wrapper.find(Modal).exists()).toBe(false);

    wrapper.setProps({ agreeingTerm: details.id, agreeTermFailure: false });
    expect(wrapper.find(Modal).exists()).toBe(false);
    wrapper.setProps({ agreeingTerm: '' });
    expect(wrapper.find(Modal).exists()).toBe(true);
  });

  test('does not report success after an unauthorized acceptance response', () => {
    const { wrapper } = renderTerms({ authTokens: { tokenV3: 'expired-token' } });
    wrapper.find(SwitchWithLabel).prop('onSwitch')();
    wrapper.find(PrimaryButton).simulate('click');
    wrapper.setProps({ agreeingTerm: details.id, agreeTermFailure: false });
    wrapper.setProps({ agreeingTerm: '', agreeTermFailure: { status: 401 } });

    expect(wrapper.find(Modal).exists()).toBe(false);
  });

  test('does not offer acceptance for an already agreed term', () => {
    const { wrapper } = renderTerms({
      authTokens: { tokenV3: 'member-token' },
      details: { ...details, agreed: true },
    });

    expect(wrapper.find(SwitchWithLabel).exists()).toBe(false);
    expect(wrapper.find(PrimaryButton).exists()).toBe(false);
  });

  test('removes electronic acceptance and success feedback after logout', () => {
    const { wrapper } = renderTerms({ authTokens: { tokenV3: 'member-token' } });
    wrapper.setState({ termsAccepted: true, showModal: true });
    wrapper.setProps({ authTokens: {}, agreeTermFailure: false });

    expect(wrapper.find(SwitchWithLabel).exists()).toBe(false);
    expect(wrapper.find(Modal).exists()).toBe(false);
    expect(wrapper.find(PrimaryButton).prop('children')).toBe('Log in to accept these terms');
  });

  test('does not mount DocuSign or expose a cached signing URL anonymously', () => {
    const { wrapper, props } = renderTerms({
      details: { ...details, docusignTemplateId: 'template-id' },
      docuSignUrl: 'https://example.com/cached-signing-session',
    });

    expect(wrapper.find(TermDetails).exists()).toBe(false);
    expect(wrapper.find(SwitchWithLabel).exists()).toBe(false);
    expect(wrapper.find(PrimaryButton).prop('children')).toBe('Log in to accept these terms');
    expect(props.getDocuSignUrl).not.toHaveBeenCalled();
  });

  test('allows authenticated DocuSign signing and removes it after logout', () => {
    const { wrapper, props } = renderTerms({
      authTokens: { tokenV3: 'member-token' },
      details: { ...details, docusignTemplateId: 'template-id' },
    });

    wrapper.find(TermDetails).prop('getDocuSignUrl')('template-id');
    expect(props.getDocuSignUrl).toHaveBeenCalledWith(
      props.authTokens, 'template-id', 'http://localhost/community-app-assets/iframe-break',
    );
    expect(wrapper.find(SwitchWithLabel).exists()).toBe(false);

    wrapper.setProps({ authTokens: {} });
    expect(wrapper.find(TermDetails).exists()).toBe(false);
  });
});
