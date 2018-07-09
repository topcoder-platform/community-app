/**
 * Child component of Settings/Profile renders setting page for profile.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton } from 'topcoder-react-ui-kit';

import { looseEqual } from 'utils/tc';

import Data from './Data';

import Styles from './styles.scss';

export default class Devices extends React.Component {
    constructor(props) {
        super(props);
        console.log("Devices props", props)
        this.state = {
          allDevices:props.devices.traits.data,
          deviceType:'',
          manufacturer:'',
          model:'',
          operatingSystem:'',
          osVersionP: '',
          osLanguage:''
        }
        this.onUpdateDeviceType = this.onUpdateDeviceType.bind(this);
        this.onUpdateManufacturer = this.onUpdateManufacturer.bind(this);
        this.onUpdateModel = this.onUpdateModel.bind(this);
        this.onUpdateOperatingSystem = this.onUpdateOperatingSystem.bind(this);
        this.onUpdateOsVersion = this.onUpdateOsVersion.bind(this);
        this.onUpdateOsLanguage = this.onUpdateOsLanguage.bind(this);
        this.onSaveToolsDevices = this.onSaveToolsDevices.bind(this);
        this.onUpdateDevice = this.onUpdateDevice.bind(this);
        this.onDeleteToolsDevice = this.onDeleteToolsDevice.bind(this);
      }
      onUpdateDeviceType(deviceType) {
        this.setState({ deviceType });
      }
      onDeleteToolsDevice(deviceobj){
        console.log("Entered index device delete");
        console.log("State things", this.state);
        _.remove(this.state.allDevices, device => device.model===deviceobj);
        this.setState({allDevices: this.state.allDevices});
        const newDevice= _.clone(this.props.devices);
        newDevice.traits.data= this.state.allDevices;
        this.props.updateDevices(newDevice, this.props.handle);
      }
      onUpdateManufacturer(manufacturer) {
        this.setState({ manufacturer });
      }
    
      onUpdateModel(model) {
        this.setState({ model });
      }
    
      onUpdateOperatingSystem(operatingSystem) {
      this.setState({ operatingSystem });
      }
      onUpdateOsVersion(osVersion) {
        this.setState({ osVersion });
      }
      onUpdateOsLanguage(osLanguage) {
        this.setState({ osLanguage });
      }
      onUpdateDevice(deviceobj) {
        const deviceObjects= this.state.allDevices;
        console.log("Device objects", deviceObjects)
        deviceObjects.push(deviceobj);
        this.setState({devices:deviceObjects});
      }
      onSaveToolsDevices(e){
        e.preventDefault();
        const newDevice= _.clone(this.props.devices);
        newDevice.traits.data= this.state.allDevices;
        console.log("New Device", newDevice)
        this.props.updateDevices(newDevice, this.props.handle);
      }
      render() {
          return (
              <Data 
                deviceType= {this.state.deviceType}
                manufacturer= {this.state.manufacturer}
                model= {this.state.model}
                allDevices= {this.state.allDevices}
                operatingSystem= {this.state.operatingSystem}
                osVersion= {this.state.osVersion}
                osLanguage= {this.state.osLanguage}
                onUpdateDevice={this.onUpdateDevice}
                onUpdateDeviceType= {this.onUpdateDeviceType}
                onUpdateManufacturer={this.onUpdateManufacturer}
                onUpdateModel = {this.onUpdateModel}
                onUpdateOperatingSystem = {this.onUpdateOperatingSystem}
                onUpdateOsVersion = {this.onUpdateOsVersion}
                onUpdateOsLanguage = {this.onUpdateOsLanguage}
                onSaveToolsDevices= {this.onSaveToolsDevices}
                onDeleteToolsDevice= {this.onDeleteToolsDevice}
              {...this.props}
              />
          );

      }

}