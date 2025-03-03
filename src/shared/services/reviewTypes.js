import { config } from 'topcoder-react-utils';

const baseUrl = config.URL.REVIEW_API_URL;
const v5ApiUrl = config.API.V5;

export const getReviewTypes = (tokenV3) => (
  fetch(`${v5ApiUrl}${baseUrl}?perPage=500&page=1`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${tokenV3}`,
    }),
  },)
    .then(res => res.json())
);
