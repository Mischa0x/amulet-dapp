# Beta Email Campaign - Resume Notes

**Date:** 2026-01-21
**Status:** Paused (Resend daily quota reached)

## Progress
- **Total signups:** 895
- **Sent:** 192
- **Remaining:** 703

## To Resume Tomorrow

Run this command to send remaining emails:

```bash
cd /home/mischa/amulet-dapp && node -e "
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config({ path: path.join(__dirname, '.env.production.local') });

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const log = JSON.parse(fs.readFileSync('beta-email-log-2026-01-21.json'));
const emails = log.remaining.emails;

const baseUrl = 'https://amulet-dapp.vercel.app/assets/Demo%20Assets/Snapshots';

const html = \`
<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap\" rel=\"stylesheet\">
</head>
<body style=\"margin:0; padding:0; background:#fff; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;\">
  <div style=\"max-width:600px; margin:0 auto; padding:48px 24px;\">
    <h1 style=\"font-size:20px; font-weight:600; color:#111; margin:0 0 16px 0;\">You're on the list.</h1>
    <p style=\"font-size:15px; color:#333; line-height:1.6; margin:0 0 32px 0;\">
      You signed up for the DrPepe.ai closed beta. We're putting the finishing touches on your access — here's what's waiting for you.
    </p>
    <p style=\"font-size:13px; color:#666; margin:0 0 16px 0;\">Landing Page</p>
    <img src=\"\${baseUrl}/Landing%20Page.png\" alt=\"Landing Page\" style=\"width:100%; border-radius:8px; margin-bottom:24px;\" />
    <p style=\"font-size:13px; color:#666; margin:0 0 16px 0;\">Shop Supplements</p>
    <img src=\"\${baseUrl}/Shop%20Supplements.png\" alt=\"Shop Supplements\" style=\"width:100%; border-radius:8px; margin-bottom:24px;\" />
    <p style=\"font-size:13px; color:#666; margin:0 0 16px 0;\">Schedule Doctor Visits</p>
    <img src=\"\${baseUrl}/Schedule%20Doctor%20Visits.png\" alt=\"Schedule Doctor Visits\" style=\"width:100%; border-radius:8px; margin-bottom:24px;\" />
    <p style=\"font-size:13px; color:#666; margin:0 0 16px 0;\">Order History</p>
    <img src=\"\${baseUrl}/Order%20History.png\" alt=\"Order History\" style=\"width:100%; border-radius:8px; margin-bottom:24px;\" />
    <p style=\"font-size:13px; color:#666; margin:0 0 16px 0;\">Buy Credits</p>
    <img src=\"\${baseUrl}/Buy%20Credits.png\" alt=\"Buy Credits\" style=\"width:100%; border-radius:8px; margin-bottom:24px;\" />
    <p style=\"font-size:13px; color:#666; margin:0 0 16px 0;\">Track Rewards</p>
    <img src=\"\${baseUrl}/Rewards.png\" alt=\"Track Rewards\" style=\"width:100%; border-radius:8px; margin-bottom:32px;\" />
    <p style=\"font-size:14px; color:#333; line-height:1.6; margin:0 0 32px 0;\">Questions? Just reply to this email.</p>
    <hr style=\"border:none; border-top:1px solid #eee; margin:32px 0;\" />
    <p style=\"font-size:12px; color:#999; margin:0;\">DrPepe.ai<br><br><a href=\"mailto:dev@drpepe.ai?subject=Unsubscribe\" style=\"color:#999;\">Unsubscribe</a></p>
  </div>
</body>
</html>
\`;

async function sendRemaining() {
  console.log('Sending to', emails.length, 'remaining emails...');
  let sent = 0, errors = 0;

  for (let i = 0; i < emails.length; i++) {
    try {
      const { error } = await resend.emails.send({
        from: 'DrPepe.ai <dev@drpepe.ai>',
        to: emails[i],
        subject: 'DrPepe.ai — Closed Beta coming soon',
        html: html
      });
      if (error) { errors++; if (errors <= 5) console.log('Error:', emails[i], error.message); }
      else { sent++; }
    } catch (e) { errors++; }

    if ((i + 1) % 50 === 0) console.log('Progress:', (i+1)+'/'+emails.length, '| Sent:', sent);
    await new Promise(r => setTimeout(r, 550));
  }

  console.log('\\nCOMPLETE - Sent:', sent, '| Errors:', errors);
}

sendRemaining();
"
```

## Files
- `beta-email-log-2026-01-21.json` - Full log with sent/remaining email lists
- `public/assets/Demo Assets/Snapshots/` - Images used in email

## Email Details
- **Subject:** DrPepe.ai — Closed Beta coming soon
- **From:** DrPepe.ai <dev@drpepe.ai>
- **Content:** Sneak peek with 6 screenshots + unsubscribe link
