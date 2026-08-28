// @ts-ignore - Deno specific syntax
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno specific syntax
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// @ts-ignore - Deno.env is not recognized by TypeScript
const ONE_SIGNAL_APP_ID = Deno.env.get('ONE_SIGNAL_APP_ID')!
// @ts-ignore - Deno.env is not recognized by TypeScript
const ONE_SIGNAL_API_KEY = Deno.env.get('ONE_SIGNAL_API_KEY')!
// @ts-ignore - Deno.env is not recognized by TypeScript
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
// @ts-ignore - Deno.env is not recognized by TypeScript
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface NotificationPayload {
  title: string
  message: string
  sender: string
  recipient: string
}

serve(async (req: Request) => {
  try {
    const payload: NotificationPayload = await req.json()
    
    console.log('Received notification request:', payload)

    // Get push tokens for the recipient
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    const { data: tokens, error: tokensError } = await supabase
      .from('user_push_tokens')
      .select('push_token')
      .eq('user_id', payload.recipient)

    if (tokensError) {
      console.error('Error fetching push tokens:', tokensError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch push tokens' }),
        { status: 500 }
      )
    }

    if (!tokens || tokens.length === 0) {
      console.log('No push tokens found for recipient:', payload.recipient)
      return new Response(
        JSON.stringify({ message: 'No push tokens found' }),
        { status: 200 }
      )
    }

    // Send notification via OneSignal
    const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONE_SIGNAL_APP_ID,
        include_player_ids: tokens.map((t: any) => t.push_token),
        headings: { en: payload.title },
        contents: { en: payload.message },
        data: {
          sender: payload.sender,
          type: 'message'
        }
      })
    })

    if (!oneSignalResponse.ok) {
      const errorText = await oneSignalResponse.text()
      console.error('OneSignal API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to send notification via OneSignal' }),
        { status: 500 }
      )
    }

    const result = await oneSignalResponse.json()
    console.log('Notification sent successfully:', result)

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in send-push-notification:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    )
  }
})
