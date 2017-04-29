import React from 'react'
import PT from 'prop-types'
import Abbreviation from './Abbreviation'
import './TrackIcon.scss'


function TrackIcon ({track, subTrack, tcoEligible, isDataScience, MAIN_URL}) {
  const TCO_URL = `${MAIN_URL}/tco`
  return (
    <span styleName="trackIcon">
      <div styleName={(isDataScience ? 'data_science' : track.toLowerCase()) + ' main-icon'}>{Abbreviation[track][subTrack]}</div>
      <a href={`${TCO_URL}`}>
      <div styleName={tcoEligible ? (isDataScience ? 'data_science' : track.toLowerCase()) + ' tco-icon' : 'hidden'}>TCO</div></a>
    </span>
  )
}
TrackIcon.defaultProps = {
  MAIN_URL: process.env.MAIN_URL
}

TrackIcon.propTypes = {
  MAIN_URL: PT.string,
}
export default TrackIcon
