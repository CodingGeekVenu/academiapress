// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set in environment variables')
}

serve(async (req) => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 405,
      })
    }

    // Parse request body
    const { to, subject, html, template_type } = await req.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, subject, or html' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Check if API key is available
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Email service configuration is missing' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    console.log(`Sending email to ${to} with subject: ${subject}`)

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AcademiaPress <noreply@academiapress.com>',
        to: [to],
        subject,
        html,
      }),
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error(`Failed to send email: ${JSON.stringify(result)}`)
      throw new Error(`Failed to send email: ${result.message || 'Unknown error'}`)
    }

    console.log(`Email sent successfully to ${to}, ID: ${result.id}`)

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(`Error in send-email function: ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
