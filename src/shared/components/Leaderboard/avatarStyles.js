/**
 * Custom style definition for the Avatar component
 * when integrated in the Leaderboard
 */

const baseAvatarStyles = {
  height: '100%',
  width: '100%',
  borderRadius: '50%',
  borderWidth: '5px',
  borderStyle: 'solid',
};

const defaultAvatarModifier = {
  borderColor: 'rgba(0, 0, 0, 0.05)',
};

const goldAvatarModifier = {
  borderColor: '#fce217',
};

const silverAvatarModifier = {
  borderColor: '#a9bcd4',
};

const bronzeAvatarModifier = {
  borderColor: '#bd731e',
};

const defaultAvatarStyles = [baseAvatarStyles, defaultAvatarModifier];

const goldAvatarStyles = [baseAvatarStyles, goldAvatarModifier];

const silverAvatarStyles = [baseAvatarStyles, silverAvatarModifier];

const bronzeAvatarStyles = [baseAvatarStyles, bronzeAvatarModifier];

export {
  defaultAvatarStyles,
  goldAvatarStyles,
  silverAvatarStyles,
  bronzeAvatarStyles,
};
