import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}

const quickLinks = [
  { label: 'Shop All', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/contact' },
  { label: 'Returns', to: '/contact' },
];

const socials = [
  { label: 'Facebook', href: 'https://facebook.com/muskaan020', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'WhatsApp', href: 'https://wa.me/8801XXXXXXXXX', Icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span
            className="text-3xl"
            style={{ fontFamily: '"Dancing Script", cursive', color: 'var(--color-gold)' }}
          >
            Muskaan
          </span>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Dhaka's boutique for handpicked South Asian ethnic wear. Rooted in heritage, worn with love.
          </p>
          <div className="flex gap-4 mt-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors cursor-pointer"
              >
                <Icon size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            {quickLinks.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-white/60 hover:text-[var(--color-gold)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="border-t border-white/10 py-5 px-6 text-center text-xs text-white/30"
        style={{ fontFamily: '"DM Mono", monospace' }}
      >
        © 2025 Muskaan. Dhaka, Bangladesh. All rights reserved.
      </div>
    </footer>
  );
}
