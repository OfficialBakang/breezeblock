import { NextResponse } from "next/server";
import { getBusiness } from "@/lib/content";


/**
 * Venue-hire / reservation enquiries.
 *
 * Delivery uses Resend (https://resend.com) over HTTPS. Configure:
 *   RESEND_API_KEY      API key
 *   ENQUIRY_FROM        a verified sender, e.g. "Breezeblock Website <website@breezeblock.co.za>"
 *   ENQUIRY_TO          optional; defaults to the business email set in the admin
 *
 * If it is not configured, the endpoint answers 503 and the form shows the
 * visitor the cafe's phone and email instead. It never pretends to have sent.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

const clean = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "").replace(/[\r\u0000]/g, "").trim().slice(0, max);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Pretend success to bots.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this device. Please try again shortly or call us." },
      { status: 429 }
    );
  }

  const f = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    eventType: clean(body.eventType, 80),
    date: clean(body.date, 40),
    guests: clean(body.guests, 10),
    message: clean(body.message, 3000),
  };

  const errors: Record<string, string> = {};
  if (f.name.length < 2) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) errors.email = "Please enter a valid email address.";
  if (f.phone.replace(/\D/g, "").length < 9) errors.phone = "Please enter a phone number we can reach you on.";
  if (!f.eventType) errors.eventType = "Please choose the type of event.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) errors.date = "Please choose your preferred date.";
  const guests = Number(f.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 10000) errors.guests = "Please enter an estimated number of guests.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  if (!key || !from) {
    return NextResponse.json(
      { ok: false, unavailable: true, error: "Online enquiries are not switched on yet." },
      { status: 503 }
    );
  }

  const b = await getBusiness();
  const to = process.env.ENQUIRY_TO || b.email;
  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Phone", f.phone],
    ["Event type", f.eventType],
    ["Preferred date", f.date],
    ["Estimated guests", String(guests)],
    ["Additional requirements", f.message || "None given"],
  ];
  const html = `<h2>New venue hire enquiry</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table><p style="color:#666">Sent from the Breezeblock website. Enquiries are subject to confirmation and availability.</p>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: f.email,
        subject: `Venue hire enquiry: ${f.eventType} on ${f.date} (${f.name})`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "We couldn't send your enquiry just now." }, { status: 502 });
    }
  } catch (e) {
    console.error("Enquiry send failed", e);
    return NextResponse.json({ ok: false, error: "We couldn't send your enquiry just now." }, { status: 502 });
  }

  hits.set(ip, [...recent, now]);
  return NextResponse.json({ ok: true });
}
