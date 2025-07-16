// // Utility to normalize job data from various APIs to a consistent format
// // Add more mappings as you discover new field names from different APIs

// export function normalizeJob(rawJob) {
//   // Support both nested company object and dot notation fields
//   const company = rawJob.company || {};
//   // Dot notation fallback
//   const getDot = (key) => rawJob[`company.${key}`] || company[key] || '';
//   // Handle locations (array of objects or string)
//   let locations = getDot('locations') || rawJob.locations || rawJob.location || '';
//   if (Array.isArray(locations)) {
//     locations = locations.map(loc => {
//       if (typeof loc === 'string') return loc;
//       if (typeof loc === 'object' && loc !== null) {
//         return [loc.city, loc.state, loc.country].filter(Boolean).join(', ');
//       }
//       return '';
//     }).filter(Boolean);
//   }
//   // Handle salary (object or string)
//   let salary = rawJob.salary;
//   if (salary && typeof salary === 'object') {
//     if (salary.text) salary = salary.text;
//     else if (salary.min && salary.max) salary = `${salary.min} - ${salary.max}`;
//     else if (salary.min) salary = `${salary.min}`;
//     else if (salary.max) salary = `${salary.max}`;
//     else salary = '';
//   }
//   // Add companyLocations as array of objects if present (nested or dot notation)
//   let companyLocations = [];
//   const rawCompanyLocations = company.locations || rawJob["company.locations"];
//   if (Array.isArray(rawCompanyLocations)) {
//     companyLocations = rawCompanyLocations.filter(loc => typeof loc === 'object' && loc !== null && loc.country);
//   } else if (rawCompanyLocations && typeof rawCompanyLocations === 'object' && rawCompanyLocations.country) {
//     companyLocations = [rawCompanyLocations];
//   }
//   return {
//     id: rawJob.id || rawJob["Job ID"] || rawJob.jobId || rawJob.job_id || '',
//     title: rawJob.title || rawJob["job title"] || rawJob["Job Title"] || rawJob.jobTitle || '',
//     company: getDot('name') || getDot('universalname') || rawJob.company || rawJob.companyName || rawJob["Company"] || rawJob.organization || '',
//     companyLogo: getDot('logo') || getDot('logos') || rawJob.companyLogo || rawJob["Company Logo"] || rawJob.logo || rawJob.organization_logo || '',
//     companyUrl: getDot('linkedinUrl') || getDot('website') || rawJob.companyUrl || rawJob["Company URL"] || rawJob.organization_url || '',
//     companyWebsite: getDot('website') || '',
//     companyEmployeeCount: getDot('employeeCount') || '',
//     companyFollowerCount: getDot('followerCount') || '',
//     companyDescription: getDot('description') || '',
//     companySpecialities: getDot('specialities') || [],
//     companyIndustries: getDot('industries') || [],
//     locations: locations,
//     companyLocations,
//     postedDate: rawJob.postedDate || rawJob.datePosted || rawJob["date posted"] || rawJob["Date Posted"] || rawJob.postedAt || rawJob.date_posted || '',
//     expireAt: rawJob.expireAt || rawJob.validThrough || rawJob["Valid Through"] || '',
//     workplaceType: rawJob.workplaceType || '',
//     descriptionText: rawJob.descriptionText || rawJob.description || rawJob["Job Description"] || rawJob.desc || rawJob.description_text || '',
//     employmentType: rawJob.employmentType || rawJob["Employment Type"] || rawJob.employment_type || rawJob.job_type || '',
//     linkedinUrl: rawJob.linkedinUrl || rawJob.url || rawJob["Job URL"] || rawJob.link || rawJob.job_url || '',
//     easyApplyUrl: rawJob.easyApplyUrl || '',
//     applicants: rawJob.applicants || '',
//     views: rawJob.views || '',
//     jobApplicationLimitReached: rawJob.jobApplicationLimitReached || false,
//     applyMethod: rawJob.applyMethod || {},
//     salary: salary,
//     tier: rawJob.tier || '',
//     // KPIs
//     kpi_jd_quality: rawJob.kpi_jd_quality || '',
//     kpi_domain_fit: rawJob.kpi_domain_fit || '',
//     kpi_seniority_alignment: rawJob.kpi_seniority_alignment || '',
//     kpi_location_priority: rawJob.kpi_location_priority || '',
//     kpi_company_specialties: rawJob.kpi_company_specialties || '',
//     kpi_salary: rawJob.kpi_salary || '',
//     kpi_company_size: rawJob.kpi_company_size || '',
//     kpi_company_popularity: rawJob.kpi_company_popularity || '',
//     kpi_industry_match: rawJob.kpi_industry_match || '',
//     kpi_job_popularity: rawJob.kpi_job_popularity || '',
//     kpi_job_freshness: rawJob.kpi_job_freshness || '',
//     kpi_employment_type: rawJob.kpi_employment_type || '',
//     kpi_contact_info: rawJob.kpi_contact_info || '',
//     kpi_skills_explicitness: rawJob.kpi_skills_explicitness || '',
//     kpi_experience_threshold: rawJob.kpi_experience_threshold || '',
//     final_score: rawJob.final_score || '',
//   };
// } 
// Utility to normalize job data from various APIs to a consistent format
// Add more mappings as you discover new field names from different APIs

export function normalizeJob(rawJob) {
  // Support both nested company object and dot notation fields
  const company = rawJob.company || {};
  // Dot notation fallback
  const getDot = (key) => rawJob[`company.${key}`] || company[key] || '';
  // Handle locations (array of objects or string)
  let locations = getDot('locations') || rawJob.locations || rawJob.location || '';
  if (Array.isArray(locations)) {
    locations = locations.map(loc => {
      if (typeof loc === 'string') return loc;
      if (typeof loc === 'object' && loc !== null) {
        return [loc.city, loc.state, loc.country].filter(Boolean).join(', ');
      }
      return '';
    }).filter(Boolean);
  }
  // Handle salary (object or string)
  let salary = rawJob.salary;
  if (salary && typeof salary === 'object') {
    if (salary.text) salary = salary.text;
    else if (salary.min && salary.max) salary = `${salary.min} - ${salary.max}`;
    else if (salary.min) salary = `${salary.min}`;
    else if (salary.max) salary = `${salary.max}`;
    else salary = '';
  }
  // Add companyLocations as array of objects if present (nested or dot notation)
  let companyLocations = [];
  const rawCompanyLocations = company.locations || rawJob["company.locations"];
  if (Array.isArray(rawCompanyLocations)) {
    companyLocations = rawCompanyLocations.filter(loc => typeof loc === 'object' && loc !== null && loc.country);
  } else if (rawCompanyLocations && typeof rawCompanyLocations === 'object' && rawCompanyLocations.country) {
    companyLocations = [rawCompanyLocations];
  }
  return {
    id: rawJob.id || rawJob["Job ID"] || rawJob.jobId || rawJob.job_id || '',
    title: rawJob.title || rawJob["job title"] || rawJob["Job Title"] || rawJob.jobTitle || '',
    company: getDot('name') || getDot('universalname') || rawJob.company || rawJob.companyName || rawJob["Company"] || rawJob.organization || '',
    companyLogo: getDot('logo') || getDot('logos') || rawJob.companyLogo || rawJob["Company Logo"] || rawJob.logo || rawJob.organization_logo || '',
    companyUrl: getDot('linkedinUrl') || getDot('website') || rawJob.companyUrl || rawJob["Company URL"] || rawJob.organization_url || '',
    companyWebsite: getDot('website') || '',
    companyEmployeeCount: getDot('employeeCount') || '',
    companyFollowerCount: getDot('followerCount') || '',
    companyDescription: getDot('description') || '',
    companySpecialities: getDot('specialities') || [],
    companyIndustries: getDot('industries') || [],
    locations: locations,
    companyLocations,
    postedDate: rawJob.postedDate || rawJob.datePosted || rawJob["date posted"] || rawJob["Date Posted"] || rawJob.postedAt || rawJob.date_posted || '',
    expireAt: rawJob.expireAt || rawJob.validThrough || rawJob["Valid Through"] || '',
    workplaceType: rawJob.workplaceType || '',
    descriptionText: rawJob.descriptionText || rawJob.description || rawJob["Job Description"] || rawJob.desc || rawJob.description_text || '',
    employmentType: rawJob.employmentType || rawJob["Employment Type"] || rawJob.employment_type || rawJob.job_type || '',
    linkedinUrl: rawJob.linkedinUrl || rawJob.url || rawJob["Job URL"] || rawJob.link || rawJob.job_url || '',
    easyApplyUrl: rawJob.easyApplyUrl || '',
    applicants: rawJob.applicants || '',
    views: rawJob.views || '',
    jobApplicationLimitReached: rawJob.jobApplicationLimitReached || false,
    applyMethod: rawJob.applyMethod || {},
    salary: salary,
    tier: rawJob.tier || '',
    status: rawJob.status || '',
    comments: Array.isArray(rawJob.comments) ? rawJob.comments : [],
    // KPIs
    kpi_jd_quality: rawJob.kpi_jd_quality || '',
    kpi_domain_fit: rawJob.kpi_domain_fit || '',
    kpi_seniority_alignment: rawJob.kpi_seniority_alignment || '',
    kpi_location_priority: rawJob.kpi_location_priority || '',
    kpi_company_specialties: rawJob.kpi_company_specialties || '',
    kpi_salary: rawJob.kpi_salary || '',
    kpi_company_size: rawJob.kpi_company_size || '',
    kpi_company_popularity: rawJob.kpi_company_popularity || '',
    kpi_industry_match: rawJob.kpi_industry_match || '',
    kpi_job_popularity: rawJob.kpi_job_popularity || '',
    kpi_job_freshness: rawJob.kpi_job_freshness || '',
    kpi_employment_type: rawJob.kpi_employment_type || '',
    kpi_contact_info: rawJob.kpi_contact_info || '',
    kpi_skills_explicitness: rawJob.kpi_skills_explicitness || '',
    kpi_experience_threshold: rawJob.kpi_experience_threshold || '',
    final_score: rawJob.final_score || '',
    ai_remark: rawJob.ai_remark || '',
    predicted_domain: rawJob.predicted_domain || '',
  };
} 