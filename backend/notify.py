"""
PhantomWorx notification pipe.

Sends each new inquiry to both:
  - Email recipient (NOTIFY_EMAIL_TO)  via Resend
  - SMS recipient (NOTIFY_SMS_TO)      via Twilio

All calls are best-effort, non-blocking, and fail silently (logged) so a
provider outage never blocks the user-facing /api/inquiries response.

Required env vars (set in /app/backend/.env):
  RESEND_API_KEY        — Resend API key (starts with re_...)
  RESEND_FROM           — Verified sender, e.g. "PhantomWorx <noreply@phantomworx.biz>"
  NOTIFY_EMAIL_TO       — Where to deliver the lead email (Ceo@phantomworx.biz)

  TWILIO_ACCOUNT_SID    — Twilio Account SID (AC...)
  TWILIO_AUTH_TOKEN     — Twilio Auth Token
  TWILIO_FROM_NUMBER    — Twilio phone number in E.164 (e.g. +18885551234)
  NOTIFY_SMS_TO         — Destination phone in E.164 (e.g. +14709417784)
"""
from __future__ import annotations

import asyncio
import logging
import os
from html import escape
from typing import Optional

logger = logging.getLogger("phantomworx.notify")


# ---------- Email (Resend) ----------
async def _send_email(subject: str, html: str) -> Optional[str]:
    api_key = os.environ.get("RESEND_API_KEY")
    from_addr = os.environ.get("RESEND_FROM")
    to_addr = os.environ.get("NOTIFY_EMAIL_TO")

    if not (api_key and from_addr and to_addr):
        logger.info("notify.email: skipped (missing RESEND_API_KEY / RESEND_FROM / NOTIFY_EMAIL_TO)")
        return None

    try:
        import resend  # lazy import so missing pkg never crashes app

        resend.api_key = api_key
        params = {
            "from": from_addr,
            "to": [to_addr],
            "subject": subject,
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        eid = result.get("id") if isinstance(result, dict) else None
        logger.info("notify.email: sent id=%s to=%s", eid, to_addr)
        return eid
    except Exception as e:  # noqa: BLE001
        logger.error("notify.email: failed %s", e)
        return None


# ---------- SMS (Twilio) ----------
async def _send_sms(body: str) -> Optional[str]:
    sid = os.environ.get("TWILIO_ACCOUNT_SID")
    token = os.environ.get("TWILIO_AUTH_TOKEN")
    from_num = os.environ.get("TWILIO_FROM_NUMBER")
    to_num = os.environ.get("NOTIFY_SMS_TO")

    if not (sid and token and from_num and to_num):
        logger.info("notify.sms: skipped (missing Twilio env vars)")
        return None

    try:
        from twilio.rest import Client  # lazy import

        client = Client(sid, token)

        def _send():
            return client.messages.create(body=body, from_=from_num, to=to_num)

        message = await asyncio.to_thread(_send)
        logger.info("notify.sms: sent sid=%s to=%s", message.sid, to_num)
        return message.sid
    except Exception as e:  # noqa: BLE001
        logger.error("notify.sms: failed %s", e)
        return None


# ---------- Public dispatcher ----------
def _truncate(s: str, n: int = 600) -> str:
    if len(s) <= n:
        return s
    return s[: n - 1] + "…"


async def notify_new_inquiry(
    name: str,
    email: str,
    intent: str,
    origin: Optional[str] = None,
    room: Optional[str] = None,
    inquiry_id: Optional[str] = None,
) -> None:
    """Fire email + SMS notifications for a new inquiry. Best-effort."""

    safe = {
        "name": escape(name or ""),
        "email": escape(email or ""),
        "origin": escape(origin or "—"),
        "room": escape(room or "—"),
        "intent": escape(intent or "").replace("\n", "<br>"),
        "id": escape(inquiry_id or ""),
    }

    subject = f"PhantomWorx · New Inquiry · {safe['name']}"
    html = f"""\
<!doctype html>
<html><body style="margin:0;padding:0;background:#0a0807;font-family:Georgia,serif;color:#e9e2d3">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0807;padding:40px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#0f0c0a;border:1px solid rgba(201,168,124,0.18)">
        <tr><td style="padding:32px 36px 12px;border-bottom:1px solid rgba(201,168,124,0.18)">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;color:#c9a87c;text-transform:uppercase">— New Inquiry</div>
          <div style="font-family:Georgia,serif;font-size:28px;color:#e9e2d3;margin-top:8px">PhantomWorx · The Phantom Wire</div>
        </td></tr>
        <tr><td style="padding:28px 36px;font-family:'Courier New',monospace;font-size:13px;line-height:1.7;color:#c8c0b0">
          <p style="margin:0 0 16px"><span style="color:#7d7568;text-transform:uppercase;letter-spacing:0.18em;font-size:10px">Principal</span><br><span style="color:#e9e2d3;font-size:16px">{safe['name']}</span></p>
          <p style="margin:0 0 16px"><span style="color:#7d7568;text-transform:uppercase;letter-spacing:0.18em;font-size:10px">Channel</span><br><a href="mailto:{safe['email']}" style="color:#c9a87c;text-decoration:none">{safe['email']}</a></p>
          <p style="margin:0 0 16px"><span style="color:#7d7568;text-transform:uppercase;letter-spacing:0.18em;font-size:10px">Origin</span><br>{safe['origin']}</p>
          <p style="margin:0 0 16px"><span style="color:#7d7568;text-transform:uppercase;letter-spacing:0.18em;font-size:10px">Room Requested</span><br>{safe['room']}</p>
          <p style="margin:0 0 8px"><span style="color:#7d7568;text-transform:uppercase;letter-spacing:0.18em;font-size:10px">Intent</span></p>
          <div style="border-left:2px solid #c9a87c;padding:8px 0 8px 16px;color:#e9e2d3;font-family:Georgia,serif;font-size:15px;line-height:1.6;font-style:italic">{safe['intent']}</div>
        </td></tr>
        <tr><td style="padding:18px 36px;border-top:1px solid rgba(201,168,124,0.18);font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;color:#7d7568;text-transform:uppercase">
          Ref · {safe['id']}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""

    sms_body = (
        f"PhantomWorx · New Inquiry\n"
        f"{name} <{email}>\n"
        f"Origin: {origin or '—'}\n"
        f"Room: {room or '—'}\n"
        f"Intent: {_truncate(intent, 400)}"
    )

    # Fire both in parallel; never raise.
    await asyncio.gather(
        _send_email(subject, html),
        _send_sms(sms_body),
        return_exceptions=True,
    )
