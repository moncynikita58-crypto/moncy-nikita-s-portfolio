import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claims, error: claimsError } = await supabaseUser.auth.getUser();
    if (claimsError || !claims.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: claims.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      application_id,
      feedback,
      webinar_link,
      webinar_date,
      webinar_description,
    } = await req.json();

    if (!application_id) {
      return new Response(JSON.stringify({ error: "application_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get application
    const { data: app, error: appErr } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("id", application_id)
      .single();

    if (appErr || !app) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create invitation token
    const { data: invitation, error: invErr } = await supabaseAdmin
      .from("invitation_tokens")
      .insert({
        application_id,
        email: app.email,
        webinar_link: webinar_link || null,
        webinar_date: webinar_date || null,
        webinar_description: webinar_description || null,
      })
      .select()
      .single();

    if (invErr) {
      return new Response(JSON.stringify({ error: invErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update application status
    await supabaseAdmin
      .from("applications")
      .update({
        status: "invited",
        admin_feedback: feedback || "Congratulations! You have been selected for the next stage.",
      })
      .eq("id", application_id);

    // The invitation URL that will be sent to the applicant
    // In production, replace with your actual domain
    const siteUrl = req.headers.get("origin") || "https://infiniteinsight.net";
    const invitationUrl = `${siteUrl}/invitation?token=${invitation.token}`;

    // Note: Email sending would be done via a third-party service.
    // For now, return the invitation details so admin can share them.
    return new Response(
      JSON.stringify({
        success: true,
        invitation: {
          token: invitation.token,
          url: invitationUrl,
          email: app.email,
          name: `${app.first_name} ${app.last_name}`,
        },
        message: `Invitation created for ${app.first_name} ${app.last_name}. Share this link: ${invitationUrl}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
