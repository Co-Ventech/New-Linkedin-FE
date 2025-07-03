const axios = require('axios');

const API_URL = 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h';

const searchJobs = async (searchParams) => {
  const {
    job_titles = [],
    locations = [],
    limit = 50,
    offset = 0,
    type_filter = 'FULL_TIME',
    remote = 'true',
    description_type = 'text'
  } = searchParams;

  // Format job titles for OR search
  const titleFilter = job_titles.length > 0 
    ? `(${job_titles.join(' | ')})` 
    : '(Flutter| Devops | MERN | SQA | AGENTIC | Nodejs | React)';

  // Format locations for OR search
  const locationFilter = locations.length > 0 
    ? locations.join(' OR ') 
    : 'Canada OR United Kingdom';

  const options = {
    method: 'GET',
    url: API_URL,
    params: {
      limit: limit.toString(),
      offset: offset.toString(),
      location_filter: locationFilter,
      description_type,
      type_filter,
      remote,
      advanced_title_filter: titleFilter
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw new Error(`LinkedIn API Error: ${error.response?.data?.message || error.message}`);
  }
};

const validateSearchParams = (params) => {
  const errors = [];
  
  if (params.limit && (params.limit < 1 || params.limit > 100)) {
    errors.push('limit must be between 1 and 100');
  }
  
  if (params.offset && params.offset < 0) {
    errors.push('offset must be a positive number');
  }
  
  const validJobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
  if (params.type_filter && !validJobTypes.includes(params.type_filter)) {
    errors.push('type_filter must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP');
  }
  
  return errors;
};

module.exports = {
  searchJobs,
  validateSearchParams
};
