import sgMail from "@sendgrid/mail";

export default async ({ req, res, log }) => {
  try {
    const body = JSON.parse(req.body || "{}");
    const { to, subject, text, html } = body;

    if (!to || !subject || (!text && !html)) {
      return res.json({ success: false, error: "Missing required fields" });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html,
    };

    await sgMail.send(msg);

    return res.json({
      success: true,
      message: `Email sent successfully to ${to}`
    });
  } catch (error) {
    log(error);
    return res.json({ success: false, error: error.message });
  }
};
