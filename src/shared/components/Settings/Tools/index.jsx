/* eslint-disable prefer-destructuring */
import React from 'react';
import PT from 'prop-types';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import Devices from './Devices';
import Software from './Software';
import ServiceProviders from './ServiceProviders';
import Subscriptions from './Subscriptions';
import ErrorWrapper from '../ErrorWrapper';

import styles from './styles.scss';

export default class Tools extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.deviceRef = React.createRef();
    this.softwareRef = React.createRef();
    this.serviceProviderRef = React.createRef();
    this.subscriptionRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving && nextProps.userTraits) {
      setIsSaving(false);
    }
  }

  save() {
    const { isSaving, setIsSaving } = this.props;
    if (isSaving) {
      return;
    }
    const newDevice = this.deviceRef.current.state.newDevice;
    const newDeviceDirty = newDevice.deviceType !== ''
      || newDevice.manufacturer !== ''
      || newDevice.model !== ''
      || newDevice.operatingSystem !== '';

    const newSoftware = this.softwareRef.current.state.newSoftware;
    const newSoftwareDirty = newSoftware.softwareType !== ''
      || newSoftware.name !== '';

    const newServiceProvider = this.serviceProviderRef.current.state.newServiceProvider;
    const newServiceProviderDirty = newServiceProvider.serviceProviderType !== ''
      || newServiceProvider.name !== '';

    const newSubscription = this.subscriptionRef.current.state.newSubscription;
    const newSubscriptionDirty = newSubscription.name !== '';

    let valid = true;
    let dirty;

    if (newDeviceDirty) {
      valid = valid && !this.deviceRef.current.onCheckFormValue(newDevice);
      dirty = true;
    }

    if (newSoftwareDirty) {
      valid = valid && !this.softwareRef.current.onCheckFormValue(newSoftware);
      dirty = true;
    }

    if (newServiceProviderDirty) {
      valid = valid && !this.serviceProviderRef.current.onCheckFormValue(newServiceProvider);
      dirty = true;
    }

    if (newSubscriptionDirty) {
      valid = valid && !this.subscriptionRef.current.onCheckFormValue(newSubscription);
      dirty = true;
    }
    if (newDeviceDirty) this.deviceRef.current.onHandleAddDevice();
    if (newSoftwareDirty) this.softwareRef.current.onHandleAddSoftware();
    if (newServiceProviderDirty) {
      this.serviceProviderRef.current.onHandleAddServiceProvider();
    }
    if (newSubscriptionDirty) {
      this.subscriptionRef.current.onHandleAddSubscription();
    }

    if (dirty && valid) setIsSaving(true);
  }

  render() {
    const { isSaving } = this.props;

    const saveBtn = (
      <PrimaryButton
        onClick={this.save}
        theme={{
          button: `${styles['save-changes-btn']} ${isSaving ? styles.disabled : ''}`,
        }}
        disabled={!!isSaving}
      >
        Save Changes
      </PrimaryButton>
    );

    return (
      <ErrorWrapper>
        <div styleName="tools-container">
          <div styleName="header" style={{ marginBottom: '40px' }}>
            <h3>Devices And Softwares</h3>
          </div>
          <Devices
            {...this.props}
            ref={this.deviceRef}
          />
          <Software
            {...this.props}
            ref={this.softwareRef}
          />
          <ServiceProviders
            {...this.props}
            ref={this.serviceProviderRef}
          />
          <Subscriptions
            {...this.props}
            ref={this.subscriptionRef}
          />
        </div>
        <div styleName="footer">{saveBtn}</div>
      </ErrorWrapper>
    );
  }
}

Tools.defaultProps = {
  isSaving: false,
  setIsSaving: () => {},
};

Tools.propTypes = {
  userTraits: PT.array.isRequired,
  isSaving: PT.bool,
  setIsSaving: PT.func,
};
