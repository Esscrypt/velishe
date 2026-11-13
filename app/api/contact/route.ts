import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/escape-html";
import { clientIpFrom, rateLimit } from "@/lib/rate-limit";
import {
  MAX_REQUEST_BYTES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  exceedsPayloadLimits,
  normalizeContactBody,
  sanitizeAttachmentFilename,
} from "@/lib/contact-form";

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(
      `contact:${clientIpFrom(request.headers)}`,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many applications submitted. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "Submission is too large. Please reduce image sizes." },
        { status: 413 },
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "Submission is too large. Please reduce image sizes." },
        { status: 413 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const body = normalizeContactBody(parsed);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (exceedsPayloadLimits(body)) {
      return NextResponse.json(
        { error: "Submission is too large. Please reduce image sizes." },
        { status: 413 },
      );
    }

    // Validate required environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const recipientEmail = process.env.RECIPIENT_EMAIL || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      console.error("Missing SMTP configuration", {
        hasHost: !!smtpHost,
        hasPort: !!smtpPort,
        hasUser: !!smtpUser,
        hasPassword: !!smtpPassword,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create transporter with Zoho-specific configuration
    const port = parseInt(smtpPort, 10);
    const isSecure = port === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: isSecure, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: smtpUser.trim(), // Trim whitespace
        pass: smtpPassword.trim(), // Trim whitespace
      },
      // Zoho-specific TLS configuration
      tls: {
        minVersion: "TLSv1.2",
      },
      // Force TLS upgrade for port 587
      requireTLS: !isSecure,
      // Connection timeout
      connectionTimeout: 10000,
      // Greeting timeout
      greetingTimeout: 10000,
      // Socket timeout
      socketTimeout: 10000,
    });

    // Prepare attachments from base64 images
    const attachments: Array<{
      filename: string;
      content: string;
      encoding: string;
    }> = [];

    if (body.headshot) {
      const base64Data = body.headshot.replace(/^data:image\/\w+;base64,/, "");
      attachments.push({
        filename: sanitizeAttachmentFilename(body.headshot_filename, "headshot.jpg"),
        content: base64Data,
        encoding: "base64",
      });
    }

    if (body.fullProfile) {
      const base64Data = body.fullProfile.replace(/^data:image\/\w+;base64,/, "");
      attachments.push({
        filename: sanitizeAttachmentFilename(body.fullProfile_filename, "fullProfile.jpg"),
        content: base64Data,
        encoding: "base64",
      });
    }

    if (body.halfProfile) {
      const base64Data = body.halfProfile.replace(/^data:image\/\w+;base64,/, "");
      attachments.push({
        filename: sanitizeAttachmentFilename(body.halfProfile_filename, "halfProfile.jpg"),
        content: base64Data,
        encoding: "base64",
      });
    }

    if (body.fullLengthProfile) {
      const base64Data = body.fullLengthProfile.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      attachments.push({
        filename: sanitizeAttachmentFilename(body.fullLengthProfile_filename, "fullLengthProfile.jpg"),
        content: base64Data,
        encoding: "base64",
      });
    }

    // Create HTML email content
    const safe = {
      gender: escapeHtml(body.gender),
      firstName: escapeHtml(body.firstName),
      lastName: escapeHtml(body.lastName),
      email: escapeHtml(body.email),
      contactNumber: escapeHtml(body.contactNumber),
      dateOfBirth: escapeHtml(body.dateOfBirth),
      address: escapeHtml(body.address),
      city: escapeHtml(body.city),
      state: escapeHtml(body.state),
      zipCode: escapeHtml(body.zipCode),
      country: escapeHtml(body.country),
      height: escapeHtml(body.height),
      bust: escapeHtml(body.bust),
      waist: escapeHtml(body.waist),
      hips: escapeHtml(body.hips),
      shoeSize: escapeHtml(body.shoeSize),
      hairColor: escapeHtml(body.hairColor),
      eyeColor: escapeHtml(body.eyeColor),
      instagram: escapeHtml(body.instagram),
      message: escapeHtmlWithBreaks(body.message),
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #000; }
            .value { margin-top: 5px; color: #666; }
            .section { margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Model Application</h1>

            <div class="section">
              <h2>Personal Information</h2>
              <div class="field">
                <div class="label">Gender:</div>
                <div class="value">${safe.gender}</div>
              </div>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${safe.firstName} ${safe.lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${safe.email}</div>
              </div>
              <div class="field">
                <div class="label">Contact Number:</div>
                <div class="value">${safe.contactNumber}</div>
              </div>
              <div class="field">
                <div class="label">Date of Birth:</div>
                <div class="value">${safe.dateOfBirth}</div>
              </div>
            </div>

            <div class="section">
              <h2>Address</h2>
              <div class="field">
                <div class="label">Address:</div>
                <div class="value">${safe.address}</div>
              </div>
              <div class="field">
                <div class="label">City:</div>
                <div class="value">${safe.city}</div>
              </div>
              <div class="field">
                <div class="label">State:</div>
                <div class="value">${safe.state}</div>
              </div>
              <div class="field">
                <div class="label">Zip Code:</div>
                <div class="value">${safe.zipCode}</div>
              </div>
              <div class="field">
                <div class="label">Country:</div>
                <div class="value">${safe.country}</div>
              </div>
            </div>

            <div class="section">
              <h2>Physical Measurements</h2>
              <div class="field">
                <div class="label">Height:</div>
                <div class="value">${safe.height}</div>
              </div>
              <div class="field">
                <div class="label">Bust:</div>
                <div class="value">${safe.bust}</div>
              </div>
              <div class="field">
                <div class="label">Waist:</div>
                <div class="value">${safe.waist}</div>
              </div>
              <div class="field">
                <div class="label">Hips:</div>
                <div class="value">${safe.hips}</div>
              </div>
              <div class="field">
                <div class="label">Shoe Size:</div>
                <div class="value">${safe.shoeSize}</div>
              </div>
              <div class="field">
                <div class="label">Hair Color:</div>
                <div class="value">${safe.hairColor}</div>
              </div>
              <div class="field">
                <div class="label">Eye Color:</div>
                <div class="value">${safe.eyeColor}</div>
              </div>
            </div>

            <div class="section">
              <h2>Social Media</h2>
              <div class="field">
                <div class="label">Instagram:</div>
                <div class="value">${safe.instagram}</div>
              </div>
            </div>

            <div class="section">
              <h2>Message</h2>
              <div class="value">${safe.message}</div>
            </div>

            ${attachments.length > 0 ? `
              <div class="section">
                <h2>Portfolio Images</h2>
                <p>${attachments.length} image(s) attached to this email.</p>
                <ul>
                  ${attachments.map(att => `<li>${escapeHtml(att.filename)}</li>`).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const textContent = `
New Model Application

Personal Information:
- Gender: ${body.gender}
- Name: ${body.firstName} ${body.lastName}
- Email: ${body.email}
- Contact Number: ${body.contactNumber}
- Date of Birth: ${body.dateOfBirth}

Address:
- Address: ${body.address}
- City: ${body.city}
- State: ${body.state}
- Zip Code: ${body.zipCode}
- Country: ${body.country}

Physical Measurements:
- Height: ${body.height}
- Bust: ${body.bust}
- Waist: ${body.waist}
- Hips: ${body.hips}
- Shoe Size: ${body.shoeSize}
- Hair Color: ${body.hairColor}
- Eye Color: ${body.eyeColor}

Social Media:
- Instagram: ${body.instagram}

Message:
${body.message}

${attachments.length > 0 ? `\nPortfolio Images: ${attachments.length} image(s) attached.\n` : ""}
    `.trim();

    const applicantEmail = typeof body.email === "string" ? body.email.trim() : "";
    const applicantName =
      `${String(body.firstName ?? "").trim()} ${String(body.lastName ?? "").trim()}`.trim() ||
      "Unknown applicant";

    // Send email
    const mailOptions = {
      from: `"Model Application Form" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail)
        ? applicantEmail
        : undefined,
      // Newlines are stripped so the applicant cannot inject extra headers.
      subject: `New Model Application from ${applicantName.replace(/[\r\n]+/g, " ")}`,
      text: textContent,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // Raw SMTP and socket errors carry internal hostnames, IPs, and relay
    // banners, so they stay in the logs. The client gets a fixed message.
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}

