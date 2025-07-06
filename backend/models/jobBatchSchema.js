const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  Source: { type: String, default: '' },
  CompanyLogo: { type: String, default: '' },
  JobTitle: { type: String, default: '' },
  JobDescription: { type: String, default: '' },
  SeniorityLevel: { type: String, default: '' },
  Countries: { type: String, default: '' },
  LocationType: { type: String, default: '' },
  Remote: { type: String, default: '' },
  Salary: { type: String, default: '' },
  CompanySize: { type: String, default: '' },
  CompanyFollowers: { type: String, default: '' },
  Industry: { type: String, default: '' },
  CompanySpecialties: { type: String, default: '' },
  RecruiterName: { type: String, default: '' },
  RecruiterURL: { type: String, default: '' },
  DatePosted: { type: String, default: '' },
  EmploymentType: { type: String, default: '' },
  Company: { type: String, default: '' },
  JobURL: { type: String, default: '' },
  CompanyEmployees: { type: String, default: '' }
}, { _id: false });

const jobBatchSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  jobs: [jobSchema]
});

module.exports = mongoose.model('JobBatch', jobBatchSchema);