import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useRegisterSW } from "virtual:pwa-register/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Heart,
  HelpCircle,
  Info,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Ticket,
  UserRound,
  Wallet,
  WifiOff,
  X,
} from "lucide-react";
import { contacts, whatsappUrl } from "../content.js";
import {
  categories,
  dateLabel,
  merchantById,
  merchants,
  money,
  nextDay,
  pickupLabel,
  remainingStock,
  todayInBolivia,
} from "./catalog.js";
import {
  changeOrder,
  createReservation,
  emptyState,
  loadState,
  sanitizeState,
  STORAGE_KEY,
} from "./store.js";

const Landing = lazy(() => import("../App.jsx"));
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);
const navigation = [
  { to: "/app", label: "Explorar", icon: Store },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/reservas", label: "Mis reservas", icon: Ticket },
  { to: "/perfil", label: "Mi espacio", icon: UserRound },
];

function Dialog({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog
      className="app-dialog"
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.target === event.currentTarget &&
          (event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom)
        )
          onClose();
      }}
      aria-labelledby="app-dialog-title"
    >
      <button
        className="app-icon-button app-dialog-close"
        aria-label="Cerrar diálogo"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <h2 id="app-dialog-title">{title}</h2>
      {children}
    </dialog>
  );
}

function PwaStatus() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean(navigator.standalone),
  );
  const [help, setHelp] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [installError, setInstallError] = useState("");
  const [swError, setSwError] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError() {
      setSwError(true);
    },
    onRegisteredSW(_url, registration) {
      setSwRegistration(registration);
    },
  });
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === "visible" && navigator.onLine)
        swRegistration?.update().catch(() => {});
    };
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, [swRegistration]);
  useEffect(() => {
    const prompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const added = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setHelp(false);
    };
    const connectivity = () => setOnline(navigator.onLine);
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", added);
    window.addEventListener("online", connectivity);
    window.addEventListener("offline", connectivity);
    return () => {
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", added);
      window.removeEventListener("online", connectivity);
      window.removeEventListener("offline", connectivity);
    };
  }, []);
  async function install() {
    if (!installPrompt) {
      setHelp(true);
      return;
    }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setInstallPrompt(null);
    } catch {
      setInstallError(
        "No se pudo abrir la instalación. Puedes usar el menú de tu navegador.",
      );
      setHelp(true);
    }
  }
  return (
    <>
      <div className="app-pwa-actions">
        <span className={`app-connectivity ${!online ? "is-offline" : ""}`}>
          <span />
          {!online
            ? "Sin conexión"
            : offlineReady
              ? "Lista para usar sin conexión"
              : "Demo en tu dispositivo"}
        </span>
        {!installed && (
          <button className="app-install" onClick={install}>
            <Download size={16} />
            <span>Instalar app</span>
          </button>
        )}
      </div>
      {!online && (
        <div className="app-system-banner" role="status">
          <WifiOff size={17} />
          Estás sin conexión. El catálogo y las reservas de prueba siguen
          disponibles; los contactos externos requieren internet.
        </div>
      )}
      {swError && (
        <div className="app-system-banner" role="status">
          No se activó el modo sin conexión. Puedes seguir usando la demo en
          línea.
        </div>
      )}
      {needRefresh && (
        <div className="app-system-banner">
          <Sparkles size={17} />
          Hay una nueva versión. Termina tu reserva antes de actualizar.
          <button onClick={() => updateServiceWorker(true)}>Actualizar</button>
        </div>
      )}
      {help && (
        <Dialog title="ReBocado, a un toque" onClose={() => setHelp(false)}>
          <div className="app-install-art">
            <img src="/icon-512.png" width="86" height="86" alt="ReBocado" />
            <Smartphone size={34} />
          </div>
          <p>
            Guarda la app en tu pantalla de inicio y vuelve a tus favoritos y
            reservas, incluso sin conexión después de la primera carga.
          </p>
          <ol>
            <li>
              <strong>iPhone / iPad:</strong> abre en Safari, toca Compartir y
              luego “Añadir a pantalla de inicio”.
            </li>
            <li>
              <strong>Android / Chrome / Edge:</strong> abre el menú y busca
              “Instalar app” o “Añadir a pantalla de inicio”.
            </li>
          </ol>
          {!import.meta.env.PROD && (
            <p className="app-note">
              La instalación y el modo sin conexión se prueban con{" "}
              <code>npm run build</code> y <code>npm run preview</code>, o en
              Vercel con HTTPS.
            </p>
          )}
          {installError && <p role="alert">{installError}</p>}
          <button className="app-button" onClick={() => setHelp(false)}>
            Entendido <Check size={17} />
          </button>
        </Dialog>
      )}
    </>
  );
}

function Shell({ children }) {
  const { state, storageError } = useApp();
  const location = useLocation();
  const mainRef = useRef(null);
  const activeOrders = state.orders.filter(
    (order) => order.status === "reserved",
  ).length;
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);
  return (
    <div className="pwa-app">
      <a href="#app-content" className="app-skip">
        Ir al contenido
      </a>
      <aside className="app-sidebar">
        <Link to="/app" className="app-brand" aria-label="ReBocado, catálogo">
          <img
            src="/assets/rebocado-emblem.png"
            width="52"
            height="52"
            alt=""
          />
          <span>
            ReBocado<small>Un bocado. Otra oportunidad.</small>
          </span>
        </Link>
        <span className="app-sidebar-label">TU PRÓXIMO BUEN BOCADO</span>
        <nav aria-label="Navegación principal">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app"}
              className={({ isActive }) =>
                `app-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={21} />
              <span>{label}</span>
              {to === "/reservas" && activeOrders > 0 && <b>{activeOrders}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="app-sidebar-bottom">
          <div className="app-sidebar-mission">
            <Leaf size={27} />
            <strong>
              Buena comida.
              <br />
              Menos desperdicio.
            </strong>
            <p>Cada pack es una nueva oportunidad.</p>
            <Link to="/">
              Conoce ReBocado <ArrowUpRight size={15} />
            </Link>
          </div>
          <span className="app-demo-pill">
            <span /> PROTOTIPO · v3.0
          </span>
        </div>
      </aside>
      <div className="app-workspace">
        <header className="app-topbar">
          <Link to="/app" className="app-mobile-brand">
            <img
              src="/assets/rebocado-emblem.png"
              width="34"
              height="34"
              alt=""
            />
            ReBocado
          </Link>
          <div className="app-location">
            <MapPin size={18} />
            <span>
              Cochabamba, Bolivia
              <small>Recojo en el local · sin delivery</small>
            </span>
          </div>
          <PwaStatus />
        </header>
        <div className="app-demo-banner">
          <Info size={15} />
          <span>
            <strong>Estás explorando una demo.</strong> Comercios, precios y
            reservas de ejemplo. No se realizan cobros ni pedidos reales.
          </span>
        </div>
        {storageError && (
          <div className="app-system-banner" role="alert">
            Tu navegador no permite guardar datos. Los cambios de esta sesión se
            perderán al cerrar o recargar la página.
          </div>
        )}
        <main id="app-content" ref={mainRef} tabIndex="-1" className="app-main">
          {children}
        </main>
        <footer className="app-footer">
          <span>Hecho para darle otra oportunidad a la buena comida.</span>
          <Link to="/perfil">
            Ayuda y contacto <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
      <nav className="app-bottom-nav" aria-label="Navegación móvil">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>
              <Icon size={21} />
              {to === "/reservas" && activeOrders > 0 && <b>{activeOrders}</b>}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function PageTitle({ eyebrow, title, subtitle, children }) {
  return (
    <div className="app-page-title">
      <div>
        {eyebrow && <span className="app-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function FavoriteButton({ merchant }) {
  const { state, mutate, toast } = useApp();
  const saved = state.favorites.includes(merchant.id);
  return (
    <button
      className={`app-favorite ${saved ? "saved" : ""}`}
      aria-pressed={saved}
      aria-label={`${saved ? "Quitar" : "Guardar"} ${merchant.name} ${saved ? "de" : "en"} favoritos`}
      onClick={() => {
        mutate((current) => ({
          ...current,
          favorites: saved
            ? current.favorites.filter((id) => id !== merchant.id)
            : [...new Set([...current.favorites, merchant.id])],
        }));
        toast(
          saved
            ? "Comercio eliminado de favoritos"
            : "Guardado para tu próximo antojo",
        );
      }}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

function MerchantCard({ merchant, index = 0 }) {
  const { state, date } = useApp();
  const available = remainingStock(merchant, state.orders, date);
  const reduced = useReducedMotion();
  return (
    <motion.article
      className="app-merchant-card"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Link to={`/comercios/${merchant.id}`} className="app-card-link">
        <div className="app-card-image">
          <img
            src={merchant.image}
            alt={merchant.imageAlt}
            width="640"
            height="480"
            loading={index > 2 ? "lazy" : "eager"}
          />
          <span className={`app-stock ${available === 0 ? "sold-out" : ""}`}>
            <span />
            {available === 0
              ? "Agotado en la demo"
              : `${available} packs de ejemplo`}
          </span>
          <span className="app-discount">−50%</span>
        </div>
        <div className="app-card-body">
          <span className="app-card-category">
            {
              categories.find((category) => category.id === merchant.category)
                .label
            }
            <span>· {merchant.area}</span>
          </span>
          <h3>{merchant.name}</h3>
          <p>Pack sorpresa · {merchant.tag}</p>
          <div className="app-card-pickup">
            <Clock3 size={15} />
            <span>Recojo {pickupLabel(merchant)}</span>
          </div>
          <div className="app-card-bottom">
            <div>
              <strong>{money(merchant.price)}</strong>
              <del>{money(merchant.originalPrice)}</del>
            </div>
            <span className="app-card-arrow">
              <ArrowUpRight size={19} />
            </span>
          </div>
        </div>
      </Link>
      <FavoriteButton merchant={merchant} />
    </motion.article>
  );
}

function DateSelect({ id = "catalog-date" }) {
  const { date, setDate } = useApp();
  const today = todayInBolivia();
  return (
    <label className="app-date-select" htmlFor={id}>
      <Clock3 size={16} />
      <span className="app-sr-only">Día de recojo</span>
      <select
        id={id}
        value={date}
        onChange={(event) => setDate(event.target.value)}
      >
        <option value={today}>Hoy · {dateLabel(today)}</option>
        <option value={nextDay(today)}>
          Mañana · {dateLabel(nextDay(today))}
        </option>
      </select>
    </label>
  );
}

function Explore() {
  const { state } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [sort, setSort] = useState("recommended");
  const filtered = merchants
    .filter(
      (merchant) =>
        (category === "todos" || merchant.category === category) &&
        `${merchant.name} ${merchant.tag} ${merchant.area} ${merchant.description}`
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(
            query
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .trim(),
          ),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "pickup"
          ? a.pickup[0].localeCompare(b.pickup[0])
          : 0,
    );
  return (
    <>
      <div className="app-welcome">
        <span>
          <span className="app-sun">✺</span>
          {state.name
            ? `Hola, ${state.name}. ¿Qué rescatamos hoy?`
            : "Un pequeño gesto. Un gran bocado."}
        </span>
        <span>BUENA COMIDA, NUEVAS OPORTUNIDADES</span>
      </div>
      <section className="app-hero" aria-labelledby="app-hero-title">
        <div className="app-hero-copy">
          <span className="app-eyebrow">
            <Leaf size={14} /> EL SABOR DE HACER ALGO BUENO
          </span>
          <h1 id="app-hero-title">
            Lo bueno no se
            <br />
            <em>desperdicia.</em>
          </h1>
          <p>
            Rescata packs sorpresa a un mejor precio.
            <br />
            Tú disfrutas. El negocio recupera. Todos ganamos.
          </p>
          <a className="app-button" href="#app-catalog">
            Encuentra tu próximo bocado <ArrowRight size={17} />
          </a>
          <div className="app-hero-foot">
            <ShieldCheck size={16} />
            Comida en buen estado. Nunca desechos.
          </div>
        </div>
        <div className="app-hero-photo">
          <img
            src="/assets/food-hero.webp"
            width="900"
            height="675"
            alt="Buena comida ilustrativa: pan, fruta y croissants en una bolsa de papel"
          />
          <div className="app-hero-sticker">
            <Leaf size={23} />
            <strong>
              Otra
              <br />
              oportunidad.
            </strong>
            <span>MISMA BUENA COMIDA</span>
          </div>
          <div className="app-hero-photo-label">
            <Sparkles size={16} />
            Sorpresa por dentro. Impacto por fuera.
          </div>
        </div>
      </section>
      <section
        id="app-catalog"
        className="app-catalog"
        aria-labelledby="catalog-title"
      >
        <div className="app-section-heading">
          <div>
            <span className="app-eyebrow">EXPLORA EL CATÁLOGO DE PRUEBA</span>
            <h2 id="catalog-title">Tu próximo buen bocado</h2>
            <p>Comercios ficticios en Cochabamba · fotos ilustrativas</p>
          </div>
          <DateSelect />
        </div>
        <div className="app-search-row">
          <label className="app-search">
            <Search size={19} />
            <span className="app-sr-only">Buscar comercios o comida</span>
            <input
              type="search"
              placeholder="¿Pan, comida casera o un antojo?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="app-sort">
            <span className="app-sr-only">Ordenar comercios</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="recommended">Recomendados</option>
              <option value="price">Menor precio</option>
              <option value="pickup">Recojo más temprano</option>
            </select>
          </label>
        </div>
        <div className="app-categories" aria-label="Categorías">
          {categories.map((item) => (
            <button
              key={item.id}
              aria-pressed={category === item.id}
              className={category === item.id ? "active" : ""}
              onClick={() => setCategory(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="app-results-label" role="status">
          <span>
            {filtered.length}{" "}
            {filtered.length === 1
              ? "comercio de ejemplo"
              : "comercios de ejemplo"}
          </span>
          <span>
            <ShoppingBag size={14} />
            Reserva · recoge · disfruta
          </span>
        </div>
        {filtered.length ? (
          <div className="app-merchant-grid">
            {filtered.map((merchant, index) => (
              <MerchantCard
                merchant={merchant}
                key={merchant.id}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Ese bocado todavía no está aquí"
            description="Prueba otra búsqueda o explora todas las categorías."
          >
            <button
              className="app-button app-button-secondary"
              onClick={() => {
                setQuery("");
                setCategory("todos");
              }}
            >
              Ver todos los comercios
            </button>
          </EmptyState>
        )}
      </section>
      <section className="app-how" aria-label="Así funciona">
        <div>
          <span className="app-how-number">01</span>
          <Search size={22} />
          <strong>Encuentra tu pack</strong>
          <p>Conoce el tipo de comida y el horario.</p>
        </div>
        <div>
          <span className="app-how-number">02</span>
          <Ticket size={22} />
          <strong>Reserva tu sorpresa</strong>
          <p>Elige cómo pagar y guarda tu código.</p>
        </div>
        <div>
          <span className="app-how-number">03</span>
          <ShoppingBag size={22} />
          <strong>Recoge y disfruta</strong>
          <p>Ve al local dentro de la ventana de recojo.</p>
        </div>
      </section>
      <Link to="/perfil#negocios" className="app-business-strip">
        <span className="app-business-icon">
          <Store size={24} />
        </span>
        <div>
          <strong>¿Tienes un negocio con comida por rescatar?</strong>
          <p>Convierte tu excedente en una nueva oportunidad.</p>
        </div>
        <span>
          Hablemos <ArrowUpRight size={18} />
        </span>
      </Link>
    </>
  );
}

function EmptyState({
  icon: Icon = ShoppingBag,
  title,
  description,
  children,
}) {
  return (
    <div className="app-empty">
      <span>
        <Icon size={31} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}

function Favorites() {
  const { state } = useApp();
  const saved = merchants.filter((merchant) =>
    state.favorites.includes(merchant.id),
  );
  return (
    <>
      <PageTitle
        eyebrow="GUÁRDALO PARA DESPUÉS"
        title="Tus favoritos"
        subtitle="Los buenos bocados merecen volver a encontrarse."
      >
        <DateSelect />
      </PageTitle>
      {saved.length ? (
        <div className="app-merchant-grid">
          {saved.map((merchant, index) => (
            <MerchantCard key={merchant.id} merchant={merchant} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Aquí van tus próximos antojos"
          description="Toca el corazón de un comercio para guardarlo en este dispositivo."
        >
          <Link to="/app" className="app-button">
            Explorar comercios <ArrowRight size={17} />
          </Link>
        </EmptyState>
      )}
    </>
  );
}

function MerchantDetail() {
  const { id } = useParams();
  const merchant = merchantById(id);
  const { state, date } = useApp();
  if (!merchant) return <NotFound />;
  const available = remainingStock(merchant, state.orders, date);
  return (
    <>
      <Link to="/app" className="app-back">
        <ArrowLeft size={16} />
        Volver a explorar
      </Link>
      <div className="app-detail-layout">
        <div>
          <div className="app-detail-photo">
            <img
              src={merchant.image}
              width="900"
              height="675"
              alt={merchant.imageAlt}
            />
            <span className="app-photo-note">Foto ilustrativa</span>
            <FavoriteButton merchant={merchant} />
          </div>
          <div className="app-detail-copy">
            <span className="app-eyebrow">
              {categories.find((item) => item.id === merchant.category).label} ·
              COMERCIO DE DEMO
            </span>
            <h1>{merchant.name}</h1>
            <p className="app-detail-place">
              <MapPin size={16} />
              {merchant.area}, Cochabamba
            </p>
            <h2>{merchant.pack}</h2>
            <p>{merchant.description}</p>
            <h3>¿Qué puede traer tu pack?</h3>
            <ul className="app-check-list">
              {merchant.contents.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={17} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="app-allergy-note">
              <ShieldCheck size={22} />
              <div>
                <strong>Buena comida, con información clara</strong>
                <p>
                  {merchant.allergens} El contenido es sorpresa: confirma
                  ingredientes y posibles alérgenos con el negocio antes de una
                  reserva real. Si no puedes confirmarlos, no reserves.
                </p>
              </div>
            </div>
            <h3>Horarios y recojo</h3>
            <div className="app-info-row">
              <Clock3 size={18} />
              <div>
                <strong>Horario de atención de ejemplo</strong>
                <p>{merchant.hours}</p>
              </div>
            </div>
            <div className="app-info-row">
              <ShoppingBag size={18} />
              <div>
                <strong>Ventana de recojo: {pickupLabel(merchant)}</strong>
                <p>Solo recojo en el local. No incluye delivery.</p>
              </div>
            </div>
            <div className="app-info-row">
              <MapPin size={18} />
              <div>
                <strong>{merchant.address}</strong>
                <p>
                  No es una dirección real. No visites este comercio de prueba.
                </p>
              </div>
            </div>
          </div>
        </div>
        <aside className="app-reserve-panel">
          <span className="app-eyebrow">PACK SORPRESA</span>
          <h2>
            Un buen bocado.
            <br />
            Un mejor precio.
          </h2>
          <div className="app-detail-price">
            <strong>{money(merchant.price)}</strong>
            <del>{money(merchant.originalPrice)}</del>
            <span>−50%</span>
          </div>
          <p>Precio y valor de referencia de ejemplo.</p>
          <DateSelect id="detail-date" />
          <div className="app-pickup-box">
            <Clock3 size={21} />
            <div>
              <strong>{pickupLabel(merchant)}</strong>
              <span>{dateLabel(date)} · recojo en el local</span>
            </div>
          </div>
          <span
            className={`app-availability ${available === 0 ? "empty" : ""}`}
          >
            <span />
            {available} packs disponibles en la demo
          </span>
          {available > 0 ? (
            <Link to={`/reservar/${merchant.id}`} className="app-button">
              Probar una reserva <ArrowRight size={18} />
            </Link>
          ) : (
            <button className="app-button" disabled>
              Agotado para este día
            </button>
          )}
          <div className="app-reserve-note">
            <Info size={16} />
            <p>
              Esta prueba no reserva comida real ni envía un pedido al negocio.
            </p>
          </div>
          <div className="app-local-benefit">
            <Leaf size={20} />
            <span>
              Ayudas a evitar que comida en buen estado termine en la basura.
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}

function Checkout() {
  const { id } = useParams();
  const merchant = merchantById(id);
  const { state, date, mutate, toast } = useApp();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState("cash");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const available = merchant ? remainingStock(merchant, state.orders, date) : 0;
  useEffect(() => {
    setQuantity(1);
    setError("");
  }, [id, date]);
  if (!merchant) return <NotFound />;
  function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    try {
      mutate((current) =>
        createReservation(current, {
          merchantId: id,
          date,
          quantity,
          method,
          accepted,
        }),
      );
      toast("Reserva de prueba creada. Tu código está listo.");
      navigate("/reservas");
    } catch (caught) {
      setError(caught.message);
      submitting.current = false;
    }
  }
  return (
    <>
      <Link to={`/comercios/${id}`} className="app-back">
        <ArrowLeft size={16} />
        Volver al comercio
      </Link>
      <PageTitle
        eyebrow="SOLO UNOS PASOS MÁS"
        title="Reserva tu próximo bocado"
        subtitle="Prueba el recorrido completo, sin pedidos ni cobros reales."
      />
      <form onSubmit={submit} className="app-checkout-layout">
        <div className="app-form-sections">
          <section className="app-form-section">
            <div className="app-form-heading">
              <span>1</span>
              <h2>Tu pack y horario</h2>
            </div>
            <div className="app-checkout-merchant">
              <img src={merchant.image} alt="" width="96" height="96" />
              <div>
                <strong>{merchant.name}</strong>
                <p>Pack sorpresa · {merchant.tag}</p>
                <span>{money(merchant.price)} por pack</span>
              </div>
            </div>
            <div className="app-quantity-row">
              <div>
                <strong>¿Cuántos packs?</strong>
                <p>{available} disponibles para este día de prueba</p>
              </div>
              <div className="app-stepper">
                <button
                  type="button"
                  aria-label="Quitar un pack"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus size={17} />
                </button>
                <output aria-label="Cantidad de packs">{quantity}</output>
                <button
                  type="button"
                  aria-label="Añadir un pack"
                  disabled={quantity >= available}
                  onClick={() =>
                    setQuantity((value) => Math.min(available, value + 1))
                  }
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>
            <DateSelect id="checkout-date" />
            <div className="app-pickup-box">
              <Clock3 size={21} />
              <div>
                <strong>Recojo entre {pickupLabel(merchant)}</strong>
                <span>
                  {dateLabel(date)} · {merchant.area} · sin delivery
                </span>
              </div>
            </div>
            <p className="app-note">
              Horarios ilustrativos. No se verifica si el comercio está abierto:
              es una demo, no un servicio operativo.
            </p>
          </section>
          <section className="app-form-section">
            <div className="app-form-heading">
              <span>2</span>
              <h2>¿Cómo prefieres pagar?</h2>
            </div>
            <fieldset className="app-payment-options">
              <legend className="app-sr-only">Forma de pago</legend>
              <label className={method === "cash" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={method === "cash"}
                  onChange={() => setMethod("cash")}
                />
                <Wallet size={23} />
                <span>
                  <strong>Pagar en el local</strong>
                  <small>Pendiente hasta el recojo · flujo de prueba</small>
                </span>
              </label>
              <label className={method === "qr-demo" ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="qr-demo"
                  checked={method === "qr-demo"}
                  onChange={() => setMethod("qr-demo")}
                />
                <CreditCard size={23} />
                <span>
                  <strong>Pago digital simulado</strong>
                  <small>Prueba del flujo QR · no genera un QR pagable</small>
                </span>
              </label>
            </fieldset>
            <div className="app-payment-disclaimer">
              <ShieldCheck size={18} />
              <p>
                {method === "qr-demo"
                  ? "Al confirmar, marcaremos el pago como simulado. No se solicita información bancaria, no se mueve dinero y no se confirma una transacción."
                  : "No pagarás nada en esta demo. En una versión operativa, el pago en el local se confirmaría con el comercio."}
              </p>
            </div>
          </section>
          <section className="app-form-section">
            <div className="app-form-heading">
              <span>3</span>
              <h2>Una sorpresa, con las cosas claras</h2>
            </div>
            <label className="app-consent">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                required
              />
              <span>
                Entiendo que el contenido es sorpresa, que debo respetar la
                ventana de recojo y que el pack puede contener alérgenos. Esta
                reserva es solo de prueba.
              </span>
            </label>
            <p className="app-note">{merchant.allergens}</p>
          </section>
        </div>
        <aside className="app-checkout-summary">
          <span className="app-eyebrow">TU RESUMEN</span>
          <h2>Un bocado que cuenta.</h2>
          <div className="app-summary-line">
            <span>{quantity} × Pack sorpresa</span>
            <strong>{money(merchant.price * quantity)}</strong>
          </div>
          <div className="app-summary-line">
            <span>Comisión en esta demo</span>
            <strong>{money(0)}</strong>
          </div>
          <div className="app-summary-saving">
            <Leaf size={17} />
            <span>
              Ahorro de ejemplo:{" "}
              {money((merchant.originalPrice - merchant.price) * quantity)}
            </span>
          </div>
          <div className="app-summary-total">
            <span>Total de ejemplo</span>
            <strong>{money(merchant.price * quantity)}</strong>
          </div>
          {error && (
            <p className="app-form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="app-button"
            type="submit"
            disabled={available < quantity || available === 0}
          >
            {method === "qr-demo"
              ? "Simular pago y reservar"
              : "Crear reserva de prueba"}
            <ArrowRight size={18} />
          </button>
          <p className="app-note">
            Guardaremos la reserva solo en este navegador. No hay cuenta,
            servidor ni cobro real.
          </p>
          <Link to={`/comercios/${id}`} className="app-text-link">
            Revisar el pack <ChevronRight size={14} />
          </Link>
        </aside>
      </form>
    </>
  );
}

function Orders() {
  const { state, mutate, toast } = useApp();
  const [tab, setTab] = useState("active");
  const [confirmation, setConfirmation] = useState(null);
  const active = state.orders.filter((order) => order.status === "reserved");
  const history = state.orders.filter((order) => order.status !== "reserved");
  const list = tab === "active" ? active : history;
  const collected = state.orders.filter(
    (order) => order.status === "collected",
  );
  const packsCount = collected.reduce(
    (total, order) => total + order.quantity,
    0,
  );
  const savings = collected.reduce(
    (total, order) =>
      total +
      (merchantById(order.merchantId).originalPrice -
        merchantById(order.merchantId).price) *
        order.quantity,
    0,
  );
  return (
    <>
      <PageTitle
        eyebrow="CADA PACK TIENE OTRA OPORTUNIDAD"
        title="Mis reservas"
        subtitle="Tu código, tu horario y las ganas de disfrutar."
      />
      <div className="app-order-stats">
        <div>
          <Ticket size={22} />
          <span>
            <strong>{active.length}</strong>Reservas de prueba activas
          </span>
        </div>
        <div>
          <ShoppingBag size={22} />
          <span>
            <strong>{packsCount}</strong>Packs recogidos en la demo
          </span>
        </div>
        <div>
          <Leaf size={22} />
          <span>
            <strong>{money(savings)}</strong>Ahorro simulado acumulado
          </span>
        </div>
      </div>
      <div className="app-tabs" aria-label="Filtrar reservas">
        <button
          aria-pressed={tab === "active"}
          className={tab === "active" ? "active" : ""}
          onClick={() => setTab("active")}
        >
          Próximos recojos <span>{active.length}</span>
        </button>
        <button
          aria-pressed={tab === "history"}
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          Historial <span>{history.length}</span>
        </button>
      </div>
      {list.length ? (
        <div className="app-order-list">
          {list.map((order) => {
            const merchant = merchantById(order.merchantId);
            return (
              <article className="app-order" key={order.id}>
                <div className="app-order-top">
                  <img src={merchant.image} width="94" height="94" alt="" />
                  <div>
                    <span className={`app-order-status ${order.status}`}>
                      {order.status === "reserved"
                        ? "Reserva de prueba"
                        : order.status === "collected"
                          ? "Recojo simulado"
                          : "Cancelada"}
                    </span>
                    <h2>{merchant.name}</h2>
                    <p>
                      {order.quantity}{" "}
                      {order.quantity === 1
                        ? "pack sorpresa"
                        : "packs sorpresa"}{" "}
                      · {money(merchant.price * order.quantity)}
                    </p>
                  </div>
                  <Link
                    to={`/comercios/${merchant.id}`}
                    className="app-icon-button"
                    aria-label={`Ver ${merchant.name}`}
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
                <div className="app-order-middle">
                  <div>
                    <Clock3 size={18} />
                    <span>
                      <strong>
                        {dateLabel(order.date)} · {pickupLabel(merchant)}
                      </strong>
                      <small>{merchant.area} · dirección ficticia</small>
                    </span>
                  </div>
                  <div>
                    <Wallet size={18} />
                    <span>
                      <strong>
                        {order.payment === "simulated"
                          ? "Pago simulado · sin cobro real"
                          : "Pago en el local · pendiente de prueba"}
                      </strong>
                      <small>
                        {order.method === "qr-demo"
                          ? "Flujo digital de ejemplo"
                          : "Método: pagar al recoger"}
                      </small>
                    </span>
                  </div>
                </div>
                <div className="app-order-code">
                  <div>
                    <span>CÓDIGO DE RECOJO DE PRUEBA</span>
                    <strong>{order.code}</strong>
                  </div>
                  <Ticket size={29} />
                  <p>
                    No es válido en ningún negocio.
                    <br />
                    Solo existe en este dispositivo.
                  </p>
                </div>
                {order.status === "reserved" && (
                  <div className="app-order-actions">
                    <button
                      className="app-text-link app-cancel"
                      onClick={() =>
                        setConfirmation({ id: order.id, action: "cancel" })
                      }
                    >
                      Cancelar reserva
                    </button>
                    <button
                      className="app-button app-button-small"
                      onClick={() =>
                        setConfirmation({
                          id: order.id,
                          action:
                            order.payment === "pending" ? "pay" : "collect",
                        })
                      }
                    >
                      {order.payment === "pending"
                        ? "Simular pago en el local"
                        : "Simular recojo"}
                      <Check size={16} />
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Ticket}
          title={
            tab === "active"
              ? "Tu próximo rescate empieza aquí"
              : "Cada bocado deja una historia"
          }
          description={
            tab === "active"
              ? "Explora un comercio de ejemplo y prueba una reserva. Tu código aparecerá aquí."
              : "Aquí verás las reservas de prueba recogidas o canceladas."
          }
        >
          <Link to="/app" className="app-button">
            Encontrar un pack <ArrowRight size={17} />
          </Link>
        </EmptyState>
      )}
      {confirmation && (
        <Dialog
          title={
            confirmation.action === "cancel"
              ? "¿Cancelar esta reserva de prueba?"
              : confirmation.action === "pay"
                ? "Simular pago en el local"
                : "¿Simular que recogiste tu pack?"
          }
          onClose={() => setConfirmation(null)}
        >
          <p>
            {confirmation.action === "cancel"
              ? "El pack volverá a estar disponible en el catálogo de este dispositivo. No se contactará a ningún negocio."
              : confirmation.action === "pay"
                ? "La reserva pasará a “pago simulado”. No se realiza ningún cobro ni se confirma dinero recibido."
                : "El pack pasará al historial como recogido en la demo. Esto no confirma una entrega real."}
          </p>
          <div className="app-dialog-actions">
            <button
              className="app-button app-button-secondary"
              onClick={() => setConfirmation(null)}
            >
              Volver
            </button>
            <button
              className="app-button"
              onClick={() => {
                mutate((current) =>
                  changeOrder(current, confirmation.id, confirmation.action),
                );
                toast(
                  confirmation.action === "cancel"
                    ? "Reserva de prueba cancelada"
                    : confirmation.action === "pay"
                      ? "Pago simulado. No se realizó ningún cobro."
                      : "Recojo simulado guardado en tu historial",
                );
                setConfirmation(null);
              }}
            >
              Confirmar simulación <Check size={16} />
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}

function Profile() {
  const { state, mutate, toast } = useApp();
  const [name, setName] = useState(state.name);
  const [reset, setReset] = useState(false);
  return (
    <>
      <PageTitle
        eyebrow="TU PEQUEÑO RINCÓN"
        title="Mi espacio"
        subtitle="Buenas costumbres, buenos bocados y personas de verdad."
      />
      <div className="app-profile-grid">
        <section className="app-profile-card">
          <div className="app-profile-avatar">
            <UserRound size={31} />
          </div>
          <h2>
            {state.name ? `Hola, ${state.name}` : "Un gusto tenerte aquí"}
          </h2>
          <p>No necesitas una cuenta para explorar la demo.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              mutate((current) => ({
                ...current,
                name: name.trim().slice(0, 40),
              }));
              toast("Nombre guardado en este dispositivo");
            }}
          >
            <label htmlFor="profile-name">
              ¿Cómo te llamas? <span>(opcional)</span>
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Tu nombre o apodo"
              maxLength="40"
              autoComplete="given-name"
            />
            <button className="app-button app-button-secondary" type="submit">
              Guardar nombre <Check size={16} />
            </button>
          </form>
          <div className="app-profile-privacy">
            <ShieldCheck size={19} />
            <p>
              Tus favoritos, nombre y reservas se guardan únicamente en este
              navegador. No se envían a un servidor. No introduzcas datos
              sensibles.
            </p>
          </div>
          <button
            className="app-text-link app-cancel"
            onClick={() => setReset(true)}
          >
            Borrar mis datos de prueba
          </button>
        </section>
        <div className="app-profile-right">
          <section className="app-help-card">
            <span className="app-eyebrow">LO QUE DEBES SABER</span>
            <h2>Una sorpresa, no una duda.</h2>
            {[
              [
                "¿Es comida en buen estado?",
                "Sí: el concepto de ReBocado es vender excedentes aptos para consumo a un mejor precio. No regalamos desechos. Esta demo no ofrece alimentos reales.",
              ],
              [
                "¿Qué contiene un pack?",
                "La selección cambia según el excedente. Se informa el tipo de comida, el precio y los alérgenos posibles. No se garantizan piezas exactas ni dietas específicas.",
              ],
              [
                "¿Cómo recojo mi reserva?",
                "En la versión operativa, irías al negocio dentro de la ventana indicada y mostrarías tu código. Los códigos y direcciones de esta demo no son válidos. No hay delivery.",
              ],
              [
                "¿Se puede pagar de verdad?",
                "Todavía no. Puedes probar pago en el local o pago digital simulado. No hay pasarela, QR bancario ni cobros conectados.",
              ],
              [
                "¿Qué funciona sin internet?",
                "Tras cargar la versión de producción, puedes abrir el catálogo y gestionar tus reservas y favoritos locales sin conexión. WhatsApp y correo necesitan internet.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus size={17} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
          <section className="app-contact-section" id="negocios">
            <div className="app-section-heading">
              <div>
                <span className="app-eyebrow">DETRÁS DE CADA BOCADO</span>
                <h2>Hablemos de verdad.</h2>
                <p>¿Quieres participar en el piloto o sumar tu negocio?</p>
              </div>
              <MessageCircle size={24} />
            </div>
            <div className="app-team-grid">
              {contacts.map((contact) => (
                <article key={contact.id}>
                  <img
                    src={contact.photo}
                    width="64"
                    height="64"
                    alt={contact.name}
                  />
                  <h3>{contact.shortName}</h3>
                  <span>{contact.role}</span>
                  <p>{contact.name}</p>
                  <a
                    className="app-button app-button-secondary app-button-small"
                    href={whatsappUrl(
                      contact,
                      contact.id === "matt" ? "negocio" : "consumidor",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} />
                    +591 {contact.phone}
                  </a>
                  <a
                    className="app-contact-email"
                    href={`mailto:${contact.email}`}
                  >
                    <Mail size={14} />
                    {contact.email}
                  </a>
                </article>
              ))}
            </div>
          </section>
          <Link to="/" className="app-about-link">
            <span>
              <Leaf size={22} />
              Conoce la idea detrás de ReBocado
            </span>
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
      {reset && (
        <Dialog
          title="¿Borrar los datos de esta demo?"
          onClose={() => setReset(false)}
        >
          <p>
            Se eliminarán tus favoritos, nombre y reservas de este navegador.
            Esta acción no se puede deshacer. No afecta a ninguna cuenta ni
            pedido real.
          </p>
          <div className="app-dialog-actions">
            <button
              className="app-button app-button-secondary"
              onClick={() => setReset(false)}
            >
              Conservar datos
            </button>
            <button
              className="app-button"
              onClick={() => {
                mutate(() => emptyState());
                setName("");
                setReset(false);
                toast("Datos de prueba borrados de este dispositivo");
              }}
            >
              Borrar datos de prueba
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}

function NotFound() {
  return (
    <EmptyState
      icon={HelpCircle}
      title="Este bocado se nos escapó"
      description="No encontramos la página que buscas. Vuelve al catálogo para explorar."
    >
      <Link to="/app" className="app-button">
        Volver al catálogo <ArrowRight size={17} />
      </Link>
    </EmptyState>
  );
}

export default function PwaApp() {
  const [state, setState] = useState(() => {
    try {
      return loadState(window.localStorage);
    } catch {
      return emptyState();
    }
  });
  const stateRef = useRef(state);
  const [date, setDate] = useState(todayInBolivia);
  const [storageError, setStorageError] = useState(false);
  const [message, setMessage] = useState("");
  const toastTimer = useRef(null);
  const location = useLocation();
  const marketing = ["/", "/conoce-rebocado"].includes(location.pathname);
  function mutate(updater) {
    const next = updater(stateRef.current);
    stateRef.current = next;
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    return next;
  }
  function toast(text) {
    clearTimeout(toastTimer.current);
    setMessage(text);
    toastTimer.current = setTimeout(() => setMessage(""), 4200);
  }
  useEffect(() => {
    const sync = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        let next;
        try {
          next = sanitizeState(JSON.parse(event.newValue));
        } catch {
          next = emptyState();
        }
        stateRef.current = next;
        setState(next);
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      clearTimeout(toastTimer.current);
    };
  }, []);
  useEffect(() => {
    const today = todayInBolivia();
    if (![today, nextDay(today)].includes(date)) setDate(today);
    document.title =
      marketing
        ? "ReBocado · La buena comida merece otra oportunidad"
        : `${location.pathname === "/app" ? "Explora la demo" : location.pathname.startsWith("/reservas") ? "Mis reservas" : location.pathname.startsWith("/favoritos") ? "Favoritos" : location.pathname.startsWith("/perfil") ? "Mi espacio" : "ReBocado"} · ReBocado`;
  }, [location.pathname, marketing, date]);
  useEffect(() => {
    const target = location.hash
      ? document.getElementById(location.hash.slice(1))
      : null;
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);
  return (
    <AppContext.Provider
      value={{ state, mutate, toast, date, setDate, storageError }}
    >
      <MotionConfig reducedMotion="user">
        {marketing ? (
          <Suspense
            fallback={<div className="app-loading">Cargando ReBocado…</div>}
          >
            <Landing />
          </Suspense>
        ) : (
          <Shell>
            <Routes>
              <Route path="/app" element={<Explore />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/reservas" element={<Orders />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/comercios/:id" element={<MerchantDetail />} />
              <Route path="/reservar/:id" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Shell>
        )}
        <div
          className="app-toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {message && (
            <span>
              <CheckCircle2 size={18} />
              {message}
            </span>
          )}
        </div>
      </MotionConfig>
    </AppContext.Provider>
  );
}
