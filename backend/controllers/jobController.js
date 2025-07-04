  
// // // // // const jobModel = require('../models/jobModel');
// // // // // const csvService = require('../services/csvService');

// // // // // class JobController {
// // // // //   async searchJobs(req, res, next) {
// // // // //     try {
// // // // //       const searchParams = req.body;
      
// // // // //       const jobs = await jobModel.searchJobs(searchParams);
// // // // //       await csvService.createCSVFile(jobs);

// // // // //       res.json({
// // // // //         success: true,
// // // // //         jobs: jobs,
// // // // //         totalJobs: jobs.length,
// // // // //         searchParams: searchParams,
// // // // //         csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
// // // // //         message: `Saved ${jobs.length} jobs with complete data to CSV`
// // // // //       });

// // // // //     } catch (error) {
// // // // //       next(error);
// // // // //     }
// // // // //   }

// // // // //   async autoDownloadCSV(req, res, next) {
// // // // //     try {
// // // // //       console.log("🚀 GET API triggered - Auto fetching jobs and preparing CSV download");

// // // // //       const searchParams = req.query;
      
// // // // //       // Step 1: Fetch jobs
// // // // //       const jobs = await jobModel.searchJobs(searchParams);

// // // // //       if (jobs.length === 0) {
// // // // //         return res.status(404).json({
// // // // //           success: false,
// // // // //           message: 'No jobs found with current search criteria'
// // // // //         });
// // // // //       }

// // // // //       // Step 2: Create CSV file
// // // // //       const csvCreated = await csvService.createCSVFile(jobs);

// // // // //       if (!csvCreated) {
// // // // //         return res.status(500).json({
// // // // //           success: false,
// // // // //           message: 'Failed to create CSV file'
// // // // //         });
// // // // //       }

// // // // //       // Step 3: Send CSV file for download
// // // // //       if (csvService.csvExists()) {
// // // // //         console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
// // // // //         res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
// // // // //           if (err) {
// // // // //             console.error('❌ Download error:', err);
// // // // //             next(err);
// // // // //           } else {
// // // // //             console.log('✅ CSV file downloaded successfully');
// // // // //           }
// // // // //         });
// // // // //       } else {
// // // // //         res.status(404).json({ 
// // // // //           success: false, 
// // // // //           message: 'CSV file not found after creation' 
// // // // //         });
// // // // //       }

// // // // //     } catch (error) {
// // // // //       next(error);
// // // // //     }
// // // // //   }

// // // // //   healthCheck(req, res) {
// // // // //     res.json({ 
// // // // //       message: "LinkedIn Job Search API is running!",
// // // // //       endpoints: {
// // // // //         "POST /api/jobs": "Search jobs and create CSV",
// // // // //         "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
// // // // //         "GET /api/download-csv": "Download existing CSV file"
// // // // //       }
// // // // //     });
// // // // //   }
// // // // // }

// // // // // module.exports = new JobController();
// // // // const jobModel = require('../models/jobModel');
// // // // const csvService = require('../services/csvService');
// // // // const Job = require('../models/jobSchema');

// // // // class JobController {
// // // //   async searchJobs(req, res, next) {
// // // //     try {
// // // //       const searchParams = req.body;
// // // //       const userId = req.user.id; // Get user ID from auth middleware
      
// // // //       const jobs = await jobModel.searchJobs(searchParams);
// // // //       await csvService.createCSVFile(jobs);

// // // //       // Auto-save jobs to database
// // // //       if (jobs.length > 0) {
// // // //         await this.saveJobsToDatabase(jobs, userId);
// // // //       }

// // // //       res.json({
// // // //         success: true,
// // // //         jobs: jobs,
// // // //         totalJobs: jobs.length,
// // // //         searchParams: searchParams,
// // // //         csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
// // // //         message: `Saved ${jobs.length} jobs with complete data to CSV and database`
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   async autoDownloadCSV(req, res, next) {
// // // //     try {
// // // //       console.log("🚀 GET API triggered - Auto fetching jobs and preparing CSV download");

// // // //       const searchParams = req.query;
// // // //       const userId = req.user.id;
      
// // // //       // Step 1: Fetch jobs
// // // //       const jobs = await jobModel.searchJobs(searchParams);

// // // //       if (jobs.length === 0) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'No jobs found with current search criteria'
// // // //         });
// // // //       }

// // // //       // Step 2: Create CSV file
// // // //       const csvCreated = await csvService.createCSVFile(jobs);

// // // //       if (!csvCreated) {
// // // //         return res.status(500).json({
// // // //           success: false,
// // // //           message: 'Failed to create CSV file'
// // // //         });
// // // //       }

// // // //       // Step 3: Auto-save to database
// // // //       await this.saveJobsToDatabase(jobs, userId);

// // // //       // Step 4: Send CSV file for download
// // // //       if (csvService.csvExists()) {
// // // //         console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
// // // //         res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
// // // //           if (err) {
// // // //             console.error('❌ Download error:', err);
// // // //             next(err);
// // // //           } else {
// // // //             console.log('✅ CSV file downloaded successfully');
// // // //           }
// // // //         });
// // // //       } else {
// // // //         res.status(404).json({ 
// // // //           success: false, 
// // // //           message: 'CSV file not found after creation' 
// // // //         });
// // // //       }

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // NEW METHOD: Save jobs to database
// // // //   async saveJobsToDatabase(jobs, userId) {
// // // //     try {
// // // //       const savedJobs = [];
      
// // // //       for (const jobData of jobs) {
// // // //         try {
// // // //           // Check if job already exists for this user
// // // //           const existingJob = await Job.findOne({ 
// // // //             jobId: jobData.id, 
// // // //             userId 
// // // //           });

// // // //           if (!existingJob) {
// // // //             const newJob = new Job({
// // // //               userId,
// // // //               jobId: jobData.id,
// // // //               title: jobData.title,
// // // //               organization: jobData.organization,
// // // //               organization_url: jobData.organization_url,
// // // //               date_posted: jobData.date_posted,
// // // //               date_created: jobData.date_created,
// // // //               date_validthrough: jobData.date_validthrough,
// // // //               location_type: jobData.location_type,
// // // //               locations_derived: jobData.locations_derived,
// // // //               cities_derived: jobData.cities_derived,
// // // //               regions_derived: jobData.regions_derived,
// // // //               countries_derived: jobData.countries_derived,
// // // //               timezones_derived: jobData.timezones_derived,
// // // //               lats_derived: jobData.lats_derived,
// // // //               lngs_derived: jobData.lngs_derived,
// // // //               salary_raw: jobData.salary_raw,
// // // //               employment_type: jobData.employment_type,
// // // //               seniority: jobData.seniority,
// // // //               remote_derived: jobData.remote_derived,
// // // //               url: jobData.url,
// // // //               external_apply_url: jobData.external_apply_url,
// // // //               source_type: jobData.source_type,
// // // //               source: jobData.source,
// // // //               source_domain: jobData.source_domain,
// // // //               organization_logo: jobData.organization_logo,
// // // //               linkedin_org_employees: jobData.linkedin_org_employees,
// // // //               linkedin_org_url: jobData.linkedin_org_url,
// // // //               linkedin_org_size: jobData.linkedin_org_size,
// // // //               linkedin_org_slogan: jobData.linkedin_org_slogan,
// // // //               linkedin_org_industry: jobData.linkedin_org_industry,
// // // //               linkedin_org_followers: jobData.linkedin_org_followers,
// // // //               linkedin_org_headquarters: jobData.linkedin_org_headquarters,
// // // //               linkedin_org_type: jobData.linkedin_org_type,
// // // //               linkedin_org_foundeddate: jobData.linkedin_org_foundeddate,
// // // //               linkedin_org_specialties: jobData.linkedin_org_specialties,
// // // //               linkedin_org_locations: jobData.linkedin_org_locations,
// // // //               linkedin_org_description: jobData.linkedin_org_description,
// // // //               linkedin_org_recruitment_agency_derived: jobData.linkedin_org_recruitment_agency_derived,
// // // //               linkedin_org_slug: jobData.linkedin_org_slug,
// // // //               recruiter_name: jobData.recruiter_name,
// // // //               recruiter_title: jobData.recruiter_title,
// // // //               recruiter_url: jobData.recruiter_url,
// // // //               description_text: jobData.description_text,
// // // //               directapply: jobData.directapply,
// // // //               locations_raw: jobData.locations_raw,
// // // //               location_requirements_raw: jobData.location_requirements_raw,
// // // //               no_jb_schema: jobData.no_jb_schema
// // // //             });

// // // //             const savedJob = await newJob.save();
// // // //             savedJobs.push(savedJob);
// // // //           }
// // // //         } catch (error) {
// // // //           console.error(`Error saving job ${jobData.id}:`, error.message);
// // // //         }
// // // //       }

// // // //       console.log(`💾 Saved ${savedJobs.length} new jobs to database`);
// // // //       return savedJobs;

// // // //     } catch (error) {
// // // //       console.error('Database save error:', error.message);
// // // //       throw error;
// // // //     }
// // // //   }

// // // //   // NEW METHOD: Get saved jobs for user
// // // //   async getSavedJobs(req, res, next) {
// // // //     try {
// // // //       const userId = req.user.id;
// // // //       const { page = 1, limit = 1, search, location, remote } = req.query;
      
// // // //       const skip = (page - 1) * limit;
      
// // // //       // Build query
// // // //       const query = { userId };
      
// // // //       if (search) {
// // // //         query.$or = [
// // // //           { title: { $regex: search, $options: 'i' } },
// // // //           { organization: { $regex: search, $options: 'i' } },
// // // //           { description_text: { $regex: search, $options: 'i' } }
// // // //         ];
// // // //       }
      
// // // //       if (location) {
// // // //         query.locations_derived = { $regex: location, $options: 'i' };
// // // //       }
      
// // // //       if (remote !== undefined) {
// // // //         query.remote_derived = remote === 'true';
// // // //       }

// // // //       const jobs = await Job.find(query)
// // // //         .sort({ createdAt: -1 })
// // // //         .limit(parseInt(limit))
// // // //         .skip(skip)
// // // //         .populate('userId', 'username email');

// // // //       const total = await Job.countDocuments(query);

// // // //       res.json({
// // // //         success: true,
// // // //         jobs,
// // // //         pagination: {
// // // //           current: parseInt(page),
// // // //           total: Math.ceil(total / limit),
// // // //           count: jobs.length,
// // // //           totalJobs: total
// // // //         }
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // NEW METHOD: Delete saved job
// // // //   async deleteSavedJob(req, res, next) {
// // // //     try {
// // // //       const { jobId } = req.params;
// // // //       const userId = req.user.id;

// // // //       const deletedJob = await Job.findOneAndDelete({ 
// // // //         jobId, 
// // // //         userId 
// // // //       });

// // // //       if (!deletedJob) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'Job not found'
// // // //         });
// // // //       }

// // // //       res.json({
// // // //         success: true,
// // // //         message: 'Job deleted successfully'
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // NEW METHOD: Clear all saved jobs for user
// // // //   async clearAllSavedJobs(req, res, next) {
// // // //     try {
// // // //       const userId = req.user.id;

// // // //       const result = await Job.deleteMany({ userId });

// // // //       res.json({
// // // //         success: true,
// // // //         message: `Cleared ${result.deletedCount} saved jobs`,
// // // //         deletedCount: result.deletedCount
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // NEW METHOD: Bookmark/Unbookmark job
// // // //   async toggleBookmark(req, res, next) {
// // // //     try {
// // // //       const { jobId } = req.params;
// // // //       const userId = req.user.id;

// // // //       const job = await Job.findOne({ jobId, userId });

// // // //       if (!job) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'Job not found'
// // // //         });
// // // //       }

// // // //       job.isBookmarked = !job.isBookmarked;
// // // //       await job.save();

// // // //       res.json({
// // // //         success: true,
// // // //         message: job.isBookmarked ? 'Job bookmarked' : 'Job unbookmarked',
// // // //         isBookmarked: job.isBookmarked
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // NEW METHOD: Mark job as applied
// // // //   async markAsApplied(req, res, next) {
// // // //     try {
// // // //       const { jobId } = req.params;
// // // //       const userId = req.user.id;

// // // //       const job = await Job.findOne({ jobId, userId });

// // // //       if (!job) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'Job not found'
// // // //         });
// // // //       }

// // // //       job.isApplied = true;
// // // //       await job.save();

// // // //       res.json({
// // // //         success: true,
// // // //         message: 'Job marked as applied',
// // // //         isApplied: job.isApplied
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   healthCheck(req, res) {
// // // //     res.json({ 
// // // //       message: "LinkedIn Job Search API is running!",
// // // //       endpoints: {
// // // //         "POST /api/jobs": "Search jobs and create CSV",
// // // //         "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
// // // //         "GET /api/download-csv": "Download existing CSV file",
// // // //         "GET /api/saved-jobs": "Get saved jobs for user",
// // // //         "DELETE /api/saved-jobs/:jobId": "Delete specific saved job",
// // // //         "DELETE /api/saved-jobs": "Clear all saved jobs",
// // // //         "PUT /api/saved-jobs/:jobId/bookmark": "Toggle bookmark",
// // // //         "PUT /api/saved-jobs/:jobId/applied": "Mark as applied"
// // // //       }
// // // //     });
// // // //   }
// // // // }

// // // // module.exports = new JobController();
// // // // const { default: mongoose } = require('mongoose');
// // // // const jobModel = require('../models/jobModel');
// // // // const csvService = require('../services/csvService');

// // // // class JobController {

// // // // //   async saveJobs(req, res, next) {
// // // // //   try {
// // // // //     console.log('💾 Save jobs endpoint hit');
// // // // //     console.log('Request headers:', req.headers);
// // // // //     console.log('Request body keys:', Object.keys(req.body));
// // // // //     console.log('Jobs count:', req.body.jobs?.length);
// // // // //     console.log('User ID:', req.body.userId);

// // // // //     const { jobs, userId } = req.body;

// // // // //     if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
// // // // //       console.log('❌ No jobs provided');
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'No jobs provided or invalid format'
// // // // //       });
// // // // //     }

// // // // //     if (!userId) {
// // // // //       console.log('❌ No userId provided');
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'User ID is required'
// // // // //       });
// // // // //     }

// // // // //     // Validate userId format
// // // // //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// // // // //       console.log('❌ Invalid userId format:', userId);
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: 'Invalid user ID format'
// // // // //       });
// // // // //     }

// // // // //     console.log('✅ Starting database save operation...');
// // // // //     const result = await this.saveJobsToDatabase(jobs, userId);
    
// // // // //     res.json({
// // // // //       success: true,
// // // // //       message: `Successfully processed ${jobs.length} jobs`,
// // // // //       savedCount: result.savedCount,
// // // // //       errorCount: result.errorCount,
// // // // //       totalJobs: jobs.length,
// // // // //       errors: result.errors.length > 0 ? result.errors : undefined
// // // // //     });

// // // // //   } catch (error) {
// // // // //     console.error('❌ Save jobs endpoint error:');
// // // // //     console.error('Error name:', error.name);
// // // // //     console.error('Error message:', error.message);
// // // // //     console.error('Error stack:', error.stack);
    
// // // // //     res.status(500).json({
// // // // //       success: false,
// // // // //       message: 'Failed to save jobs to database',
// // // // //       error: error.message,
// // // // //       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
// // // // //     });
// // // // //   }
// // // // // }

// // // //  async saveJobs(req, res, next) {
// // // //     try {
// // // //       console.log('💾 Save jobs endpoint hit (no auth)');
// // // //       console.log('Request body keys:', Object.keys(req.body));
// // // //       console.log('Jobs count:', req.body.jobs?.length);
// // // //       console.log('User ID:', req.body.userId);

// // // //       const { jobs, userId } = req.body;

// // // //       if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
// // // //         console.log('❌ No jobs provided');
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'No jobs provided or invalid format'
// // // //         });
// // // //       }

// // // //       if (!userId) {
// // // //         console.log('❌ No userId provided');
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'User ID is required'
// // // //         });
// // // //       }

// // // //       // Validate userId format
// // // //       if (!mongoose.Types.ObjectId.isValid(userId)) {
// // // //         console.log('❌ Invalid userId format:', userId);
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'Invalid user ID format'
// // // //         });
// // // //       }

// // // //       console.log('✅ Starting database save operation...');
// // // //       const result = await this.saveJobsToDatabase(jobs, userId);
      
// // // //       res.json({
// // // //         success: true,
// // // //         message: `Successfully processed ${jobs.length} jobs`,
// // // //         savedCount: result.savedCount,
// // // //         errorCount: result.errorCount,
// // // //         totalJobs: jobs.length,
// // // //         errors: result.errors.length > 0 ? result.errors : undefined
// // // //       });

// // // //     } catch (error) {
// // // //       console.error('❌ Save jobs endpoint error:', error);
// // // //       res.status(500).json({
// // // //         success: false,
// // // //         message: 'Failed to save jobs to database',
// // // //         error: error.message
// // // //       });
// // // //     }
// // // //   }

// // // //    async getSavedJobs(req, res, next) {
// // // //     try {
// // // //       const { userId, page = 1, limit = 20, search, location, remote } = req.query;
      
// // // //       if (!userId) {
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'User ID is required as query parameter'
// // // //         });
// // // //       }

// // // //       const skip = (page - 1) * limit;
      
// // // //       // Build query
// // // //       const query = { userId };
      
// // // //       if (search) {
// // // //         query.$or = [
// // // //           { title: { $regex: search, $options: 'i' } },
// // // //           { organization: { $regex: search, $options: 'i' } },
// // // //           { description_text: { $regex: search, $options: 'i' } }
// // // //         ];
// // // //       }
      
// // // //       if (location) {
// // // //         query.locations_derived = { $regex: location, $options: 'i' };
// // // //       }
      
// // // //       if (remote !== undefined) {
// // // //         query.remote_derived = remote === 'true';
// // // //       }

// // // //       const jobs = await Job.find(query)
// // // //         .sort({ createdAt: -1 })
// // // //         .limit(parseInt(limit))
// // // //         .skip(skip)
// // // //         .populate('userId', 'username email');

// // // //       const total = await Job.countDocuments(query);

// // // //       res.json({
// // // //         success: true,
// // // //         jobs,
// // // //         pagination: {
// // // //           current: parseInt(page),
// // // //           total: Math.ceil(total / limit),
// // // //           count: jobs.length,
// // // //           totalJobs: total
// // // //         }
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // UPDATED: Delete saved job without auth middleware
// // // //   async deleteSavedJob(req, res, next) {
// // // //     try {
// // // //       const { jobId } = req.params;
// // // //       const { userId } = req.body; // Get userId from request body

// // // //       if (!userId) {
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'User ID is required'
// // // //         });
// // // //       }

// // // //       const deletedJob = await Job.findOneAndDelete({ 
// // // //         jobId, 
// // // //         userId 
// // // //       });

// // // //       if (!deletedJob) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'Job not found'
// // // //         });
// // // //       }

// // // //       res.json({
// // // //         success: true,
// // // //         message: 'Job deleted successfully'
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // UPDATED: Clear all saved jobs without auth middleware
// // // //   async clearAllSavedJobs(req, res, next) {
// // // //     try {
// // // //       const { userId } = req.body; // Get userId from request body

// // // //       if (!userId) {
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'User ID is required'
// // // //         });
// // // //       }

// // // //       const result = await Job.deleteMany({ userId });

// // // //       res.json({
// // // //         success: true,
// // // //         message: `Cleared ${result.deletedCount} saved jobs`,
// // // //         deletedCount: result.deletedCount
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // UPDATED: Toggle bookmark without auth middleware
// // // //   async toggleBookmark(req, res, next) {
// // // //     try {
// // // //       const { jobId } = req.params;
// // // //       const { userId } = req.body; // Get userId from request body

// // // //       if (!userId) {
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'User ID is required'
// // // //         });
// // // //       }

// // // //       const job = await Job.findOne({ jobId, userId });

// // // //       if (!job) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'Job not found'
// // // //         });
// // // //       }

// // // //       job.isBookmarked = !job.isBookmarked;
// // // //       await job.save();

// // // //       res.json({
// // // //         success: true,
// // // //         message: job.isBookmarked ? 'Job bookmarked' : 'Job unbookmarked',
// // // //         isBookmarked: job.isBookmarked
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   // UPDATED: Mark job as applied without auth middleware
// // // //   async markAsApplied(req, res, next) {
// // // //     try {
// // // //       const { jobId } = req.params;
// // // //       const { userId } = req.body; // Get userId from request body

// // // //       if (!userId) {
// // // //         return res.status(400).json({
// // // //           success: false,
// // // //           message: 'User ID is required'
// // // //         });
// // // //       }

// // // //       const job = await Job.findOne({ jobId, userId });

// // // //       if (!job) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'Job not found'
// // // //         });
// // // //       }

// // // //       job.isApplied = true;
// // // //       await job.save();

// // // //       res.json({
// // // //         success: true,
// // // //         message: 'Job marked as applied',
// // // //         isApplied: job.isApplied
// // // //       });

// // // //     } catch (error) {
// // // //       next(error);
// // // //     }
// // // //   }

// // //   // // UPDATED: Get job stats without auth middleware
// // //   // async getJobStats(req, res, next) {
// // //   //   try {
// // //   //     const { userId } = req.query; // Get userId from query params

// // //   //     if (!userId) {
// // //   //       return res.status(400).json({
// // //   //         success: false,
// // //   //         message: 'User ID is required as query parameter'
// // //   //       });
// // //   //     }

// // //   //     const stats = await Job.aggregate([
// // //   //       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
// // //   //       {
// // //   //         $group: {
// // //   //           _id: null,
// // //   //           totalJobs: { $sum: 1 },
// // //   //           remoteJobs: { $sum: { $cond: ['$remote_derived', 1, 0] } },
// // //   //           bookmarkedJobs: { $sum: { $cond: ['$isBookmarked', 1, 0] } },
// // //   //           appliedJobs: { $sum: { $cond: ['$isApplied', 1, 0] } }
// // //   //         }
// // //   //       }
// // //   //     ]);

// // //   //     const result = stats[0] || {
// // //   //       totalJobs: 0,
// // //   //       remoteJobs: 0,
// // //   //       bookmarkedJobs: 0,
// // //   //       appliedJobs: 0
// // //   //     };

// // //   //     res.json({
// // //   //       success: true,
// // //   //       stats: result
// // //   //     });

// // //   //   } catch (error) {
// // //   //     next(error);
// // //   //   }
// // //   // }

// // // //   async searchJobs(req, res, next) {
// // // //     try {
// // // //       console.log('🔍 Job search request received');
// // // //       console.log('Request body:', req.body);

// // // //       const searchParams = req.body;
      
// // // //       // Remove user-related code since auth middleware is removed
// // // //       const jobs = await jobModel.searchJobs(searchParams);
// // // //       await csvService.createCSVFile(jobs);

// // // //       console.log('✅ Jobs fetched successfully:', jobs.length);

// // // //       res.json({
// // // //         success: true,
// // // //         jobs: jobs,
// // // //         totalJobs: jobs.length,
// // // //         searchParams: searchParams,
// // // //         csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
// // // //         message: `Found ${jobs.length} jobs and saved to CSV`
// // // //       });

// // // //     } catch (error) {
// // // //       console.error('❌ Job search controller error:', error);
// // // //       next(error); // Pass error to error handler
// // // //     }
// // // //   }

// // // //   async autoDownloadCSV(req, res, next) {
// // // //     try {
// // // //       console.log("🚀 Auto download CSV triggered");
// // // //       console.log('Query params:', req.query);

// // // //       const searchParams = req.query;
      
// // // //       // Step 1: Fetch jobs
// // // //       const jobs = await jobModel.searchJobs(searchParams);

// // // //       if (jobs.length === 0) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message: 'No jobs found with current search criteria'
// // // //         });
// // // //       }

// // // //       // Step 2: Create CSV file
// // // //       const csvCreated = await csvService.createCSVFile(jobs);

// // // //       if (!csvCreated) {
// // // //         return res.status(500).json({
// // // //           success: false,
// // // //           message: 'Failed to create CSV file'
// // // //         });
// // // //       }

// // // //       // Step 3: Send CSV file for download
// // // //       if (csvService.csvExists()) {
// // // //         console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
// // // //         res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
// // // //           if (err) {
// // // //             console.error('❌ Download error:', err);
// // // //             next(err);
// // // //           } else {
// // // //             console.log('✅ CSV file downloaded successfully');
// // // //           }
// // // //         });
// // // //       } else {
// // // //         res.status(404).json({ 
// // // //           success: false, 
// // // //           message: 'CSV file not found after creation' 
// // // //         });
// // // //       }

// // // //     } catch (error) {
// // // //       console.error('❌ Auto download error:', error);
// // // //       next(error);
// // // //     }
// // // //   }

// // // //   healthCheck(req, res) {
// // // //     res.json({ 
// // // //       message: "LinkedIn Job Search API is running!",
// // // //       endpoints: {
// // // //         "POST /api/jobs": "Search jobs and create CSV",
// // // //         "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
// // // //         "GET /api/download-csv": "Download existing CSV file"
// // // //       }
// // // //     });
// // // //   }
// // // // }

// // // // module.exports = new JobController();
// // // const jobModel = require('../models/jobModel');
// // // const csvService = require('../services/csvService');
// // // const Job = require('../models/jobSchema');
// // // const mongoose = require('mongoose'); // ADD THIS IMPORT

// // // class JobController {
// // //   async searchJobs(req, res, next) {
// // //     try {
// // //       console.log('🔍 Job search request received');
// // //       console.log('Request body:', req.body);

// // //       const searchParams = req.body;
      
// // //       // Fetch jobs from LinkedIn API
// // //       const jobs = await jobModel.searchJobs(searchParams);
// // //       await csvService.createCSVFile(jobs);

// // //       console.log('✅ Jobs fetched successfully:', jobs.length);

// // //       res.json({
// // //         success: true,
// // //         jobs: jobs,
// // //         totalJobs: jobs.length,
// // //         searchParams: searchParams,
// // //         csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
// // //         message: `Found ${jobs.length} jobs and saved to CSV`
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Job search controller error:', error);
// // //       next(error);
// // //     }
// // //   }

// // //   async autoDownloadCSV(req, res, next) {
// // //     try {
// // //       console.log("🚀 Auto download CSV triggered");
// // //       console.log('Query params:', req.query);

// // //       const searchParams = req.query;
      
// // //       // Step 1: Fetch jobs
// // //       const jobs = await jobModel.searchJobs(searchParams);

// // //       if (jobs.length === 0) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message: 'No jobs found with current search criteria'
// // //         });
// // //       }

// // //       // Step 2: Create CSV file
// // //       const csvCreated = await csvService.createCSVFile(jobs);

// // //       if (!csvCreated) {
// // //         return res.status(500).json({
// // //           success: false,
// // //           message: 'Failed to create CSV file'
// // //         });
// // //       }

// // //       // Step 3: Send CSV file for download
// // //       if (csvService.csvExists()) {
// // //         console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
// // //         res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
// // //           if (err) {
// // //             console.error('❌ Download error:', err);
// // //             next(err);
// // //           } else {
// // //             console.log('✅ CSV file downloaded successfully');
// // //           }
// // //         });
// // //       } else {
// // //         res.status(404).json({ 
// // //           success: false, 
// // //           message: 'CSV file not found after creation' 
// // //         });
// // //       }

// // //     } catch (error) {
// // //       console.error('❌ Auto download error:', error);
// // //       next(error);
// // //     }
// // //   }
// // //  async getJobStats(req, res, next) {
// // //     try {
// // //       const { userId } = req.query; // Get userId from query params

// // //       if (!userId) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required as query parameter'
// // //         });
// // //       }

// // //       const stats = await Job.aggregate([
// // //         { $match: { userId: new mongoose.Types.ObjectId(userId) } },
// // //         {
// // //           $group: {
// // //             _id: null,
// // //             totalJobs: { $sum: 1 },
// // //             remoteJobs: { $sum: { $cond: ['$remote_derived', 1, 0] } },
// // //             bookmarkedJobs: { $sum: { $cond: ['$isBookmarked', 1, 0] } },
// // //             appliedJobs: { $sum: { $cond: ['$isApplied', 1, 0] } }
// // //           }
// // //         }
// // //       ]);

// // //       const result = stats[0] || {
// // //         totalJobs: 0,
// // //         remoteJobs: 0,
// // //         bookmarkedJobs: 0,
// // //         appliedJobs: 0
// // //       };

// // //       res.json({
// // //         success: true,
// // //         stats: result
// // //       });

// // //     } catch (error) {
// // //       next(error);
// // //     }
// // //   }
// // //   // FIXED: Save jobs to database
// // //   async saveJobsToDatabase(jobs, userId) {
// // //     try {
// // //       console.log(`💾 Starting to save ${jobs.length} jobs for user: ${userId}`);
      
// // //       // Check database connection
// // //       if (mongoose.connection.readyState !== 1) {
// // //         throw new Error('Database not connected');
// // //       }

// // //       const savedJobs = [];
// // //       const errors = [];
      
// // //       for (const jobData of jobs) {
// // //         try {
// // //           // Check if job already exists for this user
// // //           const existingJob = await Job.findOne({ 
// // //             jobId: jobData.id, 
// // //             userId 
// // //           });

// // //           if (!existingJob) {
// // //             console.log(`📝 Creating new job: ${jobData.id} - ${jobData.title}`);
            
// // //             const newJob = new Job({
// // //               userId: new mongoose.Types.ObjectId(userId), // Fix ObjectId conversion
// // //               jobId: jobData.id,
// // //               title: jobData.title || '',
// // //               organization: jobData.organization || '',
// // //               organization_url: jobData.organization_url || '',
// // //               date_posted: jobData.date_posted ? new Date(jobData.date_posted) : null,
// // //               date_created: jobData.date_created ? new Date(jobData.date_created) : null,
// // //               date_validthrough: jobData.date_validthrough ? new Date(jobData.date_validthrough) : null,
// // //               location_type: jobData.location_type || '',
// // //               locations_derived: jobData.locations_derived || [],
// // //               cities_derived: jobData.cities_derived || [],
// // //               regions_derived: jobData.regions_derived || [],
// // //               countries_derived: jobData.countries_derived || [],
// // //               timezones_derived: jobData.timezones_derived || [],
// // //               lats_derived: jobData.lats_derived || [],
// // //               lngs_derived: jobData.lngs_derived || [],
// // //               salary_raw: jobData.salary_raw || null,
// // //               employment_type: jobData.employment_type || [],
// // //               seniority: jobData.seniority || '',
// // //               remote_derived: jobData.remote_derived || false,
// // //               url: jobData.url || '',
// // //               external_apply_url: jobData.external_apply_url || '',
// // //               source_type: jobData.source_type || 'jobboard',
// // //               source: jobData.source || 'linkedin',
// // //               source_domain: jobData.source_domain || '',
// // //               organization_logo: jobData.organization_logo || '',
// // //               linkedin_org_employees: jobData.linkedin_org_employees || null,
// // //               linkedin_org_url: jobData.linkedin_org_url || '',
// // //               linkedin_org_size: jobData.linkedin_org_size || '',
// // //               linkedin_org_slogan: jobData.linkedin_org_slogan || '',
// // //               linkedin_org_industry: jobData.linkedin_org_industry || '',
// // //               linkedin_org_followers: jobData.linkedin_org_followers || null,
// // //               linkedin_org_headquarters: jobData.linkedin_org_headquarters || '',
// // //               linkedin_org_type: jobData.linkedin_org_type || '',
// // //               linkedin_org_foundeddate: jobData.linkedin_org_foundeddate || '',
// // //               linkedin_org_specialties: jobData.linkedin_org_specialties || [],
// // //               linkedin_org_locations: jobData.linkedin_org_locations || [],
// // //               linkedin_org_description: jobData.linkedin_org_description || '',
// // //               linkedin_org_recruitment_agency_derived: jobData.linkedin_org_recruitment_agency_derived || false,
// // //               linkedin_org_slug: jobData.linkedin_org_slug || '',
// // //               recruiter_name: jobData.recruiter_name || '',
// // //               recruiter_title: jobData.recruiter_title || '',
// // //               recruiter_url: jobData.recruiter_url || '',
// // //               description_text: jobData.description_text || '',
// // //               directapply: jobData.directapply || false,
// // //               locations_raw: jobData.locations_raw || null,
// // //               location_requirements_raw: jobData.location_requirements_raw || null,
// // //               no_jb_schema: jobData.no_jb_schema || null,
// // //               isBookmarked: false,
// // //               isApplied: false
// // //             });

// // //             // Mark Mixed fields as modified if they exist
// // //             if (jobData.salary_raw) {
// // //               newJob.markModified('salary_raw');
// // //             }
// // //             if (jobData.locations_raw) {
// // //               newJob.markModified('locations_raw');
// // //             }
// // //             if (jobData.location_requirements_raw) {
// // //               newJob.markModified('location_requirements_raw');
// // //             }

// // //             const savedJob = await newJob.save();
// // //             console.log(`✅ Job saved successfully: ${savedJob._id}`);
// // //             savedJobs.push(savedJob);
// // //           } else {
// // //             console.log(`⚠️ Job already exists: ${jobData.id}`);
// // //           }
// // //         } catch (saveError) {
// // //           console.error(`❌ Error saving job ${jobData.id}:`, saveError.message);
// // //           errors.push({
// // //             jobId: jobData.id,
// // //             title: jobData.title,
// // //             error: saveError.message
// // //           });
// // //         }
// // //       }

// // //       console.log(`💾 Database save completed:`);
// // //       console.log(`  ✅ Successfully saved: ${savedJobs.length} jobs`);
// // //       console.log(`  ❌ Failed to save: ${errors.length} jobs`);
      
// // //       return {
// // //         savedJobs,
// // //         errors,
// // //         savedCount: savedJobs.length,
// // //         errorCount: errors.length
// // //       };

// // //     } catch (error) {
// // //       console.error('❌ Database save operation failed:', error);
// // //       throw error;
// // //     }
// // //   }

// // //   // FIXED: Save jobs endpoint
// // //   async saveJobs(req, res, next) {
// // //     try {
// // //       console.log('💾 Save jobs endpoint hit (no auth)');
// // //       console.log('Request body keys:', Object.keys(req.body));
// // //       console.log('Jobs count:', req.body.jobs?.length);
// // //       console.log('User ID:', req.body.userId);

// // //       const { jobs, userId } = req.body;

// // //       if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
// // //         console.log('❌ No jobs provided');
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'No jobs provided or invalid format'
// // //         });
// // //       }

// // //       if (!userId) {
// // //         console.log('❌ No userId provided');
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required'
// // //         });
// // //       }

// // //       // Validate userId format
// // //       if (!mongoose.Types.ObjectId.isValid(userId)) {
// // //         console.log('❌ Invalid userId format:', userId);
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'Invalid user ID format'
// // //         });
// // //       }

// // //       console.log('✅ Starting database save operation...');
// // //       const result = await this.saveJobsToDatabase(jobs, userId);
      
// // //       res.json({
// // //         success: true,
// // //         message: `Successfully processed ${jobs.length} jobs`,
// // //         savedCount: result.savedCount,
// // //         errorCount: result.errorCount,
// // //         totalJobs: jobs.length,
// // //         errors: result.errors.length > 0 ? result.errors : undefined
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Save jobs endpoint error:', error);
// // //       res.status(500).json({
// // //         success: false,
// // //         message: 'Failed to save jobs to database',
// // //         error: error.message
// // //       });
// // //     }
// // //   }

// // //   // FIXED: Get saved jobs
// // //   async getSavedJobs(req, res, next) {
// // //     try {
// // //       console.log('📋 Get saved jobs endpoint hit');
// // //       const { userId, page = 1, limit = 20, search, location, remote } = req.query;
      
// // //       console.log('Query params:', { userId, page, limit, search, location, remote });

// // //       if (!userId) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required as query parameter'
// // //         });
// // //       }

// // //       // Validate userId format
// // //       if (!mongoose.Types.ObjectId.isValid(userId)) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'Invalid user ID format'
// // //         });
// // //       }

// // //       const skip = (page - 1) * limit;
      
// // //       // Build query
// // //       const query = { userId: new mongoose.Types.ObjectId(userId) };
      
// // //       if (search) {
// // //         query.$or = [
// // //           { title: { $regex: search, $options: 'i' } },
// // //           { organization: { $regex: search, $options: 'i' } },
// // //           { description_text: { $regex: search, $options: 'i' } }
// // //         ];
// // //       }
      
// // //       if (location) {
// // //         query.locations_derived = { $regex: location, $options: 'i' };
// // //       }
      
// // //       if (remote !== undefined) {
// // //         query.remote_derived = remote === 'true';
// // //       }

// // //       console.log('Database query:', query);

// // //       const jobs = await Job.find(query)
// // //         .sort({ createdAt: -1 })
// // //         .limit(parseInt(limit))
// // //         .skip(skip);

// // //       const total = await Job.countDocuments(query);

// // //       console.log(`✅ Found ${jobs.length} saved jobs for user ${userId}`);

// // //       res.json({
// // //         success: true,
// // //         jobs,
// // //         pagination: {
// // //           current: parseInt(page),
// // //           total: Math.ceil(total / limit),
// // //           count: jobs.length,
// // //           totalJobs: total
// // //         }
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Get saved jobs error:', error);
// // //       res.status(500).json({
// // //         success: false,
// // //         message: 'Failed to get saved jobs',
// // //         error: error.message
// // //       });
// // //     }
// // //   }

// // //   // FIXED: Delete saved job
// // //   async deleteSavedJob(req, res, next) {
// // //     try {
// // //       const { jobId } = req.params;
// // //       const { userId } = req.body;

// // //       if (!userId) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required'
// // //         });
// // //       }

// // //       if (!mongoose.Types.ObjectId.isValid(userId)) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'Invalid user ID format'
// // //         });
// // //       }

// // //       const deletedJob = await Job.findOneAndDelete({ 
// // //         jobId, 
// // //         userId: new mongoose.Types.ObjectId(userId)
// // //       });

// // //       if (!deletedJob) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message: 'Job not found'
// // //         });
// // //       }

// // //       res.json({
// // //         success: true,
// // //         message: 'Job deleted successfully'
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Delete job error:', error);
// // //       res.status(500).json({
// // //         success: false,
// // //         message: 'Failed to delete job',
// // //         error: error.message
// // //       });
// // //     }
// // //   }

// // //   // FIXED: Clear all saved jobs
// // //   async clearAllSavedJobs(req, res, next) {
// // //     try {
// // //       const { userId } = req.body;

// // //       if (!userId) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required'
// // //         });
// // //       }

// // //       if (!mongoose.Types.ObjectId.isValid(userId)) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'Invalid user ID format'
// // //         });
// // //       }

// // //       const result = await Job.deleteMany({ 
// // //         userId: new mongoose.Types.ObjectId(userId) 
// // //       });

// // //       res.json({
// // //         success: true,
// // //         message: `Cleared ${result.deletedCount} saved jobs`,
// // //         deletedCount: result.deletedCount
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Clear jobs error:', error);
// // //       res.status(500).json({
// // //         success: false,
// // //         message: 'Failed to clear jobs',
// // //         error: error.message
// // //       });
// // //     }
// // //   }

// // //   // FIXED: Toggle bookmark
// // //   async toggleBookmark(req, res, next) {
// // //     try {
// // //       const { jobId } = req.params;
// // //       const { userId } = req.body;

// // //       if (!userId) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required'
// // //         });
// // //       }

// // //       const job = await Job.findOne({ 
// // //         jobId, 
// // //         userId: new mongoose.Types.ObjectId(userId) 
// // //       });

// // //       if (!job) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message: 'Job not found'
// // //         });
// // //       }

// // //       job.isBookmarked = !job.isBookmarked;
// // //       await job.save();

// // //       res.json({
// // //         success: true,
// // //         message: job.isBookmarked ? 'Job bookmarked' : 'Job unbookmarked',
// // //         isBookmarked: job.isBookmarked
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Toggle bookmark error:', error);
// // //       res.status(500).json({
// // //         success: false,
// // //         message: 'Failed to toggle bookmark',
// // //         error: error.message
// // //       });
// // //     }
// // //   }

// // //   // FIXED: Mark job as applied
// // //   async markAsApplied(req, res, next) {
// // //     try {
// // //       const { jobId } = req.params;
// // //       const { userId } = req.body;

// // //       if (!userId) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message: 'User ID is required'
// // //         });
// // //       }

// // //       const job = await Job.findOne({ 
// // //         jobId, 
// // //         userId: new mongoose.Types.ObjectId(userId) 
// // //       });

// // //       if (!job) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message: 'Job not found'
// // //         });
// // //       }

// // //       job.isApplied = true;
// // //       await job.save();

// // //       res.json({
// // //         success: true,
// // //         message: 'Job marked as applied',
// // //         isApplied: job.isApplied
// // //       });

// // //     } catch (error) {
// // //       console.error('❌ Mark applied error:', error);
// // //       res.status(500).json({
// // //         success: false,
// // //         message: 'Failed to mark as applied',
// // //         error: error.message
// // //       });
// // //     }
// // //   }

// // //   healthCheck(req, res) {
// // //     res.json({ 
// // //       message: "LinkedIn Job Search API is running!",
// // //       endpoints: {
// // //         "POST /api/jobs": "Search jobs and create CSV",
// // //         "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
// // //         "POST /api/save-jobs": "Save jobs to database",
// // //         "GET /api/saved-jobs": "Get saved jobs for user",
// // //         "DELETE /api/saved-jobs/:jobId": "Delete specific saved job",
// // //         "DELETE /api/saved-jobs": "Clear all saved jobs",
// // //         "PUT /api/saved-jobs/:jobId/bookmark": "Toggle bookmark",
// // //         "PUT /api/saved-jobs/:jobId/applied": "Mark as applied"
// // //       },
// // //       database: {
// // //         connected: mongoose.connection.readyState === 1,
// // //         name: mongoose.connection.name,
// // //         host: mongoose.connection.host
// // //       }
// // //     });
// // //   }
// // // }

// // // module.exports = new JobController();
// // const jobModel = require('../models/jobModel');
// // const csvService = require('../services/csvService');
// // const Job = require('../models/jobSchema');
// // const mongoose = require('mongoose');

// // // Helper function to save jobs to database
// // const saveJobsToDatabase = async (jobs, userId) => {
// //   try {
// //     console.log(`💾 Starting to save ${jobs.length} jobs for user: ${userId}`);
    
// //     // Check database connection
// //     if (mongoose.connection.readyState !== 1) {
// //       throw new Error('Database not connected');
// //     }

// //     const savedJobs = [];
// //     const errors = [];
    
// //     for (const jobData of jobs) {
// //       try {
// //         // Check if job already exists for this user
// //         const existingJob = await Job.findOne({ 
// //           jobId: jobData.id, 
// //           userId: new mongoose.Types.ObjectId(userId)
// //         });

// //         if (!existingJob) {
// //           console.log(`📝 Creating new job: ${jobData.id} - ${jobData.title}`);
          
// //           const newJob = new Job({
// //             userId: new mongoose.Types.ObjectId(userId),
// //             jobId: jobData.id,
// //             title: jobData.title || '',
// //             organization: jobData.organization || '',
// //             organization_url: jobData.organization_url || '',
// //             date_posted: jobData.date_posted ? new Date(jobData.date_posted) : null,
// //             date_created: jobData.date_created ? new Date(jobData.date_created) : null,
// //             date_validthrough: jobData.date_validthrough ? new Date(jobData.date_validthrough) : null,
// //             location_type: jobData.location_type || '',
// //             locations_derived: jobData.locations_derived || [],
// //             cities_derived: jobData.cities_derived || [],
// //             regions_derived: jobData.regions_derived || [],
// //             countries_derived: jobData.countries_derived || [],
// //             timezones_derived: jobData.timezones_derived || [],
// //             lats_derived: jobData.lats_derived || [],
// //             lngs_derived: jobData.lngs_derived || [],
// //             salary_raw: jobData.salary_raw || null,
// //             employment_type: jobData.employment_type || [],
// //             seniority: jobData.seniority || '',
// //             remote_derived: jobData.remote_derived || false,
// //             url: jobData.url || '',
// //             external_apply_url: jobData.external_apply_url || '',
// //             source_type: jobData.source_type || 'jobboard',
// //             source: jobData.source || 'linkedin',
// //             source_domain: jobData.source_domain || '',
// //             organization_logo: jobData.organization_logo || '',
// //             linkedin_org_employees: jobData.linkedin_org_employees || null,
// //             linkedin_org_url: jobData.linkedin_org_url || '',
// //             linkedin_org_size: jobData.linkedin_org_size || '',
// //             linkedin_org_slogan: jobData.linkedin_org_slogan || '',
// //             linkedin_org_industry: jobData.linkedin_org_industry || '',
// //             linkedin_org_followers: jobData.linkedin_org_followers || null,
// //             linkedin_org_headquarters: jobData.linkedin_org_headquarters || '',
// //             linkedin_org_type: jobData.linkedin_org_type || '',
// //             linkedin_org_foundeddate: jobData.linkedin_org_foundeddate || '',
// //             linkedin_org_specialties: jobData.linkedin_org_specialties || [],
// //             linkedin_org_locations: jobData.linkedin_org_locations || [],
// //             linkedin_org_description: jobData.linkedin_org_description || '',
// //             linkedin_org_recruitment_agency_derived: jobData.linkedin_org_recruitment_agency_derived || false,
// //             linkedin_org_slug: jobData.linkedin_org_slug || '',
// //             recruiter_name: jobData.recruiter_name || '',
// //             recruiter_title: jobData.recruiter_title || '',
// //             recruiter_url: jobData.recruiter_url || '',
// //             description_text: jobData.description_text || '',
// //             directapply: jobData.directapply || false,
// //             locations_raw: jobData.locations_raw || null,
// //             location_requirements_raw: jobData.location_requirements_raw || null,
// //             no_jb_schema: jobData.no_jb_schema || null,
// //             isBookmarked: false,
// //             isApplied: false
// //           });

// //           // Mark Mixed fields as modified if they exist
// //           if (jobData.salary_raw) {
// //             newJob.markModified('salary_raw');
// //           }
// //           if (jobData.locations_raw) {
// //             newJob.markModified('locations_raw');
// //           }
// //           if (jobData.location_requirements_raw) {
// //             newJob.markModified('location_requirements_raw');
// //           }

// //           const savedJob = await newJob.save();
// //           console.log(`✅ Job saved successfully: ${savedJob._id}`);
// //           savedJobs.push(savedJob);
// //         } else {
// //           console.log(`⚠️ Job already exists: ${jobData.id}`);
// //         }
// //       } catch (saveError) {
// //         console.error(`❌ Error saving job ${jobData.id}:`, saveError.message);
// //         errors.push({
// //           jobId: jobData.id,
// //           title: jobData.title,
// //           error: saveError.message
// //         });
// //       }
// //     }

// //     console.log(`💾 Database save completed:`);
// //     console.log(`  ✅ Successfully saved: ${savedJobs.length} jobs`);
// //     console.log(`  ❌ Failed to save: ${errors.length} jobs`);
    
// //     return {
// //       savedJobs,
// //       errors,
// //       savedCount: savedJobs.length,
// //       errorCount: errors.length
// //     };

// //   } catch (error) {
// //     console.error('❌ Database save operation failed:', error);
// //     throw error;
// //   }
// // };

// // // Search jobs function
// // const searchJobs = async (req, res, next) => {
// //   try {
// //     console.log('🔍 Job search request received');
// //     console.log('Request body:', req.body);

// //     const searchParams = req.body;
    
// //     // Fetch jobs from LinkedIn API
// //     const jobs = await jobModel.searchJobs(searchParams);
// //     await csvService.createCSVFile(jobs);

// //     console.log('✅ Jobs fetched successfully:', jobs.length);

// //     res.json({
// //       success: true,
// //       jobs: jobs,
// //       totalJobs: jobs.length,
// //       searchParams: searchParams,
// //       csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
// //       message: `Found ${jobs.length} jobs and saved to CSV`
// //     });

// //   } catch (error) {
// //     console.error('❌ Job search controller error:', error);
// //     next(error);
// //   }
// // };

// // // Auto download CSV function
// // const autoDownloadCSV = async (req, res, next) => {
// //   try {
// //     console.log("🚀 Auto download CSV triggered");
// //     console.log('Query params:', req.query);

// //     const searchParams = req.query;
    
// //     // Step 1: Fetch jobs
// //     const jobs = await jobModel.searchJobs(searchParams);

// //     if (jobs.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No jobs found with current search criteria'
// //       });
// //     }

// //     // Step 2: Create CSV file
// //     const csvCreated = await csvService.createCSVFile(jobs);

// //     if (!csvCreated) {
// //       return res.status(500).json({
// //         success: false,
// //         message: 'Failed to create CSV file'
// //       });
// //     }

// //     // Step 3: Send CSV file for download
// //     if (csvService.csvExists()) {
// //       console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
// //       res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
// //         if (err) {
// //           console.error('❌ Download error:', err);
// //           next(err);
// //         } else {
// //           console.log('✅ CSV file downloaded successfully');
// //         }
// //       });
// //     } else {
// //       res.status(404).json({ 
// //         success: false, 
// //         message: 'CSV file not found after creation' 
// //       });
// //     }

// //   } catch (error) {
// //     console.error('❌ Auto download error:', error);
// //     next(error);
// //   }
// // };

// // // Save jobs to database function
// // const saveJobs = async (req, res, next) => {
// //   try {
// //     console.log('💾 Save jobs endpoint hit (no auth)');
// //     console.log('Request body keys:', Object.keys(req.body));
// //     console.log('Jobs count:', req.body.jobs?.length);
// //     console.log('User ID:', req.body.userId);

// //     const { jobs, userId } = req.body;

// //     if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
// //       console.log('❌ No jobs provided');
// //       return res.status(400).json({
// //         success: false,
// //         message: 'No jobs provided or invalid format'
// //       });
// //     }

// //     if (!userId) {
// //       console.log('❌ No userId provided');
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required'
// //       });
// //     }

// //     // Validate userId format
// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       console.log('❌ Invalid userId format:', userId);
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     console.log('✅ Starting database save operation...');
// //     const result = await saveJobsToDatabase(jobs, userId);
    
// //     res.json({
// //       success: true,
// //       message: `Successfully processed ${jobs.length} jobs`,
// //       savedCount: result.savedCount,
// //       errorCount: result.errorCount,
// //       totalJobs: jobs.length,
// //       errors: result.errors.length > 0 ? result.errors : undefined
// //     });

// //   } catch (error) {
// //     console.error('❌ Save jobs endpoint error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to save jobs to database',
// //       error: error.message
// //     });
// //   }
// // };

// // // Get saved jobs function
// // const getSavedJobs = async (req, res, next) => {
// //   try {
// //     console.log('📋 Get saved jobs endpoint hit');
// //     const { userId, page = 1, limit = 20, search, location, remote } = req.query;
    
// //     console.log('Query params:', { userId, page, limit, search, location, remote });

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required as query parameter'
// //       });
// //     }

// //     // Validate userId format
// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     const skip = (page - 1) * limit;
    
// //     // Build query
// //     const query = { userId: new mongoose.Types.ObjectId(userId) };
    
// //     if (search) {
// //       query.$or = [
// //         { title: { $regex: search, $options: 'i' } },
// //         { organization: { $regex: search, $options: 'i' } },
// //         { description_text: { $regex: search, $options: 'i' } }
// //       ];
// //     }
    
// //     if (location) {
// //       query.locations_derived = { $regex: location, $options: 'i' };
// //     }
    
// //     if (remote !== undefined) {
// //       query.remote_derived = remote === 'true';
// //     }

// //     console.log('Database query:', query);

// //     const jobs = await Job.find(query)
// //       .sort({ createdAt: -1 })
// //       .limit(parseInt(limit))
// //       .skip(skip);

// //     const total = await Job.countDocuments(query);

// //     console.log(`✅ Found ${jobs.length} saved jobs for user ${userId}`);

// //     res.json({
// //       success: true,
// //       jobs,
// //       pagination: {
// //         current: parseInt(page),
// //         total: Math.ceil(total / limit),
// //         count: jobs.length,
// //         totalJobs: total
// //       }
// //     });

// //   } catch (error) {
// //     console.error('❌ Get saved jobs error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to get saved jobs',
// //       error: error.message
// //     });
// //   }
// // };

// // // Delete saved job function
// // const deleteSavedJob = async (req, res, next) => {
// //   try {
// //     const { jobId } = req.params;
// //     const { userId } = req.body;

// //     console.log('🗑️ Delete job request:', { jobId, userId });

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required'
// //       });
// //     }

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     const deletedJob = await Job.findOneAndDelete({ 
// //       jobId, 
// //       userId: new mongoose.Types.ObjectId(userId)
// //     });

// //     if (!deletedJob) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Job not found'
// //       });
// //     }

// //     console.log('✅ Job deleted successfully:', jobId);

// //     res.json({
// //       success: true,
// //       message: 'Job deleted successfully'
// //     });

// //   } catch (error) {
// //     console.error('❌ Delete job error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to delete job',
// //       error: error.message
// //     });
// //   }
// // };

// // // Clear all saved jobs function
// // const clearAllSavedJobs = async (req, res, next) => {
// //   try {
// //     const { userId } = req.body;

// //     console.log('🗑️ Clear all jobs request for user:', userId);

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required'
// //       });
// //     }

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     const result = await Job.deleteMany({ 
// //       userId: new mongoose.Types.ObjectId(userId) 
// //     });

// //     console.log(`✅ Cleared ${result.deletedCount} jobs for user ${userId}`);

// //     res.json({
// //       success: true,
// //       message: `Cleared ${result.deletedCount} saved jobs`,
// //       deletedCount: result.deletedCount
// //     });

// //   } catch (error) {
// //     console.error('❌ Clear jobs error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to clear jobs',
// //       error: error.message
// //     });
// //   }
// // };

// // // Toggle bookmark function
// // const toggleBookmark = async (req, res, next) => {
// //   try {
// //     const { jobId } = req.params;
// //     const { userId } = req.body;

// //     console.log('⭐ Toggle bookmark request:', { jobId, userId });

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required'
// //       });
// //     }

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     const job = await Job.findOne({ 
// //       jobId, 
// //       userId: new mongoose.Types.ObjectId(userId) 
// //     });

// //     if (!job) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Job not found'
// //       });
// //     }

// //     job.isBookmarked = !job.isBookmarked;
// //     await job.save();

// //     console.log(`✅ Job ${job.isBookmarked ? 'bookmarked' : 'unbookmarked'}:`, jobId);

// //     res.json({
// //       success: true,
// //       message: job.isBookmarked ? 'Job bookmarked' : 'Job unbookmarked',
// //       isBookmarked: job.isBookmarked
// //     });

// //   } catch (error) {
// //     console.error('❌ Toggle bookmark error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to toggle bookmark',
// //       error: error.message
// //     });
// //   }
// // };

// // // Mark job as applied function
// // const markAsApplied = async (req, res, next) => {
// //   try {
// //     const { jobId } = req.params;
// //     const { userId } = req.body;

// //     console.log('✅ Mark as applied request:', { jobId, userId });

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required'
// //       });
// //     }

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     const job = await Job.findOne({ 
// //       jobId, 
// //       userId: new mongoose.Types.ObjectId(userId) 
// //     });

// //     if (!job) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Job not found'
// //       });
// //     }

// //     job.isApplied = true;
// //     await job.save();

// //     console.log('✅ Job marked as applied:', jobId);

// //     res.json({
// //       success: true,
// //       message: 'Job marked as applied',
// //       isApplied: job.isApplied
// //     });

// //   } catch (error) {
// //     console.error('❌ Mark applied error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to mark as applied',
// //       error: error.message
// //     });
// //   }
// // };

// // // Get job statistics function
// // const getJobStats = async (req, res, next) => {
// //   try {
// //     const { userId } = req.query;

// //     console.log('📊 Get job stats request for user:', userId);

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required as query parameter'
// //       });
// //     }

// //     if (!mongoose.Types.ObjectId.isValid(userId)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid user ID format'
// //       });
// //     }

// //     const stats = await Job.aggregate([
// //       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
// //       {
// //         $group: {
// //           _id: null,
// //           totalJobs: { $sum: 1 },
// //           remoteJobs: { $sum: { $cond: ['$remote_derived', 1, 0] } },
// //           bookmarkedJobs: { $sum: { $cond: ['$isBookmarked', 1, 0] } },
// //           appliedJobs: { $sum: { $cond: ['$isApplied', 1, 0] } }
// //         }
// //       }
// //     ]);

// //     const result = stats[0] || {
// //       totalJobs: 0,
// //       remoteJobs: 0,
// //       bookmarkedJobs: 0,
// //       appliedJobs: 0
// //     };

// //     console.log('✅ Job stats:', result);

// //     res.json({
// //       success: true,
// //       stats: result
// //     });

// //   } catch (error) {
// //     console.error('❌ Get job stats error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to get job statistics',
// //       error: error.message
// //     });
// //   }
// // };

// // // Health check function
// // const healthCheck = (req, res) => {
// //   res.json({ 
// //     message: "LinkedIn Job Search API is running!",
// //     endpoints: {
// //       "POST /api/jobs": "Search jobs and create CSV",
// //       "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
// //       "POST /api/save-jobs": "Save jobs to database",
// //       "GET /api/saved-jobs": "Get saved jobs for user",
// //       "DELETE /api/saved-jobs/:jobId": "Delete specific saved job",
// //       "DELETE /api/saved-jobs": "Clear all saved jobs",
// //       "PUT /api/saved-jobs/:jobId/bookmark": "Toggle bookmark",
// //       "PUT /api/saved-jobs/:jobId/applied": "Mark as applied",
// //       "GET /api/job-stats": "Get job statistics"
// //     },
// //     database: {
// //       connected: mongoose.connection.readyState === 1,
// //       name: mongoose.connection.name,
// //       host: mongoose.connection.host
// //     },
// //     timestamp: new Date().toISOString()
// //   });
// // };

// // // Export all functions
// // module.exports = {
// //   searchJobs,
// //   autoDownloadCSV,
// //   saveJobs,
// //   getSavedJobs,
// //   deleteSavedJob,
// //   clearAllSavedJobs,
// //   toggleBookmark,
// //   markAsApplied,
// //   getJobStats,
// //   healthCheck,
// //   saveJobsToDatabase // Export helper function too
// // };


// const jobModel = require('../models/jobModel');
// const csvService = require('../services/csvService');
// const Job = require('../models/jobSchema');
// const mongoose = require('mongoose');
// const path = require('path'); // ADD THIS IMPORT
// const fs = require('fs'); // ADD THIS IMPORT
// // Helper function to safely convert and clean data
// const cleanJobData = (jobData, userId) => {
//   return {
//     userId: new mongoose.Types.ObjectId(userId),
//     jobId: jobData.id || '',
//     title: jobData.title || '',
//     organization: jobData.organization || '',
//     organization_url: jobData.organization_url || '',
    
//     // Handle dates safely
//     date_posted: jobData.date_posted ? new Date(jobData.date_posted) : null,
//     date_created: jobData.date_created ? new Date(jobData.date_created) : null,
//     date_validthrough: jobData.date_validthrough ? new Date(jobData.date_validthrough) : null,
    
//     // Handle location data
//     location_type: jobData.location_type || '',
//     locations_derived: Array.isArray(jobData.locations_derived) ? jobData.locations_derived : [],
//     cities_derived: Array.isArray(jobData.cities_derived) ? jobData.cities_derived : [],
//     regions_derived: Array.isArray(jobData.regions_derived) ? jobData.regions_derived : [],
//     countries_derived: Array.isArray(jobData.countries_derived) ? jobData.countries_derived : [],
//     timezones_derived: Array.isArray(jobData.timezones_derived) ? jobData.timezones_derived : [],
    
//     // Handle numeric arrays
//     lats_derived: Array.isArray(jobData.lats_derived) ? 
//       jobData.lats_derived.map(lat => Number(lat)).filter(lat => !isNaN(lat)) : [],
//     lngs_derived: Array.isArray(jobData.lngs_derived) ? 
//       jobData.lngs_derived.map(lng => Number(lng)).filter(lng => !isNaN(lng)) : [],
    
//     // Handle mixed types
//     salary_raw: jobData.salary_raw || null,
    
//     // Handle employment data
//     employment_type: Array.isArray(jobData.employment_type) ? jobData.employment_type : [],
//     seniority: jobData.seniority || '',
//     remote_derived: Boolean(jobData.remote_derived),
    
//     // Handle URLs
//     url: jobData.url || '',
//     external_apply_url: jobData.external_apply_url || '',
    
//     // Handle source data
//     source_type: jobData.source_type || 'jobboard',
//     source: jobData.source || 'linkedin',
//     source_domain: jobData.source_domain || '',
    
//     // Handle company data
//     organization_logo: jobData.organization_logo || '',
//     linkedin_org_employees: jobData.linkedin_org_employees ? Number(jobData.linkedin_org_employees) : null,
//     linkedin_org_url: jobData.linkedin_org_url || '',
//     linkedin_org_size: jobData.linkedin_org_size || '',
//     linkedin_org_slogan: jobData.linkedin_org_slogan || '',
//     linkedin_org_industry: jobData.linkedin_org_industry || '',
//     linkedin_org_followers: jobData.linkedin_org_followers ? Number(jobData.linkedin_org_followers) : null,
//     linkedin_org_headquarters: jobData.linkedin_org_headquarters || '',
//     linkedin_org_type: jobData.linkedin_org_type || '',
//     linkedin_org_foundeddate: jobData.linkedin_org_foundeddate || '',
//     linkedin_org_specialties: Array.isArray(jobData.linkedin_org_specialties) ? jobData.linkedin_org_specialties : [],
//     linkedin_org_locations: Array.isArray(jobData.linkedin_org_locations) ? jobData.linkedin_org_locations : [],
//     linkedin_org_description: jobData.linkedin_org_description || '',
//     linkedin_org_recruitment_agency_derived: Boolean(jobData.linkedin_org_recruitment_agency_derived),
//     linkedin_org_slug: jobData.linkedin_org_slug || '',
    
//     // Handle recruiter data
//     recruiter_name: jobData.recruiter_name || '',
//     recruiter_title: jobData.recruiter_title || '',
//     recruiter_url: jobData.recruiter_url || '',
    
//     // Handle description
//     description_text: jobData.description_text || '',
    
//     // Handle application data
//     directapply: Boolean(jobData.directapply),
    
//     // Handle raw data
//     locations_raw: jobData.locations_raw || null,
//     location_requirements_raw: jobData.location_requirements_raw || null,
//     no_jb_schema: jobData.no_jb_schema || null,
    
//     // Default user interaction values
//     isBookmarked: false,
//     isApplied: false,
//     notes: ''
//   };
// };

// // Helper function to save jobs to database
// const saveJobsToDatabase = async (jobs, userId) => {
//   try {
//     console.log(`💾 Starting to save ${jobs.length} jobs for user: ${userId}`);
    
//     // Check database connection
//     if (mongoose.connection.readyState !== 1) {
//       throw new Error('Database not connected');
//     }

//     const savedJobs = [];
//     const errors = [];
    
//     for (const jobData of jobs) {
//       try {
//         // Check if job already exists for this user
//         const existingJob = await Job.findOne({ 
//           jobId: jobData.id, 
//           userId: new mongoose.Types.ObjectId(userId)
//         });

//         if (!existingJob) {
//           console.log(`📝 Creating new job: ${jobData.id} - ${jobData.title}`);
          
//           // Clean and prepare job data
//           const cleanData = cleanJobData(jobData, userId);
//           const newJob = new Job(cleanData);

//           // Mark Mixed fields as modified if they exist
//           if (jobData.salary_raw) {
//             newJob.markModified('salary_raw');
//           }
//           if (jobData.locations_raw) {
//             newJob.markModified('locations_raw');
//           }
//           if (jobData.location_requirements_raw) {
//             newJob.markModified('location_requirements_raw');
//           }
//           if (jobData.no_jb_schema) {
//             newJob.markModified('no_jb_schema');
//           }

//           const savedJob = await newJob.save();
//           console.log(`✅ Job saved successfully: ${savedJob._id}`);
//           savedJobs.push(savedJob);
//         } else {
//           console.log(`⚠️ Job already exists: ${jobData.id}`);
//         }
//       } catch (saveError) {
//         console.error(`❌ Error saving job ${jobData.id}:`, saveError.message);
        
//         // Log validation errors in detail
//         if (saveError.name === 'ValidationError') {
//           console.error('Validation errors:', Object.keys(saveError.errors));
//           for (let field in saveError.errors) {
//             console.error(`  ${field}: ${saveError.errors[field].message}`);
//           }
//         }
        
//         errors.push({
//           jobId: jobData.id,
//           title: jobData.title,
//           error: saveError.message
//         });
//       }
//     }

//     console.log(`💾 Database save completed:`);
//     console.log(`  ✅ Successfully saved: ${savedJobs.length} jobs`);
//     console.log(`  ❌ Failed to save: ${errors.length} jobs`);
    
//     return {
//       savedJobs,
//       errors,
//       savedCount: savedJobs.length,
//       errorCount: errors.length
//     };

//   } catch (error) {
//     console.error('❌ Database save operation failed:', error);
//     throw error;
//   }
// };

// // Search jobs function
// // const searchJobs = async (req, res, next) => {
// //   try {
// //     console.log('🔍 Job search request received');
// //     console.log('Request body:', req.body);

// //     const searchParams = req.body;
    
// //     // Fetch jobs from LinkedIn API
// //     const jobs = await jobModel.searchJobs(searchParams);
// //     await csvService.createCSVFile(jobs);

// //     console.log('✅ Jobs fetched successfully:', jobs.length);

// //     res.json({
// //       success: true,
// //       jobs: jobs,
// //       totalJobs: jobs.length,
// //       searchParams: searchParams,
// //       csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
// //       message: `Found ${jobs.length} jobs and saved to CSV`
// //     });

// //   } catch (error) {
// //     console.error('❌ Job search controller error:', error);
// //     next(error);
// //   }
// // };
// // Search jobs function with 20 specific fields CSV and database save
// // const searchJobs = async (req, res, next) => {
// //   try {
// //     console.log('🔍 Job search request received');
// //     console.log('Request body:', req.body);

// //     const searchParams = req.body;
// //     const userId = req.body.userId || req.user?.id; // Get userId from request
    
// //     // Fetch jobs from LinkedIn API
// //     const jobs = await jobModel.searchJobs(searchParams);
    
// //     // Create CSV with 20 specific fields
// //     let csvCreated = false;
// //     if (jobs.length > 0) {
// //       csvCreated = await createSpecific20FieldsCSV(jobs);
// //     }

// //     // Save to database if userId is provided
// //     let dbSaveResult = null;
// //     if (userId && jobs.length > 0) {
// //       try {
// //         dbSaveResult = await saveJobsToDatabase(jobs, userId);
// //         console.log(`💾 Database save: ${dbSaveResult.savedCount} jobs saved`);
// //       } catch (dbError) {
// //         console.error('❌ Database save error:', dbError.message);
// //       }
// //     }

// //     console.log('✅ Jobs fetched successfully:', jobs.length);

// //     res.json({
// //       success: true,
// //       jobs: jobs,
// //       totalJobs: jobs.length,
// //       searchParams: searchParams,
// //       csvFile: csvCreated ? 'linkedin_jobs_20_fields.csv' : null,
// //       databaseSave: dbSaveResult ? {
// //         savedCount: dbSaveResult.savedCount,
// //         errorCount: dbSaveResult.errorCount
// //       } : null,
// //       message: `Found ${jobs.length} jobs${csvCreated ? ', saved to CSV' : ''}${dbSaveResult ? `, saved ${dbSaveResult.savedCount} to database` : ''}`
// //     });

// //   } catch (error) {
// //     console.error('❌ Job search controller error:', error);
// //     next(error);
// //   }
// // };
// // Search jobs function with automatic 20-field database save and CSV creation
// const searchJobs = async (req, res, next) => {
//   try {
//     console.log('🔍 Job search request received');
//     console.log('Request body:', req.body);

//     const searchParams = req.body;
//     const userId = req.body.userId; // Get userId from request body
    
//     // Fetch jobs from LinkedIn API
//     const jobs = await jobModel.searchJobs(searchParams);
    
//     if (jobs.length === 0) {
//       return res.json({
//         success: true,
//         jobs: [],
//         totalJobs: 0,
//         searchParams: searchParams,
//         message: 'No jobs found'
//       });
//     }

//     // Extract only 20 specific fields for database and CSV
//     const filtered20FieldsJobs = jobs.map(job => ({
//       id: job.id,
//       source: job.source || '',
//       organization_logo: job.organization_logo || '',
//       title: job.title || '',
//       description_text: job.description_text || '',
//       seniority: job.seniority || '',
//       countries_derived: job.countries_derived || [],
//       location_type: job.location_type || '',
//       remote_derived: job.remote_derived || false,
//       salary_raw: job.salary_raw || null,
//       linkedin_org_size: job.linkedin_org_size || '',
//       linkedin_org_followers: job.linkedin_org_followers || null,
//       linkedin_org_industry: job.linkedin_org_industry || '',
//       linkedin_org_specialties: job.linkedin_org_specialties || [],
//       recruiter_name: job.recruiter_name || '',
//       recruiter_url: job.recruiter_url || '',
//       date_posted: job.date_posted || '',
//       employment_type: job.employment_type || [],
//       organization: job.organization || '',
//       url: job.url || '',
//       linkedin_org_employees: job.linkedin_org_employees || null
//     }));

//     // Create CSV with 20 specific fields
//     const csvCreated = await createSpecific20FieldsCSV(filtered20FieldsJobs);

//     // Save 20 fields to database if userId is provided
//     let dbSaveResult = null;
//     if (userId) {
//       try {
//         dbSaveResult = await save20FieldsToDatabase(filtered20FieldsJobs, userId);
//         console.log(`💾 Database save: ${dbSaveResult.savedCount} jobs saved with 20 fields`);
//       } catch (dbError) {
//         console.error('❌ Database save error:', dbError.message);
//       }
//     }

//     console.log('✅ Jobs fetched successfully:', jobs.length);

//     res.json({
//       success: true,
//       jobs: filtered20FieldsJobs, // Return only 20 fields
//       totalJobs: jobs.length,
//       searchParams: searchParams,
//       csvFile: csvCreated ? 'linkedin_jobs_20_fields.csv' : null,
//       databaseSave: dbSaveResult ? {
//         savedCount: dbSaveResult.savedCount,
//         errorCount: dbSaveResult.errorCount
//       } : null,
//       message: `Found ${jobs.length} jobs${csvCreated ? ', saved 20-field CSV' : ''}${dbSaveResult ? `, saved ${dbSaveResult.savedCount} to database` : ''}`
//     });

//   } catch (error) {
//     console.error('❌ Job search controller error:', error);
//     next(error);
//   }
// };

// // Helper function to save only 20 specific fields to database
// const save20FieldsToDatabase = async (jobs, userId) => {
//   try {
//     console.log(`💾 Starting to save ${jobs.length} jobs (20 fields) for user: ${userId}`);
    
//     // Check database connection
//     if (mongoose.connection.readyState !== 1) {
//       throw new Error('Database not connected');
//     }

//     const savedJobs = [];
//     const errors = [];
    
//     for (const jobData of jobs) {
//       try {
//         // Check if job already exists for this user
//         const existingJob = await Job.findOne({ 
//           jobId: jobData.id, 
//           userId: new mongoose.Types.ObjectId(userId)
//         });

//         if (!existingJob) {
//           console.log(`📝 Creating new job (20 fields): ${jobData.id} - ${jobData.title}`);
          
//           // Create job with only 20 specific fields
//           const newJob = new Job({
//             userId: new mongoose.Types.ObjectId(userId),
//             jobId: jobData.id,
//             source: jobData.source,
//             organization_logo: jobData.organization_logo,
//             title: jobData.title,
//             description_text: jobData.description_text,
//             seniority: jobData.seniority,
//             countries_derived: Array.isArray(jobData.countries_derived) ? jobData.countries_derived : [],
//             location_type: jobData.location_type,
//             remote_derived: Boolean(jobData.remote_derived),
//             salary_raw: jobData.salary_raw,
//             linkedin_org_size: jobData.linkedin_org_size,
//             linkedin_org_followers: jobData.linkedin_org_followers ? Number(jobData.linkedin_org_followers) : null,
//             linkedin_org_industry: jobData.linkedin_org_industry,
//             linkedin_org_specialties: Array.isArray(jobData.linkedin_org_specialties) ? jobData.linkedin_org_specialties : [],
//             recruiter_name: jobData.recruiter_name,
//             recruiter_url: jobData.recruiter_url,
//             date_posted: jobData.date_posted ? new Date(jobData.date_posted) : null,
//             employment_type: Array.isArray(jobData.employment_type) ? jobData.employment_type : [],
//             organization: jobData.organization,
//             url: jobData.url,
//             linkedin_org_employees: jobData.linkedin_org_employees ? Number(jobData.linkedin_org_employees) : null,
            
//             // Default values for other required fields
//             organization_url: '',
//             locations_derived: [],
//             cities_derived: [],
//             regions_derived: [],
//             timezones_derived: [],
//             lats_derived: [],
//             lngs_derived: [],
//             external_apply_url: '',
//             source_type: 'jobboard',
//             source_domain: '',
//             linkedin_org_url: '',
//             linkedin_org_slogan: '',
//             linkedin_org_headquarters: '',
//             linkedin_org_type: '',
//             linkedin_org_foundeddate: '',
//             linkedin_org_locations: [],
//             linkedin_org_description: '',
//             linkedin_org_recruitment_agency_derived: false,
//             linkedin_org_slug: '',
//             recruiter_title: '',
//             directapply: false,
//             locations_raw: null,
//             location_requirements_raw: null,
//             no_jb_schema: null,
//             isBookmarked: false,
//             isApplied: false,
//             notes: ''
//           });

//           // Mark Mixed fields as modified
//           if (jobData.salary_raw) {
//             newJob.markModified('salary_raw');
//           }

//           const savedJob = await newJob.save();
//           console.log(`✅ Job (20 fields) saved successfully: ${savedJob._id}`);
//           savedJobs.push(savedJob);
//         } else {
//           console.log(`⚠️ Job already exists: ${jobData.id}`);
//         }
//       } catch (saveError) {
//         console.error(`❌ Error saving job ${jobData.id}:`, saveError.message);
//         errors.push({
//           jobId: jobData.id,
//           title: jobData.title,
//           error: saveError.message
//         });
//       }
//     }

//     console.log(`💾 Database save completed (20 fields):`);
//     console.log(`  ✅ Successfully saved: ${savedJobs.length} jobs`);
//     console.log(`  ❌ Failed to save: ${errors.length} jobs`);
    
//     return {
//       savedJobs,
//       errors,
//       savedCount: savedJobs.length,
//       errorCount: errors.length
//     };

//   } catch (error) {
//     console.error('❌ Database save operation failed:', error);
//     throw error;
//   }
// };

// // Helper function to create CSV with 20 specific fields
// const createSpecific20FieldsCSV = async (jobs) => {
//   try {
//     const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
    
//     const csvWriter = createCsvWriter({
//       path: csvPath,
//       header: [
//         { id: 'source', title: 'Source' },
//         { id: 'organization_logo', title: 'Company Logo' },
//         { id: 'title', title: 'Job Title' },
//         { id: 'description_text', title: 'Job Description' },
//         { id: 'seniority', title: 'Seniority Level' },
//         { id: 'countries_derived', title: 'Countries' },
//         { id: 'location_type', title: 'Location Type' },
//         { id: 'remote_derived', title: 'Remote' },
//         { id: 'salary_raw', title: 'Salary' },
//         { id: 'linkedin_org_size', title: 'Company Size' },
//         { id: 'linkedin_org_followers', title: 'Company Followers' },
//         { id: 'linkedin_org_industry', title: 'Industry' },
//         { id: 'linkedin_org_specialties', title: 'Company Specialties' },
//         { id: 'recruiter_name', title: 'Recruiter Name' },
//         { id: 'recruiter_url', title: 'Recruiter URL' },
//         { id: 'date_posted', title: 'Date Posted' },
//         { id: 'employment_type', title: 'Employment Type' },
//         { id: 'organization', title: 'Company' },
//         { id: 'url', title: 'Job URL' },
//         { id: 'linkedin_org_employees', title: 'Company Employees' }
//       ]
//     });

//     // Transform job data for CSV
//     const transformedJobs = jobs.map(job => ({
//       source: job.source || '',
//       organization_logo: job.organization_logo || '',
//       title: job.title || '',
//       description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""').substring(0, 500) : '',
//       seniority: job.seniority || '',
//       countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
//       location_type: job.location_type || '',
//       remote_derived: job.remote_derived ? 'Yes' : 'No',
//       salary_raw: job.salary_raw ? formatSalaryForCSV(job.salary_raw) : '',
//       linkedin_org_size: job.linkedin_org_size || '',
//       linkedin_org_followers: job.linkedin_org_followers || '',
//       linkedin_org_industry: job.linkedin_org_industry || '',
//       linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
//       recruiter_name: job.recruiter_name || '',
//       recruiter_url: job.recruiter_url || '',
//       date_posted: job.date_posted || '',
//       employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
//       organization: job.organization || '',
//       url: job.url || '',
//       linkedin_org_employees: job.linkedin_org_employees || ''
//     }));

//     // Delete old CSV file if exists
//     if (await fs.pathExists(csvPath)) {
//       await fs.remove(csvPath);
//       console.log('🗑️ Old 20-fields CSV file deleted');
//     }

//     // Write new CSV with 20 specific fields
//     await csvWriter.writeRecords(transformedJobs);
//     console.log(`✅ 20-fields CSV file saved with ${jobs.length} jobs`);
    
//     return true;

//   } catch (error) {
//     console.error('❌ 20-fields CSV creation error:', error);
//     return false;
//   }
// };

// // Helper function to create CSV with 20 specific fields
// // const createSpecific20FieldsCSV = async (jobs) => {
// //   try {
// //     const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
    
// //     const csvWriter = createCsvWriter({
// //       path: csvPath,
// //       header: [
// //         { id: 'source', title: 'Source' },
// //         { id: 'organization_logo', title: 'Company Logo' },
// //         { id: 'title', title: 'Job Title' },
// //         { id: 'description_text', title: 'Job Description' },
// //         { id: 'seniority', title: 'Seniority Level' },
// //         { id: 'countries_derived', title: 'Countries' },
// //         { id: 'location_type', title: 'Location Type' },
// //         { id: 'remote_derived', title: 'Remote' },
// //         { id: 'salary_raw', title: 'Salary' },
// //         { id: 'linkedin_org_size', title: 'Company Size' },
// //         { id: 'linkedin_org_followers', title: 'Company Followers' },
// //         { id: 'linkedin_org_industry', title: 'Industry' },
// //         { id: 'linkedin_org_specialties', title: 'Company Specialties' },
// //         { id: 'recruiter_name', title: 'Recruiter Name' },
// //         { id: 'recruiter_url', title: 'Recruiter URL' },
// //         { id: 'date_posted', title: 'Date Posted' },
// //         { id: 'employment_type', title: 'Employment Type' },
// //         { id: 'organization', title: 'Company' },
// //         { id: 'url', title: 'Job URL' },
// //         { id: 'linkedin_org_employees', title: 'Company Employees' }
// //       ]
// //     });

// //     // Transform job data to include only 20 specific fields
// //     const transformedJobs = jobs.map(job => ({
// //       source: job.source || '',
// //       organization_logo: job.organization_logo || '',
// //       title: job.title || '',
// //       description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""').substring(0, 500) : '',
// //       seniority: job.seniority || '',
// //       countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
// //       location_type: job.location_type || '',
// //       remote_derived: job.remote_derived ? 'Yes' : 'No',
// //       salary_raw: job.salary_raw ? formatSalaryForCSV(job.salary_raw) : '',
// //       linkedin_org_size: job.linkedin_org_size || '',
// //       linkedin_org_followers: job.linkedin_org_followers || '',
// //       linkedin_org_industry: job.linkedin_org_industry || '',
// //       linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
// //       recruiter_name: job.recruiter_name || '',
// //       recruiter_url: job.recruiter_url || '',
// //       date_posted: job.date_posted || '',
// //       employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
// //       organization: job.organization || '',
// //       url: job.url || '',
// //       linkedin_org_employees: job.linkedin_org_employees || ''
// //     }));

// //     // Delete old CSV file if exists
// //     if (await fs.pathExists(csvPath)) {
// //       await fs.remove(csvPath);
// //       console.log('🗑️ Old 20-fields CSV file deleted');
// //     }

// //     // Write new CSV with 20 specific fields
// //     await csvWriter.writeRecords(transformedJobs);
// //     console.log(`✅ 20-fields CSV file saved with ${jobs.length} jobs`);
    
// //     return true;

// //   } catch (error) {
// //     console.error('❌ 20-fields CSV creation error:', error);
// //     return false;
// //   }
// // };
// // Auto download CSV function
// // const autoDownloadCSV = async (req, res, next) => {
// //   try {
// //     console.log("🚀 Auto download CSV triggered");
// //     console.log('Query params:', req.query);

// //     const searchParams = req.query;
    
// //     // Step 1: Fetch jobs
// //     const jobs = await jobModel.searchJobs(searchParams);

// //     if (jobs.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No jobs found with current search criteria'
// //       });
// //     }

// //     // Step 2: Create CSV file
// //     const csvCreated = await csvService.createCSVFile(jobs);

// //     if (!csvCreated) {
// //       return res.status(500).json({
// //         success: false,
// //         message: 'Failed to create CSV file'
// //       });
// //     }

// //     // Step 3: Send CSV file for download
// //     if (csvService.csvExists()) {
// //       console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
// //       res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
// //         if (err) {
// //           console.error('❌ Download error:', err);
// //           next(err);
// //         } else {
// //           console.log('✅ CSV file downloaded successfully');
// //         }
// //       });
// //     } else {
// //       res.status(404).json({ 
// //         success: false, 
// //         message: 'CSV file not found after creation' 
// //       });
// //     }

// //   } catch (error) {
// //     console.error('❌ Auto download error:', error);
// //     next(error);
// //   }
// // };
// const autoDownloadCSV = async (req, res, next) => {
//   try {
//     console.log("🚀 Auto download CSV triggered");
//     console.log('Query params:', req.query);

//     const searchParams = req.query;
    
//     // Step 1: Fetch jobs
//     const jobs = await jobModel.searchJobs(searchParams);

//     if (jobs.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No jobs found with current search criteria'
//       });
//     }

//     // Step 2: Create CSV with only specified fields
//     const csvCreated = await createSpecificFieldsCSV(jobs);

//     if (!csvCreated) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to create CSV file'
//       });
//     }

//     // Step 3: Send CSV file for download
//     const csvPath = path.join(__dirname, '../', 'linkedin_jobs_specific.csv');
//     if (fs.existsSync(csvPath)) {
//       console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
//       res.download(csvPath, 'linkedin_jobs_specific.csv', (err) => {
//         if (err) {
//           console.error('❌ Download error:', err);
//           next(err);
//         } else {
//           console.log('✅ CSV file downloaded successfully');
//         }
//       });
//     } else {
//       res.status(404).json({ 
//         success: false, 
//         message: 'CSV file not found after creation' 
//       });
//     }

//   } catch (error) {
//     console.error('❌ Auto download error:', error);
//     next(error);
//   }
// };

// // Helper function to create CSV with specific fields
// const createSpecificFieldsCSV = async (jobs) => {
//   try {
//     const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//     const fs = require('fs-extra');
//     const path = require('path');

//     const csvPath = path.join(__dirname, '../', 'linkedin_jobs_specific.csv');

//     // Define CSV headers for specific fields only
//     const csvWriter = createCsvWriter({
//       path: csvPath,
//       header: [
//         { id: 'source', title: 'Source' },
//         { id: 'organization_logo', title: 'Company Logo' },
//         { id: 'title', title: 'Job Title' },
//         { id: 'description_text', title: 'Job Description' },
//         { id: 'seniority', title: 'Seniority Level' },
//         { id: 'countries_derived', title: 'Countries' },
//         { id: 'location_type', title: 'Location Type' },
//         { id: 'remote_derived', title: 'Remote' },
//         { id: 'salary_raw', title: 'Salary' },
//         { id: 'linkedin_org_size', title: 'Company Size' },
//         { id: 'linkedin_org_followers', title: 'Company Followers' },
//         { id: 'linkedin_org_industry', title: 'Industry' },
//         { id: 'linkedin_org_specialties', title: 'Company Specialties' },
//         { id: 'recruiter_name', title: 'Recruiter Name' },
//         { id: 'recruiter_url', title: 'Recruiter URL' },
//         { id: 'date_posted', title: 'Date Posted' },
//         { id: 'employment_type', title: 'Employment Type' },
//         { id: 'organization', title: 'Company' },
//         { id: 'url', title: 'Job URL' },
//         { id: 'linkedin_org_employees', title: 'Company Employees' }
//       ]
//     });

//     // Transform job data to include only specified fields
//     const transformedJobs = jobs.map(job => ({
//       source: job.source || '',
//       organization_logo: job.organization_logo || '',
//       title: job.title || '',
//       description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""') : '',
//       seniority: job.seniority || '',
//       countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
//       location_type: job.location_type || '',
//       remote_derived: job.remote_derived ? 'Yes' : 'No',
//       salary_raw: job.salary_raw ? formatSalaryForCSV(job.salary_raw) : '',
//       linkedin_org_size: job.linkedin_org_size || '',
//       linkedin_org_followers: job.linkedin_org_followers || '',
//       linkedin_org_industry: job.linkedin_org_industry || '',
//       linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
//       recruiter_name: job.recruiter_name || '',
//       recruiter_url: job.recruiter_url || '',
//       date_posted: job.date_posted || '',
//       employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
//       organization: job.organization || '',
//       url: job.url || '',
//       linkedin_org_employees: job.linkedin_org_employees || ''
//     }));

//     // Delete old CSV file if exists
//     if (await fs.pathExists(csvPath)) {
//       await fs.remove(csvPath);
//       console.log('🗑️ Old specific CSV file deleted');
//     }

//     // Write new CSV with specific fields
//     await csvWriter.writeRecords(transformedJobs);
//     console.log(`✅ Specific fields CSV file saved with ${jobs.length} jobs`);
    
//     return true;

//   } catch (error) {
//     console.error('❌ CSV creation error:', error);
//     return false;
//   }
// };

// // Helper function to format salary for CSV
// const formatSalaryForCSV = (salaryRaw) => {
//   if (!salaryRaw?.value) return 'Not specified';
  
//   const { minValue, maxValue, unitText } = salaryRaw.value;
//   const currency = salaryRaw.currency || '';
  
//   if (minValue && maxValue) {
//     return `${currency}${minValue}-${maxValue}/${unitText || 'year'}`;
//   }
//   if (minValue) {
//     return `${currency}${minValue}+/${unitText || 'year'}`;
//   }
//   return 'Not specified';
// };



// // Save jobs to database function
// const saveJobs = async (req, res, next) => {
//   try {
//     console.log('💾 Save jobs endpoint hit (no auth)');
//     console.log('Request body keys:', Object.keys(req.body));
//     console.log('Jobs count:', req.body.jobs?.length);
//     console.log('User ID:', req.body.userId);

//     const { jobs, userId } = req.body;

//     if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
//       console.log('❌ No jobs provided');
//       return res.status(400).json({
//         success: false,
//         message: 'No jobs provided or invalid format'
//       });
//     }

//     if (!userId) {
//       console.log('❌ No userId provided');
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required'
//       });
//     }

//     // Validate userId format
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       console.log('❌ Invalid userId format:', userId);
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     console.log('✅ Starting database save operation...');
//     const result = await saveJobsToDatabase(jobs, userId);
    
//     res.json({
//       success: true,
//       message: `Successfully processed ${jobs.length} jobs`,
//       savedCount: result.savedCount,
//       errorCount: result.errorCount,
//       totalJobs: jobs.length,
//       errors: result.errors.length > 0 ? result.errors : undefined
//     });

//   } catch (error) {
//     console.error('❌ Save jobs endpoint error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to save jobs to database',
//       error: error.message
//     });
//   }
// };

// // Get saved jobs function
// const getSavedJobs = async (req, res, next) => {
//   try {
//     console.log('📋 Get saved jobs endpoint hit');
//     const { userId, page = 1, limit = 20, search, location, remote } = req.query;
    
//     console.log('Query params:', { userId, page, limit, search, location, remote });

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required as query parameter'
//       });
//     }

//     // Validate userId format
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     const skip = (page - 1) * limit;
    
//     // Build query
//     const query = { userId: new mongoose.Types.ObjectId(userId) };
    
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { organization: { $regex: search, $options: 'i' } },
//         { description_text: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (location) {
//       query.locations_derived = { $regex: location, $options: 'i' };
//     }
    
//     if (remote !== undefined) {
//       query.remote_derived = remote === 'true';
//     }

//     console.log('Database query:', query);

//     const jobs = await Job.find(query)
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip(skip);

//     const total = await Job.countDocuments(query);

//     console.log(`✅ Found ${jobs.length} saved jobs for user ${userId}`);

//     res.json({
//       success: true,
//       jobs,
//       pagination: {
//         current: parseInt(page),
//         total: Math.ceil(total / limit),
//         count: jobs.length,
//         totalJobs: total
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get saved jobs error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get saved jobs',
//       error: error.message
//     });
//   }
// };

// // Delete saved job function
// const deleteSavedJob = async (req, res, next) => {
//   try {
//     const { jobId } = req.params;
//     const { userId } = req.body;

//     console.log('🗑️ Delete job request:', { jobId, userId });

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required'
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     const deletedJob = await Job.findOneAndDelete({ 
//       jobId, 
//       userId: new mongoose.Types.ObjectId(userId)
//     });

//     if (!deletedJob) {
//       return res.status(404).json({
//         success: false,
//         message: 'Job not found'
//       });
//     }

//     console.log('✅ Job deleted successfully:', jobId);

//     res.json({
//       success: true,
//       message: 'Job deleted successfully'
//     });

//   } catch (error) {
//     console.error('❌ Delete job error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete job',
//       error: error.message
//     });
//   }
// };

// // Clear all saved jobs function
// const clearAllSavedJobs = async (req, res, next) => {
//   try {
//     const { userId } = req.body;

//     console.log('🗑️ Clear all jobs request for user:', userId);

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required'
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     const result = await Job.deleteMany({ 
//       userId: new mongoose.Types.ObjectId(userId) 
//     });

//     console.log(`✅ Cleared ${result.deletedCount} jobs for user ${userId}`);

//     res.json({
//       success: true,
//       message: `Cleared ${result.deletedCount} saved jobs`,
//       deletedCount: result.deletedCount
//     });

//   } catch (error) {
//     console.error('❌ Clear jobs error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to clear jobs',
//       error: error.message
//     });
//   }
// };

// // Toggle bookmark function
// const toggleBookmark = async (req, res, next) => {
//   try {
//     const { jobId } = req.params;
//     const { userId } = req.body;

//     console.log('⭐ Toggle bookmark request:', { jobId, userId });

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required'
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     const job = await Job.findOne({ 
//       jobId, 
//       userId: new mongoose.Types.ObjectId(userId) 
//     });

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: 'Job not found'
//       });
//     }

//     job.isBookmarked = !job.isBookmarked;
//     await job.save();

//     console.log(`✅ Job ${job.isBookmarked ? 'bookmarked' : 'unbookmarked'}:`, jobId);

//     res.json({
//       success: true,
//       message: job.isBookmarked ? 'Job bookmarked' : 'Job unbookmarked',
//       isBookmarked: job.isBookmarked
//     });

//   } catch (error) {
//     console.error('❌ Toggle bookmark error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to toggle bookmark',
//       error: error.message
//     });
//   }
// };

// // Mark job as applied function
// const markAsApplied = async (req, res, next) => {
//   try {
//     const { jobId } = req.params;
//     const { userId } = req.body;

//     console.log('✅ Mark as applied request:', { jobId, userId });

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required'
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     const job = await Job.findOne({ 
//       jobId, 
//       userId: new mongoose.Types.ObjectId(userId) 
//     });

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: 'Job not found'
//       });
//     }

//     job.isApplied = true;
//     await job.save();

//     console.log('✅ Job marked as applied:', jobId);

//     res.json({
//       success: true,
//       message: 'Job marked as applied',
//       isApplied: job.isApplied
//     });

//   } catch (error) {
//     console.error('❌ Mark applied error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to mark as applied',
//       error: error.message
//     });
//   }
// };

// // Get job statistics function
// const getJobStats = async (req, res, next) => {
//   try {
//     const { userId } = req.query;

//     console.log('📊 Get job stats request for user:', userId);

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required as query parameter'
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid user ID format'
//       });
//     }

//     const stats = await Job.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       {
//         $group: {
//           _id: null,
//           totalJobs: { $sum: 1 },
//           remoteJobs: { $sum: { $cond: ['$remote_derived', 1, 0] } },
//           bookmarkedJobs: { $sum: { $cond: ['$isBookmarked', 1, 0] } },
//           appliedJobs: { $sum: { $cond: ['$isApplied', 1, 0] } }
//         }
//       }
//     ]);

//     const result = stats[0] || {
//       totalJobs: 0,
//       remoteJobs: 0,
//       bookmarkedJobs: 0,
//       appliedJobs: 0
//     };

//     console.log('✅ Job stats:', result);

//     res.json({
//       success: true,
//       stats: result
//     });

//   } catch (error) {
//     console.error('❌ Get job stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get job statistics',
//       error: error.message
//     });
//   }
// };



// // Export the new function with your existing exports

// // Health check function
// const healthCheck = (req, res) => {
//   res.json({ 
//     message: "LinkedIn Job Search API is running!",
//     endpoints: {
//       "POST /api/jobs": "Search jobs and create CSV",
//       "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
//       "POST /api/save-jobs": "Save jobs to database",
//       "GET /api/saved-jobs": "Get saved jobs for user",
//       "DELETE /api/saved-jobs/:jobId": "Delete specific saved job",
//       "DELETE /api/saved-jobs": "Clear all saved jobs",
//       "PUT /api/saved-jobs/:jobId/bookmark": "Toggle bookmark",
//       "PUT /api/saved-jobs/:jobId/applied": "Mark as applied",
//       "GET /api/job-stats": "Get job statistics"
//     },
//     database: {
//       connected: mongoose.connection.readyState === 1,
//       name: mongoose.connection.name,
//       host: mongoose.connection.host
//     },
//     timestamp: new Date().toISOString()
//   });
// };


// // Export all functions
// module.exports = {
//   searchJobs,
//   autoDownloadCSV,
//   saveJobs,
//   getSavedJobs,
//   deleteSavedJob,
//   clearAllSavedJobs,
//   toggleBookmark,
//   markAsApplied,
//   getJobStats,
//   healthCheck,
//   saveJobsToDatabase, // Export helper function too
//   //  getDummyJobs, // Add this new export
//      createSpecificFieldsCSV // Export helper function

// };
const jobModel = require('../models/jobModel');
const Job = require('../models/jobSchema');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs-extra');
const path = require('path');

// Helper function to format salary for CSV
const formatSalaryForCSV = (salaryRaw) => {
  if (!salaryRaw?.value) return 'Not specified';
  
  const { minValue, maxValue, unitText } = salaryRaw.value;
  const currency = salaryRaw.currency || '';
  
  if (minValue && maxValue) {
    return `${currency}${minValue}-${maxValue}/${unitText || 'year'}`;
  }
  if (minValue) {
    return `${currency}${minValue}+/${unitText || 'year'}`;
  }
  return 'Not specified';
};

// Search jobs function with 20 specific fields CSV and database save
const searchJobs = async (req, res, next) => {
  try {
    console.log('🔍 Job search request received');
    console.log('Request body:', req.body);

    const searchParams = req.body;
    const userId = req.body.userId; // Get userId from request body
    
    // Fetch jobs from LinkedIn API
    const jobs = await jobModel.searchJobs(searchParams);
    
    if (jobs.length === 0) {
      return res.json({
        success: true,
        jobs: [],
        totalJobs: 0,
        searchParams: searchParams,
        message: 'No jobs found'
      });
    }

    // Create CSV with 20 specific fields
    const csvCreated = await createSpecific20FieldsCSV(jobs);

    // Save 20 fields to database if userId is provided
    let dbSaveResult = null;
    if (userId) {
      try {
        dbSaveResult = await save20FieldsToDatabase(jobs, userId);
        console.log(`💾 Database save: ${dbSaveResult.savedCount} jobs saved with 20 fields`);
      } catch (dbError) {
        console.error('❌ Database save error:', dbError.message);
      }
    }

    // Return only 20 fields to frontend
    const filtered20FieldsJobs = jobs.map(job => ({
      id: job.id,
      source: job.source || '',
      organization_logo: job.organization_logo || '',
      title: job.title || '',
      description_text: job.description_text || '',
      seniority: job.seniority || '',
      countries_derived: job.countries_derived || [],
      location_type: job.location_type || '',
      remote_derived: job.remote_derived || false,
      salary_raw: job.salary_raw || null,
      linkedin_org_size: job.linkedin_org_size || '',
      linkedin_org_followers: job.linkedin_org_followers || null,
      linkedin_org_industry: job.linkedin_org_industry || '',
      linkedin_org_specialties: job.linkedin_org_specialties || [],
      recruiter_name: job.recruiter_name || '',
      recruiter_url: job.recruiter_url || '',
      date_posted: job.date_posted || '',
      employment_type: job.employment_type || [],
      organization: job.organization || '',
      url: job.url || '',
      linkedin_org_employees: job.linkedin_org_employees || null
    }));

    console.log('✅ Jobs fetched successfully:', jobs.length);

    res.json({
      success: true,
      jobs: filtered20FieldsJobs,
      totalJobs: jobs.length,
      searchParams: searchParams,
      csvFile: csvCreated ? 'linkedin_jobs_20_fields.csv' : null,
      databaseSave: dbSaveResult ? {
        savedCount: dbSaveResult.savedCount,
        errorCount: dbSaveResult.errorCount
      } : null,
      message: `Found ${jobs.length} jobs${csvCreated ? ', saved 20-field CSV' : ''}${dbSaveResult ? `, saved ${dbSaveResult.savedCount} to database` : ''}`
    });

  } catch (error) {
    console.error('❌ Job search controller error:', error);
    next(error);
  }
};

// Helper function to save only 20 specific fields to database
const save20FieldsToDatabase = async (jobs, userId) => {
  try {
    console.log(`💾 Starting to save ${jobs.length} jobs (20 fields) for user: ${userId}`);
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const savedJobs = [];
    const errors = [];
    
    for (const jobData of jobs) {
      try {
        // Check if job already exists for this user
        const existingJob = await Job.findOne({ 
          jobId: jobData.id, 
          userId: new mongoose.Types.ObjectId(userId)
        });

        if (!existingJob) {
          console.log(`📝 Creating new job (20 fields): ${jobData.id} - ${jobData.title}`);
          
          // Create job with only 20 specific fields
          const newJob = new Job({
            userId: new mongoose.Types.ObjectId(userId),
            jobId: jobData.id,
            
            // ONLY these 20 fields will be saved
            source: jobData.source || '',
            organization_logo: jobData.organization_logo || '',
            title: jobData.title || '',
            description_text: jobData.description_text || '',
            seniority: jobData.seniority || '',
            countries_derived: Array.isArray(jobData.countries_derived) ? jobData.countries_derived : [],
            location_type: jobData.location_type || '',
            remote_derived: Boolean(jobData.remote_derived),
            salary_raw: jobData.salary_raw || null,
            linkedin_org_size: jobData.linkedin_org_size || '',
            linkedin_org_followers: jobData.linkedin_org_followers ? Number(jobData.linkedin_org_followers) : null,
            linkedin_org_industry: jobData.linkedin_org_industry || '',
            linkedin_org_specialties: Array.isArray(jobData.linkedin_org_specialties) ? jobData.linkedin_org_specialties : [],
            recruiter_name: jobData.recruiter_name || '',
            recruiter_url: jobData.recruiter_url || '',
            date_posted: jobData.date_posted ? new Date(jobData.date_posted) : null,
            employment_type: Array.isArray(jobData.employment_type) ? jobData.employment_type : [],
            organization: jobData.organization || '',
            url: jobData.url || '',
            linkedin_org_employees: jobData.linkedin_org_employees ? Number(jobData.linkedin_org_employees) : null
          });

          // Mark Mixed fields as modified
          if (jobData.salary_raw) {
            newJob.markModified('salary_raw');
          }

          const savedJob = await newJob.save();
          console.log(`✅ Job (20 fields) saved successfully: ${savedJob._id}`);
          savedJobs.push(savedJob);
        } else {
          console.log(`⚠️ Job already exists: ${jobData.id}`);
        }
      } catch (saveError) {
        console.error(`❌ Error saving job ${jobData.id}:`, saveError.message);
        errors.push({
          jobId: jobData.id,
          title: jobData.title,
          error: saveError.message
        });
      }
    }

    console.log(`💾 Database save completed (20 fields):`);
    console.log(`  ✅ Successfully saved: ${savedJobs.length} jobs`);
    console.log(`  ❌ Failed to save: ${errors.length} jobs`);
    
    return {
      savedJobs,
      errors,
      savedCount: savedJobs.length,
      errorCount: errors.length
    };

  } catch (error) {
    console.error('❌ Database save operation failed:', error);
    throw error;
  }
};

// Create CSV with 20 specific fields using API field names as headers
const createSpecific20FieldsCSV = async (jobs) => {
  try {
    const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
    
    console.log('📝 Creating 20-fields CSV at:', csvPath);
    
    const csvWriter = createCsvWriter({
      path: csvPath,
      header: [
        { id: 'source', title: 'source' },
        { id: 'organization_logo', title: 'organization_logo' },
        { id: 'title', title: 'title' },
        { id: 'description_text', title: 'description_text' },
        { id: 'seniority', title: 'seniority' },
        { id: 'countries_derived', title: 'countries_derived' },
        { id: 'location_type', title: 'location_type' },
        { id: 'remote_derived', title: 'remote_derived' },
        { id: 'salary_raw', title: 'salary_raw' },
        { id: 'linkedin_org_size', title: 'linkedin_org_size' },
        { id: 'linkedin_org_followers', title: 'linkedin_org_followers' },
        { id: 'linkedin_org_industry', title: 'linkedin_org_industry' },
        { id: 'linkedin_org_specialties', title: 'linkedin_org_specialties' },
        { id: 'recruiter_name', title: 'recruiter_name' },
        { id: 'recruiter_url', title: 'recruiter_url' },
        { id: 'date_posted', title: 'date_posted' },
        { id: 'employment_type', title: 'employment_type' },
        { id: 'organization', title: 'organization' },
        { id: 'url', title: 'url' },
        { id: 'linkedin_org_employees', title: 'linkedin_org_employees' }
      ]
    });

    // Transform job data for CSV
    const transformedJobs = jobs.map(job => ({
      source: job.source || '',
      organization_logo: job.organization_logo || '',
      title: job.title || '',
      description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""').substring(0, 500) : '',
      seniority: job.seniority || '',
      countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
      location_type: job.location_type || '',
      remote_derived: job.remote_derived ? 'Yes' : 'No',
      salary_raw: job.salary_raw ? formatSalaryForCSV(job.salary_raw) : '',
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

    // Delete old CSV file if exists
    if (await fs.pathExists(csvPath)) {
      await fs.remove(csvPath);
      console.log('🗑️ Old 20-fields CSV file deleted');
    }

    // Write new CSV with 20 specific fields
    await csvWriter.writeRecords(transformedJobs);
    console.log(`✅ 20-fields CSV file created successfully with ${jobs.length} jobs`);
    console.log(`📁 CSV file location: ${csvPath}`);
    
    return true;

  } catch (error) {
    console.error('❌ 20-fields CSV creation error:', error);
    return false;
  }
};

// Auto download CSV2 function with specific fields
const autoDownloadCSV2 = async (req, res, next) => {
  try {
    console.log("🚀 Auto download CSV2 triggered (20 specific fields)");
    console.log('Query params:', req.query);

    const searchParams = req.query;
    
    // Step 1: Fetch jobs
    const jobs = await jobModel.searchJobs(searchParams);

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found with current search criteria'
      });
    }

    // Step 2: Create CSV with 20 specific fields
    const csvCreated = await createSpecific20FieldsCSV(jobs);

    if (!csvCreated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create 20-fields CSV file'
      });
    }

    // Step 3: Send CSV file for download
    const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
    
    if (fs.existsSync(csvPath)) {
      console.log(`📥 Sending 20-fields CSV with ${jobs.length} jobs for download`);
      res.download(csvPath, 'linkedin_jobs_20_fields.csv', (err) => {
        if (err) {
          console.error('❌ Download error:', err);
          next(err);
        } else {
          console.log('✅ 20-fields CSV downloaded successfully');
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: '20-fields CSV file not found after creation' 
      });
    }

  } catch (error) {
    console.error('❌ Auto download CSV2 error:', error);
    next(error);
  }
};

// Get saved jobs function
const getSavedJobs = async (req, res, next) => {
  try {
    console.log('📋 Get saved jobs endpoint hit');
    const { userId, page = 1, limit = 20, search, location, remote } = req.query;
    
    console.log('Query params:', { userId, page, limit, search, location, remote });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required as query parameter'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const skip = (page - 1) * limit;
    
    // Build query
    const query = { userId: new mongoose.Types.ObjectId(userId) };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description_text: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.locations_derived = { $regex: location, $options: 'i' };
    }
    
    if (remote !== undefined) {
      query.remote_derived = remote === 'true';
    }

    console.log('Database query:', query);

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Job.countDocuments(query);

    console.log(`✅ Found ${jobs.length} saved jobs for user ${userId}`);

    res.json({
      success: true,
      jobs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: jobs.length,
        totalJobs: total
      }
    });

  } catch (error) {
    console.error('❌ Get saved jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved jobs',
      error: error.message
    });
  }
};

// Delete saved job function
const deleteSavedJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    console.log('🗑️ Delete job request:', { jobId, userId });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const deletedJob = await Job.findOneAndDelete({ 
      jobId, 
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    console.log('✅ Job deleted successfully:', jobId);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// Clear all saved jobs function
const clearAllSavedJobs = async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log('🗑️ Clear all jobs request for user:', userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const result = await Job.deleteMany({ 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    console.log(`✅ Cleared ${result.deletedCount} jobs for user ${userId}`);

    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} saved jobs`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('❌ Clear jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear jobs',
      error: error.message
    });
  }
};

// Toggle bookmark function
const toggleBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    console.log('⭐ Toggle bookmark request:', { jobId, userId });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const job = await Job.findOne({ 
      jobId, 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.isBookmarked = !job.isBookmarked;
    await job.save();

    console.log(`✅ Job ${job.isBookmarked ? 'bookmarked' : 'unbookmarked'}:`, jobId);

    res.json({
      success: true,
      message: job.isBookmarked ? 'Job bookmarked' : 'Job unbookmarked',
      isBookmarked: job.isBookmarked
    });

  } catch (error) {
    console.error('❌ Toggle bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle bookmark',
      error: error.message
    });
  }
};

// Mark job as applied function
const markAsApplied = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body;

    console.log('✅ Mark as applied request:', { jobId, userId });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const job = await Job.findOne({ 
      jobId, 
      userId: new mongoose.Types.ObjectId(userId) 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    job.isApplied = true;
    await job.save();

    console.log('✅ Job marked as applied:', jobId);

    res.json({
      success: true,
      message: 'Job marked as applied',
      isApplied: job.isApplied
    });

  } catch (error) {
    console.error('❌ Mark applied error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as applied',
      error: error.message
    });
  }
};

// Get job statistics function
const getJobStats = async (req, res, next) => {
  try {
    const { userId } = req.query;

    console.log('📊 Get job stats request for user:', userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required as query parameter'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const stats = await Job.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          remoteJobs: { $sum: { $cond: ['$remote_derived', 1, 0] } },
          bookmarkedJobs: { $sum: { $cond: ['$isBookmarked', 1, 0] } },
          appliedJobs: { $sum: { $cond: ['$isApplied', 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      totalJobs: 0,
      remoteJobs: 0,
      bookmarkedJobs: 0,
      appliedJobs: 0
    };

    console.log('✅ Job stats:', result);

    res.json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error('❌ Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job statistics',
      error: error.message
    });
  }
};

// Get dummy jobs function
const getDummyJobs = (req, res) => {
  try {
    const dummyJobs = [
      {
        id: "1",
        jobTitle: "Senior Software Engineer",
        datePosted: "2025-01-15",
        company: "TechCorp",
        source: "linkedin",
        companyLogo: "https://via.placeholder.com/100x100?text=TechCorp",
        locations: ["New York, NY"],
        remote: true,
        recruiterName: "John Smith",
        companySize: "1000+ employees",
        companyFollowers: 50000,
        seniorityLevel: "Senior",
        jobDescription: "We are looking for a senior software engineer to join our team...",
        jobUrl: "https://example.com/job1",
        tier: "Green"
      },
      {
        id: "2",
        jobTitle: "UI/UX Designer",
        datePosted: "2025-01-14",
        company: "DesignHub",
        source: "linkedin",
        companyLogo: "https://via.placeholder.com/100x100?text=DesignHub",
        locations: ["San Francisco, CA"],
        remote: false,
        recruiterName: "Sarah Johnson",
        companySize: "100-500 employees",
        companyFollowers: 25000,
        seniorityLevel: "Mid-level",
        jobDescription: "Join our creative team as a UI/UX designer...",
        jobUrl: "https://example.com/job2",
        tier: "Yellow"
      },
      {
        id: "3",
        jobTitle: "Data Scientist",
        datePosted: "2025-01-13",
        company: "DataTech",
        source: "linkedin",
        companyLogo: "https://via.placeholder.com/100x100?text=DataTech",
        locations: ["Austin, TX"],
        remote: true,
        recruiterName: "Mike Wilson",
        companySize: "500-1000 employees",
        companyFollowers: 75000,
        seniorityLevel: "Senior",
        jobDescription: "Analyze complex data sets and build machine learning models...",
        jobUrl: "https://example.com/job3",
        tier: "Green"
      }
    ];

    res.json({
      success: true,
      totalJobs: dummyJobs.length,
      jobs: dummyJobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get dummy jobs',
      error: error.message
    });
  }
};

// Health check function
const healthCheck = (req, res) => {
  res.json({ 
    message: "LinkedIn Job Search API is running!",
    endpoints: {
      "POST /api/jobs": "Search jobs and save 20 fields to database + CSV",
      "GET /api/auto-download-csv2": "Auto fetch jobs and download 20-field CSV",
      "GET /api/download-20-fields-csv": "Download 20-fields CSV file",
      "GET /api/saved-jobs": "Get saved jobs for user",
      "DELETE /api/saved-jobs/:jobId": "Delete specific saved job",
      "DELETE /api/saved-jobs": "Clear all saved jobs",
      "PUT /api/saved-jobs/:jobId/bookmark": "Toggle bookmark",
      "PUT /api/saved-jobs/:jobId/applied": "Mark as applied",
      "GET /api/job-stats": "Get job statistics",
      "GET /api/dummy-jobs": "Get dummy job data"
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name,
      host: mongoose.connection.host
    },
    timestamp: new Date().toISOString()
  });
};

// Export all functions
module.exports = {
  searchJobs,
  autoDownloadCSV2,
  getSavedJobs,
  deleteSavedJob,
  clearAllSavedJobs,
  toggleBookmark,
  markAsApplied,
  getJobStats,
  healthCheck,
  getDummyJobs,
  save20FieldsToDatabase,
  createSpecific20FieldsCSV
};
