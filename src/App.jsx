import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Clock3, Heart, Leaf, Mail, MapPin, Menu, MessageCircle, Phone, Search, ShoppingBag, Smartphone, Sparkles, Store, X } from 'lucide-react';
import { contacts, packs, questions, whatsappUrl } from './content.js';

const navItems = [['#como-funciona', 'Cómo funciona'], ['#packs', 'Los packs'], ['#negocios', 'Para negocios'], ['#contacto', 'Hablemos']];

function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} {...props}>{children}</motion.div>;
}

function ContactLink({ contact, audience, className = 'button', children }) {
  return <a className={className} href={whatsappUrl(contact, audience)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" />{children}</a>;
}

function JoinDialog({ audience, onClose }) {
  const ref = useRef(null);
  const business = audience === 'negocio';
  useEffect(() => {
    const dialog = ref.current;
    if (audience && !dialog.open) dialog.showModal();
    if (!audience && dialog.open) dialog.close();
  }, [audience]);
  const ordered = business ? [contacts[1], contacts[0]] : contacts;
  return <dialog ref={ref} className="join-dialog" aria-labelledby="join-title" onClose={onClose} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
  }}>
    <button className="dialog-close icon-button" aria-label="Cerrar" onClick={() => ref.current.close()}><X size={22} /></button>
    <span className="eyebrow"><Leaf size={15} /> EL PRÓXIMO BOCADO EMPIEZA CONTIGO</span>
    <h2 id="join-title">{business ? 'Tu negocio tiene mucho para dar.' : 'Vamos por ese primer bocado.'}</h2>
    <p>{business ? 'Cuéntanos qué preparas y en qué zona está tu local. Matt te ayudará a conocer el piloto y cómo sumarte.' : 'Escríbele a José Andrés para conocer los packs y cómo participar en el piloto en Cochabamba.'}</p>
    <div className="dialog-contacts">{ordered.map((contact, index) => <article key={contact.id}>
      <div><img className="contact-avatar contact-photo" src={contact.photo} alt={contact.name} width="40" height="40" /><div><strong>{contact.shortName}</strong><span>{contact.role}</span></div>{index === 0 && <span className="recommended">Empieza aquí</span>}</div>
      <ContactLink contact={contact} audience={audience} className={`button ${index === 0 ? '' : 'button-outline'}`}>Escribir a {contact.shortName}</ContactLink>
      <a className="dialog-email" href={`mailto:${contact.email}`}>{contact.email}</a>
    </article>)}</div>
    <p className="dialog-foot"><MapPin size={15} /> Primera prueba con un restaurante · Cochabamba</p>
  </dialog>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [audience, setAudience] = useState(null);
  const [category, setCategory] = useState('todos');
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const visiblePacks = category === 'todos' ? packs : packs.filter(pack => pack.id === category);

  return <MotionConfig reducedMotion="user">
    <a className="skip-link" href="#contenido">Ir al contenido</a>
    <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduced ? scrollYProgress : progress }} />
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner shell">
        <a className="brand" href="#inicio" aria-label="ReBocado, inicio"><img src="/assets/rebocado-emblem.png" alt="ReBocado" width="80" height="80" /></a>
        <nav className="desktop-nav" aria-label="Navegación principal">{navItems.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
        <button className="button button-small header-cta" onClick={() => setAudience('negocio')}>Tengo un negocio <ArrowUpRight size={16} aria-hidden="true" /></button>
        <button className="menu-button icon-button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Navegación móvil" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
        {navItems.map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={17} /></a>)}
        <button className="button" onClick={() => { setMenuOpen(false); setAudience('negocio'); }}>Tengo un negocio</button>
      </motion.nav>}</AnimatePresence>
    </header>
    <main id="contenido">
      <section id="inicio" className="hero shell">
        <div className="hero-copy">
          <Reveal><span className="eyebrow"><MapPin size={15} /> DE COCHA, CON MUCHO SABOR</span></Reveal>
          <Reveal delay={0.08}><h1>Buena comida.<br />Mejor precio.<br /><span>Otra oportunidad.</span></h1></Reveal>
          <Reveal delay={0.16}><p>Ese pan de hoy. Esa última porción. Todavía tienen mucho para dar. Rescata un pack sorpresa y evita que buena comida termine en la basura.</p>
            <div className="hero-actions"><button className="button" onClick={() => setAudience('consumidor')}>Quiero mi primer bocado <ArrowUpRight size={18} /></button><a className="subtle-link" href="#como-funciona">¿Cómo funciona? <ArrowDown size={16} /></a></div>
            <div className="pilot-note"><span className="pilot-dot" /> Prueba local con un restaurante <span className="note-divider" /> Cochabamba</div>
          </Reveal>
        </div>
        <Reveal className="hero-visual" delay={0.12}>
          <div className="hero-image-wrap"><img className="hero-image" src="/assets/food-hero.webp" alt="Bolsa llena de panes dorados, croissants y fruta fresca" width="1100" height="1100" fetchPriority="high" /><span className="hero-caption">BUENO HASTA EL ÚLTIMO BOCADO</span></div>
          <motion.div className="rescue-seal" initial={reduced ? false : { rotate: -20, scale: 0.75 }} animate={{ rotate: 9, scale: 1 }} transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.5 }}><Leaf size={25} /><span>Demasiado rico<br />para desperdiciarlo.</span><span className="seal-star">✳</span></motion.div>
          <div className="hero-mini-photo"><img src="/assets/cafe.webp" alt="Una caja con pastelería y bocados de cafetería" width="720" height="480" /><span>Hoy puede sorprenderte.</span></div>
          <motion.div className="hero-pack-note" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}><span className="note-icon"><ShoppingBag size={22} /></span><div><strong>Una sorpresa que vale la pena.</strong><span>Menos desperdicio. Más buenos bocados.</span></div></motion.div>
        </Reveal>
      </section>

      <div className="principles-band"><div className="shell principles"><span><Check size={18} /> Comida en buen estado</span><span><Heart size={18} /> Precios que se disfrutan</span><span><Leaf size={18} /> Menos desperdicio</span><span><Store size={18} /> Más valor para tu barrio</span></div></div>

      <section id="como-funciona" className="how shell section-space">
        <Reveal className="section-heading"><div><span className="eyebrow">UN PLAN FÁCIL. UN BOCADO INESPERADO.</span><h2>Rescatar sabe bien.<br /><span>Y es así de simple.</span></h2></div><p>La comida ya está preparada. Solo necesita encontrar a quien la disfrute antes de que cierre el negocio.</p></Reveal>
        <div className="steps">{[
          { icon: Search, number: '01', label: 'DESCUBRE', title: 'Encuentra tu pack', text: 'En la prueba local compartiremos los packs del restaurante por WhatsApp. Conoce el tipo de comida, el precio y el horario de recojo.' },
          { icon: Smartphone, number: '02', label: 'RESERVA', title: 'Guarda tu sorpresa', text: 'Elige tu pack y resérvalo. El contenido depende del excedente del día; el precio y las condiciones se conocen antes.' },
          { icon: ShoppingBag, number: '03', label: 'DISFRUTA', title: 'Recoge y saborea', text: 'Pasa por el local en el horario acordado y paga allí durante el piloto. Tú disfrutas y el negocio recupera parte de su inversión.' },
        ].map(({ icon: Icon, number, label, title, text }, index) => <Reveal className="step" delay={index * 0.1} key={number}><div className="step-top"><span className="step-icon"><Icon size={27} /></span><span className="step-number">{number}</span></div><span className="eyebrow step-label">{label}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
        <Reveal className="how-foot"><Clock3 size={18} /><p>La disponibilidad cambia cada día. Rescatamos lo que sobra, sin producir de más.</p></Reveal>
      </section>

      <section id="packs" className="packs-section">
        <div className="shell section-space">
          <Reveal className="section-heading"><div><span className="eyebrow"><Sparkles size={16} /> LA SORPRESA ES PARTE DEL PLAN</span><h2>Tu próximo bocado<br />puede estar <span>por aquí.</span></h2></div><p>Panes, pastelería o una buena porción de comida. Cada pack es distinto. Cada uno merece otra oportunidad.</p></Reveal>
          <Reveal className="pack-filters" role="group" aria-label="Filtrar ejemplos de packs"><button className={category === 'todos' ? 'active' : ''} aria-pressed={category === 'todos'} onClick={() => setCategory('todos')}>Todos los bocados</button>{packs.map(pack => <button key={pack.id} className={category === pack.id ? 'active' : ''} aria-pressed={category === pack.id} onClick={() => setCategory(pack.id)}>{pack.label}</button>)}</Reveal>
          <div className={`pack-grid ${category !== 'todos' ? 'filtered' : ''}`} aria-live="polite">
            <AnimatePresence mode="popLayout">{visiblePacks.map(pack => <motion.article layout={!reduced} className="pack-card" key={pack.id} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
              <div className={`pack-photo ${pack.image ? '' : 'pack-illustration'}`}>{pack.image ? <img src={pack.image} alt={pack.alt} width="720" height="480" loading="lazy" /> : <ShoppingBag size={76} strokeWidth={1} aria-hidden="true" />}<span className="pack-category">{pack.label}</span><span className="pack-photo-icon" aria-hidden="true"><ShoppingBag size={21} /></span></div>
              <div className="pack-card-copy"><span className="pack-kicker">{pack.badge}</span><h3>{pack.title}</h3><p>{pack.description}</p><div className="pack-tags">{pack.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            </motion.article>)}</AnimatePresence>
          </div>
          <p className="illustration-note">Imágenes y packs ilustrativos. El contenido real depende del excedente disponible.</p>
        </div>
      </section>

      <section id="por-que" className="mission shell section-space">
        <Reveal className="mission-title"><span className="eyebrow">LA COMIDA CONSERVA SU VALOR</span><h2>Que sobre comida.<br /><span>No oportunidades.</span></h2><p>No vendemos desechos ni regalamos lo que ya no sirve. Rescatamos alimentos aptos para consumo que no se vendieron a tiempo.</p></Reveal>
        <div className="mission-values">{[
          { icon: Heart, title: 'Tú disfrutas por menos', text: 'Buena comida de tu zona, a aproximadamente la mitad de su precio habitual.' },
          { icon: Store, title: 'El negocio recupera valor', text: 'Parte de lo invertido en ingredientes, tiempo y trabajo vuelve al negocio.' },
          { icon: Leaf, title: 'Menos comida termina en la basura', text: 'Los alimentos cumplen su propósito: llegar a una mesa y ser disfrutados.' },
        ].map(({ icon: Icon, title, text }, index) => <Reveal className="mission-value" delay={index * 0.1} key={title}><span className="value-icon"><Icon size={23} /></span><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
      </section>

      <section id="negocios" className="business shell">
        <Reveal className="business-image"><img src="/assets/pickup.webp" alt="Una persona de una cafetería entrega una bolsa de comida a un cliente en el mostrador" width="1200" height="800" loading="lazy" /><div className="business-image-label"><span><Store size={18} /> NEGOCIOS DE BARRIO</span><strong>Lo que preparas<br />todavía puede dar más.</strong></div></Reveal>
        <Reveal className="business-copy"><span className="eyebrow">PARA QUIENES LE PONEN SABOR A COCHA</span><h2>Tu última venta.<br /><span>Una nueva posibilidad.</span></h2><p>¿Tienes una panadería, cafetería, pensión o restaurante? Convierte la comida en buen estado que no vendiste en una oportunidad para recuperar parte de su costo.</p>
          <ul className="business-benefits"><li><Check size={19} /> Aprovecha lo que ya preparaste.</li><li><Check size={19} /> Complementa tus ventas habituales.</li><li><Check size={19} /> Entrega el pack en tu propio local.</li></ul>
          <button className="button button-lime" onClick={() => setAudience('negocio')}>Quiero sumar mi negocio <ArrowUpRight size={18} /></button><p className="business-note">Empezamos con un restaurante como prueba local.</p>
        </Reveal>
      </section>

      <section id="preguntas" className="faq shell section-space"><Reveal className="faq-heading"><span className="eyebrow">LA SORPRESA VA EN EL PACK</span><h2>Las condiciones,<br /><span>siempre claras.</span></h2><p>Todo lo que necesitas saber antes del primer bocado.</p><a className="subtle-link" href="#contacto">¿Otra pregunta? Hablemos <ArrowUpRight size={16} /></a></Reveal><Reveal className="faq-items">{questions.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</Reveal></section>

      <section id="contacto" className="contact-section"><div className="shell section-space"><Reveal className="contact-heading"><span className="eyebrow">DOS PERSONAS. UNA IDEA CON MUCHO SABOR.</span><h2>Empezamos cerca.<br /><span>Hablemos.</span></h2><p>Estamos construyendo ReBocado desde Cochabamba.<br />Si quieres rescatar un pack o sumar tu negocio, aquí estamos.</p></Reveal>
        <div className="contact-grid">{contacts.map((contact, index) => <Reveal className="contact-card" key={contact.id} delay={index * 0.1}><div className="contact-card-top"><img className="contact-avatar contact-photo" src={contact.photo} alt={contact.name} width="88" height="88" loading="lazy" /><span className="contact-role">{contact.role}</span></div><h3>{contact.name}</h3><div className="contact-details"><a href={`tel:+${contact.internationalPhone}`}><Phone size={17} /> +591 {contact.phone}</a><a href={`mailto:${contact.email}`}><Mail size={17} /><span>{contact.email}</span></a></div><ContactLink contact={contact} audience={contact.id === 'matt' ? 'negocio' : 'consumidor'} className="button button-outline">Escribir por WhatsApp <ArrowUpRight size={17} /></ContactLink></Reveal>)}</div>
      </div></section>

      <section className="final-cta shell"><Reveal><span className="eyebrow"><Leaf size={16} /> BUENO HASTA EL ÚLTIMO BOCADO</span><h2>La buena comida<br />merece <span>otra oportunidad.</span></h2><p>Un pack para ti. Una venta para un negocio.<br />Menos comida que se pierde.</p><div className="final-actions"><button className="button" onClick={() => setAudience('consumidor')}>Quiero participar <ArrowUpRight size={18} /></button><button className="button button-outline" onClick={() => setAudience('negocio')}>Tengo un negocio</button></div><span className="final-note">Packs sorpresa · Recojo en el local · Cochabamba</span></Reveal></section>
    </main>
    <footer className="footer shell"><div><a className="footer-brand" href="#inicio"><img src="/assets/rebocado-emblem.png" alt="" width="42" height="42" loading="lazy" />ReBocado</a><p>Bueno hasta el último bocado.</p></div><nav aria-label="Navegación del pie">{navItems.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav><span>Con mucho sabor, desde Cochabamba.<br />© {new Date().getFullYear()} ReBocado</span></footer>
    <JoinDialog audience={audience} onClose={() => setAudience(null)} />
  </MotionConfig>;
}

export default App;
