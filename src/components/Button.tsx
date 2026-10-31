import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, isExternal } from "@/lib/format";

type Variant = "primary" | "outline" | "light" | "ghost-light";

const styles: Record<Variant, string> = {
  // forest button on cream
  primary: "bg-forest text-cream hover:bg-clay border border-forest hover:border-clay",
  // outlined, on cream
  outline: "border border-forest text-forest hover:bg-forest hover:text-cream",
  // cream button on forest
  light: "bg-cream text-forest hover:bg-sand border border-cream hover:border-sand",
  // outlined, on forest
  "ghost-light": "border border-cream/60 text-cream hover:bg-cream hover:text-forest",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: React.ReactNode;
  newTab?: boolean;
};

export function Button({ href, children, variant = "primary", className, icon, newTab }: Props) {
  const cls = cn(
    "group/btn inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 py-3 text-[0.95rem] font-semibold tracking-wide transition-colors duration-200 active:translate-y-px",
    styles[variant],
    variant === "light" || variant === "ghost-light" ? "on-dark" : "",
    className
  );
  const inner = (
    <>
      <span>{children}</span>
      {icon ?? (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        />
      )}
    </>
  );
  if (isExternal(href) || href.startsWith("tel:") || href.startsWith("mailto:")) {
    const external = isExternal(href);
    return (
      <a
        href={href}
        className={cls}
        {...(external || newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
        {external || newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Understated text link with an animated underline. */
export function TextLink({
  href,
  children,
  dark,
  className,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  const external = isExternal(href);
  const cls = cn(
    "group/link inline-flex items-center gap-1.5 font-semibold underline decoration-1 underline-offset-[6px] transition-colors",
    dark
      ? "on-dark text-cream decoration-cream/50 hover:decoration-cream"
      : "text-clay decoration-clay/40 hover:decoration-clay",
    className
  );
  const arrow = (
    <ArrowUpRight
      aria-hidden
      className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
    />
  );
  return external || href.startsWith("tel:") || href.startsWith("mailto:") ? (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
      {arrow}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  );
}
