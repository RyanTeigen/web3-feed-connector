
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, user_id } = await req.json();
    
    // Create a Supabase client with the Auth context
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get credentials if needed (for future real API integrations)
    const { data: credentials } = await supabase
      .from("social_media_credentials")
      .select("*")
      .eq("user_id", user_id)
      .eq("platform", platform)
      .single();

    // For now, just fetch from our mock data stored in the database
    const { data: content, error } = await supabase
      .from("social_media_content")
      .select("*")
      .eq("user_id", user_id)
      .eq("platform", platform)
      .order("fetched_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
