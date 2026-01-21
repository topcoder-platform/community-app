import { config } from 'topcoder-react-utils';

const engagementsApiUrl = config.API.ENGAGEMENTS || `${config.API.V6}/engagements/engagements`;
const skillsApiUrl = `${config.API.V5}/standardized-skills/skills`;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNKNOWN_SKILL_LABEL = 'Unknown skill';

function isUuid(value) {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function buildEngagementsUrl(page, pageSize, filters = {}) {
  const normalizedPage = Number.isFinite(page) ? Math.max(1, page + 1) : 1;
  const url = new URL(engagementsApiUrl);

  url.searchParams.append('page', normalizedPage.toString());
  if (Number.isFinite(pageSize)) {
    url.searchParams.append('perPage', pageSize.toString());
  }

  if (filters.status) {
    const normalizedStatus = String(filters.status).trim().toUpperCase();
    if (normalizedStatus) {
      url.searchParams.append('status', normalizedStatus);
    }
  }

  const hasSkillFilters = filters.skills && filters.skills.length;
  if (filters.search && !hasSkillFilters) {
    url.searchParams.append('search', String(filters.search).trim());
  }

  if (filters.location) {
    const countries = String(filters.location)
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean);
    if (countries.length) {
      url.searchParams.append('countries', countries.join(','));
    }
  }

  if (filters.skills && filters.skills.length) {
    const skills = Array.isArray(filters.skills)
      ? filters.skills
      : [filters.skills];
    const normalizedSkills = skills
      .map(skill => String(skill).trim())
      .filter(Boolean);
    if (normalizedSkills.length) {
      url.searchParams.append('requiredSkills', normalizedSkills.join(','));
    }
  }

  if (filters.sortBy === 'createdAt') {
    url.searchParams.append('sortBy', 'createdAt');
    url.searchParams.append('sortOrder', 'desc');
  }

  return url;
}

function getAuthHeaders(tokenV3) {
  if (!tokenV3) return undefined;
  return {
    Authorization: `Bearer ${tokenV3}`,
  };
}

function extractEngagements(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && data.result && Array.isArray(data.result.content)) return data.result.content;
  if (data && data.result && Array.isArray(data.result.data)) return data.result.data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

function extractSkills(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && data.result && Array.isArray(data.result.content)) return data.result.content;
  if (data && data.result && Array.isArray(data.result.data)) return data.result.data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

function extractMeta(data, engagementsCount) {
  if (!data || Array.isArray(data)) return { totalCount: engagementsCount };
  if (data.meta) return data.meta;
  if (data.result && data.result.metadata) return data.result.metadata;
  if (typeof data.totalCount === 'number') return { totalCount: data.totalCount };
  if (typeof data.total === 'number') return { totalCount: data.total };
  if (typeof data.count === 'number') return { totalCount: data.count };
  return { totalCount: engagementsCount };
}

async function fetchSkillsByIds(skillIds, tokenV3) {
  const ids = Array.isArray(skillIds) ? skillIds : [skillIds];
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (!uniqueIds.length) return [];

  const params = new URLSearchParams();
  uniqueIds.forEach(skillId => params.append('skillId', skillId));
  params.set('disablePagination', 'true');

  const headers = getAuthHeaders(tokenV3);
  const res = await fetch(`${skillsApiUrl}?${params.toString()}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return extractSkills(data);
}

function resolveSkillLabel(skill, skillNameById) {
  if (!skill) return null;

  if (typeof skill === 'object') {
    const label = skill.name || skill.title;
    if (label) return label;

    const skillId = skill.id || skill.value;
    if (isUuid(skillId)) {
      return skillNameById.get(skillId) || UNKNOWN_SKILL_LABEL;
    }
    return skillId ? String(skillId) : null;
  }

  if (isUuid(skill)) {
    return skillNameById.get(skill) || UNKNOWN_SKILL_LABEL;
  }

  return String(skill);
}

function normalizeEngagementSkills(engagement, skillNameById) {
  if (!engagement || typeof engagement !== 'object') return engagement;

  return {
    ...engagement,
    skills: asArray(engagement.skills)
      .map(skill => resolveSkillLabel(skill, skillNameById))
      .filter(Boolean),
    requiredSkills: asArray(engagement.requiredSkills)
      .map(skill => resolveSkillLabel(skill, skillNameById))
      .filter(Boolean),
    skillsets: asArray(engagement.skillsets)
      .map(skill => resolveSkillLabel(skill, skillNameById))
      .filter(Boolean),
  };
}

async function hydrateEngagementSkills(engagements, tokenV3) {
  if (!Array.isArray(engagements) || !engagements.length) {
    return engagements;
  }

  const skillIds = new Set();
  engagements.forEach((engagement) => {
    const skillValues = [
      ...asArray(engagement.skills),
      ...asArray(engagement.requiredSkills),
      ...asArray(engagement.skillsets),
    ];
    skillValues.forEach((skill) => {
      if (typeof skill === 'object' && skill !== null) {
        const skillId = skill.id || skill.value;
        if (isUuid(skillId)) {
          skillIds.add(skillId);
        }
      } else if (isUuid(skill)) {
        skillIds.add(skill);
      }
    });
  });

  let skillNameById = new Map();
  if (skillIds.size) {
    try {
      const skills = await fetchSkillsByIds(Array.from(skillIds), tokenV3);
      skillNameById = new Map(
        skills
          .map(skill => [skill.id, skill.name || skill.title || skill.label])
          .filter(([id, label]) => Boolean(id) && Boolean(label)),
      );
    } catch (error) {
      skillNameById = new Map();
    }
  }

  return engagements.map(engagement => normalizeEngagementSkills(engagement, skillNameById));
}

/**
 * Fetches engagements.
 *
 * @param {number} page - Page number (0-based).
 * @param {number} pageSize - Number of items per page.
 * @param {Object} filters - Filters for engagements.
 * @param {string} tokenV3 - Optional auth token.
 * @returns {Promise<{engagements: Object[], meta: Object}>} The fetched data.
 */
export default async function getEngagements(page, pageSize, filters = {}, tokenV3) {
  const url = buildEngagementsUrl(page, pageSize, filters);
  const headers = getAuthHeaders(tokenV3);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    const engagements = extractEngagements(data);
    const meta = extractMeta(data, engagements.length);
    const hydratedEngagements = await hydrateEngagementSkills(engagements, tokenV3);

    return { engagements: hydratedEngagements, meta };
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Fetches a single engagement by ID.
 *
 * @param {string} engagementId - The engagement ID.
 * @param {string} tokenV3 - Optional auth token.
 * @returns {Promise<Object>} The engagement details.
 */
export async function getEngagementDetails(engagementId, tokenV3) {
  const url = new URL(`${engagementsApiUrl}/${encodeURIComponent(engagementId)}`);
  const headers = getAuthHeaders(tokenV3);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    const [hydrated] = await hydrateEngagementSkills([data], tokenV3);
    return hydrated || data;
  } catch (error) {
    return Promise.reject(error);
  }
}
