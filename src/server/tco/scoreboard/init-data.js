/**
 * Initialize data in scoreboard database.
 */
import logger from 'utils/logger';
import models from './models';
import SubmissionService from './services/SubmissionService';

const Competitor = models.Competitor;
const Challenge = models.Challenge;
const Submission = models.Submission;
const ChallengeCompetitor = models.ChallengeCompetitor;

async function init() {
  try {
    // create DB schema with dropping tables.
    await models.init(true);

    // clear competitors
    await Competitor.destroy({ where: {} });
    // create competitors
    await Competitor.create({ handle: 'johnd', name: 'John Doe' });
    await Competitor.create({ handle: 'janed', name: 'Jane Doe' });

    // clear challenges
    await Challenge.destroy({ where: {} });
    // create challenges
    const challengeId1 = 123;
    const challengeId2 = 1234;
    await Challenge.create({
      id: challengeId1,
      type: 'Code',
      title: 'Create New API',
      description: 'Create New API having CRUD operations',
    });
    await Challenge.create({
      id: challengeId2,
      type: 'Design',
      title: 'Design New Page',
      description: 'Design a brand new page',
    });

    // clear submissions
    await Submission.destroy({ where: {} });
    // create submissions
    await SubmissionService.create({
      challengeId: challengeId1,
      handle: 'johnd',
      submissionCode: {
        codeField1: 'Best',
        codeField2: 'Done',
        codeField3: 40,
      },
    });

    await SubmissionService.create({
      challengeId: challengeId1,
      handle: 'janed',
      submissionCode: {
        codeField1: 'Good',
        codeField2: 'Final Submission',
        codeField3: 30,
      },
    });

    // create submissions
    await SubmissionService.create({
      challengeId: challengeId2,
      handle: 'johnd',
      submissionDesign: {
        designField1: 'RUX',
        designField2: '48h',
        designField3: 40,
      },
    });

    // create submissions
    await SubmissionService.create({
      challengeId: challengeId2,
      handle: 'janed',
      submissionDesign: {
        designField1: 'FAST',
        designField2: '24h',
        designField3: 30,
      },
    });

    // clear challenge competitors
    await ChallengeCompetitor.destroy({ where: {} });
    // create challenge competitors
    await ChallengeCompetitor.create({ challengeId: challengeId1, handle: 'johnd' });
    await ChallengeCompetitor.create({ challengeId: challengeId1, handle: 'janed' });
  } catch (e) {
    logger.warn('An error ocurred while creating and populating the Scoreboard DB:');
    logger.warn(e);
    logger.warn('Fix the error and retry the script. Exiting...');
  }

  // need to exit the current script.
  process.exit();
}

init();
