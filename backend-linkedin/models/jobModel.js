// const axios = require('axios');

// const API_URL = 'https://jobs-search-api.p.rapidapi.com/getjobs';

// const searchJobs = async (searchParams) => {
//   const {
//     search_term,
//     location,
//     results_wanted,
//     site_name,
//     distance,
//     job_type,
//     is_remote,
//     linkedin_fetch_description,
//     hours_old
//   } = searchParams;

//   const options = {
//     method: 'POST',
//     url: API_URL,
//     headers: {
//       'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//       'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
//       'Content-Type': 'application/json'
//     },
//     data: {
//       search_term,
//       location,
//       results_wanted,
//       site_name,
//       distance,
//       job_type,
//       is_remote,
//       linkedin_fetch_description,
//       hours_old
//     }
//   };

//   try {
//     const response = await axios(options);
//     return response.data;
//   } catch (error) {
//     throw new Error(`RapidAPI Error: ${error.response?.data?.message || error.message}`);
//   }
// };

// const validateSearchParams = (params) => {
//   const errors = [];
  
//   if (params.results_wanted && (params.results_wanted < 1 || params.results_wanted > 50)) {
//     errors.push('results_wanted must be between 1 and 50');
//   }
  
//   if (params.distance && params.distance < 0) {
//     errors.push('distance must be a positive number');
//   }
  
//   const validJobTypes = ['fulltime', 'parttime', 'contract', 'internship'];
//   if (params.job_type && !validJobTypes.includes(params.job_type)) {
//     errors.push('job_type must be one of: fulltime, parttime, contract, internship');
//   }
  
//   return errors;
// };

// module.exports = {
//   searchJobs,
//   validateSearchParams
// };
const axios = require('axios');

const searchLinkedInJobs = async (searchParams) => {
  const {
    job_titles = ['Flutter', 'Devops', 'MERN', 'SQA', 'AGENTIC', 'Nodejs', 'React'],
    locations = ['United States', 'United Kingdom', 'Saudia', 'United Arab Emirates'],
    limit = 20,
    offset = 0,
    remote = true,
    description_type = 'text'
  } = searchParams;

  // Format job titles for advanced filter
  const titleFilter = `(${job_titles.join('| ')})`;
  
  // Format locations for location filter with quotes
  const locationFilter = locations.map(loc => `"${loc}"`).join(' OR ');

  const options = {
    method: 'GET',  // Confirmed GET method
    url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h',
    params: {  // Using params for GET request
      limit: limit.toString(),
      offset: offset.toString(),
      location_filter: locationFilter,
      description_type,
      remote: remote.toString(),
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
  
  return errors;
};

module.exports = {
  searchLinkedInJobs,
  validateSearchParams
};
