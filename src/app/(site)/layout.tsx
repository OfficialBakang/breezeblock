import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { getAnnouncement, getBusiness, getPhotos, hasLogo } from "@/lib/content";
import { directionsHref, fullAddress, isExternal, telHref } from "@/lib/format";
import { businessJsonLd } from "@/lib/schema";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [b, banner, photos] = await Promise.all([getBusiness(), getAnnouncement(), getPhotos()]);
  const logo = hasLogo();
  const ld = businessJsonLd(b, photos.hero.src);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {banner && (
        <div className="bg-terracotta text-charcoal">
          <p className="mx-auto max-w-7xl px-5 py-2 text-center text-sm font-semibold md:px-8">
            {banner.text}
            {banner.linkHref && banner.linkLabel && (
              <>
                {" "}
                {isExternal(banner.linkHref) ? (
                  <a href={banner.linkHref} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                    {banner.linkLabel}
                  </a>
                ) : (
                  <Link href={banner.linkHref} className="underline underline-offset-4">
                    {banner.linkLabel}
                  </Link>
                )}
              </>
            )}
          </p>
        </div>
      )}
      <Header name={b.name} hasLogo={logo} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer b={b} hasLogo={logo} />
      <MobileActionBar phoneHref={telHref(b.phoneGeneral)} directionsHref={directionsHref(fullAddress(b))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
