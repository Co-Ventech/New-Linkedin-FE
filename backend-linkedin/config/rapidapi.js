const rapidApiConfig = {
  baseUrl: 'https://jobs-search-api.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
    // 'Content-Type': 'application/json'
  }
};

module.exports = rapidApiConfig;
