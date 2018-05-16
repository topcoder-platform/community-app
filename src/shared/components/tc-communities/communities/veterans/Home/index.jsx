/**
 * Static implementation of Home page for Wipro 2 community
 *
 * It hardcodes data which is passed to dummy components,
 * thus we disable max-len eslint rule for this file
 */

import ChallengesBlock from 'components/tc-communities/ChallengesBlock';
import ImageText from 'components/tc-communities/ImageText2';
import JoinCommunity from 'containers/tc-communities/JoinCommunity';
import LoadingIndicator from 'components/LoadingIndicator';
import Modal from 'components/Modal';
import PT from 'prop-types';
import React from 'react';
import YouTubeVideo from 'components/YouTubeVideo';
import { Button } from 'topcoder-react-ui-kit';
import { Link } from 'topcoder-react-utils';

import image01 from './images/image-01.jpg';
import image02 from './images/image-02.jpg';
import image03 from './images/image-03.jpg';
import qouteAvatar from './images/qoute-avatar.jpg';

import style from './style.scss';

export default function Home({
  activeChallenges,
  baseUrl,
  isWhatIsTopcoderVideoShown,
  loadingActiveChallenges,
  setChallengeListingFilter,
  showWhatIsTopcoderVideo,
}) {
  return (
    <main>
      {
        isWhatIsTopcoderVideoShown ? (
          <Modal
            onCancel={() => showWhatIsTopcoderVideo()}
            theme={{
              container: style.whatIsTopcoderVideo,
            }}
          >
            <YouTubeVideo
              autoplay
              src="https://www.youtube.com/embed/mD12LIqdxqk"
              title="What is Topcoder?"
            />
            <div
              onClick={() => showWhatIsTopcoderVideo()}
              onKeyPress={() => showWhatIsTopcoderVideo()}
              role="button"
              styleName="closeWhatIsTopcoderVideoCross"
              tabIndex={0}
            >&times;
            </div>
          </Modal>
        ) : null
      }
      <div styleName="style.header">
        <h1>Topcoder for Veterans</h1>
        <p>
          We help military service members and veterans transition to a career
          in technology with the world&apos;s premier crowdsourcing platform.
        </p>
        <p styleName="marginTop30">
          What is Topcoder?
          &zwnj;
          <Button
            onClick={() => showWhatIsTopcoderVideo(true)}
            theme={{
              button: style.watchVideoButton,
            }}
          >
            &#9658;&emsp;Watch video
          </Button>
        </p>
        <JoinCommunity
          label="Join Now"
          theme={{
            container: style.joinButtonInHeader,
          }}
        />
      </div>

      <h1 styleName="style.ourMission">
        We help connect talented coders with organizations across the globe in
        need of your specialized skills.
      </h1>

      <div styleName="style.imageTextBlock">
        <ImageText imageUrl={image01}>
          <h1>Why We Started</h1>
          <p>
            The U.S. military has some of the most sophisticated technology
            platforms and equipment on the planet, which demand the brightest
            minds available. And with 200,000 service members exiting the
            military annually, it’s time to apply that expertise to civilian
            employment with thousands of organizations around the world.
          </p>
          <p>
            But the transition from military to civilian life can be
            challenging and, as with any training, the most effective method
            includes real-world experience. Yet, there are few private sector
            programs outside the realm of government service that effectively
            and repeatedly provide new, realistic opportunities for service
            members. In fact, the Center for New American Security reports that
            60% of employers see the translation gap as the biggest obstacle to
            bringing more vets on board.
          </p>
          <p>
            We’re here to bridge that gap.
          </p>
        </ImageText>
        <ImageText imageUrl={image02}>
          <h1>How the Topcoder Veterans Community Works</h1>
          <p>
            The challenges on veterans.topcoder.com are real-world problems and
            projects requested by Topcoder customers. Whether a contestant wins
            a challenge or not, participation demonstrates skill with current,
            in-demand toolsets. Members can compete to gain experience, and as
            proficiency increases, earn money — all from home.
          </p>
          <p>
            Topcoder also partners with advocacy groups such as OperationCode,
            a 503(c) dedicated to helping veterans learn to code. Together with
            our partners, we have developed a coalition of companies that share
            our vision and are committed to providing job opportunities to
            members of the Topcoder Veterans Community.
          </p>
          <p>
            Sign up today! Not only is it fast and free to join the Topcoder
            Veterans Community, but doing so also enables you to compete in
            interesting projects, earn money, hone your skills, and help many
            of today’s top businesses solve real-world problems.
          </p>
          <JoinCommunity
            label="Join Now"
            theme={{
              container: style.joinButtonInCard,
            }}
          />
        </ImageText>
        <ImageText imageUrl={image03}>
          <h1>The Topcoder Team is Here to Help</h1>
          <p>
            If you&apos;re new to Topcoder, we&apos;re here to help. If you
            have any questions about joining or competing, contact us
            &zwnj;
            <Link
              to="mailto:support@topcoder.com"
            >here
            </Link>.
          </p>
          <p>
            The
            &zwnj;
            <Link
              openNewTab
              to="https://apps.topcoder.com/forums/"
            >Topcoder forums
            </Link>&zwnj;
            have lots of great insight and they are a good place to find
            answers to your questions.
          </p>
          <p>
            We also have Slack for our community members. Instant feedback and
            chatting opportunities with some of the world&apos;s best.
            &zwnj;
            <Link
              openNewTab
              to="https://docs.google.com/forms/d/e/1FAIpQLScb9pWbauhQ6owZZheM15f1Rodu_6CdGNtivvDb71kGgpJJKw/viewform"
            >Topcoder Community Slack
            </Link>.
          </p>
          <p>
            The best place to start after you register is to check the
            &zwnj;
            <Link
              to={`${baseUrl}/challenges`}
            >challenge listings page
            </Link>. We event have some fun challenges
            which are perfect for getting your feet wet!
          </p>
        </ImageText>
      </div>

      <div styleName="style.quoteBlock">
        <div styleName="style.qouteAvatar">
          <img alt="Qoute avatar" src={qouteAvatar} />
          <div styleName="style.qouteNote">
            <strong>Jarah Meador</strong> Innovation Crowdsourcing Lead at the
            VA
          </div>
        </div>
        <div>
          <div styleName="style.qouteText">
            <span styleName="style.qouteCommas style.left">&ldquo;</span>
            The launch of the Topcoder Veterans Community represents a major milestone
            in our ongoing mission to help veterans develop new skills and successfully
            transition to meaningful civilian jobs.  This community is helping the VA, as
            well as other organizations, accelerate technology innovation development
            while supporting important workforce development for Veterans.
            <span styleName="style.qouteCommas style.right">&rdquo;</span>
          </div>
          <div styleName="style.qouteNote">
            <strong>Jarah Meador</strong> Innovation Crowdsourcing Lead, U.S. Department
            of Veterans Affairs
          </div>
        </div>
      </div>
      <div styleName="style.challengesBlock">
        {
          loadingActiveChallenges && !activeChallenges ? <LoadingIndicator /> : (
            <ChallengesBlock
              baseUrl={baseUrl}
              challenges={activeChallenges}
              setChallengeListingFilter={setChallengeListingFilter}
            />
          )
        }
      </div>
      <div styleName="style.cardsBlock">
        <div styleName="style.card style.card-01">
          <div>
            <h1>Learn & Explore</h1>
            <p>
              Grow your skills and get Topcoder-certified&nbsp;&mdash; all for
              free
            </p>
            <Button to={`${baseUrl}/learn`}>Learn More</Button>
          </div>
        </div>
        <div styleName="style.card style.card-02">
          <div>
            <h1>Compete & Earn</h1>
            <p>
              Check out our challenges and get paid for winning results
            </p>
            <Button to={`${baseUrl}/learn`}>Learn More</Button>
          </div>
        </div>
      </div>
    </main>
  );
}

Home.propTypes = {
  activeChallenges: PT.arrayOf(PT.shape({

  })).isRequired,
  baseUrl: PT.string.isRequired,
  isWhatIsTopcoderVideoShown: PT.bool.isRequired,
  loadingActiveChallenges: PT.bool.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showWhatIsTopcoderVideo: PT.func.isRequired,
};
