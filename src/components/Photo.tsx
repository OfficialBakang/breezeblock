import Image from "next/image";
import { cn } from "@/lib/format";

type Props = {
  src?: string | null;
  alt: string;
  /** Shown only on the temporary placeholder, e.g. "Courtyard". */
  label: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Placeholder colour: pick the one that sits well on the section background. */
  tone?: "forest" | "sand";
};

/**
 * Renders a real photograph when one exists. Otherwise renders an obviously
 * temporary, labelled placeholder so nothing ever pretends to be the cafe.
 * The parent sets the size/aspect ratio through className.
 */
export function Photo({
  src,
  alt,
  label,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  tone = "forest",
}: Props) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div className={cn("ph", tone === "sand" && "ph-sand")} aria-hidden="true">
          <span className="absolute bottom-3 left-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] opacity-80">
            Photo to come · {label}
          </span>
        </div>
      )}
    </div>
  );
}
