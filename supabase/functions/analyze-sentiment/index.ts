
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { platform, channel, timeframe } = await req.json()
    console.log(`Analyzing sentiment for ${platform} channel: ${channel}`)

    // In a real implementation, we would fetch messages from the platform API
    // and use an AI service to analyze sentiment
    // For this demo, we'll generate mock sentiment data

    // Generate mock sentiment data
    const sentimentData = generateMockSentimentData(platform, channel, timeframe)
    
    // Store the sentiment analysis in the database
    const { data: analysisData, error: analysisError } = await supabaseClient
      .from('sentiment_analysis')
      .insert({
        platform: platform,
        channel_name: channel,
        sentiment_summary: sentimentData.summary,
        topics: sentimentData.topics,
        message_count: sentimentData.messageCount,
        period: timeframe
      })
      .select('id')
      .single()
      
    if (analysisError) {
      console.error('Error inserting sentiment analysis:', analysisError)
      throw new Error('Failed to store sentiment analysis')
    }
    
    const analysisId = analysisData.id
    
    // Store sentiment details
    const detailsPromises = sentimentData.emotions.map(emotion => {
      return supabaseClient
        .from('sentiment_details')
        .insert({
          analysis_id: analysisId,
          emotion_type: emotion.type,
          percentage: emotion.percentage,
          keywords: emotion.keywords
        })
    })
    
    await Promise.all(detailsPromises)
    
    // Store insights
    const insightsPromises = sentimentData.insights.map(insight => {
      return supabaseClient
        .from('sentiment_insights')
        .insert({
          analysis_id: analysisId,
          insight_type: insight.type,
          description: insight.description,
          confidence_score: insight.confidenceScore
        })
    })
    
    await Promise.all(insightsPromises)
    
    // Store feature requests
    if (sentimentData.featureRequests && sentimentData.featureRequests.length > 0) {
      const featurePromises = sentimentData.featureRequests.map(feature => {
        return supabaseClient
          .from('feature_requests')
          .insert({
            analysis_id: analysisId,
            feature_name: feature.name,
            description: feature.description,
            mention_count: feature.mentions,
            first_mentioned: new Date().toISOString()
          })
      })
      
      await Promise.all(featurePromises)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: sentimentData,
        analysisId 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})

// Helper function to generate mock sentiment data
function generateMockSentimentData(platform: string, channel: string, timeframe: string) {
  const currentDate = new Date().toISOString()
  
  return {
    summary: {
      positive: Math.random() * 50 + 30, // 30-80%
      neutral: Math.random() * 20 + 10,  // 10-30%
      negative: Math.random() * 20 + 5   // 5-25%
    },
    topics: {
      main_topics: ["wallet integration", "user interface", "authentication", "social feeds"],
      trending: ["feature requests", "wallet connectivity", "sentiment analysis"]
    },
    emotions: [
      {
        type: "excited",
        percentage: Math.random() * 30 + 20,
        keywords: ["great", "amazing", "love", "excellent"]
      },
      {
        type: "satisfied",
        percentage: Math.random() * 20 + 30,
        keywords: ["good", "works", "helpful", "useful"]
      },
      {
        type: "curious",
        percentage: Math.random() * 15 + 10,
        keywords: ["how", "when", "what if", "possible"]
      },
      {
        type: "frustrated",
        percentage: Math.random() * 10 + 5,
        keywords: ["issue", "problem", "doesn't work", "bug"]
      },
      {
        type: "confused",
        percentage: Math.random() * 10 + 5,
        keywords: ["unclear", "not sure", "question", "help"]
      }
    ],
    insights: [
      {
        type: "trend",
        description: "Increasing interest in wallet connectivity features",
        confidenceScore: Math.random() * 30 + 70
      },
      {
        type: "prediction",
        description: "Users may react positively to improved social media integration",
        confidenceScore: Math.random() * 20 + 60
      },
      {
        type: "suggestion",
        description: "Consider addressing wallet connection issues mentioned frequently",
        confidenceScore: Math.random() * 15 + 75
      }
    ],
    featureRequests: [
      {
        name: "Multiple wallet support",
        description: "Users want to connect multiple wallets simultaneously",
        mentions: Math.floor(Math.random() * 15) + 5
      },
      {
        name: "Notification settings",
        description: "Users want more granular control over notification preferences",
        mentions: Math.floor(Math.random() * 10) + 3
      },
      {
        name: "Dark mode toggle",
        description: "Easily switch between light and dark themes",
        mentions: Math.floor(Math.random() * 8) + 2
      }
    ],
    messageCount: Math.floor(Math.random() * 200) + 100,
    timestamp: currentDate
  }
}
