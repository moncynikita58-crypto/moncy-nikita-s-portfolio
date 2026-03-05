import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import { getJobListings } from "@/lib/careersData";
import { MapPin, Clock, Briefcase, Calendar } from "lucide-react";

const CareersPage = () => {
  const jobs = getJobListings();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">Careers</h1>

          <p className="text-base text-muted-foreground mb-6 max-w-3xl leading-relaxed">
            At Infinite Insight, we are looking out for research professionals with excellent communication skills, strong analytical capability, imagination and a passion for developing enduring partnerships with our clients to make a real difference to their businesses.
          </p>

          <p className="text-base text-muted-foreground mb-6 max-w-3xl leading-relaxed">
            In return, we offer exciting reward, development and progression opportunities.
          </p>

          <p className="text-base text-muted-foreground mb-6 max-w-3xl leading-relaxed">
            You may submit your application by sending your CV to{" "}
            <a href="mailto:hr@infiniteinsight.net" className="text-primary hover:underline">
              hr@infiniteinsight.net
            </a>
          </p>

          <p className="text-base font-bold italic text-foreground mb-10 max-w-3xl leading-relaxed">
            Please note that applicants without proven track record and 2 years experience in a reputable market research agency will not be considered.
          </p>

          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-heading font-bold text-accent mb-6">Current Job Openings:</h2>

            {jobs.length === 0 ? (
              <p className="text-muted-foreground">No vacancies currently</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/careers/${job.id}`}
                    className="group block border border-border rounded-lg p-6 bg-card hover:shadow-lg hover:border-primary transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
                        {job.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{job.type}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Deadline: {job.deadline}</span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-primary group-hover:underline">
                      Apply Now →
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CareersPage;
