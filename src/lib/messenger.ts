const FB_USERNAME = import.meta.env.VITE_FACEBOOK_PAGE_USERNAME ?? 'muskaan020';

export interface MessengerTemplate {
  key: string;
  label: string;
  text: string;
}

export function buildMessengerUrl(text: string): string {
  return `https://m.me/${FB_USERNAME}?text=${encodeURIComponent(text)}`;
}

/**
 * Messenger links can only pre-fill a text draft — Meta does not let a website
 * attach a file or send on the customer's behalf, so the product photo is
 * included as a link inside the message text instead (Messenger renders a
 * preview for it once sent).
 */
export function openMessenger(text: string) {
  window.open(buildMessengerUrl(text), '_blank', 'noopener,noreferrer');
}

export function productMessageTemplates(product: { label?: string | null; image_url: string }): MessengerTemplate[] {
  const name = product.label ?? 'this piece';
  const photo = product.image_url;
  return [
    { key: 'price', label: 'Ask the price', text: `Hi! Could you tell me the price for ${name}?\n${photo}` },
    { key: 'availability', label: 'Ask availability & size', text: `Hi! Is ${name} still available, and what sizes do you have?\n${photo}` },
    { key: 'delivery', label: 'Ask about delivery', text: `Hi! Do you deliver, and how long would it take for ${name}?\n${photo}` },
    { key: 'general', label: 'Just say hi', text: `Hi! I'm interested in ${name}.\n${photo}` },
  ];
}
