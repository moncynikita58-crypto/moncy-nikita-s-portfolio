import { useState } from "react";
import { getJobListings, addJobListing, deleteJobListing, updateJobListing, type JobListing } from "@/lib/careersData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit, X, Save } from "lucide-react";

const emptyJob = {
  title: "", category: "", location: "", type: "Full-time",
  description: "", requirements: [""], deadline: "",
};

const AdminPage = () => {
  const [jobs, setJobs] = useState(getJobListings());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyJob>(emptyJob);

  const refresh = () => setJobs(getJobListings());

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleDelete = (id: string) => {
    if (confirm("Delete this listing?")) {
      deleteJobListing(id);
      refresh();
    }
  };

  const handleEdit = (job: JobListing) => {
    setEditingId(job.id);
    setForm({
      title: job.title, category: job.category, location: job.location,
      type: job.type, description: job.description,
      requirements: job.requirements, deadline: job.deadline,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, requirements: form.requirements.filter(Boolean) };
    if (editingId) {
      updateJobListing(editingId, data);
    } else {
      addJobListing(data);
    }
    setForm(emptyJob);
    setShowForm(false);
    setEditingId(null);
    refresh();
  };

  const addReq = () => setForm((p) => ({ ...p, requirements: [...p.requirements, ""] }));
  const updateReq = (i: number, v: string) =>
    setForm((p) => ({ ...p, requirements: p.requirements.map((r, idx) => (idx === i ? v : r)) }));
  const removeReq = (i: number) =>
    setForm((p) => ({ ...p, requirements: p.requirements.filter((_, idx) => idx !== i) }));

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-foreground text-background py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Infinite Insight — Admin Panel</h1>
        <a href="/" className="text-sm text-primary-foreground hover:underline">← Back to Site</a>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Manage Career Listings</h2>
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyJob); }}>
            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Listing</>}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
            <h3 className="font-bold text-foreground">{editingId ? "Edit Listing" : "Create New Listing"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Job Title *</label>
                <Input required value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Category *</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={form.category} onChange={(e) => update("category", e.target.value)}>
                  <option value="">Select</option>
                  <option value="Field Data Collection">Field Data Collection</option>
                  <option value="Research">Research</option>
                  <option value="Sorting">Sorting</option>
                  <option value="Administration">Administration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Location *</label>
                <Input required value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Type *</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Deadline *</label>
                <Input type="date" required value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Description *</label>
              <Textarea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Requirements</label>
              {form.requirements.map((r, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input value={r} onChange={(e) => updateReq(i, e.target.value)} placeholder={`Requirement ${i + 1}`} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeReq(i)}><X className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addReq}><Plus className="w-3 h-3 mr-1" /> Add Requirement</Button>
            </div>
            <div className="flex justify-end">
              <Button type="submit"><Save className="w-4 h-4 mr-1" /> {editingId ? "Update" : "Create"} Listing</Button>
            </div>
          </form>
        )}

        {/* Listings Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-foreground">Title</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Category</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Type</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Deadline</th>
                <th className="text-right p-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No listings yet</td></tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-t border-border">
                    <td className="p-3 text-foreground font-medium">{job.title}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{job.category}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{job.type}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{job.deadline}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
