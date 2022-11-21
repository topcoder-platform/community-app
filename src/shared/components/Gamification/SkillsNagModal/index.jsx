import React from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import { keys } from 'lodash';

import IconClose from 'assets/images/icon-close-green.svg';
import style from './styles.scss';

const skillCountStatement = (count) => {
  let statement = '';
  switch (count) {
    case 0:
      statement = 'don’t have any skills';
      break;
    case 1:
      statement = 'only have 1 skill';
      break;
    default:
      statement = `only have ${count} skills`;
  }
  return statement;
};

const SkillsNagModal = ({
  handle,
  skills,
  onCancel,
  onCTA,
  MIN_SKILLS_TO_REMIND,
}) => (
  <Modal onCancel={onCancel} theme={style}>
    <div styleName="nagModal">

      <div styleName="header">
        <div styleName="title">
          <span>UPDATE PROFILE SKILLS</span>
        </div>
        <div styleName="icon" role="presentation" onClick={onCancel}>
          <IconClose />
        </div>
      </div>

      <div styleName="description">
        <div styleName="badgeWrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="75"
            fill="none"
            viewBox="0 0 70 75"
          >
            <path
              fill="url(#paint0_linear_439_23448)"
              d="M33.3 71.06l-28-15.468a3.477 3.477 0 01-1.8-3.042V21.845c0-1.264.69-2.429 1.8-3.043l28-15.467a3.518 3.518 0 013.4 0l28 15.467a3.477 3.477 0 011.8 3.043V52.55c0 1.264-.69 2.429-1.8 3.042l-28 15.468a3.518 3.518 0 01-3.4 0z"
            />
            <mask
              id="mask0_439_23448"
              style={{ maskType: 'alpha' }}
              width="64"
              height="70"
              x="3"
              y="2"
              maskUnits="userSpaceOnUse"
            >
              <path
                fill="url(#paint1_linear_439_23448)"
                d="M33.3 71.06l-28-15.468a3.477 3.477 0 01-1.8-3.042V21.845c0-1.264.69-2.429 1.8-3.043l28-15.467a3.518 3.518 0 013.4 0l28 15.467a3.477 3.477 0 011.8 3.043V52.55c0 1.264-.69 2.429-1.8 3.042l-28 15.468a3.518 3.518 0 01-3.4 0z"
              />
            </mask>
            <g mask="url(#mask0_439_23448)">
              <path
                fill="#171717"
                d="M37.383 82.496l25.678-25.393-4.887.62 6.71-2.461 4.91-4.924-12.784 3.747 20.549-11.416 3.701-3.672c.406-.403 1.043-1.045 1.34-1.329L55.307 50.664l24.987-19.717-1.296-1.286-25.91 17.899 21.066-22.703-1.307-1.296L50.42 44.847 67.916 18.66l-1.285-1.275-19.264 25.208 14.08-30.35-1.274-1.263-16.189 29.86L54.176 5.03l-1.065-1.057-12.73 35.677 5.294-43.052-.812-.806-8.205 43.259-1.68-52.246a2.528 2.528 0 00-.406 0L32.88 39.052 24.654-4.24l-.813.817 5.316 43.074-12.74-35.71-1.098 1.09 10.247 35.807-16.2-29.903L8.092 12.2 22.194 42.58 2.809 17.44l-1.186 1.176L19.13 44.836l-22.45-21.33-1.295 1.275 21.032 22.79-25.865-17.997-1.252 1.242 24.898 19.848L-12.6 38.213l.857.85 3.8 3.769 20.428 11.253-12.806-3.682 4.92 4.87 6.71 2.461-4.887-.62 25.02 24.794c2.108 2.102 3.338 3.366 5.941.599v-.011z"
                opacity="0.4"
              />
              <path
                fill="url(#paint2_linear_439_23448)"
                d="M34.614 53.975h-1.911c-.212-.023-.423-.053-.642-.076-2.939-.34-5.597-1.382-7.924-3.232-3.044-2.417-4.948-5.537-5.673-9.366-.113-.597-.173-1.208-.264-1.813v-1.91c.098-.688.143-1.383.302-2.047 1.534-6.435 5.514-10.491 11.942-12.077 1.096-.272 2.251-.287 3.384-.348.952-.053 1.911-.007 2.855-.007.446-2.644 1.927-4.102 4.14-4.102 2.213 0 3.694 1.458 4.14 4.11h4.146v4.146c2.462.105 3.988 1.979 4.087 3.935.09 1.82-1.201 4.116-4.102 4.313V38.498c0 2.349-.468 4.6-1.518 6.7-2.327 4.622-6.028 7.492-11.12 8.526-.61.121-1.23.182-1.85.272l.008-.022zm12.433-21.209c.536.19 1.012.37 1.496.529a1.967 1.967 0 002.167-.68c.567-.725.597-1.7.068-2.447-.52-.74-1.412-1.035-2.296-.748-.468.159-.937.333-1.443.514v-4.819h-4.781c.181-.498.347-.959.506-1.42a2.012 2.012 0 00-1.292-2.568 2.046 2.046 0 00-2.575 1.307c-.159.476-.114.936.06 1.405.159.415.31.838.476 1.306h-4.728v2.07c2.817.189 4.048 2.349 4.078 3.995.023 1.02-.28 1.934-.929 2.72-.808.989-1.88 1.472-3.15 1.525v2.055h4.676c-.181.498-.355.951-.498 1.42a2.048 2.048 0 002.032 2.666c1.352-.046 2.273-1.375 1.858-2.69-.144-.46-.318-.92-.499-1.42h4.766V32.76l.008.007zM34.674 51.852c6.61-.377 11.995-6.042 12.297-12.28h-2.024c-.106 2.439-1.956 3.972-3.935 4.078-1.836.09-4.124-1.216-4.306-4.078h-2.024v4.682c-.491-.173-.937-.34-1.39-.483-.861-.28-1.737-.015-2.266.672a2.04 2.04 0 00-.076 2.425 2.035 2.035 0 002.32.785c.46-.143.92-.317 1.42-.49v4.697l-.016-.008zm-2.04-14.365v-4.683c.545.181 1.05.385 1.572.521 1.042.272 2.107-.347 2.432-1.367a2.052 2.052 0 00-1.239-2.53c-.513-.196-1.027-.159-1.533.03-.4.151-.8.287-1.246.453v-4.743c-3.498.332-6.436 1.737-8.808 4.29-2.092 2.259-3.248 4.94-3.52 8.029h2.055c.159-2.644 2.122-3.965 3.867-4.071a4.002 4.002 0 012.75.838c1.057.816 1.563 1.919 1.631 3.24h2.04v-.007zm-.022 12.349c-2.817-.197-4.049-2.35-4.086-4.003-.023-1.02.28-1.934.929-2.72.808-.989 1.88-1.472 3.15-1.525v-2.054h-4.676c.181-.499.355-.96.498-1.42a2.052 2.052 0 00-2.001-2.666c-1.367.022-2.312 1.36-1.896 2.688.143.461.317.914.498 1.428h-4.713c.453 6.994 6.48 12.054 12.29 12.266v-2.002l.007.008z"
              />
            </g>
            <path
              stroke="#E9E9E9"
              strokeWidth="7"
              d="M31.818 69.968h0a6.515 6.515 0 006.364 0h0l24.266-13.573s0 0 0 0A6.557 6.557 0 0065.8 50.67V23.724A6.557 6.557 0 0062.448 18s0 0 0 0L38.182 4.427h0a6.516 6.516 0 00-6.364 0h0L7.552 18s0 0 0 0A6.557 6.557 0 004.2 23.724V50.67a6.557 6.557 0 003.352 5.724s0 0 0 0l24.266 13.574z"
            />
            <path
              stroke="url(#paint3_linear_439_23448)"
              strokeWidth="2"
              d="M11.07 51.717h0a1.918 1.918 0 01-.97-1.673V24.35c0-.7.375-1.34.97-1.674h0L34.092 9.736s0 0 0 0a1.848 1.848 0 011.816 0s0 0 0 0L58.93 22.677h0c.595.335.97.974.97 1.674v25.693c0 .7-.375 1.339-.97 1.673h0L35.908 64.66a1.848 1.848 0 01-1.816 0L11.07 51.717z"
            />
            <defs>
              <linearGradient
                id="paint0_linear_439_23448"
                x1="4.168"
                x2="71.076"
                y1="70.762"
                y2="9.316"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#574F47" />
                <stop offset="1" stopColor="#292929" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_439_23448"
                x1="4.168"
                x2="71.076"
                y1="70.762"
                y2="9.316"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#B9B6B4" />
                <stop offset="1" stopColor="#ACACAB" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_439_23448"
                x1="53.2"
                x2="17.047"
                y1="28.318"
                y2="31.236"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FAFDFD" />
                <stop offset="1" stopColor="#CBCBCB" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_439_23448"
                x1="63.889"
                x2="-0.98"
                y1="60.157"
                y2="30.683"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FEB914" />
                <stop offset="1" stopColor="#FFE501" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span>
          {/* eslint-disable-next-line max-len */}
          Hey <strong>{handle}</strong>, we have noticed that you {skillCountStatement(keys(skills).length)} added to your profile. To be able to match you with the best opportunities at Topcoder, please add skills to that you have at least <strong>{MIN_SKILLS_TO_REMIND} skills</strong> listed in your profile.
        </span>
      </div>

      <div styleName="actionButtons">
        <button type="button" styleName="primaryBtn" onClick={onCTA}>
          Update Your Skills
        </button>
      </div>

    </div>
  </Modal>
);

SkillsNagModal.propTypes = {
  MIN_SKILLS_TO_REMIND: PT.number.isRequired,
  handle: PT.string.isRequired,
  skills: PT.shape().isRequired,
  onCancel: PT.func.isRequired,
  onCTA: PT.func.isRequired,
};

export default SkillsNagModal;
