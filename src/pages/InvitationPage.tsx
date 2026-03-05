import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, Lock, PartyPopper, Calendar, Link2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvitationData {
  id: string;
  token: string;
  email: string;
  webinar_link: string | null;
  webinar_date: string | null;
  webinar_description: string | null;
  payment_completed: boolean;
  cv_uploaded: boolean;
  application_id: string;
}

interface ApplicationData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  admin_feedback: string | null;
}

const InvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [pollingPayment, setPollingPayment] = useState(false);
  const [merchantRef, setMerchantRef] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No invitation token provided. This page is only accessible via invitation link.");
      setLoading(false);
      return;
    }
    loadInvitation();
  }, [token]);

  // Poll payment status
  useEffect(() => {
    if (!pollingPayment || !merchantRef) return;
    const interval = setInterval(async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/pesapal-payment/status?merchant_reference=${merchantRef}`,
          { headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        if (data.payment?.status === "completed") {
          setPollingPayment(false);
          setInvitation((prev) => prev ? { ...prev, payment_completed: true } : prev);
          toast({ title: "Payment Confirmed!", description: "You can now upload your CV and access the webinar link." });
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [pollingPayment, merchantRef]);

  const loadInvitation = async () => {
    try {
      // Use .from() with type assertion since these tables aren't in generated types yet
      const { data: inv, error: invErr } = await (supabase as any)
        .from("invitation_tokens")
        .select("*")
        .eq("token", token)
        .single();

      if (invErr || !inv) {
        setError("Invalid or expired invitation token.");
        setLoading(false);
        return;
      }

      if (new Date(inv.expires_at) < new Date()) {
        setError("This invitation has expired. Please contact the administrator.");
        setLoading(false);
        return;
      }

      setInvitation(inv as InvitationData);

      const { data: app } = await (supabase as any)
        .from("applications")
        .select("first_name, last_name, email, phone, job_title, admin_feedback")
        .eq("id", inv.application_id)
        .single();

      if (app) setApplication(app as ApplicationData);
    } catch {
      setError("Failed to load invitation.");
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!invitation || !application) return;
    setPaymentLoading(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/pesapal-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_token_id: invitation.id,
          email: application.email,
          first_name: application.first_name,
          last_name: application.last_name,
          phone: application.phone,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));

      setMerchantRef(data.merchant_reference);
      setPollingPayment(true);
      window.open(data.redirect_url, "_blank");
      toast({
        title: "Payment Initiated",
        description: "Complete the payment in the new tab. This page will update automatically.",
      });
    } catch (err: any) {
      toast({ title: "Payment Error", description: err.message, variant: "destructive" });
    }
    setPaymentLoading(false);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !invitation) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload a PDF or Word document.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setUploadingCV(true);
    try {
      const filePath = `${invitation.application_id}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage.from("cv-uploads").upload(filePath, file);
      if (uploadErr) throw uploadErr;

      await (supabase as any)
        .from("invitation_tokens")
        .update({ cv_uploaded: true })
        .eq("id", invitation.id);

      setInvitation((prev) => prev ? { ...prev, cv_uploaded: true } : prev);
      toast({ title: "CV Uploaded!", description: "Your CV has been uploaded successfully." });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    }
    setUploadingCV(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading invitation...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="py-16 text-center">
          <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground mb-3">Access Denied</h1>
          <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-6">
          {/* Congratulations Header */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8 text-center">
            <PartyPopper className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
              Congratulations, {application?.first_name}! 🎉
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              You have been selected for the next stage of the recruitment process for <strong className="text-foreground">{application?.job_title}</strong>.
            </p>
            {application?.admin_feedback && (
              <div className="bg-secondary rounded-lg p-4 mt-4 text-left">
                <h3 className="text-sm font-bold text-foreground mb-2">Message from the recruiter:</h3>
                <p className="text-sm text-muted-foreground">{application.admin_feedback}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">📋 Next Steps</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Pay the registration fee</strong> — A one-time fee of <strong>KSH 92</strong> is required to proceed. This covers administrative and platform costs.</li>
              <li><strong className="text-foreground">Upload your CV</strong> — After payment, upload your latest CV/Resume in PDF or Word format.</li>
              <li><strong className="text-foreground">Access the webinar/interview link</strong> — Once payment is confirmed and your CV is uploaded, the webinar/interview link and details will appear below.</li>
              <li><strong className="text-foreground">Attend the session</strong> — Join the webinar/interview on the stated date and time.</li>
            </ol>
          </div>

          {/* Step 1: Payment */}
          <div className={`bg-card border rounded-lg p-6 mb-6 ${invitation?.payment_completed ? "border-primary/40" : "border-border"}`}>
            <div className="flex items-center gap-3 mb-4">
              {invitation?.payment_completed ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
              )}
              <h3 className="text-lg font-heading font-bold text-foreground">
                Registration Fee — KSH 92
              </h3>
            </div>
            {invitation?.payment_completed ? (
              <p className="text-sm text-primary font-semibold">✅ Payment confirmed. Thank you!</p>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Pay via M-Pesa, Airtel Money, card, or any method supported by Pesapal.
                </p>
                {pollingPayment && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Waiting for payment confirmation...
                  </div>
                )}
                <Button onClick={handlePayment} disabled={paymentLoading || pollingPayment}>
                  {paymentLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Pay KSH 92 via Pesapal"}
                </Button>
              </div>
            )}
          </div>

          {/* Step 2: CV Upload */}
          <div className={`bg-card border rounded-lg p-6 mb-6 ${!invitation?.payment_completed ? "opacity-50 pointer-events-none" : invitation?.cv_uploaded ? "border-primary/40" : "border-border"}`}>
            <div className="flex items-center gap-3 mb-4">
              {invitation?.cv_uploaded ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
              )}
              <h3 className="text-lg font-heading font-bold text-foreground">Upload Your CV</h3>
            </div>
            {invitation?.cv_uploaded ? (
              <p className="text-sm text-primary font-semibold">✅ CV uploaded successfully.</p>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your latest CV/Resume. Accepted formats: PDF, DOC, DOCX. Maximum size: 10MB.
                </p>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} className="hidden" disabled={uploadingCV} />
                  <Button variant="outline" asChild>
                    <span>
                      {uploadingCV ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Choose File</>}
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Step 3: Webinar Link */}
          <div className={`bg-card border rounded-lg p-6 ${!(invitation?.payment_completed && invitation?.cv_uploaded) ? "opacity-50 pointer-events-none" : "border-primary/40"}`}>
            <div className="flex items-center gap-3 mb-4">
              {invitation?.payment_completed && invitation?.cv_uploaded ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              )}
              <h3 className="text-lg font-heading font-bold text-foreground">Webinar / Interview Details</h3>
            </div>
            {invitation?.payment_completed && invitation?.cv_uploaded ? (
              <div className="space-y-3">
                {invitation.webinar_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-semibold">Date:</span>
                    <span className="text-muted-foreground">{new Date(invitation.webinar_date).toLocaleString()}</span>
                  </div>
                )}
                {invitation.webinar_description && (
                  <p className="text-sm text-muted-foreground">{invitation.webinar_description}</p>
                )}
                {invitation.webinar_link ? (
                  <a
                    href={invitation.webinar_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Link2 className="w-5 h-5" /> Join Webinar / Interview
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    The webinar/interview link will be shared via email at <strong>{application?.email}</strong>. Please check your inbox.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete payment and CV upload to access the webinar/interview link.</p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default InvitationPage;
