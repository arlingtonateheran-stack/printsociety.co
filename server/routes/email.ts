import { Request, Response } from "express";

export async function handleSendEmail(req: Request, res: Response) {
  const { to, subject, html, from } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const primaryFrom = from || "Print Society <notifications@printsociety.co>";
  const fallbackFrom = "onboarding@resend.dev";

  async function attemptSend(sender: string) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: sender,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });
    return {
      ok: response.ok,
      status: response.status,
      data: await response.json()
    };
  }

  try {
    let result = await attemptSend(primaryFrom);

    // If domain is not verified, retry with fallback sender
    if (!result.ok && (result.data.message?.includes("domain is not verified") || result.data.message?.includes("unverified"))) {
      console.warn(`[EMAIL] Domain unverified for ${primaryFrom}. Retrying with fallback: ${fallbackFrom}`);
      result = await attemptSend(fallbackFrom);
    }

    if (!result.ok) {
      throw new Error(result.data.message || "Failed to send email");
    }

    res.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Error sending email via Resend:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
}
