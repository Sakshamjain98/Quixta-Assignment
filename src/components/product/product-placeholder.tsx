interface ProductPlaceholderProps {
  name: string;
}

/**
 * The spec's grey 4:3 image placeholder. Inside, a quiet grey drawing of a plank
 * floating on a wall stands in for "hidden brackets" until real photography exists.
 */
export function ProductPlaceholder({ name }: ProductPlaceholderProps) {
  return (
    <div role="img" aria-label={name} className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-wall">
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden focusable="false">
        <defs>
          <filter id="shelf-shadow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        {/* Soft shadow the floating plank casts on the wall */}
        <rect x="104" y="186" width="192" height="10" rx="5" fill="#17201b" opacity="0.16" filter="url(#shelf-shadow)" />
        {/* Books, leaning */}
        <rect x="132" y="128" width="13" height="46" rx="1.5" fill="#b7bbb4" />
        <rect x="147" y="122" width="11" height="52" rx="1.5" fill="#c6c9c2" />
        <rect x="160" y="133" width="12" height="41" rx="1.5" fill="#aeb2ab" transform="rotate(8 166 174)" />
        {/* Vase */}
        <path d="M244 174c-10 0-15-7-15-18 0-9 6-14 6-22v-6h18v6c0 8 6 13 6 22 0 11-5 18-15 18z" fill="#c2c5be" />
        {/* The plank */}
        <rect x="96" y="174" width="208" height="9" rx="1.5" fill="#cdcfc9" />
        <rect x="96" y="181" width="208" height="2" fill="#b9bcb5" />
      </svg>
      <span aria-hidden className="absolute bottom-3 left-4 text-sm text-muted">
        {name}
      </span>
    </div>
  );
}
