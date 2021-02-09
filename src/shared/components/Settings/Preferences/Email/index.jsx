/**
 * Email Preferences component.
 */
import { debounce, map } from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import ToggleableItem from 'components/Settings/ToggleableItem';

import './styles.scss';

function toastrSuccess(title, message) {
  setImmediate(() => {
    toastr.success(title, message);
  });
}

function toastrError(title, message) {
  setImmediate(() => {
    toastr.error(title, message);
  });
}

const SAVE_DELAY = 1000;

const newsletters = [
  {
    id: '9f950b43a1',
    name: 'Challenge Pipeline',
    desc: 'Subscribe to this newsletter if you want to get updates on the types of challenges coming up in the future. To view these challenges at your leisure you can always visit the <a href="https://www.topcoder.com/community/pipeline" style="color:#0d61bf;text-decoration:underline">Challenge Pipeline</a> page.',
  },
  {
    id: 'd0c48e9da3',
    name: 'Gig Work',
    desc: 'This newsletter gets sent out at various times, specifically when we have an opportunity of mass appeal. For more information you can visit the <a href="https://www.topcoder.com/community/taas" style="color:#0d61bf;text-decoration:underline">Gig Work</a> page.',
  },
  {
    id: 'a8f858cdf1',
    name: 'Monthly Newsletter',
    desc: 'This newsletter gets sent out at the end of every month and contains a variety of important information across all of our tracks.',
  },
  {
    id: '5e67dba327',
    name: 'Marathon Match Reminders',
    desc: 'Receive updates whenever a new marathon match is scheduled.',
  },
  {
    id: '9091b438cc',
    name: 'Single Round Match (SRM) Reminders',
    desc: 'Attention Competitive Programmers! If there is any newsletter you are subscribing too, it better be this one. Receive updates when a new SRM event is scheduled.',
  },
  {
    id: '603c900c32',
    name: 'TCO Newsletter',
    desc: 'For all the latest updates surrounding the <a href="https://www.topcoder.com/community/member-programs/topcoder-open" style="color:#0d61bf;text-decoration:underline">Topcoder Open</a> you should definitely be subscribing to this one. Expect an update in your mailbox every Tuesday!',
  },
  {
    id: '3460574ddd',
    name: 'Rapid Development Match (RDM) Reminders',
    desc: 'Receive notifications of our brand new RDMs! These rated, development matches will be a fun new way to engage with us!',
  },
];
const programs = [
  {
    id: 'cafe98d7a7',
    name: 'Beta Testers',
    desc: '',
  },
];

export default class EmailPreferences extends React.Component {
  saveEmailPreferences = debounce((id, checked) => {
    const { email, saveEmailPreferences } = this.props;
    saveEmailPreferences(email, id, checked);
  }, SAVE_DELAY);

  constructor(props) {
    super(props);
    this.state = {
      emailPreferences: { ...props.preferences },
      status: props.status,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { updated } = this.props;
    if (updated && updated !== prevProps.updated) {
      if (updated.error) {
        toastrError('Error! ', 'Failed to update Your email preferences :-(');
      }
      const { emailPreferences } = this.state;
      const { id, checked } = updated;
      emailPreferences[id] = checked;

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        emailPreferences,
      });
      toastrSuccess('Success! ', 'Your email preferences were updated.');
    }
  }

  onChange(id, checked) {
    document.querySelectorAll(`#pre-onoffswitch-${id}`).forEach((el) => { el.checked = checked; }); // eslint-disable-line no-param-reassign
    this.saveEmailPreferences(id, checked);
  }

  render() {
    const { emailPreferences, status } = this.state;
    return (
      <div styleName="EmailPreferences">
        <h1 styleName="title">
          E-Mail Preferences
        </h1>
        {
          status !== 'subscribed' ? (
            <div styleName="unsubscribed-msg">
              <h3>You have unsubscribed from Topcoder Emails</h3>
              <p>If this was a mistake or if you would like to resubscribe,
                please click the button below and fill out the form.
              </p>
              <PrimaryButton
                // eslint-disable-next-line no-return-assign
                onClick={() => window.location.href = 'https://topcoder.us13.list-manage.com/subscribe?u=65bd5a1857b73643aad556093&id=28bfd3c062'}
              >
                Resubscribe
              </PrimaryButton>
            </div>
          ) : null
        }
        <div styleName="sub-title">Newsletters</div>
        <div styleName="preferences-container">
          {
            map(newsletters, (newsletter) => {
              const checked = emailPreferences[newsletter.id];
              return (
                <ToggleableItem
                  key={newsletter.id}
                  id={newsletter.id}
                  value={newsletter.id}
                  checked={checked}
                  primaryText={newsletter.name}
                  secondaryText={newsletter.desc}
                  onToggle={e => this.onChange(newsletter.id, e.target.checked)}
                  disabled={status !== 'subscribed'}
                />
              );
            })
          }
        </div>
        <div styleName="sub-title-2">Programs</div>
        <div styleName="preferences-container">
          {
            map(programs, (program) => {
              const checked = emailPreferences[program.id];
              return checked && (
                <ToggleableItem
                  key={program.id}
                  id={program.id}
                  value={program.id}
                  checked={checked}
                  primaryText={program.name}
                  secondaryText={program.desc}
                  onToggle={e => this.onChange(program.id, e.target.checked)}
                  disabled={status !== 'subscribed'}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

EmailPreferences.defaultProps = {
  updated: null,
  status: null,
};

EmailPreferences.propTypes = {
  email: PT.string.isRequired,
  preferences: PT.shape().isRequired,
  saveEmailPreferences: PT.func.isRequired,
  updated: PT.shape(),
  status: PT.string,
};
