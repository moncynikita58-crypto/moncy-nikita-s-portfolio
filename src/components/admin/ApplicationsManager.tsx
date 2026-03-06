import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  job_listing_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_number: string;
  gender: string;
  country: string;
  county: string;
  education: string;
  experience: string;
  cover_letter: string;
  status: string;
  admin_feedback: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  reviewed: "bg-secondary text-secondary-foreground",
  invited: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
};

const ApplicationsManager = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [inviteForm, setInviteForm] = useState({
    feedback: "Congratulations! You have been selected for the next stage of the recruitment process.",
    webinar_link: "",
    webinar_date: "",
    webinar_description: "Please join our online interview/webinar session. Ensure you have a stable internet connection and a quiet environment.",
  });
  const [sendingInvite, setSendingInvite] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setApplications(data);
    setLoading(false);
  };

  useEffect(() => { loadApplications(); }, []);

  const handleSendInvitation = async () => {
    if (!selectedApp) return;
    setSendingInvite(true);
    try {
      const res = await supabase.functions.invoke("send-invitation", {
        body: {
          application_id: selectedApp.id,
          feedback: inviteForm.feedback,
          webinar_link: inviteForm.webinar_link || null,
          webinar_date: inviteForm.webinar_date || null,
          webinar_description: inviteForm.webinar_description || null,
        },
      });
      if (res.error) throw res.error;
      const data = res.data as any;
      toast({ title: "Invitation Sent!", description: `Invitation link created for ${selectedApp.first_name}.` });
      if (data?.invitation?.url) {
        navigator.clipboard.writeText(data.invitation.url);
        toast({ title: "Link Copied!", description: "The invitation link has been copied to your clipboard." });
      }
      setSelectedApp(null);
      loadApplications();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send invitation", variant: "destructive" });
    }
    setSendingInvite(false);
  };

  if (selectedApp) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedApp(null)}>← Back to list</Button>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">{selectedApp.first_name} {selectedApp.last_name}</h3>
            <span className={`text-xs px-2 py-1 rounded font-semibold ${statusColors[selectedApp.status] || "bg-muted text-muted-foreground"}`}>
              {selectedApp.status.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong className="text-foreground">Job:</strong> <span className="text-muted-foreground">{selectedApp.job_title}</span></div>
            <div><strong className="text-foreground">Email:</strong> <span className="text-muted-foreground">{selectedApp.email}</span></div>
            <div><strong className="text-foreground">Phone:</strong> <span className="text-muted-foreground">{selectedApp.phone}</span></div>
            <div><strong className="text-foreground">ID Number:</strong> <span className="text-muted-foreground">{selectedApp.id_number}</span></div>
            <div><strong className="text-foreground">Gender:</strong> <span className="text-muted-foreground">{selectedApp.gender || "N/A"}</span></div>
            <div><strong className="text-foreground">Country:</strong> <span className="text-muted-foreground">{selectedApp.country}</span></div>
            <div><strong className="text-foreground">County:</strong> <span className="text-muted-foreground">{selectedApp.county || "N/A"}</span></div>
            <div><strong className="text-foreground">Education:</strong> <span className="text-muted-foreground">{selectedApp.education || "N/A"}</span></div>
            <div><strong className="text-foreground">Experience:</strong> <span className="text-muted-foreground">{selectedApp.experience || "N/A"} years</span></div>
            <div><strong className="text-foreground">Applied:</strong> <span className="text-muted-foreground">{new Date(selectedApp.created_at).toLocaleDateString()}</span></div>
          </div>
          {selectedApp.cover_letter && (
            <div className="mt-4">
              <strong className="text-foreground text-sm">Cover Letter:</strong>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{selectedApp.cover_letter}</p>
            </div>
          )}
        </div>

        {selectedApp.status !== "invited" ? (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" /> Send Interview Invitation
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will create a secure invitation link for <strong>{selectedApp.first_name}</strong>. They will need to pay KSH 92 and upload their CV before accessing the webinar/interview link.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Feedback Message *</label>
                <Textarea rows={3} value={inviteForm.feedback} onChange={(e) => setInviteForm(p => ({ ...p, feedback: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Webinar/Interview Link</label>
                  <Input placeholder="https://zoom.us/j/..." value={inviteForm.webinar_link} onChange={(e) => setInviteForm(p => ({ ...p, webinar_link: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Webinar Date & Time</label>
                  <Input type="datetime-local" value={inviteForm.webinar_date} onChange={(e) => setInviteForm(p => ({ ...p, webinar_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Webinar Description</label>
                <Textarea rows={2} value={inviteForm.webinar_description} onChange={(e) => setInviteForm(p => ({ ...p, webinar_description: e.target.value }))} />
              </div>
              <Button onClick={handleSendInvitation} disabled={sendingInvite}>
                {sendingInvite ? "Sending..." : <><Send className="w-4 h-4" /> Send Invitation & Copy Link</>}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-primary/30 rounded-lg p-6">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <CheckCircle className="w-5 h-5" /> Invitation Already Sent
            </div>
            <p className="text-sm text-muted-foreground">This applicant has already been sent an invitation.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Applications</h2>
        <Button variant="outline" onClick={loadApplications}>Refresh</Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No applications received yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-foreground">Applicant</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Job</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Email</th>
                <th className="text-left p-3 font-semibold text-foreground">Status</th>
                <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Date</th>
                <th className="text-right p-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t border-border">
                  <td className="p-3 text-foreground font-medium">{app.first_name} {app.last_name}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{app.job_title}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{app.email}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${statusColors[app.status] || "bg-muted text-muted-foreground"}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedApp(app)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ApplicationsManager;
