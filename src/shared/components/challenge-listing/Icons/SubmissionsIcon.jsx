import React from 'react'

const SubmissionsIcon = ({ width, height, fill }) => {
  const f = (fill || '#C3C3C8')
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={ width || '14' } height={ height || '16' } viewBox="0 0 14 16">
      <path fill={ f } fillRule="evenodd" d="M14,15 L14,5 L9,0 L1,0 C0.4,0 0,0.4 0,1 L0,15 C0,15.6 0.4,16 1,16 L13,16 C13.6,16 14,15.6 14,15 Z M2,2 L8,2 L8,6 L12,6 L12,14 L2,14 L2,2 Z"/>
    </svg>
  )
}

export default SubmissionsIcon
