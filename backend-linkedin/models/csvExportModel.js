const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs-extra');
const path = require('path');

const CSV_FILENAME = 'linkedin_jobs_export.csv';
const CSV_PATH = path.join(__dirname, '../exports/', CSV_FILENAME);

// Ensure exports directory exists
const ensureExportsDir = async () => {
  const exportsDir = path.dirname(CSV_PATH);
  await fs.ensureDir(exportsDir);
};

const csvWriter = createCsvWriter({
  path: CSV_PATH,
  header: [
    { id: 'id', title: 'Job ID' },
    { id: 'title', title: 'Job Title' },
    { id: 'company', title: 'Company' },
    { id: 'location', title: 'Location' },
    { id: 'employment_type', title: 'Employment Type' },
    { id: 'remote', title: 'Remote' },
    { id: 'date_posted', title: 'Date Posted' },
    { id: 'salary', title: 'Salary' },
    { id: 'description', title: 'Description' },
    { id: 'url', title: 'Job URL' }
  ]
});

const transformJobsForCSV = (jobs) => {
  return jobs.map(job => ({
    id: job.id || '',
    title: job.title || '',
    company: job.organization || job.company || '',
    location: job.locations_derived ? job.locations_derived.join(', ') : job.location || '',
    employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
    remote: job.remote_derived || job.remote || false,
    date_posted: job.date_posted || '',
    salary: job.salary_raw ? `${job.salary_raw.currency || ''}${job.salary_raw.value?.minValue || ''}-${job.salary_raw.value?.maxValue || ''}` : '',
    description: job.description_text ? job.description_text.substring(0, 500) : '',
    url: job.url || ''
  }));
};

const exportJobsToCSV = async (jobs) => {
  try {
    await ensureExportsDir();
    
    // Remove old CSV if exists
    if (await fs.pathExists(CSV_PATH)) {
      await fs.remove(CSV_PATH);
    }

    const csvData = transformJobsForCSV(jobs);
    await csvWriter.writeRecords(csvData);
    
    return {
      filename: CSV_FILENAME,
      path: CSV_PATH,
      totalExported: jobs.length
    };
  } catch (error) {
    throw new Error(`CSV Export Error: ${error.message}`);
  }
};

const getCSVFilePath = () => CSV_PATH;
const getCSVFileName = () => CSV_FILENAME;
const csvExists = () => fs.existsSync(CSV_PATH);

module.exports = {
  exportJobsToCSV,
  getCSVFilePath,
  getCSVFileName,
  csvExists
};
