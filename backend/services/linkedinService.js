
const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'linkedin-job-search-api.p.rapidapi.com';
const BASE_URL = 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h';

const DEFAULT_PARAMS = {
  limit: "10",
  offset: "0",
  location_filter: '"United States" OR "United Kingdom"',
  description_type: 'text',
  remote: 'true',
  advanced_title_filter: "('Test Automation' | 'Web Development' | 'AI/ML' | 'UI/UX')"
};

async function fetchJobsFromRapidAPI(params = {}) {
  const options = {
    method: 'GET',
    url: BASE_URL,
    params: { ...DEFAULT_PARAMS, ...params },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
    },
  };
  const response = await axios.request(options);
  return Array.isArray(response.data) ? response.data : [];
}

module.exports = { fetchJobsFromRapidAPI };