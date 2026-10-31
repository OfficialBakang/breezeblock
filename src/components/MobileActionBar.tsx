import Link from "next/link";
import { MapPin, Phone, UtensilsCrossed } from "lucide-react";

/** Discreet sticky bar for phones: the three things people want most. */
export function MobileActionBar({ phoneHref, directionsHref }: { phoneHref: string; directionsHref: string }) {
  const item =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.72rem] font-semibold tracking-wide text-cream active:bg-clay";
  return (
    <nav
      aria-label="Quick actions"
      className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-cream/15 bg-forest/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex max-w-md divide-x divide-cream/15">
        <a href={phoneHref} className={item}>
          <Phone aria-hidden className="size-5" />
          Call
        </a>
        <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={item}>
          <MapPin aria-hidden className="size-5" />
          Directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Link href="/menu" className={item}>
          <UtensilsCrossed aria-hidden className="size-5" />
          Menu
        </Link>
      </div>
    </nav>
  );
}
