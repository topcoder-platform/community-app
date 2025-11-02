export const SUBMISSION_PHASE_NAMES = [
  'Submission',
  'Checkpoint Submission',
  'Topgear Submission',
];

export function hasOpenSubmissionPhase(phases) {
  if (!Array.isArray(phases)) return false;
  return phases.some(phase => SUBMISSION_PHASE_NAMES.includes(phase.name) && phase.isOpen);
}
