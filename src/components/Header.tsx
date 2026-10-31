"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/format";
import { NAV } from "@/lib/nav";


export function Wordmark({ name, hasLogo, className }: { name: string; hasLogo: boolean; className?: string }) {
  if (hasLogo) {
    return (
      <Image
        src="/brand/logo-white.png"
        alt={name}
        width={150}
        height={150}
        className={cn("h-12 w-auto", className)}
        priority
      />
    );
  }
  // Temporary text wordmark until the cafe's own logo file is added at
  // public/brand/logo-white.png (see README).
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="display text-[1.7rem] font-semibold">Breezeblock</span>
      <span className="eyebrow mt-1 text-[0.6rem] opacity-80">Cafe · Brixton</span>
    </span>
  );
}

export function Header({ name, hasLogo }: { name: string; hasLogo: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll, close on Escape, manage focus while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="on-dark sticky top-0 z-50 bg-forest text-cream">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" aria-label={`${name}, home`} className="shrink-0">
          <Wordmark name={name} hasLogo={hasLogo} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="relative py-2 text-[0.95rem] tracking-wide text-cream/85 transition-colors hover:text-cream aria-[current=page]:text-cream"
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-px bg-terracotta"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </Link>
          ))}
          <Link
            href="/contact#visit"
            className="ml-2 inline-flex min-h-11 items-center rounded-sm bg-cream px-5 text-[0.95rem] font-semibold text-forest transition-colors hover:bg-sand"
          >
            Visit Us
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex size-11 items-center justify-center rounded-sm lg:hidden"
        >
          <Menu aria-hidden className="size-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[60] flex flex-col bg-forest text-cream lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Wordmark name={name} hasLogo={hasLogo} />
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                className="inline-flex size-11 items-center justify-center rounded-sm"
              >
                <X aria-hidden className="size-6" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-7 pb-16">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="display block py-2 text-[2.6rem] text-cream/85 aria-[current=page]:text-cream aria-[current=page]:italic"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  href="/contact#visit"
                  className="inline-flex min-h-12 items-center rounded-sm bg-cream px-7 font-semibold text-forest"
                >
                  Visit Us
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
