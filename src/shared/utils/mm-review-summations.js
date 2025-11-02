import _ from 'lodash';

function normalizeScoreValue(score) {
  if (_.isNil(score) || score === '' || score === '-') {
    return null;
  }
  const parsed = Number(score);
  if (_.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

function getSummationTimestamp(summation) {
  const candidates = [
    _.get(summation, 'createdAt'),
    _.get(summation, 'created'),
    _.get(summation, 'reviewedDate'),
    _.get(summation, 'updatedAt'),
  ];
  return _.find(candidates, value => !!value) || null;
}

function toTimestampValue(value) {
  if (!value) {
    return 0;
  }
  const timestamp = new Date(value).getTime();
  if (_.isNaN(timestamp)) {
    return 0;
  }
  return timestamp;
}

function getSummationHandle(summation) {
  const handle = _.get(summation, 'submitterHandle');
  if (!handle || !_.isString(handle) || !handle.trim()) {
    return 'unknown';
  }
  return handle;
}

function getSummationMemberId(summation) {
  const memberId = _.get(summation, 'submitterId');
  return _.isNil(memberId) ? null : _.toString(memberId);
}

function getSummationRating(summation) {
  const rating = _.get(summation, 'submitterMaxRating');
  return _.isNil(rating) ? null : rating;
}

function ensureSubmissionEntry(existingEntry, { submissionId, timestamp, timestampValue }) {
  const baseEntry = {
    submissionId,
    submissionTime: timestamp || null,
    provisionalScore: null,
    finalScore: null,
    status: 'completed',
    reviewSummations: [],
    reviewSummation: [],
    latestTimestamp: timestampValue,
    provisionalMeta: { timestamp: -Infinity, score: null },
    finalMeta: { timestamp: -Infinity, score: null },
  };

  if (!existingEntry) {
    return baseEntry;
  }

  const reviewSummations = Array.isArray(existingEntry.reviewSummations)
    ? [...existingEntry.reviewSummations]
    : [];
  const reviewSummation = Array.isArray(existingEntry.reviewSummation)
    ? [...existingEntry.reviewSummation]
    : [...reviewSummations];

  return {
    ...baseEntry,
    ...existingEntry,
    submissionId: existingEntry.submissionId || submissionId,
    submissionTime: existingEntry.submissionTime || baseEntry.submissionTime,
    status: existingEntry.status || 'completed',
    reviewSummations,
    reviewSummation,
    latestTimestamp: _.isFinite(existingEntry.latestTimestamp)
      ? existingEntry.latestTimestamp
      : baseEntry.latestTimestamp,
    provisionalMeta: existingEntry.provisionalMeta
      ? { ...existingEntry.provisionalMeta }
      : baseEntry.provisionalMeta,
    finalMeta: existingEntry.finalMeta
      ? { ...existingEntry.finalMeta }
      : baseEntry.finalMeta,
  };
}

function mergeScoreData(meta, currentValue, score, timestampValue, options = {}) {
  const { allowOlderTimestampUpdate = true } = options;
  const nextMeta = { ...meta };
  let nextValue = currentValue;

  if (timestampValue > nextMeta.timestamp) {
    nextMeta.timestamp = timestampValue;
    nextMeta.score = score;
    nextValue = _.isNil(score) ? null : score;
  } else if (timestampValue === nextMeta.timestamp) {
    if (!_.isNil(score) && (_.isNil(nextMeta.score) || score > nextMeta.score)) {
      nextMeta.score = score;
      nextValue = score;
    }
  } else if (allowOlderTimestampUpdate && _.isNil(nextValue) && !_.isNil(score)) {
    nextMeta.timestamp = timestampValue;
    nextMeta.score = score;
    nextValue = score;
  }

  return {
    meta: nextMeta,
    value: nextValue,
  };
}

function updateSubmissionEntry(existingEntry, {
  submissionId,
  timestamp,
  timestampValue,
  normalizedScore,
  summation,
  isProvisional,
}) {
  const baseEntry = ensureSubmissionEntry(existingEntry, {
    submissionId,
    timestamp,
    timestampValue,
  });
  const {
    submissionTime: baseSubmissionTime,
    latestTimestamp: baseLatestTimestamp,
  } = baseEntry;

  let submissionTime = baseSubmissionTime;
  let latestTimestamp = baseLatestTimestamp;

  if (timestampValue > latestTimestamp) {
    latestTimestamp = timestampValue;
    submissionTime = timestamp || submissionTime;
  } else if (!submissionTime && timestamp) {
    submissionTime = timestamp;
  }

  const provisionalResult = isProvisional
    ? mergeScoreData(
      baseEntry.provisionalMeta,
      baseEntry.provisionalScore,
      normalizedScore,
      timestampValue,
    )
    : { meta: baseEntry.provisionalMeta, value: baseEntry.provisionalScore };

  const finalResult = isProvisional
    ? { meta: baseEntry.finalMeta, value: baseEntry.finalScore }
    : mergeScoreData(
      baseEntry.finalMeta,
      baseEntry.finalScore,
      normalizedScore,
      timestampValue,
    );

  const reviewSummations = [...baseEntry.reviewSummations, summation];

  return {
    ...baseEntry,
    submissionTime,
    latestTimestamp,
    provisionalMeta: provisionalResult.meta,
    provisionalScore: provisionalResult.value,
    finalMeta: finalResult.meta,
    finalScore: finalResult.value,
    reviewSummations,
    reviewSummation: [...reviewSummations],
  };
}

function assignRanks(members, scoreKey, rankKey) {
  const rankedEntries = members
    .map(member => ({
      key: `${member.memberId || member.member || ''}`,
      score: member[scoreKey],
    }))
    .filter(entry => !_.isNil(entry.score))
    .sort((a, b) => b.score - a.score);

  let processed = 0;
  let previousScore = null;
  let currentRank = 0;
  const rankByKey = new Map();

  rankedEntries.forEach((entry) => {
    processed += 1;
    if (previousScore === null || entry.score !== previousScore) {
      currentRank = processed;
      previousScore = entry.score;
    }
    rankByKey.set(entry.key, currentRank);
  });

  return members.map((member) => {
    const key = `${member.memberId || member.member || ''}`;
    const rank = rankByKey.get(key);
    return {
      ...member,
      [rankKey]: _.isNil(rank) ? null : rank,
    };
  });
}

function createStatisticsSubmission({
  submissionId,
  timestamp,
  timestampValue,
  score,
}) {
  return {
    submissionId,
    created: timestamp || null,
    createdAt: timestamp || null,
    score,
    meta: {
      timestamp: timestampValue,
      score,
    },
  };
}

function updateStatisticsSubmission(submission, {
  timestamp,
  timestampValue,
  score,
}) {
  const base = {
    ...submission,
    meta: submission.meta ? { ...submission.meta } : { timestamp: -Infinity, score: null },
  };

  const previousMeta = base.meta;
  const { meta, value } = mergeScoreData(previousMeta, base.score, score, timestampValue, {
    allowOlderTimestampUpdate: false,
  });

  const hasNewerTimestamp = meta.timestamp > previousMeta.timestamp;

  return {
    ...base,
    created: hasNewerTimestamp ? (timestamp || base.created) : base.created,
    createdAt: hasNewerTimestamp ? (timestamp || base.createdAt) : base.createdAt,
    score: value,
    meta,
  };
}

export function buildMmSubmissionData(reviewSummations = []) {
  if (!Array.isArray(reviewSummations) || !reviewSummations.length) {
    return [];
  }

  const membersByHandle = new Map();

  reviewSummations.forEach((summation, index) => {
    if (!summation) {
      return;
    }

    const handle = getSummationHandle(summation);
    if (!membersByHandle.has(handle)) {
      membersByHandle.set(handle, {
        handle,
        memberId: null,
        rating: null,
        submissionsMap: new Map(),
        bestProvisionalScore: null,
        bestFinalScore: null,
      });
    }

    const memberEntry = membersByHandle.get(handle);

    const memberId = getSummationMemberId(summation);
    if (!memberEntry.memberId && memberId) {
      memberEntry.memberId = memberId;
    }

    const rating = getSummationRating(summation);
    if (_.isNil(memberEntry.rating) && !_.isNil(rating)) {
      memberEntry.rating = rating;
    }

    const rawSubmissionId = _.get(summation, 'submissionId', _.get(summation, 'id'));
    const submissionId = rawSubmissionId ? _.toString(rawSubmissionId) : `unknown-${handle}-${index}`;
    const timestamp = getSummationTimestamp(summation);
    const timestampValue = toTimestampValue(timestamp);

    const normalizedScore = normalizeScoreValue(_.get(summation, 'aggregateScore'));
    const isProvisional = Boolean(summation.isProvisional);

    const updatedEntry = updateSubmissionEntry(memberEntry.submissionsMap.get(submissionId), {
      submissionId,
      timestamp,
      timestampValue,
      normalizedScore,
      summation,
      isProvisional,
    });

    memberEntry.submissionsMap.set(submissionId, updatedEntry);

    if (!_.isNil(normalizedScore)) {
      if (isProvisional) {
        memberEntry.bestProvisionalScore = _.isNil(memberEntry.bestProvisionalScore)
          ? normalizedScore
          : Math.max(memberEntry.bestProvisionalScore, normalizedScore);
      } else {
        memberEntry.bestFinalScore = _.isNil(memberEntry.bestFinalScore)
          ? normalizedScore
          : Math.max(memberEntry.bestFinalScore, normalizedScore);
      }
    }
  });

  const members = Array.from(membersByHandle.values()).map((memberEntry) => {
    const submissions = Array.from(memberEntry.submissionsMap.values())
      .map(submission => ({
        submissionId: submission.submissionId,
        submissionTime: submission.submissionTime,
        provisionalScore: _.isNil(submission.provisionalScore) ? null : submission.provisionalScore,
        finalScore: _.isNil(submission.finalScore) ? null : submission.finalScore,
        status: submission.status || 'completed',
        reviewSummations: [...submission.reviewSummations],
        reviewSummation: [...submission.reviewSummations],
      }))
      .sort((a, b) => toTimestampValue(b.submissionTime) - toTimestampValue(a.submissionTime));

    const rating = _.isNil(memberEntry.rating) ? null : memberEntry.rating;
    const memberId = memberEntry.memberId ? _.toString(memberEntry.memberId) : null;

    const registrant = memberId ? {
      userId: memberId,
      memberHandle: memberEntry.handle === 'unknown' ? null : memberEntry.handle,
      rating,
    } : null;

    return {
      member: memberEntry.handle,
      memberId,
      registrant,
      rating,
      provisionalRank: null,
      finalRank: null,
      submissions,
      bestProvisionalScore: memberEntry.bestProvisionalScore,
      bestFinalScore: memberEntry.bestFinalScore,
    };
  });

  const withProvisionalRanks = assignRanks(members, 'bestProvisionalScore', 'provisionalRank');
  const withFinalRanks = assignRanks(withProvisionalRanks, 'bestFinalScore', 'finalRank');

  return withFinalRanks
    .map(({ bestProvisionalScore, bestFinalScore, ...rest }) => rest)
    .sort((a, b) => {
      if (!_.isNil(a.finalRank) && !_.isNil(b.finalRank)) {
        return a.finalRank - b.finalRank;
      }
      if (!_.isNil(a.finalRank)) {
        return -1;
      }
      if (!_.isNil(b.finalRank)) {
        return 1;
      }
      if (!_.isNil(a.provisionalRank) && !_.isNil(b.provisionalRank)) {
        return a.provisionalRank - b.provisionalRank;
      }
      if (!_.isNil(a.provisionalRank)) {
        return -1;
      }
      if (!_.isNil(b.provisionalRank)) {
        return 1;
      }
      return 0;
    });
}

export function buildStatisticsData(reviewSummations = []) {
  if (!Array.isArray(reviewSummations) || !reviewSummations.length) {
    return [];
  }

  const grouped = new Map();

  reviewSummations.forEach((summation, index) => {
    if (!summation) {
      return;
    }

    const handle = getSummationHandle(summation);
    if (!grouped.has(handle)) {
      grouped.set(handle, {
        handle,
        rating: null,
        submissionsMap: new Map(),
      });
    }

    const entry = grouped.get(handle);

    const rating = getSummationRating(summation);
    if (_.isNil(entry.rating) && !_.isNil(rating)) {
      entry.rating = rating;
    }

    const timestamp = getSummationTimestamp(summation);
    const timestampValue = toTimestampValue(timestamp);
    const score = normalizeScoreValue(_.get(summation, 'aggregateScore'));

    const rawSubmissionId = _.get(summation, 'submissionId', _.get(summation, 'id'));
    const submissionId = rawSubmissionId ? _.toString(rawSubmissionId) : `unknown-${handle}-${index}`;

    const existingSubmission = entry.submissionsMap.get(submissionId);

    const updatedSubmission = existingSubmission
      ? updateStatisticsSubmission(existingSubmission, { timestamp, timestampValue, score })
      : createStatisticsSubmission({
        submissionId,
        timestamp,
        timestampValue,
        score,
      });

    entry.submissionsMap.set(submissionId, updatedSubmission);
  });

  return Array.from(grouped.values()).map(entry => ({
    handle: entry.handle,
    rating: entry.rating,
    submissions: Array.from(entry.submissionsMap.values())
      .map(submission => ({
        submissionId: submission.submissionId,
        created: submission.created,
        createdAt: submission.createdAt,
        score: submission.score,
      }))
      .sort((a, b) => toTimestampValue(b.createdAt) - toTimestampValue(a.createdAt)),
  }));
}

export default {
  buildMmSubmissionData,
  buildStatisticsData,
};
