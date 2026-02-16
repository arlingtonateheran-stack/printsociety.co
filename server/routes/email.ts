import { Request, Response } from "express";

export async function handleSendEmail(req: Request, res: Response) {
  const { to, subject, html, from } = req.body;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: from || "Print Society <notifications@printsociety.co>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending email via Resend:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
