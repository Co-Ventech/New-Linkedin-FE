const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs-extra');
const CSV_CONFIG = require('../config/csvConfig');
const CSV_HEADERS = require('../utils/csvHeaders');

class CSVService {
  constructor() {
    this.csvWriter = createCsvWriter({
      path: CSV_CONFIG.path,
      header: CSV_HEADERS
    });
  }

  transformJobData(jobs) {
    return jobs.map(job => ({
      id: job.id || '',
      date_posted: job.date_posted || '',
      date_created: job.date_created || '',
      title: job.title || '',
      organization: job.organization || '',
      organization_url: job.organization_url || '',
      date_validthrough: job.date_validthrough || '',
      location_type: job.location_type || '',
      salary_raw: job.salary_raw ? JSON.stringify(job.salary_raw) : '',
      employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
      url: job.url || '',
      source_type: job.source_type || '',
      source: job.source || '',
      source_domain: job.source_domain || '',
      organization_logo: job.organization_logo || '',
      cities_derived: Array.isArray(job.cities_derived) ? job.cities_derived.join(', ') : '',
      regions_derived: Array.isArray(job.regions_derived) ? job.regions_derived.join(', ') : '',
      countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
      locations_derived: Array.isArray(job.locations_derived) ? job.locations_derived.join(', ') : '',
      timezones_derived: Array.isArray(job.timezones_derived) ? job.timezones_derived.join(', ') : '',
      lats_derived: Array.isArray(job.lats_derived) ? job.lats_derived.join(', ') : '',
      lngs_derived: Array.isArray(job.lngs_derived) ? job.lngs_derived.join(', ') : '',
      remote_derived: job.remote_derived || false,
      recruiter_name: job.recruiter_name || '',
      recruiter_title: job.recruiter_title || '',
      recruiter_url: job.recruiter_url || '',
      linkedin_org_employees: job.linkedin_org_employees || '',
      linkedin_org_url: job.linkedin_org_url || '',
      linkedin_org_size: job.linkedin_org_size || '',
      linkedin_org_slogan: job.linkedin_org_slogan || '',
      linkedin_org_industry: job.linkedin_org_industry || '',
      linkedin_org_followers: job.linkedin_org_followers || '',
      linkedin_org_headquarters: job.linkedin_org_headquarters || '',
      linkedin_org_type: job.linkedin_org_type || '',
      linkedin_org_foundeddate: job.linkedin_org_foundeddate || '',
      linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
      linkedin_org_locations: Array.isArray(job.linkedin_org_locations) ? job.linkedin_org_locations.join(', ') : '',
      linkedin_org_description: job.linkedin_org_description ? job.linkedin_org_description.replace(/\n/g, ' ').replace(/"/g, '""') : '',
      linkedin_org_recruitment_agency_derived: job.linkedin_org_recruitment_agency_derived || false,
      seniority: job.seniority || '',
      directapply: job.directapply || false,
      linkedin_org_slug: job.linkedin_org_slug || '',
      no_jb_schema: job.no_jb_schema || '',
      external_apply_url: job.external_apply_url || '',
      description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""') : '',
      locations_raw: job.locations_raw ? JSON.stringify(job.locations_raw) : '',
      location_requirements_raw: job.location_requirements_raw ? JSON.stringify(job.location_requirements_raw) : ''
    }));
  }

  async createCSVFile(jobs) {
    if (jobs.length === 0) return false;

    try {
      // Delete old CSV file if exists
      if (await fs.pathExists(CSV_CONFIG.path)) {
        await fs.remove(CSV_CONFIG.path);
        console.log('🗑️ Old CSV file deleted');
      }

      // Transform and write new CSV
      const csvData = this.transformJobData(jobs);
      await this.csvWriter.writeRecords(csvData);
      console.log(`✅ Complete CSV file saved with ${jobs.length} jobs and ALL fields`);
      return true;
    } catch (error) {
      console.error('❌ CSV Creation Error:', error);
      throw new Error(`CSV Creation Error: ${error.message}`);
    }
  }

  csvExists() {
    return fs.existsSync(CSV_CONFIG.path);
  }

  getCSVPath() {
    return CSV_CONFIG.path;
  }

  getCSVFilename() {
    return CSV_CONFIG.filename;
  }
}
const createSpecificFieldsCSV = async (jobs) => {
  try {
    const specificCsvPath = path.join(__dirname, '../', 'linkedin_jobs_specific.csv');

    const specificCsvWriter = createCsvWriter({
      path: specificCsvPath,
      header: [
        { id: 'source', title: 'Source' },
        { id: 'organization_logo', title: 'Company Logo' },
        { id: 'title', title: 'Job Title' },
        { id: 'description_text', title: 'Job Description' },
        { id: 'seniority', title: 'Seniority Level' },
        { id: 'countries_derived', title: 'Countries' },
        { id: 'location_type', title: 'Location Type' },
        { id: 'remote_derived', title: 'Remote' },
        { id: 'salary_raw', title: 'Salary' },
        { id: 'linkedin_org_size', title: 'Company Size' },
        { id: 'linkedin_org_followers', title: 'Company Followers' },
        { id: 'linkedin_org_industry', title: 'Industry' },
        { id: 'linkedin_org_specialties', title: 'Company Specialties' },
        { id: 'recruiter_name', title: 'Recruiter Name' },
        { id: 'recruiter_url', title: 'Recruiter URL' },
        { id: 'date_posted', title: 'Date Posted' },
        { id: 'employment_type', title: 'Employment Type' },
        { id: 'organization', title: 'Company' },
        { id: 'url', title: 'Job URL' },
        { id: 'linkedin_org_employees', title: 'Company Employees' }
      ]
    });

    // Transform data for specific fields
    const specificData = jobs.map(job => ({
      source: job.source || '',
      organization_logo: job.organization_logo || '',
      title: job.title || '',
      description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""') : '',
      seniority: job.seniority || '',
      countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
      location_type: job.location_type || '',
      remote_derived: job.remote_derived ? 'Yes' : 'No',
      salary_raw: job.salary_raw ? this.formatSalary(job.salary_raw) : '',
      linkedin_org_size: job.linkedin_org_size || '',
      linkedin_org_followers: job.linkedin_org_followers || '',
      linkedin_org_industry: job.linkedin_org_industry || '',
      linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
      recruiter_name: job.recruiter_name || '',
      recruiter_url: job.recruiter_url || '',
      date_posted: job.date_posted || '',
      employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
      organization: job.organization || '',
      url: job.url || '',
      linkedin_org_employees: job.linkedin_org_employees || ''
    }));

    // Delete old file if exists
    if (await fs.pathExists(specificCsvPath)) {
      await fs.remove(specificCsvPath);
    }

    // Write new CSV
    await specificCsvWriter.writeRecords(specificData);
    console.log(`✅ Specific fields CSV created with ${jobs.length} jobs`);
    
    return specificCsvPath;

  } catch (error) {
    console.error('❌ Specific CSV creation error:', error);
    throw error;
  }
};
module.exports = new CSVService();
module.exports = {
  createSpecificFieldsCSV
};
