/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getDeviceTypes } from 'utils/deviceTypes';
import { getOperatingSystems } from 'utils/operatingSystems';

import Select from 'components/Select';
import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';

const deviceTypes = getDeviceTypes();
const operatingSystems = getOperatingSystems();

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    console.log("Super props devices Data", props);
    this.onSaveToolsDevices= this.onSaveToolsDevices.bind(this)
    this.onUpdateDeviceType= this.onUpdateDeviceType.bind(this);
    this.onUpdateManufacturer= this.onUpdateManufacturer.bind(this);
    this.onUpdateModel= this.onUpdateModel.bind(this);
    this.onUpdateOperatingSystem= this.onUpdateOperatingSystem.bind(this);
    this.onUpdateOsVersion= this.onUpdateOsVersion.bind(this);
    this.onUpdateOsLanguage= this.onUpdateOsLanguage.bind(this);
  }
  onUpdateDeviceType(type){
    this.props.onUpdateDeviceType(type.name);
  }
  onUpdateManufacturer(){
    const manufacturer= document.querySelector('#devices-manufacturer').value;
    this.props.onUpdateManufacturer(manufacturer)
  }
  onUpdateModel(){
    const model= document.querySelector('#devices-model').value;
    this.props.onUpdateModel(model)
  }
  onUpdateOperatingSystem(opSys){
    this.props.onUpdateOperatingSystem(opSys.name)
  }
  onUpdateOsVersion(){
    const osVersion= document.querySelector('#devices-osVersion').value;
    this.props.onUpdateOsVersion(osVersion)
  }
  onUpdateOsLanguage(){
    const osLanguage= document.querySelector('#devices-osLanguage').value;
    this.props.onUpdateOsLanguage(osLanguage)
  }
  onDeleteToolsDevice(deviceModel){
    // e.preventDefault();
    console.log("Deleting device");
    console.log(deviceModel);
    this.props.onDeleteToolsDevice(deviceModel);
  }
  onSaveToolsDevices(e){
    e.preventDefault();
    const deviceType= this.props.deviceType;
    const manufacturer= this.props.manufacturer;
    const model= this.props.model;
    const operatingSystem= this.props.operatingSystem;
    const osVersion= this.props.osVersion;
    const osLanguage= this.props.osLanguage;
    const deviceobj= {
      "deviceType": deviceType,
      "manufacturer": manufacturer,
      "model": model,
      "operatingSystem": operatingSystem,
      "osVersion": osVersion,
      "osLanguage": osLanguage
    }    
    this.props.onUpdateDevice(deviceobj);
    this.props.onSaveToolsDevices(e);
  }
  displayDevices(){
    return(
      this.props.allDevices.map((deviceObj, key) => {
        return (
          <div style= {{border:"1px solid #ededf2", padding: "20px 20px", overflow: "hidden"}}>
          <div style= {{width: "6.7%", padding: "0", float: "left"}}>
          <img src= "#" style= {{height: "45px", width: "45px"}}/>
          </div>
          <div style= {{width: "79.83%", marginLeft: "2.4%", float: "left"}}>
            <p style= {{fontFamily: "Roboto", marginBottom: "5px", fontSize: "16px", fontWeight: "550", lineHeight: "1.33", color: "#262628"}}>{deviceObj.manufacturer} | {deviceObj.model} | {deviceObj.deviceType}</p>
  
            <p style= {{fontFamily: "Roboto", fontSize: "16px", color: "#888894", lineHeight: "1.33"}}>{deviceObj.operatingSystem} {deviceObj.osLanguage}</p>
          </div>
          <div style= {{width: "8.367%", float: "left"}}>
          <a style= {{padding: "5px", borderRadius: "4px"}} onClick= {(e) => (e.preventDefault(), this.onDeleteToolsDevice(deviceObj.model))}>
                  {/* <img src= "images/flag.jpg" style= {{height: "15px", width: "15px"}}/> */}
                  <p style= {{fontSize: "13px", color: "#888894", marginTop: "10px", fontFamily: "Roboto", textAlign: "center", lineHeight: "1.36"}}>Delete</p>
                </a>
            </div>
          </div>
      )})
    );
    
}
  render() {
    const {
      deviceType,
      manufacturer,
      model,
      operatingSystem,
      osVersion,
      osLanguage
    }= this.props;

    return (
      <div style= {{padding: "0", float: "left"}}>
          <p styleName= 'titleP'>Devices</p>
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2", padding: "20px", overflow: "hidden"}}>
            <p style= {{fontSize: "20px", color: "#262628", lineHeight: "1.5", marginBottom: "20px"}}>Add Device</p>
            <div style= {{width: "18.88%", paddingLeft: "0", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>Device Type</p>
              <Select
                name="type"
                options={deviceTypes}
                id= "devices-type"
                value={deviceType}
                onChange={this.onUpdateDeviceType}
                placeholder="Device Type"
                matchPos="start"
                matchProp="name"
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div style= {{width: "32.08%", paddingLeft: "5px", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>Manufacturer</p>
              <input type= "text" style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} value={manufacturer} onChange={this.onUpdateManufacturer} id= "devices-manufacturer" />
            </div>
            <div style= {{width: "44.18%", paddingLeft: "5px", paddingRight: "0", float: "left"}}>
              <p styleName= 'headingsP'>Model</p>
              <input type= "text" style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} value={model} onChange={this.onUpdateModel} id= "devices-model" />
            </div>
            <div style= {{width: "18.88%", paddingLeft: "0", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>Operating System</p>
              <Select
                name="type"
                options={operatingSystems}
                id= "devices-os"
                value={operatingSystem}
                onChange={this.onUpdateOperatingSystem}
                placeholder="Device Operating System"
                matchPos="start"
                matchProp="name"
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div style= {{width: "32.08%", paddingLeft: "5px", paddingRight: "5px", float: "left"}}>
              <p styleName= 'headingsP'>OS Version</p>
              <input type= "text" style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} value={osVersion} onChange={this.onUpdateOsVersion} id= "devices-osVersion" />
            </div>
            <div style= {{width: "44.18%", paddingLeft: "5px", paddingRight: "0", float: "left"}}>
              <p styleName= 'headingsP'>OS Language</p>
              <input type= "text" value={osLanguage} onChange={this.onUpdateOsLanguage} id= "devices-osLanguage" style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} />
            </div>
            <div style={{textAlign: "center", width: "100%"}}>
            <PrimaryButton
            onClick={this.onSaveToolsDevices}
            theme={{ button: Styles['save-button'] }}
          >
            Add Device
          </PrimaryButton>
          </div>
          </div>
          <div style={{backgroundColor: "white", marginTop: "20px"}}>
            {this.displayDevices()}
          </div>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

