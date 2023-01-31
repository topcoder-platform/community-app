
import { TABS } from '../../actions/page/settings';

export const SCREEN_SIZE = {
  SM: 767,
};

export const SETTINGS_TABS = [
  { title: 'Profile', link: TABS.PROFILE },
  { title: 'Skills & Experience', link: TABS.SKILLS },
  { title: 'Topcoder & You', link: TABS.TRACKS },
  { title: 'Tools', link: TABS.TOOLS },
  { title: 'Account', link: TABS.ACCOUNT },
  { title: 'Preferences', link: TABS.PREFERENCES },
  { title: 'Payment', link: TABS.PAYMENT },
];

export const PROFILE_SETTINGS = {
  personalDetails: {
    title: 'Personal Details',
    description:
      'By keeping this information up to date we may contact you about relevant freelance opportunites at Topcoder, or even surprise you with a cool T-shirt. Sharing your contact details will never result in robocalls about health insurance plans or junk mail.',
  },
  aboutYou: {
    title: 'About You',
    description:
      'Enter a short bio to help potential customers know you.',
  },
  learningAndEducations: {
    title: 'Learning & Education',
    description: 'Enter information about your schooling and degrees.',
  },
  hobbies: {
    title: 'Hobbies',
    description: 'Tell us about what you love to do in your free time.',
  },
};

export const TOPCODER_AND_YOU = {
  tracks: {
    title: 'Tracks',
    description: 'Topcoder\'s three categories of challenges... please pick at least one based on your skills and interests.',
  },
  community: {
    title: 'Your Communities',
  },
};

export const INTERESTS_AT_TOPCODER = [
  'Top Paying Work',
  'Skill Building / Upskilling',
  'Work with Top Companies',
  'Compete (Code & Design Challenges)',
  'Full Time Freelance Work',
  'Have Fun',
  'Gain Technical Experience',
  'Prepare for an interview',
  'Competitive Programming',
  'Earn Extra Money',
  'Connect With Smart People',
  'Explore / Not Sure',
];
