import React from 'react'
import PT from 'prop-types'
import SRMCard from './SRMCard.jsx'
require('./SRMCardExamples.scss')

class SRMCardExamples extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      srmChallenges: [],
    }

    /* Fetching of SRM challenges */
    fetch(`${this.props.API_URL}/?filter=status=FUTURE`)
      .then(res => res.json())
      .then((json) => {
        this.setState({srmChallenges: json.result.content})
      })
  }

  render() {
    // Upcoming srms
    let futureSRMChallenge = this.state.srmChallenges.filter((challenge) => {
      return challenge.status === 'FUTURE'
    })

    futureSRMChallenge = futureSRMChallenge.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    const UpcomingSrm = futureSRMChallenge.map((srmChallenge, i) => {
      return <SRMCard category={'upcoming'} srmChallenge={srmChallenge} key={i}/>
    })

    return(
      <div className="SRMsCardExamples">
        <div className={'tc-content-wrapper srm'}>
          <div className="challenges-container SRMs-container">
            {/* happening now */}
            <div className="SRMCardExamples">
              <SRMCard category={'now'} />
            </div>
            {/* upcoming SRMs */}
            <div className="SRMCardExamples">
              <div className="title">Upcoming SRMs</div>
              { UpcomingSrm }
            </div>
            {/* past SRMs */}
            <div className="SRMCardExamples">
              <div className="title">Past SRMs</div>
              <SRMCard category={'past'} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SRMCardExamples.defaultProps = {
  API_URL: process.env.API_URL
}

SRMCardExamples.propTypes = {
  API_URL: PT.string
}

export default SRMCardExamples
