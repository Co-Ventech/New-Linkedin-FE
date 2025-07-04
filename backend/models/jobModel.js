const linkedinService = require('../services/linkedinService');

class JobModel {
  constructor() {
    this.defaultParams = {
      limit: "30",
      offset: "0",
      location_filter: '"United States" OR "United Kingdom"',
      description_type: 'text',
      remote: 'true',
      advanced_title_filter: '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
    };
  }

  validateSearchParams(params) {
    const errors = [];
    
    if (params.limit && (parseInt(params.limit) < 1 || parseInt(params.limit) > 100)) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (params.offset && parseInt(params.offset) < 0) {
      errors.push('Offset must be a positive number');
    }
    
    return errors;
  }

  async searchJobs(searchParams) {
    const params = { ...this.defaultParams, ...searchParams };
    
    const validationErrors = this.validateSearchParams(params);
    if (validationErrors.length > 0) {
      throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
    }

    return await linkedinService.fetchJobs(params);
  }
}

module.exports = new JobModel();
