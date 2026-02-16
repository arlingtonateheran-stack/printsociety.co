interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send email");
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error calling send-email API:", error);
    return { success: false, error: error.message };
  }
}

const LOGO_URL = "https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2Fdc0d573640c04a0f81b1a11991f519d2?format=webp&width=200";

const wrapLayout = (content: string) => `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #000000; padding: 30px; text-align: center;">
        <img src="${LOGO_URL}" alt="Print Society Co" style="height: 50px; width: auto;" />
      </div>

      <!-- Content -->
      <div style="padding: 40px; line-height: 1.6;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="background-color: #f3f4f6; padding: 30px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb;">
        <p style="margin-bottom: 10px; font-weight: bold; color: #1f2937;">Print Society Co</p>
        <p style="margin-bottom: 20px;">Premium Custom Stickers & Print Solutions</p>
        <div style="margin-bottom: 20px;">
          <a href="${window.location.origin}" style="color: #16a34a; text-decoration: none; margin: 0 10px;">Website</a>
          <a href="${window.location.origin}/account" style="color: #16a34a; text-decoration: none; margin: 0 10px;">My Account</a>
          <a href="${window.location.origin}/support" style="color: #16a34a; text-decoration: none; margin: 0 10px;">Support</a>
        </div>
        <p style="font-size: 12px;">&copy; ${new Date().getFullYear()} Print Society Co. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

export const EMAIL_TEMPLATES = {
  welcome: (name: string) => ({
    subject: "Welcome to Print Society Co!",
    html: wrapLayout(`
      <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 20px;">Welcome to the Society, ${name}!</h1>
      <p style="margin-bottom: 20px;">We're thrilled to have you with us. Print Society Co is dedicated to providing the highest quality custom stickers and print solutions for your brand.</p>
      <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
        <p style="font-weight: bold; color: #166534; margin-bottom: 10px;">What you can do now:</p>
        <ul style="margin: 0; padding-left: 20px; color: #166534;">
          <li style="margin-bottom: 5px;">Upload and manage your artwork</li>
          <li style="margin-bottom: 5px;">Track your orders in real-time</li>
          <li style="margin-bottom: 5px;">Approve digital proofs</li>
          <li style="margin-bottom: 5px;">Access exclusive wholesale pricing</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <a href="${window.location.origin}/products" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none;">Browse Products</a>
      </div>
    `),
  }),
  orderConfirmation: (orderNumber: string, total: string) => ({
    subject: `Order Confirmed: ${orderNumber}`,
    html: wrapLayout(`
      <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 20px;">Order Confirmed</h1>
      <p style="margin-bottom: 20px;">Your order <strong>${orderNumber}</strong> has been successfully placed and is now being processed by our team.</p>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Paid</p>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">${total}</p>
      </div>

      <p style="margin-bottom: 20px;"><strong>What happens next?</strong></p>
      <p style="margin-bottom: 10px;">1. Our designers will review your artwork files.</p>
      <p style="margin-bottom: 10px;">2. We will send you a digital proof for approval within 24 hours.</p>
      <p style="margin-bottom: 20px;">3. Once approved, your order will move into production.</p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${window.location.origin}/account" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none;">View Order Details</a>
      </div>
    `),
  }),
  proofReady: (orderNumber: string, name: string, version: number, message: string) => ({
    subject: `Action Required: Proof Ready for Order ${orderNumber}`,
    html: wrapLayout(`
      <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 20px;">New Proof Ready!</h1>
      <p style="margin-bottom: 20px;">Hi ${name}, our design team has prepared a new proof (v${version}) for your order <strong>${orderNumber}</strong>.</p>

      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
        <p style="font-weight: bold; color: #1e40af; margin-bottom: 10px;">Message from our designer:</p>
        <p style="color: #1e40af; margin: 0; font-style: italic;">"${message}"</p>
      </div>

      <p style="margin-bottom: 30px;">Please review the proof carefully. We cannot begin production until we have your final approval.</p>

      <div style="text-align: center;">
        <a href="${window.location.origin}/proofs" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none;">Review & Approve Proof</a>
      </div>
    `),
  }),
  supportTicket: (name: string, subject: string, category: string, message: string, isConfirmation = false) => ({
    subject: isConfirmation ? `We've received your request: ${subject}` : `[New Support Ticket] ${subject}`,
    html: wrapLayout(`
      <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 20px;">
        ${isConfirmation ? "Support Request Received" : "New Support Ticket"}
      </h1>
      <p style="margin-bottom: 20px;">
        ${isConfirmation
          ? `Hi ${name}, thank you for reaching out. We've received your support request regarding "${subject}" and our team will get back to you within 24 hours.`
          : `A new support ticket has been submitted by ${name}.`
        }
      </p>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Category:</strong> ${category}</p>
        <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">${message}</p>
      </div>

      ${isConfirmation ? `
        <p style="font-size: 14px; color: #6b7280;">If you have any additional information to add, simply reply to this email.</p>
      ` : ""}
    `),
  }),
};
