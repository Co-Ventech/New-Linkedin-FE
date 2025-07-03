const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs-extra');
const path = require('path');

const CSV_FILENAME = 'linkedin_jobs_data.csv';
const CSV_PATH = path.join(__dirname, '../', CSV_FILENAME);

const csvWriter = createCsvWriter({
  path: CSV_PATH,
  header: [
    { id: 'id', title: 'Job ID' },
    { id: 'date_posted', title: 'Date Posted' },
    { id: 'title', title: 'Job Title' },
    { id: 'organization', title: 'Company' },
    { id: 'location', title: 'Location' },
    { id: 'salary_min', title: 'Salary Min' },
    { id: 'salary_max', title: 'Salary Max' },
    { id: 'currency', title: 'Currency' },
    { id: 'employment_type', title: 'Employment Type' },
    { id: 'remote_derived', title: 'Remote' },
    { id: 'url', title: 'Job URL' },
    { id: 'recruiter_name', title: 'Recruiter' },
    { id: 'seniority', title: 'Seniority Level' },
    { id: 'linkedin_org_industry', title: 'Industry' },
    { id: 'linkedin_org_size', title: 'Company Size' },
    { id: 'description_text', title: 'Description' }
  ]
});

const transformJobData = (jobs) => {
  return jobs.map(job => ({
    id: job.id || '',
    date_posted: job.date_posted || '',
    title: job.title || '',
    organization: job.organization || '',
    location: job.locations_derived ? job.locations_derived.join(', ') : '',
    salary_min: job.salary_raw?.value?.minValue || '',
    salary_max: job.salary_raw?.value?.maxValue || '',
    currency: job.salary_raw?.currency || '',
    employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
    remote_derived: job.remote_derived || false,
    url: job.url || '',
    recruiter_name: job.recruiter_name || '',
    seniority: job.seniority || '',
    linkedin_org_industry: job.linkedin_org_industry || '',
    linkedin_org_size: job.linkedin_org_size || '',
    description_text: job.description_text ? job.description_text.substring(0, 500) : ''
  }));
};

const saveJobsToCSV = async (jobs) => {
  // Delete old CSV file if exists
  if (await fs.pathExists(CSV_PATH)) {
    await fs.remove(CSV_PATH);
    console.log('🗑️ Old CSV file deleted');
  }

  // Transform and write CSV
  const csvData = transformJobData(jobs);
  await csvWriter.writeRecords(csvData);
  
  return {
    filename: CSV_FILENAME,
    path: CSV_PATH,
    totalJobs: jobs.length
  };
};

const checkCSVExists = () => {
  return fs.existsSync(CSV_PATH);
};

const getCSVPath = () => {
  return CSV_PATH;
};

const getCSVFilename = () => {
  return CSV_FILENAME;
};

module.exports = {
  saveJobsToCSV,
  checkCSVExists,
  getCSVPath,
  getCSVFilename
};
