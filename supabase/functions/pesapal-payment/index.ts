import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PESAPAL_API_URL = "https://pay.pesapal.com/v3"; // Live
// const PESAPAL_API_URL = "https://cybqa.pesapal.com/pesapalv3"; // Sandbox

async function getPesapalToken(): Promise<string> {
  const res = await fetch(`${PESAPAL_API_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: Deno.env.get("PESAPAL_CONSUMER_KEY"),
      consumer_secret: Deno.env.get("PESAPAL_CONSUMER_SECRET"),
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "Failed to get Pesapal token");
  return data.token;
}

async function registerIPN(token: string, callbackUrl: string): Promise<string> {
  const res = await fetch(`${PESAPAL_API_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: callbackUrl,
      ipn_notification_type: "GET",
    }),
  });
  const data = await res.json();
  return data.ipn_id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);

  try {
    // ---- IPN Callback ----
    if (url.pathname.endsWith("/ipn")) {
      const orderTrackingId = url.searchParams.get("OrderTrackingId");
      const merchantReference = url.searchParams.get("OrderMerchantReference");

      if (!orderTrackingId || !merchantReference) {
        return new Response(JSON.stringify({ error: "Missing params" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get transaction status from Pesapal
      const token = await getPesapalToken();
      const statusRes = await fetch(
        `${PESAPAL_API_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const statusData = await statusRes.json();

      if (statusData.payment_status_description === "Completed") {
        // Update payment record
        await supabase
          .from("invitation_payments")
          .update({
            status: "completed",
            pesapal_order_tracking_id: orderTrackingId,
            payment_method: statusData.payment_method || "unknown",
            paid_at: new Date().toISOString(),
          })
          .eq("pesapal_merchant_reference", merchantReference);

        // Get the payment to find invitation token
        const { data: payment } = await supabase
          .from("invitation_payments")
          .select("invitation_token_id")
          .eq("pesapal_merchant_reference", merchantReference)
          .single();

        if (payment) {
          // Mark invitation as paid
          await supabase
            .from("invitation_tokens")
            .update({ payment_completed: true })
            .eq("id", payment.invitation_token_id);
        }
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Check Payment Status ----
    if (req.method === "GET" && url.pathname.endsWith("/status")) {
      const merchantRef = url.searchParams.get("merchant_reference");
      if (!merchantRef) {
        return new Response(JSON.stringify({ error: "Missing merchant_reference" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: payment } = await supabase
        .from("invitation_payments")
        .select("*")
        .eq("pesapal_merchant_reference", merchantRef)
        .single();

      return new Response(JSON.stringify({ payment }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Initiate Payment ----
    if (req.method === "POST") {
      const { invitation_token_id, email, first_name, last_name, phone } = await req.json();

      if (!invitation_token_id || !email) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const merchantReference = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const token = await getPesapalToken();

      // Register IPN callback
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const ipnUrl = `${supabaseUrl}/functions/v1/pesapal-payment/ipn`;
      const ipnId = await registerIPN(token, ipnUrl);

      // Submit order to Pesapal
      const orderRes = await fetch(`${PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: merchantReference,
          currency: "KES",
          amount: 92,
          description: "Interview/Webinar Access Fee",
          callback_url: `${url.origin}/pesapal-payment/ipn`,
          notification_id: ipnId,
          billing_address: {
            email_address: email,
            phone_number: phone || "",
            first_name: first_name || "",
            last_name: last_name || "",
          },
        }),
      });

      const orderData = await orderRes.json();

      if (orderData.error) {
        return new Response(JSON.stringify({ error: orderData.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Save payment record
      await supabase.from("invitation_payments").insert({
        invitation_token_id,
        pesapal_merchant_reference: merchantReference,
        pesapal_order_tracking_id: orderData.order_tracking_id,
        amount: 92,
        currency: "KES",
      });

      return new Response(
        JSON.stringify({
          redirect_url: orderData.redirect_url,
          merchant_reference: merchantReference,
          order_tracking_id: orderData.order_tracking_id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
