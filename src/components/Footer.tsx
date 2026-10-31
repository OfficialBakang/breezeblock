import Link from "next/link";
import type { Business } from "@/lib/content";
import { fullAddress, mailHref, telHref, directionsHref } from "@/lib/format";
import { NAV } from "@/lib/nav";
import { Wordmark } from "./Header";

export function Footer({ b, hasLogo }: { b: Business; hasLogo: boolean }) {
  const address = fullAddress(b);
  return (
    <footer className="on-dark bg-forest pb-28 text-cream md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:gap-8 md:px-8 md:py-20">
        <div className="md:col-span-4">
          <Wordmark name={b.name} hasLogo={hasLogo} />
          <p className="display mt-6 max-w-xs text-3xl text-cream/95">{b.tagline}</p>
          <p className="mt-4 max-w-sm text-[0.95rem] text-cream/75">
            An independent, owner-run cafe built around good food, great coffee, art and community.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="eyebrow text-cream/60">Explore</h2>
          <ul className="mt-5 space-y-2.5">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-cream/85 hover:text-cream hover:underline underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-cream/60">Find us</h2>
          <address className="mt-5 space-y-3 not-italic text-cream/85">
            <p>
              {b.streetAddress}
              <br />
              {b.suburb}, {b.city}
              <br />
              {b.postalCode}
            </p>
            <p>
              <a href={directionsHref(address)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cream">
                Get directions<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <p>
              <a href={telHref(b.phoneGeneral)} className="hover:text-cream hover:underline underline-offset-4">
                {b.phoneGeneral}
              </a>
              <br />
              <a href={mailHref(b.email)} className="hover:text-cream hover:underline underline-offset-4">
                {b.email}
              </a>
            </p>
          </address>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-cream/60">Opening hours</h2>
          <dl className="mt-5 space-y-2.5 text-cream/85">
            {b.hours.map((h) => (
              <div key={h.days}>
                <dt className="text-sm text-cream/65">{h.days}</dt>
                <dd>
                  {h.opens}–{h.closes}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex gap-5">
            {b.instagramUrl && (
              <a href={b.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cream">
                Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {b.facebookUrl && (
              <a href={b.facebookUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cream">
                Facebook<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-cream/65 md:flex-row md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {b.name}. All rights reserved.
          </p>
          <p>
            {b.streetAddress}, {b.suburb}, {b.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
