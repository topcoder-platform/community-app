/**
 * Child component of Settings/Profile/AboutMe renders "About Me" section of profile setting page.
 */
/* global document */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';

import { PrimaryButton, SecondaryButton } from 'topcoder-react-ui-kit';

import { getEducationTypes } from 'utils/educationTypes';

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
    // console.log("IsGraduate ", this.state.isGraduated)
    // console.log("Education Data props", this.props);
    // const isGraduated= this.props.graduated? 'Graduated': 'Not Graduated';
    return(
      this.props.educations.map((educationObj, key) => {
        return (
          <div style= {{border:"1px solid #ededf2"}}>
        <div styleName= "col-md-9 col-sm-9 col-xs-9 col-lg-9">
          <h4>{educationObj.schoolCollegeName}</h4>
          <p>{educationObj.timePeriodFrom.substring(0,4)} - {educationObj.timePeriodTo.substring(0,4)} | {educationObj.graduated? 'Graduated': 'Not Graduated'}</p>
        </div>
        <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
        <button style= {{padding: "5px", borderRadius: "4px"}} onClick= {(e) => (e.preventDefault(), this.onDeleteProfileEducation(educationObj.schoolCollegeName))}>
                Delete
              </button>
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
      <div>
        <form autoComplete= "off">
          <h2>Education</h2>
          <br></br>
          <div style= {{backgroundColor: "#fafafb", border:"1px solid #ededf2", float: "left"}}>
            <h3>Add Education</h3>
            <br></br>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>Type</p>
              <Select
                name="type"
                options={educationTypes}
                id= "profile-type"
                value={type}
                onChange={this.onUpdateType}
                placeholder="Education Type"
                matchPos="start"
                matchProp="name"
                labelKey="name"
                valueKey="name"
                clearable={false}
              />
            </div>
            <div styleName= "col-md-6 col-sm-6 col-xs-6 col-lg-6">
              <p>Name</p>
              <input type= "text"  name="name" id="profile-name" 
                    value={name} onChange= {this.onUpdateName} style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>Major</p>
              <input type= "text"  name="major" id="profile-major" 
                    value={major} onChange= {this.onUpdateMajor} style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>From</p>
              <input type= "date" style= {{width: "100%"}}  name="startDate" id="profile-startDate" 
                    value={startDate} onChange= {this.onUpdateStartDate} style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-3 col-sm-3 col-xs-3 col-lg-3">
              <p>To</p>
              <input type= "date" style= {{width: "100%"}}  name="endDate" id="profile-endDate" 
                    value={endDate} onChange= {this.onUpdateEndDate} style= {{width: "100%"}} />
            </div>
            <div styleName= "col-md-2 col-sm-2 col-xs-2 col-lg-2">
            <br></br>
            <br></br>
              <input type= "checkbox" style= {{visibility: "visible"}} name="graduated" id="profile-graduated" 
                    checked= {this.state.isGraduatedBool} onChange= {this.onUpdateGraduated} />
              Graduated
            </div>
            <div styleName= "col-md-4 col-sm-4 col-xs-4 col-lg-4">
            </div>
            <div styleName= "col-md-12 col-sm-12 col-xs-12 col-lg-12">
              <button style= {{padding: "5px", borderRadius: "4px"}} onClick={this.onSaveProfileEducation}>
                Add Education
              </button>
            </div>
          </div>
          <br></br>
          {this.displayEducation()}
        </form>
      </div>
    );
  }
}

Data.defaultProps = {
 
};

Data.propTypes = {
 };

