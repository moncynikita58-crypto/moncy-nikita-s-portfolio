export interface JobListing {
  id: string;
  title: string;
  category: string;
  location: string;
  type: string; // Full-time, Part-time, Contract
  description: string;
  requirements: string[];
  deadline: string;
  regions?: {
    countries: string[];
    counties?: string[];
    constituencies?: string[];
    wards?: string[];
  };
}

// Sample data — admin panel will manage these in-memory for now
let jobListings: JobListing[] = [
  {
    id: "1",
    title: "Field Data Collection Enumerator",
    category: "Field Data Collection",
    location: "Nairobi, Kenya",
    type: "Contract",
    description: "We are seeking experienced enumerators for an upcoming household survey across multiple counties in Kenya. The role involves conducting face-to-face interviews using mobile data collection tools.",
    requirements: [
      "Minimum 2 years experience in field data collection",
      "Proficiency in ODK/SurveyCTO or similar platforms",
      "Fluency in English and Kiswahili",
      "Willingness to travel to rural areas",
      "Valid national ID",
    ],
    deadline: "2026-04-15",
    regions: {
      countries: ["Kenya"],
      counties: ["Nairobi", "Kiambu", "Nakuru", "Mombasa"],
    },
  },
  {
    id: "2",
    title: "Research Analyst",
    category: "Research",
    location: "Nairobi, Kenya",
    type: "Full-time",
    description: "Join our analytics team to support quantitative and qualitative research projects across Sub-Saharan Africa. You will be responsible for data analysis, report writing, and client presentations.",
    requirements: [
      "Degree in Statistics, Economics, Social Sciences or related field",
      "3+ years experience in market or social research",
      "Proficiency in SPSS, Stata, or R",
      "Strong report writing skills",
      "Experience with survey design",
    ],
    deadline: "2026-04-30",
  },
  {
    id: "3",
    title: "Data Sorting & Cleaning Specialist",
    category: "Sorting",
    location: "Remote / Nairobi",
    type: "Part-time",
    description: "We need detail-oriented professionals to assist with data cleaning, coding, and sorting for large-scale survey datasets.",
    requirements: [
      "Experience with data cleaning and validation",
      "Proficiency in Excel and/or Python",
      "Attention to detail",
      "Ability to meet tight deadlines",
    ],
    deadline: "2026-03-31",
    regions: {
      countries: ["Kenya", "Uganda", "Tanzania"],
    },
  },
];

export const getJobListings = (): JobListing[] => [...jobListings];

export const getJobById = (id: string): JobListing | undefined =>
  jobListings.find((j) => j.id === id);

export const addJobListing = (job: Omit<JobListing, "id">): JobListing => {
  const newJob = { ...job, id: Date.now().toString() };
  jobListings = [...jobListings, newJob];
  return newJob;
};

export const updateJobListing = (id: string, updates: Partial<JobListing>): void => {
  jobListings = jobListings.map((j) => (j.id === id ? { ...j, ...updates } : j));
};

export const deleteJobListing = (id: string): void => {
  jobListings = jobListings.filter((j) => j.id !== id);
};
