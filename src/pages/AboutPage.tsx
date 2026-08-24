import { motion } from 'framer-motion';
import { Sparkles, Landmark, Heart } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

const timeline = [
  { year: '2005', event: 'Founded', detail: 'In a single room in Dhaka, with a rack of hand-picked sarees and a quiet dream, Muskaan is born.' },
  { year: '2007', event: 'First Store', detail: 'Muskaan steps into its first storefront at Bashundhara Shopping Centre, ready to welcome its first walk-in customers.' },
  { year: '2012', event: 'Second Store', detail: 'A second home opens in Dhanmondi, bringing Muskaan closer to the women who wear it.' },
  { year: '2016', event: 'Going Global', detail: 'Muskaan crosses borders online, building a small but growing family of customers around the world.' },
  { year: '2021', event: 'Staying Close', detail: 'Through a hard year, Muskaan leans on its community online, keeping the craft alive one order at a time.' },
  { year: 'Present', event: 'A New Chapter', detail: 'Two decades on, from that single room, Muskaan is no longer just where women shop. It is where they come home to themselves.' },
];

const team = [
  { name: 'Sanjeeda Akhter', role: 'Designer and Founder' },
  { name: 'Afzal Hossain', role: 'Proprietor' },
];

const values = [
  { icon: Sparkles, title: 'Quality', body: 'We source only fabrics and craftsmanship we would wear ourselves. No compromises.' },
  { icon: Landmark, title: 'Heritage', body: 'Every piece celebrates South Asian textile traditions — Jamdani, chikankari, zardozi, and more.' },
  { icon: Heart, title: 'Love', body: 'Muskaan means smile. That warmth is in every garment, every package, every interaction.' },
];

const galleryImages = [
  { src: '/about-gallery/store-display.jpg', alt: 'Muskaan store display of curated ethnic wear' },
  { src: '/about-gallery/styling-shoot.jpg', alt: 'Behind the scenes styling and filming at a Muskaan pop-up' },
  { src: '/about-gallery/customers.jpg', alt: 'Customers browsing at a Muskaan pop-up event' },
  { src: '/about-gallery/award.jpg', alt: 'Muskaan Boutique’s Youth Entrepreneurial Festival 2021 award and certificate of appreciation' },
];

export default function AboutPage() {
  return (
    <PageWrapper dotPattern="md">
      {/* Hero quote */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: 'var(--color-ink)' }}
      >
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <p
            className="text-white leading-tight"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            }}
          >
            "We began with a single stitch<br />and a dream."
          </p>
          <cite
            className="block mt-6 text-sm not-italic"
            style={{ color: 'var(--color-gold)', fontFamily: '"DM Mono", monospace' }}
          >
            — Sanjeeda Akhter, Founder
          </cite>
        </motion.blockquote>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[var(--color-ink)] mb-14"
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2.5rem' }}
        >
          Our Journey
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: 'var(--color-border)' }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`flex gap-6 items-start md:w-1/2 ${i % 2 === 0 ? 'md:pr-10 md:ml-0 md:text-right md:self-start' : 'md:pl-10 md:ml-auto md:text-left md:self-end'}`}
              >
                <div className={`flex flex-col gap-1 ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                  <span
                    className="text-2xl font-semibold"
                    style={{ fontFamily: '"DM Mono", monospace', color: 'var(--color-gold)' }}
                  >
                    {item.year}
                  </span>
                  <h3
                    className="text-lg text-[var(--color-ink)]"
                    style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                  >
                    {item.event}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed max-w-xs">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the family */}
      <section className="py-20 px-6 max-w-7xl mx-auto dot-bg-lg">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[var(--color-ink)] mb-14"
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2.5rem' }}
        >
          Meet the Founders
        </motion.h2>

        <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full rounded-sm overflow-hidden"
            style={{ border: '2px solid var(--color-gold)', aspectRatio: '4/3' }}
          >
            <img
              src="/about-gallery/meet_the_founders.jpeg"
              alt="Sanjeeda Akhter and Afzal Hossain, the founders of Muskaan Boutique"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-8 w-full">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                className="text-center"
              >
                <p
                  className="text-lg text-[var(--color-ink)]"
                  style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                >
                  {member.name}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[var(--color-ink)] mb-14"
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, fontSize: '2.5rem' }}
        >
          What We Stand For
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col gap-3 p-8 rounded-sm text-center"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <v.icon
                size={32}
                style={{ color: 'var(--color-gold)' }}
                aria-hidden="true"
              />
              <h3
                className="text-xl text-[var(--color-ink)]"
                style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
              >
                {v.title}
              </h3>
              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Photo strip */}
      <section className="py-10 px-6 overflow-hidden" aria-label="Gallery">
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {galleryImages.map(img => (
            <div
              key={img.src}
              className="shrink-0 rounded-sm overflow-hidden"
              style={{ width: 260, height: 180, background: 'var(--color-border)' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
