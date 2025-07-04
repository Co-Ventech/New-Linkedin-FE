  
const axios = require('axios');

class LinkedInService {
  constructor() {
    this.baseURL = 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h';
    this.headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'xxx',
      'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com',
    };
  }

  async fetchJobs(searchParams) {
    const options = {
      method: 'GET',
      url: this.baseURL,
      params: searchParams,
      headers: this.headers,
    };

    console.log('🔍 Fetching jobs with params:', options.params);

    try {
      const response = await axios.request(options);
      const jobs = Array.isArray(response.data) ? response.data : [];
      
      console.log('✅ Jobs found:', jobs.length);
      return jobs;
    } catch (error) {
      console.error('❌ LinkedIn API Error:', error.response?.data || error.message);
      throw new Error(`LinkedIn API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new LinkedInService();
