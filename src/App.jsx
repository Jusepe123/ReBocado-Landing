import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Pause,
  Play,
  Plus,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { contacts, packs, questions, whatsappUrl } from "./content.js";
import { BocoScene, ScrollGuide } from "./landing/Boco.jsx";
import "./landing/landing.css";

const chapters = [
  {
    id: "hola",
    mood: "happy",
    text: "¡Soy Boco! Te acompaño a descubrir comida rica, un mejor precio y una nueva oportunidad para lo que sobra.",
  },
  {
    id: "como-funciona",
    mood: "curious",
    text: "Es fácil: descubre un pack, reserva por WhatsApp y pasa a recogerlo. Antes, revisa el precio, horario y alérgenos.",
  },
  {
    id: "packs",
    mood: "delighted",
    text: "El contenido es sorpresa, pero las condiciones no. Estos son ejemplos; cada pack depende de lo que sobre ese día.",
  },
  {
    id: "negocios",
    mood: "wink",
    text: "¿Tienes un negocio? Tu comida todavía tiene mucho para dar. Conversemos sobre cómo sumarte a nuestra primera prueba local.",
  },
  {
    id: "contacto",
    mood: "happy",
    text: "Las buenas ideas empiezan conversando. Escríbenos para conocer el piloto, participar como consumidor o sumar tu negocio a ReBocado.",
  },
];
const navigation = [
  ["#como-funciona", "Cómo funciona"],
  ["#packs", "Los packs"],
  ["#negocios", "Tu negocio"],
  ["#contacto", "Contacto"],
];
const steps = [
  {
    n: "01",
    icon: ShoppingBag,
    title: "Descubre tu pack.",
    text: "En el piloto compartimos los packs por WhatsApp. Revisa el tipo de comida, el precio y la ventana de recojo.",
    note: "Aproximadamente a mitad de precio.",
  },
  {
    n: "02",
    icon: MessageCircle,
    title: "Reserva por WhatsApp.",
    text: "Confirma el pack y consulta los ingredientes y alérgenos. El contenido exacto es sorpresa: depende del excedente del día.",
    note: "Las condiciones claras, antes de reservar.",
  },
  {
    n: "03",
    icon: Store,
    title: "Recoge y paga en el local.",
    text: "Acércate al negocio dentro del horario acordado. Recoge tu pack y paga allí durante el piloto. El recojo es en el local.",
    note: "Sin pago anticipado en la web.",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GuideDock({ id, paused, className = "" }) {
  const chapter = chapters.find((item) => item.id === id);
  return (
    <div className={`rb-guide-dock ${className}`} data-guide-anchor={id}>
      <div className="rb-guide-inline" aria-hidden="true">
        <BocoScene mood={chapter.mood} text={chapter.text} paused={paused} />
      </div>
    </div>
  );
}

function JoinDialog({ audience, onClose }) {
  const ref = useRef(null);
  const business = audience === "negocio";
  const contact = business ? contacts[1] : contacts[0];
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="rb-dialog"
      aria-labelledby="rb-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          ref.current.close();
      }}
    >
      <button
        className="rb-icon-button rb-close"
        aria-label="Cerrar diálogo"
        onClick={() => ref.current.close()}
      >
        <X />
      </button>
      <span className="rb-eyebrow">
        <Leaf size={15} /> EL PRIMER PASO ES CONVERSAR
      </span>
      <h2 id="rb-dialog-title">
        {business
          ? "Tu negocio tiene mucho para dar."
          : "Tu próximo bocado empieza aquí."}
      </h2>
      <p>
        {business
          ? "Cuéntale a Matt qué preparas y en qué zona está tu local. Conversemos sobre el piloto."
          : "Escríbele a José Andrés para conocer la primera prueba local y cómo participar."}
      </p>
      <div className="rb-dialog-person">
        <img src={contact.photo} alt="" width="64" height="64" />
        <div>
          <strong>{contact.shortName}</strong>
          <span>{contact.role}</span>
        </div>
      </div>
      <a
        className="rb-button rb-button-green"
        href={whatsappUrl(contact, audience)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Conversar por WhatsApp <MessageCircle size={19} />
      </a>
      <a className="rb-dialog-email" href={`mailto:${contact.email}`}>
        {contact.email}
      </a>
      <small>Se abrirá un mensaje preparado. Tú decides cuándo enviarlo.</small>
    </dialog>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [audience, setAudience] = useState(null);
  const [selectedPack, setSelectedPack] = useState("panaderias");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const selected = packs.find((pack) => pack.id === selectedPack);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    // Lazy loading may finish after the router's initial hash effect.
    const frame = requestAnimationFrame(() => {
      const target =
        window.location.hash &&
        document.getElementById(window.location.hash.slice(1));
      if (target)
        target.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => {
      window.removeEventListener("keydown", close);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <MotionConfig reducedMotion={paused ? "always" : "user"}>
      <div className={`rb-landing ${paused ? "rb-motion-paused" : ""}`}>
        <a className="rb-skip" href="#contenido">
          Ir al contenido
        </a>
        <motion.div
          className="rb-reading-progress"
          style={{ scaleX: reduced ? scrollYProgress : progress }}
          aria-hidden="true"
        />
        <header className="rb-header">
          <a
            className="rb-wordmark"
            href="#inicio"
            aria-label="ReBocado, inicio"
          >
            <img
              src="/assets/rebocado-emblem.png"
              alt=""
              width="44"
              height="44"
            />
            <span>
              ReBocado<span className="rb-wordmark-dot">.</span>
            </span>
          </a>
          <nav className="rb-desktop-nav" aria-label="Navegación principal">
            {navigation.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="rb-header-actions">
            <Link className="rb-demo-link" to="/app">
              Ver demo <ArrowUpRight size={17} />
            </Link>
            <button
              className="rb-icon-button rb-menu-toggle"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-controls="rb-mobile-nav"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
          {menuOpen && (
            <nav
              id="rb-mobile-nav"
              className="rb-mobile-nav"
              aria-label="Navegación móvil"
            >
              {navigation.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                  <ArrowUpRight size={20} />
                </a>
              ))}
              <button
                className="rb-button rb-button-green"
                onClick={() => {
                  setMenuOpen(false);
                  setAudience("consumidor");
                }}
              >
                Quiero participar <MessageCircle size={19} />
              </button>
            </nav>
          )}
        </header>
        <main id="contenido" tabIndex={-1}>
          <section
            className="rb-hero rb-container"
            id="inicio"
            aria-labelledby="rb-hero-title"
          >
            <div className="rb-hero-copy">
              <Reveal>
                <span className="rb-eyebrow rb-location">
                  <span className="rb-status-dot" /> DE COCHA, PARA TU ANTOJO
                </span>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 id="rb-hero-title">
                  Packs sorpresa.
                  <br />
                  <span className="rb-outline-word">Precio pequeño.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.13}>
                <p>
                  <strong>
                    Packs sorpresa a aproximadamente mitad de precio.
                  </strong>{" "}
                  Comida que no se vendió a tiempo y todavía tiene mucho para
                  dar. En el piloto, reservas por WhatsApp y pagas al recoger.
                </p>
                <div className="rb-hero-actions">
                  <button
                    className="rb-button rb-button-green"
                    onClick={() => setAudience("consumidor")}
                  >
                    Quiero participar
                    <span className="rb-button-arrow">
                      <ArrowUpRight size={21} />
                    </span>
                  </button>
                  <a className="rb-text-button" href="#como-funciona">
                    Cómo funciona <ArrowDown size={18} />
                  </a>
                </div>
                <span className="rb-hero-note">
                  <MapPin size={14} /> Empezamos cerca. Empezamos en Cochabamba.
                </span>
              </Reveal>
            </div>
            <div className="rb-hero-art">
              <span className="rb-orbit rb-orbit-one" aria-hidden="true" />
              <span className="rb-orbit rb-orbit-two" aria-hidden="true" />
              <GuideDock id="hola" paused={paused} className="rb-hero-dock" />
              <span className="rb-hero-sticker">
                <Leaf size={17} /> BUENO HASTA
                <br />
                EL ÚLTIMO BOCADO
              </span>
              <span className="rb-art-caption">
                UN PEQUEÑO GUÍA. UNA GRAN CAUSA.
              </span>
            </div>
            <a className="rb-scroll-cue" href="#como-funciona">
              <span className="rb-scroll-circle">
                <ArrowDown size={19} />
              </span>
              DESLIZA Y DESCUBRE.
              <span className="rb-scroll-line" />
            </a>
          </section>
          <div className="rb-quick-facts" aria-label="Lo esencial de ReBocado">
            <ul className="rb-container">
              <li>
                <ShoppingBag size={25} />
                <span>
                  <strong>Más comida por menos</strong>Aproximadamente a mitad
                  de precio
                </span>
              </li>
              <li>
                <MessageCircle size={25} />
                <span>
                  <strong>Reserva por WhatsApp</strong>Así coordinamos el piloto
                </span>
              </li>
              <li>
                <Store size={25} />
                <span>
                  <strong>Recoge y paga en el local</strong>Dentro del horario
                  acordado
                </span>
              </li>
            </ul>
          </div>
          <section
            className="rb-how rb-section"
            id="como-funciona"
            aria-labelledby="rb-how-title"
          >
            <div className="rb-container rb-how-layout">
              <div className="rb-how-intro">
                <Reveal>
                  <span className="rb-eyebrow">01 / UN PLAN BIEN SIMPLE</span>
                  <h2 id="rb-how-title">
                    De la sorpresa
                    <br />
                    a tu mesa,
                    <br />
                    <span className="rb-serif">en tres pasos.</span>
                  </h2>
                  <p>
                    Así funciona el piloto de ReBocado. Una buena oportunidad
                    para la comida, el negocio y tu bolsillo.
                  </p>
                </Reveal>
                <GuideDock id="como-funciona" paused={paused} />
              </div>
              <div className="rb-steps">
                {steps.map(({ n, icon: Icon, title, text, note }) => (
                  <Reveal key={n} className="rb-step">
                    <span className="rb-step-number">{n}</span>
                    <div>
                      <span className="rb-step-icon">
                        <Icon size={25} strokeWidth={1.5} />
                      </span>
                      <h3>{title}</h3>
                      <p>{text}</p>
                      <span className="rb-step-note">
                        {note}
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
              <aside
                className="rb-before-reserving"
                aria-labelledby="rb-before-title"
              >
                <div>
                  <span className="rb-eyebrow">
                    LA SORPRESA ES EL CONTENIDO
                  </span>
                  <h3 id="rb-before-title">Antes de reservar</h3>
                </div>
                <ul>
                  <li>
                    <Check size={20} />
                    <span>
                      <strong>Comida y precio.</strong> Conoce el tipo de pack y
                      cuánto pagarás.
                    </span>
                  </li>
                  <li>
                    <Clock3 size={20} />
                    <span>
                      <strong>Hora y lugar.</strong> Asegúrate de poder
                      recogerlo en la ventana acordada.
                    </span>
                  </li>
                  <li>
                    <Leaf size={20} />
                    <span>
                      <strong>Ingredientes y alérgenos.</strong> Consúltalos
                      antes de confirmar tu reserva.
                    </span>
                  </li>
                </ul>
                <p>
                  <MessageCircle size={18} /> El piloto se coordina por
                  WhatsApp. La demo es de prueba y no genera pedidos reales.
                </p>
              </aside>
            </div>
          </section>
          <section
            className="rb-packs rb-section"
            id="packs"
            aria-labelledby="rb-packs-title"
          >
            <div className="rb-container">
              <div className="rb-packs-heading">
                <Reveal>
                  <span className="rb-eyebrow">
                    02 / NUNCA ES SOLO LO QUE SOBRA
                  </span>
                  <h2 id="rb-packs-title">
                    La sorpresa
                    <br />
                    está <span className="rb-serif">servida.</span>
                  </h2>
                  <p>
                    Panadería, comida o algo dulce: elige un ejemplo para
                    descubrir qué podría venir en tu pack sorpresa.
                  </p>
                </Reveal>
                <GuideDock id="packs" paused={paused} />
              </div>
              <p className="rb-pack-selector-label">
                ¿Qué se te antoja? Elige un tipo de pack.
              </p>
              <div
                className="rb-pack-tabs"
                role="group"
                aria-label="Elegir ejemplo de pack"
              >
                {packs.map((pack, i) => (
                  <button
                    key={pack.id}
                    aria-pressed={selectedPack === pack.id}
                    aria-controls="rb-pack-example"
                    className={selectedPack === pack.id ? "is-selected" : ""}
                    onClick={() => setSelectedPack(pack.id)}
                  >
                    <span>0{i + 1}</span>
                    {pack.label}
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
              <div className="rb-pack-feature" id="rb-pack-example">
                <div className="rb-pack-photo">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={selected.id}
                      src={selected.image}
                      alt={selected.alt}
                      width="1100"
                      height="800"
                      loading="lazy"
                      initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                    />
                  </AnimatePresence>
                  <span className="rb-photo-label">
                    UNA IDEA DE LO QUE PUEDE TOCARTE
                  </span>
                  <span className="rb-price-seal">
                    Buen bocado.
                    <br />
                    <strong>Mejor precio.</strong>
                    <Leaf size={20} />
                  </span>
                </div>
                <div
                  className="rb-pack-description"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="rb-eyebrow">
                    PACK SORPRESA / {selected.label.toUpperCase()}
                  </span>
                  <h3>{selected.title}</h3>
                  <p>{selected.description}</p>
                  <div className="rb-pack-details">
                    <span>
                      <ShoppingBag size={19} /> Contenido sorpresa del día
                    </span>
                    <span>
                      <Leaf size={19} /> Aproximadamente a mitad de precio
                    </span>
                    <span>
                      <Clock3 size={19} /> Consulta el horario de recojo
                    </span>
                  </div>
                  <button
                    className="rb-text-button"
                    onClick={() => setAudience("consumidor")}
                  >
                    Me apunto al piloto <ArrowUpRight size={22} />
                  </button>
                </div>
              </div>
              <p className="rb-illustration-note">
                Packs e imágenes ilustrativos. La disponibilidad y el contenido
                cambian cada día. Consulta los alérgenos antes de reservar.
              </p>
            </div>
          </section>
          <section
            className="rb-belief rb-container"
            aria-label="Nuestra razón de ser"
          >
            <Reveal>
              <span className="rb-eyebrow">
                <Leaf size={16} /> UNA IDEA QUE NOS MUEVE
              </span>
              <p>
                Que sobre{" "}
                <span className="rb-belief-food">
                  comida
                  <svg
                    viewBox="0 0 400 25"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M5 17Q200-5 395 12" />
                  </svg>
                </span>
                .<br />
                No oportunidades<span className="rb-lime-dot">.</span>
              </p>
              <span className="rb-belief-foot">
                BUENA PARA TI. BUENA PARA EL NEGOCIO. MEJOR PARA TODOS.
              </span>
            </Reveal>
          </section>
          <section
            className="rb-business rb-section"
            id="negocios"
            aria-labelledby="rb-business-title"
          >
            <div className="rb-container rb-business-layout">
              <div className="rb-business-visual">
                <img
                  src="/assets/pickup.webp"
                  alt="Escena ilustrativa de una cafetería entregando una bolsa de comida en el mostrador"
                  width="900"
                  height="1100"
                  loading="lazy"
                />
                <div className="rb-business-tag">
                  <Store size={20} />
                  <span>
                    DE TU MOSTRADOR
                    <br />
                    <strong>A UNA NUEVA OPORTUNIDAD.</strong>
                  </span>
                </div>
                <GuideDock id="negocios" paused={paused} />
              </div>
              <Reveal className="rb-business-copy">
                <span className="rb-eyebrow">
                  03 / PARA LOS QUE LE DAN SABOR AL BARRIO
                </span>
                <h2 id="rb-business-title">
                  Lo preparaste
                  <br />
                  con cariño.
                  <br />
                  <span className="rb-serif">Que se disfrute.</span>
                </h2>
                <p>
                  Tu última porción puede ser el mejor momento del día de
                  alguien. Suma tu panadería, cafetería, pensión o restaurante
                  al piloto de ReBocado.
                </p>
                <ul>
                  {[
                    "Recupera parte de lo que ya invertiste.",
                    "Complementa tus ventas de siempre.",
                    "Entrega en tu local, sin logística extra.",
                  ].map((text) => (
                    <li key={text}>
                      <Check size={18} />
                      {text}
                    </li>
                  ))}
                </ul>
                <button
                  className="rb-button rb-button-green"
                  onClick={() => setAudience("negocio")}
                >
                  Mi negocio se suma{" "}
                  <span className="rb-button-arrow">
                    <ArrowUpRight size={21} />
                  </span>
                </button>
                <span className="rb-business-note">
                  Empezamos con una primera prueba local en Cochabamba.
                </span>
              </Reveal>
            </div>
          </section>
          <section
            className="rb-faq rb-container rb-section"
            id="preguntas"
            aria-labelledby="rb-faq-title"
          >
            <Reveal className="rb-faq-intro">
              <span className="rb-eyebrow">CERO VUELTAS. TODO CLARO.</span>
              <h2 id="rb-faq-title">
                La sorpresa,
                <br />
                <span className="rb-serif">solo en el pack.</span>
              </h2>
              <p>
                Las condiciones las conoces antes.
                <br />Y si tienes otra duda, aquí estamos.
              </p>
              <a className="rb-text-button" href="#contacto">
                Hablemos <ArrowUpRight size={22} />
              </a>
            </Reveal>
            <div className="rb-faq-list">
              {questions.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <Plus size={21} aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section
            className="rb-contact rb-section"
            id="contacto"
            aria-labelledby="rb-contact-title"
          >
            <div className="rb-container">
              <div className="rb-contact-top">
                <Reveal>
                  <span className="rb-eyebrow">
                    04 / LAS BUENAS IDEAS SE COMPARTEN
                  </span>
                  <h2 id="rb-contact-title">
                    Un pequeño bocado.
                    <br />
                    <span className="rb-serif">Un gran comienzo.</span>
                  </h2>
                  <p>
                    Estamos construyendo ReBocado desde Cochabamba.
                    <br />
                    ¿Rescatamos algo bueno juntos?
                  </p>
                  <div className="rb-contact-actions">
                    <button
                      className="rb-button rb-button-green"
                      onClick={() => setAudience("consumidor")}
                    >
                      Quiero participar <ArrowUpRight size={20} />
                    </button>
                    <button
                      className="rb-button rb-button-outline"
                      onClick={() => setAudience("negocio")}
                    >
                      Tengo un negocio <ArrowUpRight size={20} />
                    </button>
                  </div>
                </Reveal>
                <GuideDock id="contacto" paused={paused} />
              </div>
              <div className="rb-founders">
                {contacts.map((contact) => (
                  <a
                    key={contact.id}
                    className="rb-founder"
                    href={whatsappUrl(
                      contact,
                      contact.id === "matt" ? "negocio" : "consumidor",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={contact.photo}
                      alt=""
                      width="56"
                      height="56"
                      loading="lazy"
                    />
                    <span>
                      <strong>{contact.shortName}</strong>
                      <span>{contact.role}</span>
                    </span>
                    <ArrowUpRight size={21} />
                    <span className="rb-sr-only">: conversar por WhatsApp</span>
                  </a>
                ))}
              </div>
              <div className="rb-demo-note">
                <span>
                  <ShoppingBag size={20} /> EXPLORA LA APP DE DEMOSTRACIÓN
                </span>
                <p>
                  Descubre cómo se verá el catálogo. Los comercios son
                  ficticios: no se envían pedidos ni se realizan cobros reales.
                </p>
                <Link to="/app">
                  Entrar a la demo <ArrowUpRight size={19} />
                </Link>
              </div>
            </div>
          </section>
        </main>
        <footer className="rb-footer rb-container">
          <div className="rb-footer-top">
            <a href="#inicio" className="rb-footer-wordmark">
              ReBocado<span>.</span>
            </a>
            <a href="#inicio" className="rb-back-top">
              Arriba, que hay más sabor <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="rb-footer-bottom">
            <span>BUENO HASTA EL ÚLTIMO BOCADO.</span>
            <span>Hecho con cariño en Cochabamba, Bolivia.</span>
            <span>© {new Date().getFullYear()} ReBocado</span>
          </div>
        </footer>
        <ScrollGuide sections={chapters} paused={paused} />
        {!reduced && (
          <button
            className="rb-motion-control"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Reanudar animaciones" : "Pausar animaciones"}
            aria-pressed={paused}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            <span>{paused ? "Reanudar" : "Pausar"}</span>
          </button>
        )}
        {audience && (
          <JoinDialog audience={audience} onClose={() => setAudience(null)} />
        )}
      </div>
    </MotionConfig>
  );
}
