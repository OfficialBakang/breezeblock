"use client";

import { useState } from "react";
import { CircleAlert, Check } from "lucide-react";
import { cn } from "@/lib/format";

type Fields = "name" | "email" | "phone" | "eventType" | "date" | "guests" | "message";
type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

export function EnquiryForm({
  eventTypes,
  phone,
  email,
  fallbackHref,
}: {
  eventTypes: readonly string[];
  phone: string;
  email: string;
  fallbackHref: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (res.status === 422 && json.errors) {
        setErrors(json.errors);
        setStatus("idle");
        const first = Object.keys(json.errors)[0];
        form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }
      if (json.unavailable) {
        setStatus("unavailable");
        return;
      }
      setMessage(json.error || "Something went wrong.");
      setStatus("error");
    } catch {
      setMessage("We couldn't reach the server. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-forest bg-cream p-8">
        <Check aria-hidden className="size-8 text-clay" />
        <h3 className="display mt-4 text-4xl text-forest">Thank you, we&rsquo;ve got your enquiry.</h3>
        <p className="mt-3 max-w-md">
          We&rsquo;ll be in touch to confirm. Enquiries are subject to confirmation and availability, and a message
          here isn&rsquo;t a booking until we&rsquo;ve confirmed it with you.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 font-semibold text-clay underline underline-offset-4">
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = "w-full rounded-sm border border-forest/40 bg-cream px-4 py-3 text-base text-charcoal placeholder:text-charcoal/45 focus:border-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta";
  const err = (k: Fields) => (errors[k] ? `${k}-err` : undefined);
  const Label = ({ id, children, optional }: { id: Fields; children: React.ReactNode; optional?: boolean }) => (
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-forest">
      {children}
      {optional && <span className="font-normal text-charcoal/60"> (optional)</span>}
    </label>
  );
  const Err = ({ id }: { id: Fields }) =>
    errors[id] ? (
      <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-clay">
        <CircleAlert aria-hidden className="size-4" />
        {errors[id]}
      </p>
    ) : null;

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Johannesburg" });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-describedby="form-note">
      <div>
        <Label id="name">Name</Label>
        <input id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={err("name")} className={field} />
        <Err id="name" />
      </div>
      <div>
        <Label id="email">Email</Label>
        <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={err("email")} className={field} />
        <Err id="email" />
      </div>
      <div>
        <Label id="phone">Phone number</Label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={!!errors.phone} aria-describedby={err("phone")} className={field} />
        <Err id="phone" />
      </div>
      <div>
        <Label id="eventType">Type of event</Label>
        <select id="eventType" name="eventType" required defaultValue="" aria-invalid={!!errors.eventType} aria-describedby={err("eventType")} className={field}>
          <option value="" disabled>
            Choose…
          </option>
          {eventTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
          <option>Something else</option>
        </select>
        <Err id="eventType" />
      </div>
      <div>
        <Label id="date">Preferred date</Label>
        <input id="date" name="date" type="date" min={today} required aria-invalid={!!errors.date} aria-describedby={err("date")} className={field} />
        <Err id="date" />
      </div>
      <div>
        <Label id="guests">Estimated number of guests</Label>
        <input id="guests" name="guests" type="number" inputMode="numeric" min={1} max={10000} required aria-invalid={!!errors.guests} aria-describedby={err("guests")} className={field} />
        <Err id="guests" />
      </div>
      <div className="sm:col-span-2">
        <Label id="message" optional>
          Additional requirements
        </Label>
        <textarea id="message" name="message" rows={5} maxLength={3000} className={field} placeholder="Catering, audio-visual, timing, anything we should know." />
      </div>

      {/* Honeypot, hidden from people and screen readers */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <p id="form-note" className="mb-5 text-sm text-charcoal/75">
          All enquiries are subject to confirmation and availability.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "inline-flex min-h-12 items-center justify-center rounded-sm border border-forest bg-forest px-8 font-semibold text-cream transition-colors hover:border-clay hover:bg-clay disabled:cursor-wait disabled:opacity-70"
          )}
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>

        <div aria-live="polite" className="mt-5">
          {status === "error" && (
            <p role="alert" className="flex gap-2 border-l-2 border-clay pl-3 text-clay">
              <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
              <span>
                {message} Please try again, or reach us on{" "}
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold underline">
                  {phone}
                </a>{" "}
                or{" "}
                <a href={fallbackHref} className="font-semibold underline">
                  {email}
                </a>
                .
              </span>
            </p>
          )}
          {status === "unavailable" && (
            <p role="alert" className="flex gap-2 border-l-2 border-clay pl-3">
              <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-clay" />
              <span>
                Online enquiries aren&rsquo;t switched on just yet, so nothing was sent. Please{" "}
                <a href={fallbackHref} className="font-semibold text-clay underline">
                  email us
                </a>{" "}
                or call{" "}
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-clay underline">
                  {phone}
                </a>
                .
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
