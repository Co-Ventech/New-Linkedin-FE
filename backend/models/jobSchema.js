// const mongoose = require('mongoose');

// const jobSchema = new mongoose.Schema({
//   // User reference
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
  
//   // Job identification
//   jobId: {
//     type: String,
//     required: true,
//     // unique: true,
//     // index: true
//   },
  
//   // Basic job information
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   organization: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   organization_url: {
//     type: String,
//     trim: true
//   },
  
//   // Dates
//   date_posted: {
//     type: Date
//   },
//   date_created: {
//     type: Date
//   },
//   date_validthrough: {
//     type: Date
//   },
  
//   // Location information
//   location_type: {
//     type: String,
//     enum: ['TELECOMMUTE', 'ON_SITE', 'HYBRID']
//   },
//   locations_derived: [{
//     type: String,
//     trim: true
//   }],
//   cities_derived: [{
//     type: String,
//     trim: true
//   }],
//   regions_derived: [{
//     type: String,
//     trim: true
//   }],
//   countries_derived: [{
//     type: String,
//     trim: true
//   }],
//   timezones_derived: [{
//     type: String
//   }],
//   lats_derived: [{
//     type: Number
//   }],
//   lngs_derived: [{
//     type: Number
//   }],
  
//   // Salary information
//   salary_raw: {
//     currency: {
//       type: String,
//       trim: true
//     },
//     value: {
//       minValue: {
//         type: Number
//       },
//       maxValue: {
//         type: Number
//       },
//       unitText: {
//         type: String,
//         enum: ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']
//       }
//     }
//   },
  
//   // Employment details
//   employment_type: [{
//     type: String,
//     enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERN', 'VOLUNTEER', 'CONTRACTOR']
//   }],
//   seniority: {
//     type: String,
//     enum: ['Internship', 'Entry level', 'Associate', 'Mid-Senior level', 'Director', 'Executive']
//   },
//   remote_derived: {
//     type: Boolean,
//     default: false
//   },
  
//   // URLs and links
//   url: {
//     type: String,
//     trim: true
//   },
//   external_apply_url: {
//     type: String,
//     trim: true
//   },
  
//   // Source information
//   source_type: {
//     type: String,
//     default: 'jobboard'
//   },
//   source: {
//     type: String,
//     default: 'linkedin'
//   },
//   source_domain: {
//     type: String,
//     trim: true
//   },
  
//   // Company information
//   organization_logo: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_employees: {
//     type: Number
//   },
//   linkedin_org_url: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_size: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_slogan: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_industry: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_followers: {
//     type: Number
//   },
//   linkedin_org_headquarters: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_type: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_foundeddate: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_specialties: [{
//     type: String,
//     trim: true
//   }],
//   linkedin_org_locations: [{
//     type: String,
//     trim: true
//   }],
//   linkedin_org_description: {
//     type: String,
//     trim: true
//   },
//   linkedin_org_recruitment_agency_derived: {
//     type: Boolean,
//     default: false
//   },
//   linkedin_org_slug: {
//     type: String,
//     trim: true
//   },
  
//   // Recruiter information
//   recruiter_name: {
//     type: String,
//     trim: true
//   },
//   recruiter_title: {
//     type: String,
//     trim: true
//   },
//   recruiter_url: {
//     type: String,
//     trim: true
//   },
  
//   // Job description
//   description_text: {
//     type: String,
//     trim: true
//   },
  
//   // Application details
//   directapply: {
//     type: Boolean,
//     default: false
//   },
  
//   // Raw data (for complex nested objects)
//   locations_raw: {
//     type: mongoose.Schema.Types.Mixed
//   },
//   location_requirements_raw: {
//     type: mongoose.Schema.Types.Mixed
//   },
  
//   // Additional fields
//   no_jb_schema: {
//     type: mongoose.Schema.Types.Mixed
//   },
  
//   // User interaction tracking
//   isBookmarked: {
//     type: Boolean,
//     default: false
//   },
//   isApplied: {
//     type: Boolean,
//     default: false
//   },
//   notes: {
//     type: String,
//     trim: true
//   }
// }, {
//   timestamps: true, // Adds createdAt and updatedAt
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for better query performance
// jobSchema.index({ jobId: 1, userId: 1 }, { unique: true });
// jobSchema.index({ jobId: 1 });
// jobSchema.index({ organization: 1 });
// jobSchema.index({ 'locations_derived': 1 });
// jobSchema.index({ employment_type: 1 });
// jobSchema.index({ remote_derived: 1 });
// jobSchema.index({ date_posted: -1 });

// // Virtual for formatted salary
// jobSchema.virtual('formattedSalary').get(function() {
//   if (!this.salary_raw?.value) return 'Not specified';
  
//   const { minValue, maxValue, unitText } = this.salary_raw.value;
//   const currency = this.salary_raw.currency || '';
  
//   if (minValue && maxValue) {
//     return `${currency}${minValue.toLocaleString()}-${maxValue.toLocaleString()}/${unitText || 'year'}`;
//   }
//   if (minValue) {
//     return `${currency}${minValue.toLocaleString()}+/${unitText || 'year'}`;
//   }
//   return 'Not specified';
// });

// // Static method to find jobs by user
// jobSchema.statics.findByUser = function(userId, options = {}) {
//   const { limit = 1, skip = 0, sort = { createdAt: -1 } } = options;
//   return this.find({ userId })
//     .sort(sort)
//     .limit(limit)
//     .skip(skip)
//     .populate('userId', 'username email');
// };

// // Instance method to mark as applied
// jobSchema.methods.markAsApplied = function() {
//   this.isApplied = true;
//   return this.save();
// };

// // Instance method to bookmark job
// jobSchema.methods.toggleBookmark = function() {
//   this.isBookmarked = !this.isBookmarked;
//   return this.save();
// };

// module.exports = mongoose.model('Job', jobSchema);
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Job identification
  jobId: {
    type: String,
    required: true
  },
  
  // Basic job information
  title: {
    type: String,
    required: true,
    default: ''
  },
  organization: {
    type: String,
    required: true,
    default: ''
  },
  organization_url: {
    type: String,
    default: ''
  },
  
  // Dates
  date_posted: {
    type: Date,
    default: null
  },
  date_created: {
    type: Date,
    default: null
  },
  date_validthrough: {
    type: Date,
    default: null
  },
  
  // Location information - NO ENUMS, flexible strings
  location_type: {
    type: String,
    default: ''
  },
  locations_derived: {
    type: [String],
    default: []
  },
  cities_derived: {
    type: [String],
    default: []
  },
  regions_derived: {
    type: [String],
    default: []
  },
  countries_derived: {
    type: [String],
    default: []
  },
  timezones_derived: {
    type: [String],
    default: []
  },
  lats_derived: {
    type: [Number],
    default: []
  },
  lngs_derived: {
    type: [Number],
    default: []
  },
  
  // Salary information - flexible mixed type
  salary_raw: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Employment details - NO ENUMS, flexible
  employment_type: {
    type: [String],
    default: []
  },
  seniority: {
    type: String,
    default: ''
  },
  remote_derived: {
    type: Boolean,
    default: false
  },
  
  // URLs and links
  url: {
    type: String,
    default: ''
  },
  external_apply_url: {
    type: String,
    default: ''
  },
  
  // Source information
  source_type: {
    type: String,
    default: 'jobboard'
  },
  source: {
    type: String,
    default: 'linkedin'
  },
  source_domain: {
    type: String,
    default: ''
  },
  
  // Company information
  organization_logo: {
    type: String,
    default: ''
  },
  linkedin_org_employees: {
    type: Number,
    default: null
  },
  linkedin_org_url: {
    type: String,
    default: ''
  },
  linkedin_org_size: {
    type: String,
    default: ''
  },
  linkedin_org_slogan: {
    type: String,
    default: ''
  },
  linkedin_org_industry: {
    type: String,
    default: ''
  },
  linkedin_org_followers: {
    type: Number,
    default: null
  },
  linkedin_org_headquarters: {
    type: String,
    default: ''
  },
  linkedin_org_type: {
    type: String,
    default: ''
  },
  linkedin_org_foundeddate: {
    type: String,
    default: ''
  },
  linkedin_org_specialties: {
    type: [String],
    default: []
  },
  linkedin_org_locations: {
    type: [String],
    default: []
  },
  linkedin_org_description: {
    type: String,
    default: ''
  },
  linkedin_org_recruitment_agency_derived: {
    type: Boolean,
    default: false
  },
  linkedin_org_slug: {
    type: String,
    default: ''
  },
  
  // Recruiter information
  recruiter_name: {
    type: String,
    default: ''
  },
  recruiter_title: {
    type: String,
    default: ''
  },
  recruiter_url: {
    type: String,
    default: ''
  },
  
  // Job description
  description_text: {
    type: String,
    default: ''
  },
  
  // Application details
  directapply: {
    type: Boolean,
    default: false
  },
  
  // Raw data (for complex nested objects)
  locations_raw: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  location_requirements_raw: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Additional fields
  no_jb_schema: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // User interaction tracking
  isBookmarked: {
    type: Boolean,
    default: false
  },
  isApplied: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobSchema.index({ userId: 1, createdAt: -1 });
jobSchema.index({ jobId: 1, userId: 1 }, { unique: true }); // Compound unique index
jobSchema.index({ organization: 1 });
jobSchema.index({ 'locations_derived': 1 });
jobSchema.index({ employment_type: 1 });
jobSchema.index({ remote_derived: 1 });
jobSchema.index({ date_posted: -1 });

// Virtual for formatted salary
jobSchema.virtual('formattedSalary').get(function() {
  if (!this.salary_raw?.value) return 'Not specified';
  
  const { minValue, maxValue, unitText } = this.salary_raw.value;
  const currency = this.salary_raw.currency || '';
  
  if (minValue && maxValue) {
    return `${currency}${minValue.toLocaleString()}-${maxValue.toLocaleString()}/${unitText || 'year'}`;
  }
  if (minValue) {
    return `${currency}${minValue.toLocaleString()}+/${unitText || 'year'}`;
  }
  return 'Not specified';
});

// Static method to find jobs by user
jobSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 20, skip = 0, sort = { createdAt: -1 } } = options;
  return this.find({ userId })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate('userId', 'username email');
};

// Instance method to mark as applied
jobSchema.methods.markAsApplied = function() {
  this.isApplied = true;
  return this.save();
};

// Instance method to bookmark job
jobSchema.methods.toggleBookmark = function() {
  this.isBookmarked = !this.isBookmarked;
  return this.save();
};

// Pre-save middleware to handle data cleaning
jobSchema.pre('save', function(next) {
  // Ensure arrays are actually arrays
  const arrayFields = [
    'locations_derived', 'cities_derived', 'regions_derived', 
    'countries_derived', 'timezones_derived', 'lats_derived', 
    'lngs_derived', 'employment_type', 'linkedin_org_specialties', 
    'linkedin_org_locations'
  ];
  
  arrayFields.forEach(field => {
    if (this[field] && !Array.isArray(this[field])) {
      this[field] = [];
    }
  });
  
  // Ensure strings are actually strings
  const stringFields = [
    'title', 'organization', 'organization_url', 'location_type',
    'seniority', 'url', 'external_apply_url', 'source_type', 'source',
    'source_domain', 'organization_logo', 'linkedin_org_url',
    'linkedin_org_size', 'linkedin_org_slogan', 'linkedin_org_industry',
    'linkedin_org_headquarters', 'linkedin_org_type', 'linkedin_org_foundeddate',
    'linkedin_org_description', 'linkedin_org_slug', 'recruiter_name',
    'recruiter_title', 'recruiter_url', 'description_text', 'notes'
  ];
  
  stringFields.forEach(field => {
    if (this[field] && typeof this[field] !== 'string') {
      this[field] = String(this[field]);
    }
  });
  
  next();
});

module.exports = mongoose.model('Job', jobSchema);
