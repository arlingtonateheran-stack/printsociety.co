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

export const EMAIL_TEMPLATES = {
  welcome: (name: string) => ({
    subject: "Welcome to Print Society Co!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Welcome to Print Society!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with us. We're excited to help you bring your sticker designs to life!</p>
        <p>With your account, you can:</p>
        <ul>
          <li>Track your orders</li>
          <li>Approve design proofs</li>
          <li>Save your custom designs</li>
          <li>Access wholesale pricing (if applicable)</li>
        </ul>
        <p>Ready to start? <a href="${window.location.origin}/products" style="color: #16a34a; font-weight: bold;">Browse our products</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">
          Print Society Co · Custom Sticker Printing · notifications@printsociety.co
        </p>
      </div>
    `,
  }),
  orderConfirmation: (orderNumber: string, total: string) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Order Confirmed!</h1>
        <p>Your order <strong>${orderNumber}</strong> has been received and is being processed.</p>
        <p><strong>Total:</strong> ${total}</p>
        <p>What's next? Our designers will review your artwork and send a proof for your approval within 24 hours.</p>
        <p><a href="${window.location.origin}/account" style="color: #16a34a; font-weight: bold;">View Order Status</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">
          Thank you for choosing Print Society!
        </p>
      </div>
    `,
  }),
};
