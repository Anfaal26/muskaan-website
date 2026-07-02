import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';

const timeline = [
  { year: '2007', event: 'Founded', detail: 'Muskaan opens its doors in Dhaka â€” a single room, a rack of hand-selected sarees, and a dream.' },
  { year: '2012', event: 'Growing Family', detail: 'We expand to a proper boutique space, welcoming artisan collaborations from across Bangladesh and India.' },
  { year: '2018', event: 'Going Online', detail: 'Our first online orders. Customers from across Bangladesh â€” and the diaspora abroad â€” discover Muskaan.' },
  { year: '2023', event: 'New Collection', detail: 'Launch of our indo-western fusion line, honouring tradition while speaking to a modern woman.' },
  { year: '2025', event: 'Today', detail: 'Over 10,000 pieces curated. Still family-run. Still choosing every garment with love.' },
];

const team = [
  { name: 'Nasrin Akter', role: 'Founder & Lead Curator', img: 'https://picsum.photos/seed/team1/200/200' },
  { name: 'Rafiq Hossain', role: 'Operations & Sourcing', img: 'https://picsum.photos/seed/team2/200/200' },
  { name: 'Tania Begum', role: 'Design & Styling', img: 'https://picsum.photos/seed/team3/200/200' },
];

const values = [
  { icon: 'âœ¦', title: 'Quality', body: 'We source only fabrics and craftsmanship we would wear ourselves. No compromises.' },
  { icon: 'â§', title: 'Heritage', body: 'Every piece celebrates South Asian textile traditions â€” Jamdani, chikankari, zardozi, and more.' },
  { icon: 'â™¡', title: 'Love', body: 'Muskaan means smile. That warmth is in every garment, every package, every interaction.' },
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
            â€” Nasrin Akter, Founder
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
          Meet the Family
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div
                className="w-28 h-28 rounded-full overflow-hidden"
                style={{ border: '2px solid var(--color-gold)' }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p
                  className="text-lg text-[var(--color-ink)]"
                  style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400 }}
                >
                  {member.name}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{member.role}</p>
              </div>
            </motion.div>
          ))}
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
              <span
                className="text-3xl"
                style={{ color: 'var(--color-gold)' }}
                aria-hidden="true"
              >
                {v.icon}
              </span>
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
          {['gal1','gal2','gal3','gal4','gal5'].map(seed => (
            <div
              key={seed}
              className="shrink-0 rounded-sm overflow-hidden"
              style={{ width: 260, height: 180, background: 'var(--color-border)' }}
            >
              <img
                src={`https://picsum.photos/seed/${seed}/520/360`}
                alt="Muskaan boutique gallery"
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
