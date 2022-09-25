/* eslint-disable import/prefer-default-export */
import fetch from 'isomorphic-fetch';
import { config } from 'topcoder-react-utils';

const baseUrl = config.TIMELINE_WALL_URL;

/**
 * Get timeline wall events
 */
export const getTimelineEvents = async () => {
  try {
    const res = await fetch(`${baseUrl}/events`);
    return res.json();
  } catch (error) {
    return [];
  }
};

/**
 * Get pending approvals for timeline
 */
export const getPendingApprovals = async () => {
  try {
    const res = await fetch(`${baseUrl}/pending`);
    return res.json();
  } catch (error) {
    return [];
  }
};
