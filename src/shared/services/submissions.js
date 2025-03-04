import { config } from 'topcoder-react-utils';

const v5ApiUrl = config.API.V5;

export const downloadSubmissions = (tokenV3, submissionId, artifactId) => {
  return fetch(`${v5ApiUrl}/submissions/${submissionId}/artifacts/${artifactId}/download`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${tokenV3}`,
    }),
  }).then(res => res.blob());
};

export const getSubmissionArtifacts = (tokenV3, submissionId) => {
  return fetch(`${v5ApiUrl}/submissions/${submissionId}/artifacts`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${tokenV3}`,
    }),
  }).then(res => res.json());
};
