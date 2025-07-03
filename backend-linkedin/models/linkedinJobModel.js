// const axios = require('axios');

// const fetchLinkedInJobs = async (searchParams) => {
//   const {
//     limit = 10,
//     offset = 0,
//     location_filter = '"United States" OR "United Kingdom" OR "Saudia" OR "United Arab Emirates"',
//     description_type = 'text',
//     remote = true,
//     advanced_title_filter = '(AI | \'Machine Learning\' | \'Robotics\')'
//   } = searchParams;

//   const options = {
//     method: 'GET',
//     url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h',
//     params: {
//       limit: limit.toString(),
//       offset: offset.toString(),
//       location_filter,
//       description_type,
//       remote: remote.toString(),
//       advanced_title_filter
//     },
//     headers: {
//       'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//       'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await axios.request(options);
//     return {
//       jobs: response.data?.jobs || [],
//       totalJobs: response.data?.jobs?.length || 0,
//       hasMore: response.data?.jobs?.length === limit,
//       currentOffset: offset,
//       nextOffset: offset + limit
//     };
//   } catch (error) {
//     throw new Error(`LinkedIn API Error: ${error.response?.data?.message || error.message}`);
//   }
// };

// const validateJobSearchParams = (params) => {
//   const errors = [];
  
//   if (params.limit && (params.limit < 1 || params.limit > 100)) {
//     errors.push('limit must be between 1 and 100');
//   }
  
//   if (params.offset && params.offset < 0) {
//     errors.push('offset must be a positive number');
//   }
  
//   return errors;
// };

// module.exports = {
//   fetchLinkedInJobs,
//   validateJobSearchParams
// };
const axios = require('axios');

const fetchLinkedInJobs = async (searchParams) => {
  const {
    limit = 10,
    offset = 0,
    location_filter = "United Kingdom",
    advanced_title_filter = "('Robotics')",
    description_type = 'text',
    remote = true,
    title_filter // Optional - only if provided
  } = searchParams;

  // Build params object dynamically
  const apiParams = {
    limit: limit.toString(),
    offset: offset.toString(),
    location_filter,
    description_type,
    remote: remote.toString(),
    advanced_title_filter
  };

  // Only add title_filter if it's provided and not empty
  if (title_filter && title_filter.trim() !== '') {
    apiParams.title_filter = title_filter;
  }

  const options = {
    method: 'GET',
    url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h',
    params: apiParams,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
    }
  };

  console.log('🔍 API Request Params:', apiParams);

  try {
    const response = await axios.request(options);
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Jobs Returned:', response.data?.jobs?.length || 0);
    
    return {
      jobs: response.data?.jobs || [],
      totalJobs: response.data?.jobs?.length || 0,
      hasMore: response.data?.jobs?.length === limit,
      currentOffset: offset,
      nextOffset: offset + limit
    };
  } catch (error) {
    console.error('❌ LinkedIn API Error:', error.response?.status, error.response?.data);
    throw new Error(`LinkedIn API Error: ${error.response?.data?.message || error.message}`);
  }
};

const validateJobSearchParams = (params) => {
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
  fetchLinkedInJobs,
  validateJobSearchParams
};
