/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getEducationTypes } from 'utils/educationTypes';
import EducationList from '../../../../../assets/images/educationlist.svg';

import Select from 'components/Select';
import DefaultPortrait from 'assets/images/ico-user-default.svg';

import Styles from './styles.scss';

const educationTypes = getEducationTypes();

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    console.log("Super props edu Data", props);
    this.state= {
      isGraduatedBool: false
    }
    this.onSaveProfileEducation= this.onSaveProfileEducation.bind(this)
    this.onUpdateType= this.onUpdateType.bind(this);
    this.onUpdateName= this.onUpdateName.bind(this);
    this.onUpdateMajor= this.onUpdateMajor.bind(this);
    this.onUpdateStartDate= this.onUpdateStartDate.bind(this);
    this.onUpdateEndDate= this.onUpdateEndDate.bind(this);
    this.onUpdateGraduated= this.onUpdateGraduated.bind(this);
    // this.onDeleteProfileLanguages= this.onDeleteProfileLanguages.bind(this)
  }
  onUpdateType(type){
    this.props.onUpdateType(type.name);
  }
  onUpdateName(){
    const name= document.querySelector('#profile-name').value;
    this.props.onUpdateName(name);
  }
  onUpdateMajor(){
    const major= document.querySelector('#profile-major').value;
    this.props.onUpdateMajor(major);
  }
  onUpdateStartDate(){
    const startDate= document.querySelector('#profile-startDate').value;
    this.props.onUpdateStartDate(startDate)
  }
  onUpdateEndDate(){
    const endDate= document.querySelector('#profile-endDate').value;
    this.props.onUpdateEndDate(endDate)
  }
  onUpdateGraduated(){
    this.setState({isGraduatedBool: !this.state.isGraduatedBool});
    
    this.props.onUpdateGraduated(!this.state.isGraduatedBool);
  }
  onSaveProfileEducation(e){
    e.preventDefault();
    const type= this.props.type;
    const name= this.props.name;
    const major= this.props.major;
    const startDate= this.props.startDate+ "T00:00:00.000Z";
    const endDate= this.props.endDate+"T00:00:00.000Z";
    const graduated= this.props.graduated;
    const educationobj= {
      "type": type,
      "schoolCollegeName": name,
      "major": major,
      "timePeriodFrom": startDate,
      "timePeriodTo": endDate,
      "graduated": graduated
    }    
    this.props.onUpdateEducation(educationobj);
    this.props.onSaveProfileEducation(e);
  }
  onDeleteProfileEducation(educationName){
    // e.preventDefault();
    console.log("Deleting education");
    console.log(educationName);
    this.props.onDeleteProfileEducation(educationName);
  }
  displayEducation(){
    return(
      this.props.educations.map((educationObj, key) => {
        return (
          <div style= {{border:"1px solid #ededf2", padding: "20px 20px", overflow: "hidden"}}>
          <div style= {{width: "6.7%", padding: "0", float: "left"}}>
          <EducationList />
          </div>
          <div style= {{width: "79.83%", marginLeft: "2.4%", float: "left"}}>
            <p style= {{fontFamily: "Roboto", marginBottom: "5px", fontSize: "16px", fontWeight: "550", lineHeight: "1.33", color: "#262628"}}>{educationObj.schoolCollegeName}</p>
  
            <p style= {{fontFamily: "Roboto", fontSize: "16px", color: "#888894", lineHeight: "1.33"}}>{educationObj.timePeriodFrom.substring(0,4)} - {educationObj.timePeriodTo.substring(0,4)} | {educationObj.graduated? 'Graduated': 'Not Graduated'}</p>
          </div>
          <div style= {{width: "8.367%", float: "left"}}>
          <a style= {{padding: "5px", borderRadius: "4px"}} onClick= {(e) => (e.preventDefault(), this.onDeleteProfileEducation(educationObj.schoolCollegeName))}>
                  
                  <p style= {{fontSize: "16px", marginTop: "10px", cursor: "pointer", fontFamily: "Roboto", textAlign: "center", lineHeight: "1.36", fontWeight: "550"}}>Delete</p>
                </a>
            </div>
          </div>
      )})
    );
    
}
  render() {
    const {
      type,
      name,
      major,
      startDate,
      endDate,
      graduated
    } = this.props;
    return (
      <div style= {{padding: "0", float: "left"}}>
          <p styleName= 'titleP'>Education</p>
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2", padding: "20px", overflow: "hidden"}}>
            <p style= {{fontSize: "20px", color: "#262628", lineHeight: "1.5", marginBottom: "20px"}}>Add Education</p>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3" style= {{paddingLeft: "0", paddingRight: "5px"}}>
              <p styleName= "headingsP">Type</p>
              <Select
                name="type"
                options={educationTypes}
                id= "profile-type"
                value={type}
                onChange={this.onUpdateType}
                placeholder="Education Type"
                matchPos="start"
                matchProp="name"
                style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div styleName= "col-md-6 col-sm-6 col-xs-6 col-lg-6" style= {{paddingLeft: "5px", paddingRight: "5px"}}>
              <p styleName= "headingsP">Name</p>
              <input type= "text"  name="name" id="profile-name" 
                    value={name} style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                     onChange= {this.onUpdateName} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3" style= {{paddingLeft: "5px", paddingRight: "0"}}>
              <p styleName= "headingsP">Major</p>
              <input type= "text"  name="major" id="profile-major" style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}
                    value={major} onChange= {this.onUpdateMajor} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3" style= {{paddingLeft: "0", paddingRight: "5px"}}>
              <p styleName= "headingsP">From</p>
              <input type= "date"  style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}} name="startDate" id="profile-startDate" 
                    value={startDate} onChange= {this.onUpdateStartDate} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3" style= {{paddingLeft: "5px", paddingRight: "5px"}}>
              <p styleName= "headingsP">To</p>
              <input type= "date"  style= {{height: "36px", marginBottom: "20px", borderRadius: "4px", color: "#262628"}}  name="endDate" id="profile-endDate" 
                    value={endDate} onChange= {this.onUpdateEndDate} />
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4" style= {{paddingLeft: "5px", paddingRight: "0"}}>
              <input type= "checkbox" style= {{visibility: "visible", marginTop: "31.5px", backgroundColor: "#1a85ff"}} name="graduated" id="profile-graduated" 
                    checked= {this.state.isGraduatedBool} onChange= {this.onUpdateGraduated} />
              Graduated
            </div>
            <div styleName= "col-md-2 col-sm-2 col-xs-2 col-lg-2" style= {{height: "80px"}}>
            </div>
            <div style={{textAlign: "center", width: "100%"}}>
            <PrimaryButton
              onClick={this.onSaveProfileEducation}
              theme={{ button: Styles['save-button'] }}
            >
              Add Education
            </PrimaryButton>
            </div>
          </div>
          <div style={{backgroundColor: "white", marginTop: "20px"}}> 
          {this.displayEducation()}
          </div>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

