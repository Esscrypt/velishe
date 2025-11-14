import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface FormData {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
  instagram: string;
  tiktok: string;
  message: string;
  headshot?: string;
  headshot_filename?: string;
  fullProfile?: string;
  fullProfile_filename?: string;
  halfProfile?: string;
  halfProfile_filename?: string;
  fullLengthProfile?: string;
  fullLengthProfile_filename?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    // Validate required environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const recipientEmail = process.env.RECIPIENT_EMAIL || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      console.error("Missing SMTP configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
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
        filename: body.headshot_filename || "headshot.jpg",
        content: base64Data,
        encoding: "base64",
      });
    }

    if (body.fullProfile) {
      const base64Data = body.fullProfile.replace(/^data:image\/\w+;base64,/, "");
      attachments.push({
        filename: body.fullProfile_filename || "fullProfile.jpg",
        content: base64Data,
        encoding: "base64",
      });
    }

    if (body.halfProfile) {
      const base64Data = body.halfProfile.replace(/^data:image\/\w+;base64,/, "");
      attachments.push({
        filename: body.halfProfile_filename || "halfProfile.jpg",
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
        filename: body.fullLengthProfile_filename || "fullLengthProfile.jpg",
        content: base64Data,
        encoding: "base64",
      });
    }

    // Create HTML email content
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
                <div class="value">${body.gender}</div>
              </div>
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${body.firstName} ${body.lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${body.email}</div>
              </div>
              <div class="field">
                <div class="label">Contact Number:</div>
                <div class="value">${body.contactNumber}</div>
              </div>
              <div class="field">
                <div class="label">Date of Birth:</div>
                <div class="value">${body.dateOfBirth}</div>
              </div>
            </div>

            <div class="section">
              <h2>Address</h2>
              <div class="field">
                <div class="label">Address:</div>
                <div class="value">${body.address}</div>
              </div>
              <div class="field">
                <div class="label">City:</div>
                <div class="value">${body.city}</div>
              </div>
              <div class="field">
                <div class="label">State:</div>
                <div class="value">${body.state}</div>
              </div>
              <div class="field">
                <div class="label">Zip Code:</div>
                <div class="value">${body.zipCode}</div>
              </div>
              <div class="field">
                <div class="label">Country:</div>
                <div class="value">${body.country}</div>
              </div>
            </div>

            <div class="section">
              <h2>Physical Measurements</h2>
              <div class="field">
                <div class="label">Height:</div>
                <div class="value">${body.height}</div>
              </div>
              <div class="field">
                <div class="label">Bust:</div>
                <div class="value">${body.bust}</div>
              </div>
              <div class="field">
                <div class="label">Waist:</div>
                <div class="value">${body.waist}</div>
              </div>
              <div class="field">
                <div class="label">Hips:</div>
                <div class="value">${body.hips}</div>
              </div>
              <div class="field">
                <div class="label">Shoe Size:</div>
                <div class="value">${body.shoeSize}</div>
              </div>
              <div class="field">
                <div class="label">Hair Color:</div>
                <div class="value">${body.hairColor}</div>
              </div>
              <div class="field">
                <div class="label">Eye Color:</div>
                <div class="value">${body.eyeColor}</div>
              </div>
            </div>

            <div class="section">
              <h2>Social Media</h2>
              <div class="field">
                <div class="label">Instagram:</div>
                <div class="value">${body.instagram}</div>
              </div>
              <div class="field">
                <div class="label">TikTok:</div>
                <div class="value">${body.tiktok}</div>
              </div>
            </div>

            <div class="section">
              <h2>Message</h2>
              <div class="value">${body.message.replace(/\n/g, "<br>")}</div>
            </div>

            ${attachments.length > 0 ? `
              <div class="section">
                <h2>Portfolio Images</h2>
                <p>${attachments.length} image(s) attached to this email.</p>
                <ul>
                  ${attachments.map(att => `<li>${att.filename}</li>`).join("")}
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
- TikTok: ${body.tiktok}

Message:
${body.message}

${attachments.length > 0 ? `\nPortfolio Images: ${attachments.length} image(s) attached.\n` : ""}
    `.trim();

    // Send email
    const mailOptions = {
      from: `"Model Application Form" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: body.email,
      subject: `New Model Application from ${body.firstName} ${body.lastName}`,
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send email. Please try again later.",
      },
      { status: 500 }
    );
  }
}

