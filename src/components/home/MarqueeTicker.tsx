const items = [
  'SAREES', 'KURTIS', 'LEHENGAS', 'SALWAR KAMEEZ', 'ANARKALIS',
  'NEW ARRIVALS', 'FREE SHIPPING OVER ৳2000',
];

const text = items.join('  ✦  ');

export default function MarqueeTicker() {
  return (
    <div
      className="overflow-hidden py-3"
      style={{ background: 'var(--color-ink)' }}
      aria-label="Product categories ticker"
    >
      <div className="marquee-track" aria-hidden="true">
        {[text, text].map((t, i) => (
          <span
            key={i}
            className="whitespace-nowrap px-8 text-xs tracking-[0.2em] uppercase text-white/80"
            style={{ fontFamily: '"DM Mono", monospace' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
