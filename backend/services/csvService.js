

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const CSV_PATH = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
const CSV_HEADERS = [
  { id: 'Source', title: 'Source' },
  { id: 'CompanyLogo', title: 'Company Logo' },
  { id: 'JobTitle', title: 'Job Title' },
  { id: 'JobDescription', title: 'Job Description' },
  { id: 'SeniorityLevel', title: 'Seniority Level' },
  { id: 'Countries', title: 'Countries' },
  { id: 'LocationType', title: 'Location Type' },
  { id: 'Remote', title: 'Remote' },
  { id: 'Salary', title: 'Salary' },
  { id: 'CompanySize', title: 'Company Size' },
  { id: 'CompanyFollowers', title: 'Company Followers' },
  { id: 'Industry', title: 'Industry' },
  { id: 'CompanySpecialties', title: 'Company Specialties' },
  { id: 'RecruiterName', title: 'Recruiter Name' },
  { id: 'RecruiterURL', title: 'Recruiter URL' },
  { id: 'DatePosted', title: 'Date Posted' },
  { id: 'EmploymentType', title: 'Employment Type' },
  { id: 'Company', title: 'Company' },
  { id: 'JobURL', title: 'Job URL' },
  { id: 'CompanyEmployees', title: 'Company Employees' }
];

// Helper to safely stringify any value
function safeString(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
  return JSON.stringify(val);
}

// Salary formatter for all possible cases
function formatSalary(salary) {
  if (!salary) return '';
  if (typeof salary === 'string') return salary;
  if (typeof salary === 'number') return salary.toString();
  if (typeof salary === 'object') {
    if (salary.value && (salary.value.minValue || salary.value.maxValue)) {
      const min = salary.value.minValue || '';
      const max = salary.value.maxValue || '';
      const currency = salary.currency || '';
      const unit = salary.value.unitText || '';
      return `${currency} ${min}-${max} ${unit}`.trim();
    }
    return JSON.stringify(salary);
  }
  return '';
}

function mapJobTo20Fields(job) {
  return {
    Source: safeString(job.Source || job.source),
    CompanyLogo: safeString(job.CompanyLogo || job.organization_logo),
    JobTitle: safeString(job.JobTitle || job.title),
    JobDescription: safeString(job.JobDescription || job.description_text),
    SeniorityLevel: safeString(job.SeniorityLevel || job.seniority),
    Countries: safeString(job.Countries || (Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '')),
    LocationType: safeString(job.LocationType || job.location_type),
    Remote: safeString(job.Remote || (job.remote_derived ? 'Yes' : 'No')),
    Salary: formatSalary(job.Salary || job.salary_raw),
    CompanySize: safeString(job.CompanySize || job.linkedin_org_size),
    CompanyFollowers: safeString(job.CompanyFollowers || job.linkedin_org_followers),
    Industry: safeString(job.Industry || job.linkedin_org_industry),
    CompanySpecialties: safeString(job.CompanySpecialties || (Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '')),
    RecruiterName: safeString(job.RecruiterName || job.recruiter_name),
    RecruiterURL: safeString(job.RecruiterURL || job.recruiter_url),
    DatePosted: safeString(job.DatePosted || job.date_posted),
    EmploymentType: safeString(job.EmploymentType || (Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type)),
    Company: safeString(job.Company || job.organization),
    JobURL: safeString(job.JobURL || job.url),
    CompanyEmployees: safeString(job.CompanyEmployees || job.linkedin_org_employees)
  };
}

async function writeJobsToCSV(jobs) {
  const csvWriter = createCsvWriter({
    path: CSV_PATH,
    header: CSV_HEADERS
  });
  const data = jobs.map(mapJobTo20Fields);
  await csvWriter.writeRecords(data);
  return CSV_PATH;
}

module.exports = { writeJobsToCSV, mapJobTo20Fields, CSV_PATH };