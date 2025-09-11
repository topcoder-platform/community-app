import { config } from 'topcoder-react-utils';

const baseUrl = config.URL.REVIEW_TYPES_API_URL;
const v6ApiUrl = config.API.V6;

export default function getReviewTypes(tokenV3) {
  return fetch(`${v6ApiUrl}${baseUrl}?perPage=500&page=1`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${tokenV3}`,
    }),
  }).then(res => res.json());
}
