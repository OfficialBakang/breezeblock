"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { MenuCategory, MenuItem } from "@/lib/content";
import { cn } from "@/lib/format";

function groupItems(items: MenuItem[]) {
  const groups: { title: string; items: MenuItem[] }[] = [];
  for (const it of items) {
    const last = groups[groups.length - 1];
    if (last && last.title === it.group) last.items.push(it);
    else groups.push({ title: it.group, items: [it] });
  }
  return groups;
}

export function MenuBrowser({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const navRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);

  // Scroll-spy: highlight the category nearest the top of the viewport.
  useEffect(() => {
    const els = categories
      .map((c) => document.getElementById(c.slug))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        if (lock.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [categories]);

  // Keep the active chip in view inside the horizontal strip (without moving the page).
  useEffect(() => {
    const strip = navRef.current;
    const chip = strip?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!strip || !chip) return;
    strip.scrollTo({
      left: chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  const jump = (slug: string) => {
    setActive(slug);
    lock.current = true;
    window.setTimeout(() => (lock.current = false), 900);
  };

  let lastKind = "";
  return (
    <div>
      <div className="sticky top-16 z-30 border-b border-forest/15 bg-cream/95 backdrop-blur md:top-20">
        <nav aria-label="Menu categories" className="mx-auto max-w-7xl">
          <div ref={navRef} className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 md:px-6">
            {categories.map((c) => {
              const on = c.slug === active;
              return (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  data-slug={c.slug}
                  onClick={() => jump(c.slug)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "relative shrink-0 whitespace-nowrap rounded-sm px-4 py-2.5 text-[0.92rem] font-semibold transition-colors",
                    on ? "text-cream" : "text-forest hover:bg-forest/10"
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="menu-chip"
                      className="absolute inset-0 -z-0 rounded-sm bg-forest"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{c.name}</span>
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {categories.map((c) => {
          const showKind = c.kind !== lastKind;
          lastKind = c.kind;
          return (
            <div key={c.slug}>
              {showKind && (
                <div className="pt-20 md:pt-28">
                  <p className="eyebrow text-clay">{c.kind === "food" ? "Kitchen" : "Bar & coffee"}</p>
                  <p className="display mt-2 text-[clamp(3.4rem,9vw,7.5rem)] text-forest/95">
                    {c.kind === "food" ? "Food" : "Drinks"}
                  </p>
                </div>
              )}
              <section
                id={c.slug}
                aria-labelledby={`${c.slug}-h`}
                className="scroll-mt-36 grid gap-6 border-t border-forest/20 py-10 md:scroll-mt-40 md:grid-cols-12 md:gap-10 md:py-14"
              >
                <div className="md:col-span-4">
                  <h2 id={`${c.slug}-h`} className="display text-[clamp(2.2rem,3.6vw,3.2rem)] text-forest md:sticky md:top-44">
                    {c.name}
                  </h2>
                  {c.intro && <p className="mt-2 max-w-xs text-[0.97rem] italic text-charcoal/75 md:sticky md:top-[10.5rem]">{c.intro}</p>}
                </div>
                <div className="md:col-span-8">
                  {groupItems(c.items).map((g, gi) => (
                    <div key={`${g.title}-${gi}`} className={gi > 0 ? "mt-8" : ""}>
                      {g.title && (
                        <h3 className="eyebrow mb-1 border-b border-forest/15 pb-2 text-clay">{g.title}</h3>
                      )}
                      <ul>
                        {g.items.map((it) => (
                          <li key={it.name} className="flex gap-4 py-3">
                            {it.photo && (
                              <Image
                                src={it.photo}
                                alt={it.photoAlt}
                                width={96}
                                height={96}
                                loading="lazy"
                                className="size-20 shrink-0 object-cover md:size-24"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-3">
                                <span className="text-[1.08rem] font-semibold text-forest">{it.name}</span>
                                <span aria-hidden className="leader" />
                                <span className="max-w-[55%] text-right font-semibold tabular-nums text-charcoal">
                                  {it.price}
                                </span>
                              </div>
                              {it.description && (
                                <p className="mt-1 max-w-prose text-[0.96rem] text-charcoal/75">{it.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </div>
  );
}
