// src/lib/notifications.ts
import { supabase } from './supabase'

export interface NotificationTemplate {
  type: 'submission_received' | 'status_update' | 'review_assigned' | 'conference_registration' | 'payment_confirmation'
  subject: string
  template: string
}

const EMAIL_TEMPLATES: Record<string, NotificationTemplate> = {
  submission_received: {
    type: 'submission_received',
    subject: 'Submission Received - {title}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002147; color: white; padding: 20px; text-align: center;">
          <h1>AcademiaPress</h1>
          <h2>Submission Received</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear {author_name},</p>
          <p>We have successfully received your submission:</p>
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #002147; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">{title}</h3>
            <p><strong>Submission ID:</strong> {submission_id}</p>
            <p><strong>Field of Study:</strong> {field_of_study}</p>
            <p><strong>Submitted:</strong> {submitted_date}</p>
          </div>
          <p>Your submission is now under review. You will be notified of any status updates.</p>
          <p>Best regards,<br>The AcademiaPress Team</p>
        </div>
      </div>
    `
  },
  status_update: {
    type: 'status_update',
    subject: 'Status Update - {title}',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #002147; color: white; padding: 20px; text-align: center;">
          <h1>AcademiaPress</h1>
          <h2>Status Update</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear {author_name},</p>
          <p>The status of your submission has been updated:</p>
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #002147; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">{title}</h3>
            <p><strong>Previous Status:</strong> {old_status}</p>
            <p><strong>New Status:</strong> <span style="color: #10B981; font-weight: bold;">{new_status}</span></p>
            {reviewer_comments && <p><strong>Comments:</strong> {reviewer_comments}</p>}
          </div>
          <p>You can view the full details in your dashboard.</p>
          <p>Best regards,<br>The AcademiaPress Team</p>
        </div>
      </div>
    `
  }
}

export async function sendNotification(
  to: string,
  templateType: keyof typeof EMAIL_TEMPLATES,
  variables: Record<string, string>
) {
  const template = EMAIL_TEMPLATES[templateType]
  if (!template) {
    throw new Error(`Template ${templateType} not found`)
  }

  // Replace template variables
  let subject = template.subject
  let body = template.template
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    subject = subject.replace(new RegExp(placeholder, 'g'), value)
    body = body.replace(new RegExp(placeholder, 'g'), value)
  })

  // Call Supabase Edge Function for sending email
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to,
      subject,
      html: body,
      template_type: templateType
    }
  })

  if (error) {
    console.error('Failed to send notification:', error)
    throw error
  }

  // Log notification in database
  await supabase.from('notifications').insert({
    recipient_email: to,
    template_type: templateType,
    subject,
    status: 'sent',
    sent_at: new Date().toISOString()
  })

  return data
}

// Hook for submission status changes
export async function notifySubmissionUpdate(
  submissionId: number,
  oldStatus: string,
  newStatus: string,
  reviewerComments?: string
) {
  try {
    // Get submission details and author email
    const { data: submission, error } = await supabase
      .from('article_submissions')
      .select(`
        *,
        user_profiles!inner(email, first_name, last_name)
      `)
      .eq('id', submissionId)
      .single()

    if (error || !submission) {
      console.error('Submission not found:', error)
      return
    }

    const authorEmail = submission.user_profiles.email
    const authorName = `${submission.user_profiles.first_name} ${submission.user_profiles.last_name}`

    await sendNotification(authorEmail, 'status_update', {
      author_name: authorName,
      title: submission.title,
      old_status: oldStatus,
      new_status: newStatus,
      reviewer_comments: reviewerComments || '',
      submission_id: submissionId.toString()
    })
  } catch (error) {
    console.error('Failed to send status update notification:', error)
  }
}
