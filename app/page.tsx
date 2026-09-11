"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  Minus,
  Pizza,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { InstagramIcon, WhatsAppIcon } from "@/components/brand-icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  categories,
  customPizza,
  products,
  siteConfig,
  type Category,
  type Product,
} from "./site-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type CartLine = {
  key: string;
  name: string;
  details: string;
  price: number;
  quantity: number;
};

function whatsappUrl(message: string) {
  const phone = siteConfig.whatsapp.replace(/\D/g, "");
  const recipient = phone ? `/${phone}` : "/";
  return `https://wa.me${recipient}?text=${encodeURIComponent(message)}`;
}

function scrollToMenu() {
  window.setTimeout(() => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
  }, 180);
}

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<"todos" | Category>("todos");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [delivery, setDelivery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const filteredProducts =
    activeCategory === "todos"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderMessage = useMemo(
    () =>
      [
        `Olá! Quero fazer este pedido na ${siteConfig.fullName}:`,
        "",
        ...cart.map(
          (item) =>
            `• ${item.quantity}x ${item.name} (${item.details}) — ${currency.format(item.price * item.quantity)}`,
        ),
        "",
        `Subtotal: ${currency.format(subtotal)}`,
        delivery
          ? `Entrega/retirada: ${delivery}`
          : "Entrega/retirada: quero confirmar pelo WhatsApp",
        "",
        "Pode confirmar a disponibilidade e o valor final?",
      ].join("\n"),
    [cart, delivery, subtotal],
  );

  function addLine(line: Omit<CartLine, "quantity">) {
    setCart((current) => {
      const existing = current.find((item) => item.key === line.key);
      if (existing) {
        return current.map((item) =>
          item.key === line.key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...line, quantity: 1 }];
    });
  }

  function addProduct(product: Product) {
    addLine({
      key: `product-${product.id}`,
      name: product.name,
      details: product.description,
      price: product.price,
    });
  }

  function updateQuantity(key: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.key === key
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({
          defaults: { duration: 0.82, ease: "power3.out" },
        });

        intro
          .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 18 })
          .from("[data-hero-title]", { autoAlpha: 0, y: 44 }, "-=0.56")
          .from("[data-hero-copy]", { autoAlpha: 0, y: 26 }, "-=0.54")
          .from("[data-hero-actions]", { autoAlpha: 0, y: 22 }, "-=0.48")
          .from(
            ".pizza-disc-shell",
            { autoAlpha: 0, scale: 0.72, rotate: -8, stagger: 0.12 },
            "-=0.75",
          );

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 38,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          });
        });
      });

      return () => media.revert();
    },
    { scope: pageRef },
  );

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <main ref={pageRef}>
      <SmoothScroll />

      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#cardapio">Cardápio</a>
          <a href="#monte-a-sua">Monte a sua</a>
          <a href="#como-pedir">Como pedir</a>
          <a href="#entrega">Entrega</a>
        </nav>
        <div className="header-actions">
          <Sheet>
            <SheetTrigger
              className="cart-button"
              aria-label={`Abrir pedido com ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
            >
              <ShoppingBag />
              <span className="desktop-only">Meu pedido</span>
              {itemCount > 0 && <b>{itemCount}</b>}
            </SheetTrigger>
            <CartSheet
              items={cart}
              subtotal={subtotal}
              delivery={delivery}
              setDelivery={setDelivery}
              updateQuantity={updateQuantity}
              message={orderMessage}
            />
          </Sheet>
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setMobileNav((current) => !current)}
            aria-expanded={mobileNav}
            aria-controls="mobile-navigation"
            aria-label={mobileNav ? "Fechar menu" : "Abrir menu"}
          >
            {mobileNav ? <X /> : <Menu />}
          </button>
        </div>
        {mobileNav && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação móvel">
            <a href="#cardapio" onClick={() => setMobileNav(false)}>Cardápio</a>
            <a href="#monte-a-sua" onClick={() => setMobileNav(false)}>Monte a sua</a>
            <a href="#como-pedir" onClick={() => setMobileNav(false)}>Como pedir</a>
            <a href="#entrega" onClick={() => setMobileNav(false)}>Entrega</a>
          </nav>
        )}
      </header>

      <section className="hero" id="inicio">
        <div className="hero-watermark" aria-hidden="true">F&amp;F</div>
        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow" data-hero-eyebrow><span />{siteConfig.hero.eyebrow}</p>
            <h1 data-hero-title>{siteConfig.hero.title}<br /><em>{siteConfig.hero.accent}</em></h1>
            <p className="hero-description" data-hero-copy>{siteConfig.hero.description}</p>
            <div className="hero-ctas" data-hero-actions>
              <a className="button button-primary" href="#cardapio">
                Ver cardápio <ArrowDown />
              </a>
              <a className="button button-ghost" href="#monte-a-sua">
                Montar minha pizza <Pizza />
              </a>
            </div>
            <div className="hero-proof" aria-label="Informações do atendimento">
              <span><Clock3 /><strong>{siteConfig.schedule}</strong></span>
              <span><MapPin /><strong>{siteConfig.location}</strong></span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow" aria-hidden="true" />
            <PizzaShowcase />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Diferenciais">
        <div className="shell">
          <span><Check /> Massa aberta na hora</span>
          <span><Check /> Sabores para todos</span>
          <span><Check /> Pedido organizado no WhatsApp</span>
        </div>
      </section>

      <section className="menu-section shell" id="cardapio" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />ESCOLHA SEM PRESSA</p>
            <h2>Cardápio da noite</h2>
          </div>
          <p>Das clássicas às doces, com fritas e coxinhas para completar a mesa.</p>
        </div>
        <div className="category-tabs" aria-label="Categorias do cardápio">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              aria-pressed={activeCategory === category.id}
              className={activeCategory === category.id ? "active" : ""}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="product-grid" aria-live="polite">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart.find((item) => item.key === `product-${product.id}`)?.quantity ?? 0}
              addProduct={addProduct}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      </section>

      <CustomPizzaBuilder onAdd={addLine} />

      <section className="service-section" id="como-pedir" data-reveal>
        <div className="shell service-grid">
          <div className="service-intro">
            <p className="eyebrow light"><span />SEM TELEFONE OCUPADO</p>
            <h2>Você escolhe.<br /><em>A mensagem sai pronta.</em></h2>
            <p>O carrinho organiza sabores, quantidades e forma de recebimento antes de abrir o WhatsApp.</p>
          </div>
          <ol className="steps-list">
            <li><b>01</b><span><strong>Escolha</strong><small>Adicione pizzas e porções.</small></span></li>
            <li><b>02</b><span><strong>Revise</strong><small>Ajuste quantidades no carrinho.</small></span></li>
            <li><b>03</b><span><strong>Envie</strong><small>Confirme tudo pelo WhatsApp.</small></span></li>
          </ol>
        </div>
      </section>

      <section className="delivery-section" id="entrega" data-reveal>
        <div className="delivery-mark" aria-hidden="true"><MapPin /></div>
        <div className="shell delivery-grid">
          <div>
            <p className="eyebrow light"><span />DO BALCÃO À SUA PORTA</p>
            <h2>Retire por aqui.<br /><em>Ou consulte a entrega.</em></h2>
          </div>
          <div className="delivery-card">
            <div className="delivery-area">
              <MapPin />
              <div>
                <span>Ponto de atendimento</span>
                <strong>{siteConfig.location}</strong>
                <small>{siteConfig.address}</small>
              </div>
            </div>
            <div className="delivery-options">
              <span>Como você prefere?</span>
              <button
                type="button"
                className={delivery === "Retirada no local" ? "active" : ""}
                onClick={() => setDelivery("Retirada no local")}
              >
                Retirada no local <ArrowRight />
              </button>
              <button
                type="button"
                className={delivery === "Entrega sob consulta" ? "active" : ""}
                onClick={() => setDelivery("Entrega sob consulta")}
              >
                Entrega sob consulta <ArrowRight />
              </button>
            </div>
            <a
              className="button button-primary full"
              href={whatsappUrl("Olá! Quero consultar a entrega para o meu endereço.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Consultar meu endereço
            </a>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell">
          <div><p>A próxima fatia</p><h2>começa por aqui.</h2></div>
          <a className="button button-light" href="#cardapio">
            Escolher meu pedido <ArrowRight />
          </a>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <div><Brand footer /><p>{siteConfig.footerDescription}</p></div>
          <div><strong>Atendimento</strong><p>{siteConfig.schedule}<br />{siteConfig.city}.</p></div>
          <div>
            <strong>Fale com a gente</strong>
            <p>{siteConfig.whatsappLabel}</p>
            <div className="social-links">
              <a
                href={whatsappUrl(`Olá! Vim pelo site da ${siteConfig.fullName}.`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir WhatsApp"
              ><WhatsAppIcon /></a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir Instagram ${siteConfig.instagramLabel}`}
              ><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom shell">
          <span>© 2026 {siteConfig.fullName}. Modelo demonstrativo.</span>
          <a href="https://www.instagram.com/ranyel.azevedo/" target="_blank" rel="noopener noreferrer">
            Feito por Ranyel Azevedo — Desenvolvedor de Sistemas
          </a>
        </div>
      </footer>

      {itemCount === 0 ? (
        <a className="mobile-order-bar" href="#cardapio">
          <span><ShoppingBag /><b>0</b></span>
          <strong>Ver cardápio</strong>
          <ArrowRight />
        </a>
      ) : (
        <Sheet>
          <SheetTrigger className="mobile-order-bar">
            <span><ShoppingBag /><b>{itemCount}</b></span>
            <strong>Ver pedido · {currency.format(subtotal)}</strong>
            <ArrowRight />
          </SheetTrigger>
          <CartSheet
            items={cart}
            subtotal={subtotal}
            delivery={delivery}
            setDelivery={setDelivery}
            updateQuantity={updateQuantity}
            message={orderMessage}
          />
        </Sheet>
      )}
    </main>
  );
}

function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const update = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      if (reducedMotion.matches || lenis) return;

      lenis = new Lenis({
        autoRaf: false,
        anchors: true,
        smoothWheel: true,
        lerp: 0.1,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(update);
      ScrollTrigger.refresh();
    };

    const stop = () => {
      if (!lenis) return;

      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      lenis = null;
    };

    const syncMotionPreference = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    gsap.ticker.lagSmoothing(0);
    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);

    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference);
      stop();
    };
  }, []);

  return null;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand ${footer ? "footer-brand" : ""}`} href="#inicio" aria-label={`${siteConfig.fullName} — início`}>
      <span className="brand-mark" aria-hidden="true"><Pizza /></span>
      <span><strong>{siteConfig.brandPrimary}</strong><small>{siteConfig.brandSecondary}</small></span>
    </a>
  );
}

const showcasePizzas = [
  { name: "Margherita", image: "/images/pizza-margherita.webp", className: "pizza-one" },
  { name: "Calabresa", image: "/images/pizza-calabresa.webp", className: "pizza-two" },
  { name: "Chocolate com morango", image: "/images/pizza-chocolate.webp", className: "pizza-three" },
];

function PizzaShowcase() {
  return (
    <div className="pizza-showcase" aria-label="Três pizzas interativas com oito fatias cada">
      {showcasePizzas.map((pizza) => <PizzaDisc key={pizza.name} {...pizza} />)}
      <div className="showcase-note">
        <Sparkles aria-hidden="true" />
        <span><strong>Experimente o movimento</strong><small>Passe o mouse ou toque em uma pizza</small></span>
      </div>
    </div>
  );
}

function sliceClip(index: number) {
  const centerAngle = -90 + index * 45;
  const arc = [-22.5, -11.25, 0, 11.25, 22.5].map((offset) => {
    const angle = ((centerAngle + offset) * Math.PI) / 180;
    return `${50 + Math.cos(angle) * 74}% ${50 + Math.sin(angle) * 74}%`;
  });
  return `polygon(50% 50%, ${arc.join(", ")})`;
}

function PizzaDisc({ name, image, className }: { name: string; image: string; className: string }) {
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const sliceRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lockedRef = useRef(false);
  const [locked, setLocked] = useState(false);
  function animate(expanded: boolean) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sliceRefs.current.forEach((slice, index) => {
      if (!slice) return;
      const angle = ((-90 + index * 45) * Math.PI) / 180;
      const highlighted = index === 7 || index === 0 || index === 1;
      const distance = expanded && highlighted && !reduceMotion ? 25 : 0;

      gsap.to(slice, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: expanded && highlighted && !reduceMotion ? 1.035 : 1,
        duration: reduceMotion ? 0 : expanded ? 0.58 : 0.48,
        ease: expanded ? "back.out(1.45)" : "power3.out",
        overwrite: true,
      });
    });

    gsap.to(rootRef.current, {
      scale: expanded && !reduceMotion ? 1.025 : 1,
      duration: reduceMotion ? 0 : 0.5,
      ease: "power3.out",
      overwrite: true,
    });
  }

  useEffect(() => () => {
    gsap.killTweensOf(sliceRefs.current);
    gsap.killTweensOf(rootRef.current);
  }, []);

  function toggleLocked() {
    lockedRef.current = !lockedRef.current;
    setLocked(lockedRef.current);
    animate(lockedRef.current);
  }

  return (
    <button
      type="button"
      ref={rootRef}
      className={`pizza-disc-shell ${className}`}
      onPointerEnter={(event) => event.pointerType === "mouse" && animate(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && animate(lockedRef.current)}
      onPointerUp={(event) => event.pointerType !== "mouse" && toggleLocked()}
      onClick={(event) => event.detail === 0 && toggleLocked()}
      aria-pressed={locked}
      aria-label={`${locked ? "Fechar" : "Abrir"} três fatias da pizza ${name}`}
    >
      <span className="pizza-disc" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            key={index}
            ref={(node) => { sliceRefs.current[index] = node; }}
            className="pizza-slice"
            style={{ clipPath: sliceClip(index) }}
          >
          <Image unoptimized src={image} alt="" width={960} height={960} draggable={false} />
          </span>
        ))}
      </span>
      <span className="pizza-name">{name}</span>
    </button>
  );
}

function ProductCard({
  product,
  quantity,
  addProduct,
  updateQuantity,
}: {
  product: Product;
  quantity: number;
  addProduct: (product: Product) => void;
  updateQuantity: (key: string, delta: number) => void;
}) {
  const key = `product-${product.id}`;

  return (
    <article className={`product-card ${product.image ? "featured" : "compact"}`}>
      {product.image && (
        <div className="product-image">
          <Image unoptimized src={product.image} alt={product.name} width={960} height={960} />
          {product.badge && <span>{product.badge}</span>}
        </div>
      )}
      <div className="product-content">
        {product.badge && !product.image && <span className="product-badge">{product.badge}</span>}
        <div className="product-category"><UtensilsCrossed />{categories.find((category) => category.id === product.category)?.label}</div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{currency.format(product.price)}</strong>
          {quantity ? (
            <QuantityControl
              quantity={quantity}
              decrease={() => updateQuantity(key, -1)}
              increase={() => updateQuantity(key, 1)}
              label={product.name}
            />
          ) : (
            <button type="button" className="add-button" onClick={() => addProduct(product)}>
              Adicionar <Plus />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function BuilderPizzaHalf({
  flavor,
  side,
}: {
  flavor: (typeof customPizza.flavors)[number];
  side: "first" | "second";
}) {
  const halfRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        halfRef.current,
        { autoAlpha: 0.2, scale: 0.94, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.52,
          ease: "power3.out",
          clearProps: "filter",
        },
      );
    },
    { scope: halfRef },
  );

  return (
    <span ref={halfRef} className={`builder-pizza-half ${side}`}>
      <Image unoptimized src={flavor.image} alt="" width={960} height={960} />
    </span>
  );
}

function CustomPizzaBuilder({ onAdd }: { onAdd: (line: Omit<CartLine, "quantity">) => void }) {
  const [sizeId, setSizeId] = useState(customPizza.sizes[1].id);
  const [firstFlavorId, setFirstFlavorId] = useState(customPizza.flavors[0].id);
  const [secondFlavorId, setSecondFlavorId] = useState(customPizza.flavors[1].id);
  const [borderId, setBorderId] = useState(customPizza.borders[0].id);
  const [added, setAdded] = useState(false);
  const feedbackTimer = useRef<number | null>(null);

  const size = customPizza.sizes.find((item) => item.id === sizeId)!;
  const firstFlavor = customPizza.flavors.find((item) => item.id === firstFlavorId)!;
  const secondFlavor = customPizza.flavors.find((item) => item.id === secondFlavorId)!;
  const border = customPizza.borders.find((item) => item.id === borderId)!;
  const total = size.price + border.price;

  useEffect(() => () => {
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
  }, []);

  function handleAdd() {
    const details = `${size.label}; 1/2 ${firstFlavor.label} + 1/2 ${secondFlavor.label}; ${border.label}`;
    onAdd({
      key: `custom-${sizeId}-${firstFlavorId}-${secondFlavorId}-${borderId}`,
      name: "Pizza personalizada",
      details,
      price: total,
    });
    setAdded(true);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <section className="builder-section" id="monte-a-sua" data-reveal>
      <div className="shell builder-grid">
        <div className="builder-visual" aria-hidden="true">
          <div className="builder-ring" />
          <div className="builder-pizza-composite">
            <BuilderPizzaHalf key={`first-${firstFlavor.id}`} flavor={firstFlavor} side="first" />
            <BuilderPizzaHalf key={`second-${secondFlavor.id}`} flavor={secondFlavor} side="second" />
            <span className="builder-pizza-seam" />
          </div>
          <div className="builder-flavor-tags">
            <span>{firstFlavor.label}</span>
            <span>{secondFlavor.label}</span>
          </div>
          <span>1/2 + 1/2</span>
        </div>
        <div className="builder-panel">
          <p className="eyebrow light"><span />DOIS SABORES, UMA ESCOLHA</p>
          <h2>Monte a sua pizza</h2>
          <p className="builder-lead">Escolha o tamanho, combine dois sabores e finalize com a borda.</p>

          <fieldset className="size-options">
            <legend>Tamanho</legend>
            {customPizza.sizes.map((item) => (
              <label key={item.id} className={sizeId === item.id ? "active" : ""}>
                <input
                  type="radio"
                  name="pizza-size"
                  value={item.id}
                  checked={sizeId === item.id}
                  onChange={() => setSizeId(item.id)}
                />
                <span>{item.label}</span><strong>{currency.format(item.price)}</strong>
              </label>
            ))}
          </fieldset>

          <div className="builder-fields">
            <label>
              <span>Primeira metade</span>
              <div><select value={firstFlavorId} onChange={(event) => setFirstFlavorId(event.target.value)}>{customPizza.flavors.map((flavor) => <option key={flavor.id} value={flavor.id}>{flavor.label}</option>)}</select><ChevronDown /></div>
            </label>
            <label>
              <span>Segunda metade</span>
              <div><select value={secondFlavorId} onChange={(event) => setSecondFlavorId(event.target.value)}>{customPizza.flavors.map((flavor) => <option key={flavor.id} value={flavor.id}>{flavor.label}</option>)}</select><ChevronDown /></div>
            </label>
            <label className="builder-border">
              <span>Borda</span>
              <div><select value={borderId} onChange={(event) => setBorderId(event.target.value)}>{customPizza.borders.map((item) => <option key={item.id} value={item.id}>{item.label}{item.price ? ` · +${currency.format(item.price)}` : ""}</option>)}</select><ChevronDown /></div>
            </label>
          </div>

          <div className="builder-summary">
            <span><small>Sua combinação</small><strong>{firstFlavor.label} + {secondFlavor.label}</strong></span>
            <b>{currency.format(total)}</b>
          </div>
          <button type="button" className="button button-primary full" onClick={handleAdd}>
            {added ? <><Check /> Adicionada ao pedido</> : <><Plus /> Adicionar pizza personalizada</>}
          </button>
          <p className="builder-feedback" aria-live="polite">{added ? "Sua combinação já está no carrinho." : ""}</p>
        </div>
      </div>
    </section>
  );
}

function QuantityControl({
  quantity,
  decrease,
  increase,
  label,
}: {
  quantity: number;
  decrease: () => void;
  increase: () => void;
  label: string;
}) {
  return (
    <div className="quantity-control">
      <button type="button" onClick={decrease} aria-label={`Remover uma unidade de ${label}`}><Minus /></button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" onClick={increase} aria-label={`Adicionar uma unidade de ${label}`}><Plus /></button>
    </div>
  );
}

function CartSheet({
  items,
  subtotal,
  delivery,
  setDelivery,
  updateQuantity,
  message,
}: {
  items: CartLine[];
  subtotal: number;
  delivery: string;
  setDelivery: (value: string) => void;
  updateQuantity: (key: string, delta: number) => void;
  message: string;
}) {
  return (
    <SheetContent className="cart-sheet">
      <SheetHeader className="cart-header">
        <SheetTitle>Seu pedido</SheetTitle>
        <SheetDescription>Revise os itens antes de abrir o WhatsApp.</SheetDescription>
      </SheetHeader>
      <div className="cart-body">
        {!items.length ? (
          <div className="empty-cart">
            <span><ShoppingBag /></span>
            <h3>Seu carrinho está vazio</h3>
            <p>Comece pelas pizzas da casa ou monte uma combinação só sua.</p>
            <SheetClose type="button" className="button button-primary" onClick={scrollToMenu}>
              Ver cardápio
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article key={item.key}>
                  <div><h3>{item.name}</h3><small>{item.details}</small><span>{currency.format(item.price * item.quantity)}</span></div>
                  <QuantityControl
                    quantity={item.quantity}
                    decrease={() => updateQuantity(item.key, -1)}
                    increase={() => updateQuantity(item.key, 1)}
                    label={item.name}
                  />
                  <button type="button" className="remove-item" onClick={() => updateQuantity(item.key, -item.quantity)} aria-label={`Remover ${item.name}`}><Trash2 /></button>
                </article>
              ))}
            </div>
            <label className="delivery-select">
              <span>Como deseja receber?</span>
              <div>
                <select value={delivery} onChange={(event) => setDelivery(event.target.value)}>
                  <option value="">Confirmar pelo WhatsApp</option>
                  <option value="Entrega sob consulta">Entrega sob consulta</option>
                  <option value="Retirada no local">Retirada no local</option>
                </select>
                <ChevronDown />
              </div>
            </label>
            <div className="cart-total">
              <span>Subtotal</span><strong>{currency.format(subtotal)}</strong>
              <small>Taxa de entrega confirmada no atendimento.</small>
            </div>
          </>
        )}
      </div>
      {!!items.length && (
        <a
          className="button button-whatsapp full"
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon /> Enviar pedido no WhatsApp
        </a>
      )}
    </SheetContent>
  );
}
