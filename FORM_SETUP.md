# Form Email Setup Guide

The form on the "Become a Model" page uses Formspree to send emails. Here's how to set it up:

## Option 1: Formspree (Recommended for Static Sites)

1. **Create a Formspree account**:
   - Go to https://formspree.io/
   - Sign up for a free account (50 submissions/month on free tier)

2. **Create a new form**:
   - Click "New Form" in your dashboard
   - Copy your form endpoint (e.g., `https://formspree.io/f/YOUR_FORM_ID`)

3. **Configure the endpoint**:
   - Create a `.env.local` file in the project root:
     ```
     NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
     ```
   - Or update the `FORMSPREE_ENDPOINT` constant in `app/become-a-model/page.tsx`

4. **Enable file uploads** (if needed):
   - In Formspree settings, enable file uploads
   - Free tier allows up to 10MB per file

5. **Set up email notifications**:
   - In Formspree dashboard, go to your form settings
   - Add your email address to receive notifications
   - Configure email template if desired

## Option 2: EmailJS (Alternative)

If you prefer EmailJS:

1. Install EmailJS:
   ```bash
   bun add @emailjs/browser
   ```

2. Create an account at https://www.emailjs.com/

3. Set up email service and template

4. Update the form submission code to use EmailJS API

## Option 3: Custom Backend API

If you have a backend server:

1. Create an API endpoint (e.g., `/api/submit-form`)

2. Update `FORMSPREE_ENDPOINT` to point to your API

3. Handle form submission and email sending on the backend using:
   - Nodemailer (Node.js)
   - SendGrid
   - AWS SES
   - Or any other email service

## Testing

After setup:
1. Fill out the form
2. Submit it
3. Check your email (or Formspree dashboard) for the submission
4. Verify all fields and file attachments are received correctly

## Notes

- Formspree free tier: 50 submissions/month
- File uploads: Up to 10MB per file on free tier
- All form data is sent as FormData to support file uploads
- The form includes validation before submission
- Success/error messages are displayed to the user

