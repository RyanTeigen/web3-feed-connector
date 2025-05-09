
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ethers } from "https://esm.sh/ethers@6.11.1";

// Set up CORS headers for the API
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    if (req.method === "POST") {
      const { action, address, signature, nonce, message, chain_id, wallet_type } = await req.json();
      
      if (action === "getNonce") {
        // Get or create user
        const { data: userCheck, error: userError } = await supabaseClient.auth
          .admin
          .getUserByEmail(`${address.toLowerCase()}@web3auth.com`);
          
        let userId;
        
        if (userError || !userCheck) {
          // Create a new user
          const { data: newUser, error: createError } = await supabaseClient.auth
            .admin
            .createUser({
              email: `${address.toLowerCase()}@web3auth.com`,
              password: crypto.randomUUID(),
              email_confirm: true,
              user_metadata: { wallet_address: address.toLowerCase() }
            });
            
          if (createError) {
            throw createError;
          }
          
          userId = newUser.id;
        } else {
          userId = userCheck.id;
        }
        
        // Generate a new nonce for this user + address
        const { data: nonceData, error: nonceError } = await supabaseClient
          .rpc("generate_nonce", {
            user_id: userId,
            wallet_address: address.toLowerCase(),
          });
          
        if (nonceError) throw nonceError;
        
        // Return the nonce for signing
        return new Response(
          JSON.stringify({
            nonce: nonceData,
            message: `Sign this unique message to authenticate with Autheo: ${nonceData}`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (action === "verifySignature") {
        // Verify the signature matches the address
        const signerAddr = ethers.verifyMessage(message, signature);
        
        if (signerAddr.toLowerCase() !== address.toLowerCase()) {
          return new Response(
            JSON.stringify({ error: "Invalid signature" }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        // Get user by email (which contains the wallet address)
        const { data: user, error: userError } = await supabaseClient.auth
          .admin
          .getUserByEmail(`${address.toLowerCase()}@web3auth.com`);
          
        if (userError || !user) {
          return new Response(
            JSON.stringify({ error: "User not found" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        // Verify nonce from the message
        const extractedNonce = message.replace("Sign this unique message to authenticate with Autheo: ", "");
        
        // Check if nonce exists in the database
        const { data: connections, error: connError } = await supabaseClient
          .from("wallet_connections")
          .select("*")
          .eq("user_id", user.id)
          .eq("wallet_address", address.toLowerCase())
          .eq("nonce", extractedNonce);
          
        if (connError || !connections || connections.length === 0) {
          return new Response(
            JSON.stringify({ error: "Invalid or expired nonce" }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
        
        // Update the wallet connection
        await supabaseClient
          .from("wallet_connections")
          .update({
            last_connected_at: new Date().toISOString(),
            chain_id: chain_id || connections[0].chain_id,
            wallet_type
          })
          .eq("id", connections[0].id);
          
        // Generate a new session for the user
        const { data: session, error: sessionError } = await supabaseClient.auth
          .admin
          .generateLink({
            type: "magiclink",
            email: `${address.toLowerCase()}@web3auth.com`,
            options: {
              redirectTo: `${req.headers.get("origin") || ""}`,
            }
          });
          
        if (sessionError) {
          throw sessionError;
        }
        
        // Return the session
        return new Response(
          JSON.stringify({
            user: {
              id: user.id,
              wallet_address: address.toLowerCase(),
              email: user.email,
            },
            access_token: session.properties.token,
            refresh_token: session.properties.refresh_token,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
