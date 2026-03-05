import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getJobById } from "@/lib/careersData";
import { MapPin, Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const kenyanCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans-Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia", "South Africa", "Nigeria", "Ghana"];

const CareerApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = getJobById(id || "");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", idNumber: "",
    gender: "", dateOfBirth: "", country: "", county: "", constituency: "",
    ward: "", education: "", experience: "", coverLetter: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="py-16 text-center">
          <p className="text-muted-foreground mb-4">Job listing not found.</p>
          <Link to="/careers" className="text-primary hover:underline">← Back to Careers</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="py-16">
          <div className="container mx-auto max-w-2xl px-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for applying for <strong>{job.title}</strong>. We will review your application and get back to you.
            </p>
            <Link to="/careers" className="text-primary hover:underline font-semibold">← Back to Careers</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-6">
          <Link to="/careers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>

          {/* Job Details */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{job.category}</span>
              <span className="text-xs text-muted-foreground">{job.type}</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Deadline: {job.deadline}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
            <h3 className="text-sm font-bold text-foreground mb-2">Requirements:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Application Form */}
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">Application Form</h2>
          <form
            className="space-y-6"
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          >
            {/* Personal Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">First Name *</label>
                  <Input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Last Name *</label>
                  <Input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Email Address *</label>
                  <Input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Phone Number *</label>
                  <Input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">ID / Passport Number *</label>
                  <Input required value={form.idNumber} onChange={(e) => update("idNumber", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Gender</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Date of Birth</label>
                  <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Regional Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Region</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Country *</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={form.country} onChange={(e) => update("country", e.target.value)}>
                    <option value="">Select Country</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">County</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.county} onChange={(e) => update("county", e.target.value)}>
                    <option value="">Select County</option>
                    {kenyanCounties.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Constituency</label>
                  <Input placeholder="Enter constituency" value={form.constituency} onChange={(e) => update("constituency", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Ward</label>
                  <Input placeholder="Enter ward" value={form.ward} onChange={(e) => update("ward", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Qualifications</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Highest Education Level</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.education} onChange={(e) => update("education", e.target.value)}>
                    <option value="">Select</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Years of Relevant Experience</label>
                  <Input type="number" min="0" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Cover Letter / Additional Information</label>
                  <Textarea rows={5} value={form.coverLetter} onChange={(e) => update("coverLetter", e.target.value)} placeholder="Tell us why you are a good fit for this role..." />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="px-10">
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CareerApplyPage;
