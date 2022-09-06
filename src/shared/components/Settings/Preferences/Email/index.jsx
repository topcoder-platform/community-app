/* eslint-disable max-len */
/**
 * Email Preferences component.
 */
import { debounce, map } from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { toastr } from 'react-redux-toastr';
import ToggleableItem from 'components/Settings/ToggleableItem';
import Item from '../List/Item';
import subscribe from './data';

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
    id: 'd0c48e9da3',
    name: 'Gig Work',
    desc: 'This newsletter gets sent out at various times, specifically when we have an opportunity of mass appeal. For more information you can visit the <a href="https://www.topcoder.com/community/taas" style="color:#0d61bf;text-decoration:none;font-weight:500;">Gig Work page.</a>',
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
    desc: 'For all the latest updates surrounding the <a href="https://www.topcoder.com/community/member-programs/topcoder-open" style="color:#0d61bf;text-decoration:none;font-weight:700;">Topcoder Open</a> you should definitely be subscribing to this one. Expect an update in your mailbox every Tuesday!',
  },
  {
    id: '3460574ddd',
    name: 'Rapid Development Match (RDM) Reminders',
    desc: 'Receive notifications of our brand new RDMs! These rated, development matches will be a fun new way to engage with us!',
  },
  {
    id: 'ee26600945',
    name: 'NASA Community',
    desc: 'Receive email notifications for all the latest news and announcements of our <a href="https://www.topcoder.com/community/nasa" style="color:#0d61bf;text-decoration:none;font-weight:500;">NASA Member Program</a>.',
  },
];
const programs = [
  {
    id: 'cafe98d7a7',
    name: 'Beta Testers',
    desc: 'If you have applied and been approved as a <a href="https://www.topcoder.com/community/member-programs/beta-testers" style="color:#0d61bf;text-decoration:none;font-weight:500;">Beta Tester</a>, you may control the emails you receive here.',
  },
];

export default class EmailPreferences extends React.Component {
  saveEmailPreferences = debounce((id, checked) => {
    // update local state
    const { emailPreferences, status } = this.state;
    emailPreferences[id] = checked;
    this.setState({
      emailPreferences,
      status: checked ? 'subscribed' : status,
    });
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
      const { emailPreferences, status } = this.state;
      const { id, checked } = updated;
      if (emailPreferences[id] !== checked) {
        emailPreferences[id] = checked;

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          emailPreferences,
          status: updated.resubscribe ? 'subscribed' : status,
        });
      }
      toastrSuccess('Success! ', 'Your email preferences were updated.');
    }
  }

  onChange(id, checked) {
    // document.querySelectorAll(`#pre-onoffswitch-${id}`).forEach((el) => { el.checked = checked; }); // eslint-disable-line no-param-reassign
    // update remote state
    this.saveEmailPreferences(id, checked);
  }

  render() {
    const { emailPreferences, status } = this.state;
    const { email } = this.props;
    return (
      <div styleName="EmailPreferences">
        {
          status !== 'subscribed' ? (
            <Item
              isSubscribeForm
              email={email}
              key={subscribe.id}
              id={subscribe.id}
              title={subscribe.name}
              description={subscribe.description}
              linkTitle={subscribe.linkTitle}
            />
          ) : (
            <React.Fragment>
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
                        onToggle={c => this.onChange(newsletter.id, c)}
                        disabled={status !== 'subscribed'}
                      />
                    );
                  })
                }
              {
                  map(programs, (program) => {
                    const checked = emailPreferences[program.id];
                    return (
                      <ToggleableItem
                        key={program.id}
                        id={program.id}
                        value={program.id}
                        checked={checked}
                        primaryText={program.name}
                        secondaryText={program.desc}
                        onToggle={c => this.onChange(program.id, c)}
                        disabled={status !== 'subscribed'}
                      />
                    );
                  })
                }
            </React.Fragment>
          )
        }
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
