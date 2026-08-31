import nodemailer from "nodemailer";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

export async function sendConfirmSubscriptionEmail(
  email: string,
  confirmToken: string,
): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
    throw new Error("SMTP is not configured");
  }

  const port = parseInt(smtpPort, 10);
  const isSecure = port === 465;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: isSecure,
    auth: {
      user: smtpUser.trim(),
      pass: smtpPassword.trim(),
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    requireTLS: !isSecure,
  });

  const confirmUrl = `${SITE_URL}/blog/confirm/${confirmToken}/`;
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
      <h1 style="font-size:24px">Confirm your subscription</h1>
      <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#444">
        Confirm to receive new posts from ${SITE_NAME} Journal.
      </p>
      <p style="margin:28px 0">
        <a href="${confirmUrl}"
           style="display:inline-block;background:#111;color:#fff;padding:12px 18px;text-decoration:none;font-family:system-ui,sans-serif;font-size:14px">
          Confirm subscription
        </a>
      </p>
      <p style="font-family:system-ui,sans-serif;font-size:12px;color:#888">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${SITE_NAME}" <${smtpUser}>`,
    to: email,
    subject: "Confirm your Velishe Journal subscription",
    text: `Confirm your subscription: ${confirmUrl}`,
    html,
  });
}
