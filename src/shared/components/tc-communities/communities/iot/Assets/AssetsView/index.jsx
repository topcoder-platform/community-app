/**
 * Assets Item component of Assets page IoT community
 */
/* eslint-disable max-len */
import React from 'react';
import './styles.scss';
import Link from 'components/Link'
import AssetsItem from '../AssetsItem';

const assetsItems = [
  {
    "title": "Predix – CityIQ / Google.Maps PoC App",
    "description": "This Topcoder challenge was focused on developing a simple proof-of-concept application that combines …",
    "link": "https://github.com/topcoder-predix/cityiq-ui",
    "Technologies": [{"value": "Angular 2+"}, {"value": "Google API"}, {"value": "JavaScript"}, {"value": "node.js"}, {"value": "Predix", "link":"sdf"}, {"value": "Reactjs"}],
    "Platforms": [{"value": "Google"}, {"value": "Node.js"}, {"value": "Predix", "link": " "}],
    "AssetLinks": [
      {
        "style": "github",
        "text": "Github",
        "link": ""
      },
      {
        "style": "details",
        "text": "More Details",
        "link": ""
      }
    ],
    "detailsId": "Predix–CityIQ-Google-Maps-PoC-App"
  },
  {
    "title": "Predix – Steam Locomotive NodeJS Simulation",
    "description": "This Topcoder challenge was focused on creating a generic device in node.js …",
    "link": "https://github.com/topcoder-predix/locomotive-simulation",
    "Technologies": [{"value": "JavaScript"}, {"value": "node.js"}, {"value": "Predix", "link":"sdf"}],
    "Platforms": [{"value": "Google"}, {"value": "Node.js"}, {"value": "Predix", "link": " "}],
    "detailsId": "Predix–Steam-Locomotive-NodeJS-Simulation"
  },
  {
    "title": "Predix – Integration with Alexa Voice Service",
    "description": "This Topcoder challenge was focused on creating a generic device in node.js …",
    "link": "https://github.com/topcoder-predix/alexa-avs",
    "Technologies": [{"value": "Angular.js"}, {"value": "node.js"}, {"value": "Predix", "link":"sdf"}, {"value": "Reactjs"}],
    "Platforms": [{"value": "Node.js"}, {"value": "Predix", "link": " "}],
    "detailsId": "Predix–Integration-with-Alexa-Voice-Service"
  },
  {
    "title": "Predix – Sensor Emulator in C++",
    "description": "This Topcoder challenge was focused on creating a Predix sensor emulator in C++. …",
    "link": "https://github.com/topcoder-predix/sensor-emulator",
    "Technologies": [{"value": "C"}, {"value": "C++"}, {"value": "Predix", "link":"sdf"}],
    "Platforms": [{"value": "Predix", "link": " "}],
    "detailsId": "Predix–Sensor-Emulator-in-C++"
  }
]


export default class AssetsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridView: true
    }
    this.changeGridViewStyle = this.changeGridViewStyle.bind(this);
  }

  changeGridViewStyle = (value) => {
    this.setState({
      gridView: value
    })
  }

  render() {
    return (
      <div>
        <div styleName="assets-header">
          <h1>Predix Assets</h1>
          <div styleName="description">
            <p>Download the latest Predix assets created by Topcoder members to accelerate your Predix learning, and be sure to check out the latest Predix challenges. Your winning code could be posted next!</p>
          </div>
          <div styleName="view-mode">
            <a styleName={this.state.gridView?"switch-to-grid selected":"switch-to-grid"} onClick={()=>{this.changeGridViewStyle(true)}}>
              <span styleName="sr-only">Grid View</span>
            </a>
            <a styleName={this.state.gridView?"switch-to-list":"switch-to-list selected"} onClick={()=>{this.changeGridViewStyle(false)}}>
              <span styleName="sr-only">List View</span>
            </a>
          </div>
        </div>
        <div styleName="assets-body">
          <div styleName="assets-items">
            {
              assetsItems.map((item, index)=>{
                return (
                  <AssetsItem base={this.props.baseUrl}
                    asset={item}
                    key={index}
                    assetItemStyle={this.state.gridView?"assets-item-grid":"assets-item"}/>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }


}
