import type { Env } from "./env";

export type Mail = {
  to: string;
  subject: string;
  plain: string;
  html: string;
  replyTo?: string;
  tags?: string[];
};

/** Send one message through the CloudMailin outbound HTTP API.
 *  Docs: https://docs.cloudmailin.com/outbound/sending_email_via_json_api/ */
export async function sendMail(env: Env, mail: Mail): Promise<boolean> {
  const url = `https://api.cloudmailin.com/api/v0.1/${encodeURIComponent(env.CLOUDMAILIN_SMTP_USERNAME!)}/messages`;
  const headers: Record<string, string> = {};
  if (mail.replyTo) headers["Reply-To"] = mail.replyTo;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.CLOUDMAILIN_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [mail.to],
        subject: mail.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
        plain: mail.plain,
        html: mail.html,
        headers,
        tags: mail.tags ?? [],
        test_mode: env.CLOUDMAILIN_TEST_MODE === "1",
      }),
    });
    if (!res.ok) {
      console.error("cloudmailin send failed", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("cloudmailin send threw", err instanceof Error ? err.message : "unknown");
    return false;
  }
}

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Minimal, high-contrast email shell that mirrors the site. */
export function emailShell(opts: { heading: string; intro: string[]; rows: [string, string][]; outro?: string[] }): { html: string; plain: string } {
  const rows = opts.rows.filter(([, v]) => v !== "");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(opts.heading)}</title></head>
<body style="margin:0;background:#f9f3ef;color:#25211f;font-family:Jost,'Avenir Next','Segoe UI',Arial,sans-serif;font-size:17px;line-height:1.6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f3ef;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #c5c0b9;">
<tr><td style="background:#15355c;color:#ffffff;padding:22px 28px;font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:6px;">ONYX</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:26px;line-height:1.2;color:#25211f;">${esc(opts.heading)}</h1>
${opts.intro.map((p) => `<p style="margin:0 0 14px;">${esc(p)}</p>`).join("\n")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border-top:1px solid #25211f;">
${rows
  .map(
    ([k, v]) =>
      `<tr><th align="left" valign="top" style="padding:10px 12px 10px 0;border-bottom:1px solid #c5c0b9;font-weight:500;color:#4a443e;width:38%;">${esc(k)}</th><td valign="top" style="padding:10px 0;border-bottom:1px solid #c5c0b9;">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
  )
  .join("\n")}
</table>
${(opts.outro ?? []).map((p) => `<p style="margin:0 0 14px;">${esc(p)}</p>`).join("\n")}
</td></tr></table>
</td></tr></table>
</body></html>`;
  const plain = [
    opts.heading,
    "",
    ...opts.intro,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...(opts.outro ?? []),
  ].join("\n");
  return { html, plain };
}
