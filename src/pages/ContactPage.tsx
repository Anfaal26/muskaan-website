import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../hooks/useToast';

const subjectOptions = [
  { value: '', label: 'Select a subject…' },
  { value: 'order', label: 'Order Inquiry' },
  { value: 'tailoring', label: 'Custom Tailoring' },
  { value: 'general', label: 'General Question' },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const empty: FormState = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const { show } = useToast();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim()) e.message = 'Message cannot be empty';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate async submit
    await new Promise(r => setTimeout(r, 1000));
    console.log('Form submission:', form);
    setLoading(false);
    setForm(empty);
    show('Message sent! We\'ll get back to you within 24 hours. 💛', 'success');
  };

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <PageWrapper dotPattern="sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1
            className="text-[var(--color-ink)]"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Get in Touch
          </h1>
          <p className="text-[var(--color-ink-muted)] mt-3 max-w-md mx-auto text-sm">
            We'd love to hear from you — whether it's an order question, custom tailoring enquiry, or just a hello.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Your Name"
                  placeholder="e.g. Nadia Islam"
                  value={form.name}
                  onChange={set('name')}
                  error={errors.name}
                  fullWidth
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  fullWidth
                  required
                />
              </div>

              <Input
                label="Phone (optional)"
                type="tel"
                placeholder="+880 1X XX XXX XXX"
                value={form.phone}
                onChange={set('phone')}
                fullWidth
              />

              <Select
                label="Subject"
                options={subjectOptions}
                value={form.subject}
                onChange={set('subject')}
                error={errors.subject}
                fullWidth
                required
              />

              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="text-sm font-medium text-[var(--color-ink)]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={set('message')}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'msg-error' : undefined}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] rounded-sm px-4 py-3 text-sm transition-colors duration-150 focus:outline-none focus:border-[var(--color-gold)] resize-none"
                  style={{ borderColor: errors.message ? 'var(--color-terracotta)' : undefined }}
                />
                {errors.message && (
                  <p id="msg-error" role="alert" className="text-xs text-[var(--color-terracotta)]">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact info */}
          <motion.aside
            className="lg:col-span-2 flex flex-col gap-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            aria-label="Contact information"
          >
            <div
              className="rounded-sm p-8 flex flex-col gap-6"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <h2
                className="text-xl text-[var(--color-ink)]"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 }}
              >
                Contact Details
              </h2>

              <a
                href="https://wa.me/8801XXXXXXXXX?text=Hello%20Muskaan%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#25D366' }}
                >
                  <MessageCircle size={18} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                    WhatsApp (fastest response)
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                    +880 1X-XXXXXXXX · Tap to chat
                  </p>
                </div>
              </a>

              <a
                href="mailto:hello@muskaan020.com"
                className="flex items-start gap-4 group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--color-gold-light)' }}
                >
                  <Mail size={18} style={{ color: 'var(--color-ink)' }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                    Email
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">hello@muskaan020.com</p>
                </div>
              </a>

              <a
                href="https://facebook.com/muskaan020"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#1877F2' }}
                >
                  <FacebookIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                    Facebook Page
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">facebook.com/muskaan020</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--color-border)' }}
                >
                  <MapPin size={18} style={{ color: 'var(--color-ink-muted)' }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">Visit Us</p>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-0.5 leading-relaxed">
                    Muskaan Boutique<br />
                    Dhaka, Bangladesh<br />
                    <span className="italic">By appointment preferred</span>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-sm p-6 text-sm"
              style={{ background: 'var(--color-gold-light)', border: '1px solid var(--color-gold)' }}
            >
              <p
                className="font-medium text-[var(--color-ink)] mb-1"
                style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem' }}
              >
                Custom Tailoring?
              </p>
              <p className="text-[var(--color-ink-muted)] text-xs leading-relaxed">
                We offer custom sizing and tailoring on most pieces. Reach out via WhatsApp with your measurements and we'll guide you through the process.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </PageWrapper>
  );
}
