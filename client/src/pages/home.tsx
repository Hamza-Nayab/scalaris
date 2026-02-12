import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  Check,
  Filter,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Sparkles,
  Star,
  Sun,
  Users,
  Wand2,
} from "lucide-react";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  return { theme, toggle, isDark: theme === "dark" };
}
import { navLinks, siteConfig } from "@/config.ts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "home");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            // Priority: element covering more of the viewport center
            const rectA = a.target.getBoundingClientRect();
            const rectB = b.target.getBoundingClientRect();
            const center = window.innerHeight / 2;
            const distA = Math.abs((rectA.top + rectA.bottom) / 2 - center);
            const distB = Math.abs((rectB.top + rectB.bottom) / 2 - center);
            return distA - distB;
          });

        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const navHeight = 80; // Offset for fixed navbar
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

function formatWaNumber(input: string) {
  return input.replace(/\D/g, "");
}

function buildWaLink(message: string) {
  const phone = formatWaNumber(siteConfig.whatsappNumber);
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "left",
  testId,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
  testId: string;
}) {
  return (
    <div
      className={cn("mb-10", align === "center" ? "text-center" : "text-left")}
      data-testid={testId}
    >
      {eyebrow ? (
        <div
          className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs font-medium text-black/70 dark:text-white/70"
          data-testid={`${testId}-eyebrow`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          <span>{eyebrow}</span>
        </div>
      ) : null}

      <h2
        className={cn(
          "mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl text-foreground",
        )}
        data-testid={`${testId}-title`}
      >
        {title}
      </h2>
      {desc ? (
        <p
          className="mt-3 max-w-2xl text-sm leading-relaxed text-black/70 dark:text-white/70 sm:text-base"
          data-testid={`${testId}-desc`}
        >
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function GradientButton({
  children,
  onClick,
  variant = "primary",
  className,
  testId,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  testId: string;
}) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
      <Button
        type="button"
        onClick={onClick}
        className={cn(
          "gradient-border h-11 rounded-2xl px-5 text-sm shadow-sm transition-all",
          variant === "primary"
            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:brightness-[1.03]"
            : variant === "ghost"
              ? "bg-white/5 text-white hover:bg-white/8"
              : "bg-transparent border border-current",
          className,
        )}
        data-testid={testId}
      >
        {children}
      </Button>
    </motion.div>
  );
}

function GlassCard({
  children,
  className,
  testId,
}: {
  children: React.ReactNode;
  className?: string;
  testId: string;
}) {
  return (
    <motion.div
      className={cn(
        "glass rounded-3xl p-6 transition-all",
        "hover:olive-glow",
        className,
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

function TopProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 30 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-[hsl(var(--primary))]/80"
      style={{ scaleX }}
      data-testid="progress-scroll"
    />
  );
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] opacity-100"
      style={{
        background:
          "radial-gradient(220px 220px at var(--x, -200px) var(--y, -200px), hsl(var(--primary) / .18), transparent 65%)",
      }}
      data-testid="fx-cursor"
    />
  );
}

function Navbar({ activeId }: { activeId: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-50" data-testid="nav-wrap">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={cn(
            "mt-4 rounded-3xl border border-black/10 dark:border-white/10 dark:bg-black/30 bg-white/60 backdrop-blur-xl transition-all",
            scrolled ? "py-1.5 shadow-lg" : "py-2",
          )}
          data-testid="nav-bar"
        >
          <div className="flex items-center justify-between gap-3 px-4">
            <button
              type="button"
              onClick={() => scrollToId("home")}
              className="group"
              data-testid="link-home-logo"
            >
              <div className="h-14 w-14 overflow-hidden">
                <img
                  src={
                    theme === "dark"
                      ? siteConfig.darkLogoPath
                      : siteConfig.logoPath
                  }
                  alt={siteConfig.brandName}
                  className="h-full w-full object-cover"
                  data-testid="img-logo"
                />
              </div>
            </button>

            <div
              className="hidden items-center gap-1 md:flex"
              data-testid="nav-links"
            >
              {navLinks.map((l: (typeof navLinks)[number]) => {
                const active = activeId === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => scrollToId(l.id)}
                    className={cn(
                      "group relative rounded-2xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
                      "text-black/60 dark:text-white/60 hover:text-primary dark:hover:text-white",
                      active ? "text-primary dark:text-white" : "",
                    )}
                    data-testid={`link-nav-${l.id}`}
                  >
                    <span className="relative z-10">{l.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 z-0 rounded-xl bg-primary/5 dark:bg-white/5"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={cn(
                        "absolute bottom-0 left-3 right-3 h-0.5 z-10",
                        "bg-primary rounded-full origin-left scale-x-0 transition-transform duration-200",
                        active ? "scale-x-100" : "group-hover:scale-x-100",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2" data-testid="nav-ctas">
              <button
                onClick={toggle}
                className="p-2 rounded-xl dark:bg-white/5 bg-black/5 hover:bg-white/10 transition-colors"
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
              <a
                href={buildWaLink(
                  `Hello ${siteConfig.brandName}, I want a personalized branding website.`,
                )}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "hidden items-center gap-2 rounded-xl border border-white/10 dark:bg-white/5 bg-black/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em]",
                  "transition-all hover:bg-primary hover:text-white md:inline-flex",
                )}
                data-testid="button-whatsapp-nav"
              >
                WhatsApp
              </a>
              <GradientButton
                testId="button-start-nav"
                onClick={() => scrollToId("contact")}
              >
                <span className="font-black uppercase tracking-[0.15em] text-[10px]">
                  Let's Talk
                </span>
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" as const },
    },
  };

  return (
    <section id="home" className="relative pt-28" data-testid="section-home">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-[hsl(var(--primary))]/25 orb" />
        <div className="absolute right-[-140px] top-[120px] h-[380px] w-[380px] rounded-full bg-emerald-400/10 orb" />
        <div className="absolute left-[15%] top-[50%] h-[260px] w-[260px] rounded-full bg-white/5 orb" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div
          className="absolute inset-0 -z-10 rounded-[36px] noise"
          aria-hidden
        />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            variants={container}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? undefined : "show"}
            className="max-w-xl"
            data-testid="hero-copy"
          >
            <motion.div variants={item}>
              <div
                className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1 text-xs text-black/70 dark:text-white/70"
                data-testid="badge-hero"
              >
                <Wand2 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                Dubai-based personalized web presence
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl text-foreground"
              data-testid="text-hero-title"
            >
              Your story, distilled into a premium online identity.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 text-sm leading-relaxed text-black/70 dark:text-white/70 sm:text-base"
              data-testid="text-hero-sub"
            >
              Minimal. Elegant. Built to convert curiosity into clients.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
              data-testid="hero-ctas"
            >
              <GradientButton
                testId="button-cta-start"
                onClick={() => scrollToId("contact")}
              >
                Start Your Brand
                <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>

              <GradientButton
                testId="button-cta-work"
                variant="ghost"
                onClick={() => scrollToId("work")}
              >
                <span className="text-foreground">View Work</span>
              </GradientButton>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-3 text-xs text-black/60 dark:text-white/60"
              data-testid="hero-meta"
            >
              {[
                "Story-led Design",
                "Premium UI",
                "Considerate",
                "Responsive",
              ].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-1"
                  data-testid={`pill-hero-${t}`}
                >
                  <Check className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
            data-testid="hero-image"
          >
            <motion.div
              className="glass gradient-border relative overflow-hidden rounded-[36px] p-5"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              data-testid="card-hero-image"
            >
              <div className="absolute inset-0 noise" aria-hidden />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 to-black/40">
                <img
                  src="/src/assets/hero-bg.jpg"
                  alt="Premium Branding"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
                />
                <motion.div
                  className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[hsl(var(--primary))]/20 orb"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { x: [0, 20, 0], y: [0, 14, 0] }
                  }
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-20 -right-14 h-56 w-56 rounded-full bg-emerald-400/10 orb"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { x: [0, -18, 0], y: [0, -10, 0] }
                  }
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div
                className="relative mt-5 grid gap-3 sm:grid-cols-3"
                data-testid="hero-stats"
              >
                {[
                  { k: "Timeline", v: "Fast" },
                  { k: "Feel", v: "Premium" },
                  { k: "Focus", v: "Conversion" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3"
                    data-testid={`stat-${s.k}`}
                  >
                    <div
                      className="text-xs text-black/60 dark:text-white/60"
                      data-testid={`stat-key-${s.k}`}
                    >
                      {s.k}
                    </div>
                    <div
                      className="mt-1 text-sm font-semibold text-foreground"
                      data-testid={`stat-val-${s.k}`}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Story() {
  const steps = useMemo(
    () => [
      {
        title: "Idea",
        line: "We extract what makes you unmistakably you.",
      },
      {
        title: "Identity",
        line: "A visual language: type, tone, and rhythm.",
      },
      {
        title: "Digital Presence",
        line: "A story-style landing page that feels expensive.",
      },
    ],
    [],
  );

  return (
    <section id="story" className="relative py-20" data-testid="section-story">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Process"
          title="From Idea → Identity → Digital Presence"
          desc="A simple three-step journey. Nothing noisy. Everything intentional."
          testId="header-story"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="grid gap-5 md:grid-cols-3"
          data-testid="grid-story"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <GlassCard testId={`card-story-${i}`} className="h-full">
                <div className="flex items-center justify-between">
                  <div
                    className="text-xs font-medium text-black/60 dark:text-white/60"
                    data-testid={`text-story-step-${i}`}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    className="rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-1 text-xs text-black/70 dark:text-white/70"
                    data-testid={`badge-story-${i}`}
                  >
                    {s.title}
                  </div>
                </div>
                <div
                  className="mt-4 font-display text-2xl tracking-tight text-foreground"
                  data-testid={`text-story-title-${i}`}
                >
                  {s.title}
                </div>
                <p
                  className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70"
                  data-testid={`text-story-line-${i}`}
                >
                  {s.line}
                </p>
                <div className="mt-5 h-1 w-14 rounded-full bg-[hsl(var(--primary))]/60" />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Expertise() {
  const items = useMemo(
    () => [
      {
        title: "AI Development",
        desc: "Smart features, quietly integrated.",
        icon: Sparkles,
      },
      {
        title: "Web Development",
        desc: "Fast, responsive, premium feel.",
        icon: Wand2,
      },
      {
        title: "Mobile App Development",
        desc: "Polished experiences on the go.",
        icon: Users,
      },
    ],
    [],
  );

  return (
    <section
      id="expertise"
      className="relative py-20"
      data-testid="section-expertise"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Expertise"
          title="Three ways we build modern brands"
          desc="Only what matters. No filler services."
          testId="header-expertise"
        />

        <div className="grid gap-5 md:grid-cols-3" data-testid="grid-expertise">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <GlassCard key={it.title} testId={`card-expertise-${idx}`}>
                <div className="flex items-start gap-4">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
                    data-testid={`iconwrap-expertise-${idx}`}
                  >
                    <Icon
                      className="h-5 w-5 text-[hsl(var(--primary))]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <div
                      className="text-lg font-semibold tracking-tight text-foreground"
                      data-testid={`text-expertise-title-${idx}`}
                    >
                      {it.title}
                    </div>
                    <div
                      className="mt-1 text-sm text-black/70 dark:text-white/70"
                      data-testid={`text-expertise-desc-${idx}`}
                    >
                      {it.desc}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

type Project = {
  id: string;
  title: string;
  category: "Branding" | "Websites" | "Apps";
  line: string;
  url?: string;
  image?: string;
  imageClassName?: string;
  render?: React.ReactNode;
};

function Work() {
  const projects: Project[] = useMemo(
    () => [
      {
        id: "p1",
        title: "Sport Pro Tech",
        category: "Websites",
        line: "Dynamic sports platform with seamless UX.",
        url: "https://sportprotech.com/#",
        image: "https://sportprotech.com/assets/logo-sportprotech-TbApeHD3.png",
        imageClassName: "h-full w-full object-contain p-4 bg-black",
      },
      {
        id: "p2",
        title: "Dubai Medical Research Forum",
        category: "Websites",
        line: "Registration platform for DHA-backed medical research forum.",
        url: "https://dmrf.ae/",
        image: "/src/assets/dmrf.jpg",
        imageClassName: "h-full w-full object-contain p-4 bg-black",
      },
      {
        id: "p3",
        title: "Operative Zainab",
        category: "Websites",
        line: "Portfolio with a custom terminal theme + integrated game.",
        render: (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black">
            <div className="w-full px-5 py-6 text-left">
              <div className="font-mono text-xl sm:text-2xl tracking-[0.18em] text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]">
                OPERATIVE ZAINAB
              </div>
              <div className="mt-2 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-emerald-300/80">
                SYSTEM ID: 2x4-PORTFOLIO-DEV
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            </div>
          </div>
        ),
      },
      {
        id: "p4",
        title: "UniCadia",
        category: "Websites",
        line: "An Academy Website",
        url: "https://unicadia.netlify.app/",
        image: "/src/assets/Unicadia.png",
        imageClassName: "h-full w-full object-contain p-4 bg-black",
      },
      {
        id: "p5",
        title: "NorthQuest Marketing",
        category: "Websites",
        line: "A portfolio website for marketing company.",
        url: "https://northquestmarketing.co.uk/",
        image:
          "https://northquestmarketing.co.uk/assets/logo-northquest-BFE-nnqh.svg",
        imageClassName: "h-full w-full object-contain p-4 bg-black",
      },
      {
        id: "p6",
        title: "Wesbridge Associates",
        category: "Websites",
        line: "A website for a lawfirm in UK.",
        url: "https://www.wesbridgeassociates.co.uk/",
        image:
          "https://www.wesbridgeassociates.co.uk/assets/wesbridge-logo-new-B4voiEXE.svg",
        imageClassName: "h-full w-full object-contain p-4 bg-white",
      },
    ],
    [],
  );

  const tabs = ["All", "Branding", "Websites", "Apps"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = useMemo(() => {
    if (tab === "All") return projects;
    return projects.filter((p) => p.category === tab);
  }, [projects, tab]);

  return (
    <section id="work" className="relative py-20" data-testid="section-work">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Work"
          title="A few projects in the right direction"
          desc="Placeholders for now — curated like a gallery."
          testId="header-work"
        />

        <div
          className="hidden flex-wrap items-center gap-2"
          data-testid="tabs-work"
        >
          <div className="mr-1 inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-xs transition-colors",
                tab === t
                  ? "bg-[hsl(var(--primary))]/15 text-primary dark:text-white"
                  : "bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/8",
              )}
              data-testid={`tab-work-${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          data-testid="grid-work"
        >
          {filtered.map((p) => (
            <GlassCard key={p.id} testId={`card-project-${p.id}`}>
              <div
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-black/5 dark:from-white/5 to-black/20 dark:to-black/40"
                data-testid={`img-project-${p.id}`}
              >
                {p.render ? (
                  p.render
                ) : p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className={
                      p.imageClassName ??
                      "h-full w-full object-contain p-8 bg-white dark:bg-black/20"
                    }
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-black/60 dark:text-white/60">
                    Preview image placeholder
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div
                    className="text-sm font-semibold text-foreground"
                    data-testid={`text-project-title-${p.id}`}
                  >
                    {p.title}
                  </div>
                  <div
                    className="mt-1 text-xs text-black/60 dark:text-white/60"
                    data-testid={`text-project-cat-${p.id}`}
                  >
                    {p.category}
                  </div>
                </div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2 hover:bg-primary/10 transition-colors"
                    data-testid={`button-project-open-${p.id}`}
                  >
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--primary))]" />
                  </a>
                ) : (
                  <div
                    className="rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2"
                    data-testid={`button-project-open-${p.id}`}
                  >
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--primary))]" />
                  </div>
                )}
              </div>
              <div
                className="mt-3 text-sm text-black/70 dark:text-white/70"
                data-testid={`text-project-line-${p.id}`}
              >
                {p.line}
              </div>
            </GlassCard>
          ))}
        </motion.div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Team() {
  type TeamMember = {
    id: string;
    name: string;
    role: string;
    image?: string;
    imagePosition?: string;
  };

  const people = useMemo<TeamMember[]>(
    () => [
      {
        id: `t1`,
        name: `Hamza Nayab`,
        role: "CEO",
        image: "/src/assets/hamzanayab.jpg",
      },
      {
        id: `t2`,
        name: `Zainab Iqbal`,
        role: "CTO",
        image: "/src/assets/zainab.jpg",
        imagePosition: "center 20%",
      },
      {
        id: `t3`,
        name: `Rana Talha`,
        role: "COO",
        image: "/src/assets/Talha.jpg",
      },
      {
        id: `t4`,
        name: `Daniyal Rao`,
        role: "BDM",
        image: "/src/assets/dani.jpg",
      },
      {
        id: `t5`,
        name: `Farheen Ather`,
        role: "BDM",
        image: "/src/assets/farheen.jpg",
      },
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: `t${i + 6}`,
        name: `Teammate ${i + 6}`,
        role: "Creative + Build",
      })),
    ],
    [],
  );

  return (
    <section id="team" className="relative py-20" data-testid="section-team">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Team"
            title="Meet Our Team"
            desc="Small team. High taste. Focused execution."
            testId="header-team"
          />

          <div
            className="flex justify-start lg:justify-end"
            data-testid="team-cta"
          >
            <GradientButton
              testId="button-meet-team"
              variant="outline"
              onClick={() => toast("Team profiles coming soon.")}
              className="border-black/20 dark:border-white/20 text-black/80 dark:text-white/80"
            >
              Meet the Team
              <Users className="ml-2 h-4 w-4" />
            </GradientButton>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden" data-testid="carousel-team">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -2400],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {[...people, ...people, ...people].map((p, idx) => (
              <motion.div
                key={`${p.id}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group flex-shrink-0 w-[280px]"
                data-testid={`card-team-${p.id}-${idx}`}
              >
                <div className="glass gradient-border relative overflow-hidden rounded-3xl p-4 transition-all hover:scale-105 group-hover:olive-glow h-full">
                  <div
                    className="aspect-[3/4] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-black/5 dark:from-white/5 to-black/20 dark:to-black/50"
                    data-testid={`img-team-${p.id}`}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        style={
                          p.imagePosition
                            ? { objectPosition: p.imagePosition }
                            : undefined
                        }
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-black/60 dark:text-white/60">
                        Profile image
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-1">
                    <div
                      className="text-base font-semibold text-foreground"
                      data-testid={`text-team-name-${p.id}`}
                    >
                      {p.name}
                    </div>
                    <div
                      className="mt-1 text-sm text-black/60 dark:text-white/60"
                      data-testid={`text-team-role-${p.id}`}
                    >
                      {p.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Testimonials() {
  const items = useMemo(
    () => [
      {
        id: "r1",
        name: "Client A",
        line: "It felt premium from the first scroll.",
      },
      {
        id: "r2",
        name: "Client B",
        line: "Clean story. Strong conversion energy.",
      },
      { id: "r3", name: "Client C", line: "Tasteful design, fast execution." },
    ],
    [],
  );

  return (
    <section
      id="testimonials"
      className="relative py-20"
      data-testid="section-testimonials"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Testimonials"
          title="Short words. Real signal."
          desc="Placeholders, styled like trust markers."
          testId="header-testimonials"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-5 md:grid-cols-3"
          data-testid="grid-testimonials"
        >
          {items.map((t) => (
            <motion.div
              key={t.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <GlassCard testId={`card-testimonial-${t.id}`}>
                <div
                  className="flex items-center gap-1"
                  data-testid={`stars-${t.id}`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[hsl(var(--primary))]/30 text-[hsl(var(--primary))]"
                    />
                  ))}
                </div>
                <div
                  className="mt-4 text-sm text-black/80 dark:text-white/80"
                  data-testid={`text-testimonial-line-${t.id}`}
                >
                  “{t.line}”
                </div>
                <div
                  className="mt-4 text-xs text-black/60 dark:text-white/60"
                  data-testid={`text-testimonial-name-${t.id}`}
                >
                  {t.name}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const errors = {
    name: name.trim().length === 0,
    contact: contact.trim().length === 0,
    message: message.trim().length === 0,
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.name || errors.contact || errors.message) {
      toast.error("Please complete all fields.");
      return;
    }

    const msg = `Hello ${siteConfig.brandName}, I want a personalized branding website.\nName: ${name}\nContact: ${contact}\nMessage: ${message}`;
    const url = buildWaLink(msg);

    toast.success("Opening WhatsApp…");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      className="relative py-20"
      data-testid="section-contact"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="Let’s build your presence"
              desc="Send a note — we’ll continue on WhatsApp."
              testId="header-contact"
            />

            <div
              className="glass rounded-3xl p-6 space-y-6"
              data-testid="card-contact-info"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 dark:bg-white/5 bg-black/5">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest dark:text-white/40 text-black/40">
                    WhatsApp
                  </div>
                  <div className="text-base font-bold">
                    {siteConfig.whatsappNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 dark:bg-white/5 bg-black/5">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest dark:text-white/40 text-black/40">
                    Email
                  </div>
                  <div className="text-base font-bold">
                    {(siteConfig as any).emailPlaceholder}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 dark:bg-white/5 bg-black/5">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest dark:text-white/40 text-black/40">
                    Office
                  </div>
                  <div className="text-base font-bold">
                    {(siteConfig as any).officeAddress}
                  </div>
                </div>
              </div>

              <a
                href={buildWaLink(
                  `Hello ${siteConfig.brandName}, I want a personalized branding website.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full justify-center items-center gap-2 rounded-2xl bg-primary px-4 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02] active:scale-100 shadow-lg shadow-primary/25"
                data-testid="button-whatsapp-direct"
              >
                Instant Connect
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="glass rounded-3xl p-6"
            data-testid="form-contact"
          >
            <div className="grid gap-4">
              <div>
                <label
                  className="text-[10px] font-black uppercase tracking-widest dark:text-white/40 text-black/40"
                  data-testid="label-name"
                >
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "mt-2 h-12 rounded-2xl border-white/10 dark:bg-white/5 bg-black/5 dark:text-white text-black placeholder:text-black/20 dark:placeholder:text-white/20",
                    errors.name
                      ? "ring-1 ring-red-500/40"
                      : "focus-visible:ring-primary/40",
                  )}
                  placeholder="Your full name"
                  data-testid="input-name"
                />
              </div>

              <div>
                <label
                  className="text-[10px] font-black uppercase tracking-widest dark:text-white/40 text-black/40"
                  data-testid="label-contact"
                >
                  Email or phone
                </label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={cn(
                    "mt-2 h-12 rounded-2xl border-white/10 dark:bg-white/5 bg-black/5 dark:text-white text-black placeholder:text-black/20 dark:placeholder:text-white/20",
                    errors.contact
                      ? "ring-1 ring-red-500/40"
                      : "focus-visible:ring-primary/40",
                  )}
                  placeholder="How can we reach you?"
                  data-testid="input-contact"
                />
              </div>

              <div>
                <label
                  className="text-[10px] font-black uppercase tracking-widest dark:text-white/40 text-black/40"
                  data-testid="label-message"
                >
                  Project Brief
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={cn(
                    "mt-2 min-h-32 rounded-2xl border-white/10 dark:bg-white/5 bg-black/5 dark:text-white text-black placeholder:text-black/20 dark:placeholder:text-white/20",
                    errors.message
                      ? "ring-1 ring-red-500/40"
                      : "focus-visible:ring-primary/40",
                  )}
                  placeholder="Tell us about your vision..."
                  data-testid="input-message"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.25em] text-[11px] transition-all hover:brightness-110 shadow-lg shadow-primary/20"
                  data-testid="button-submit"
                >
                  Confirm & Launch
                </Button>
                <p className="mt-4 text-center text-[9px] font-bold uppercase tracking-widest dark:text-white/20 text-black/20">
                  Opens Secure WhatsApp Chat
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Footer({ theme }: { theme: string }) {
  return (
    <footer className="relative pb-14 pt-10" data-testid="footer">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-3xl p-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div
                className="flex items-center gap-3"
                data-testid="footer-brand"
              >
                <div className="h-14 w-14 overflow-hidden">
                  {theme === "dark" ? (
                    <img
                      src={siteConfig.darkLogoPath}
                      alt={siteConfig.brandName}
                      className="h-full w-full object-cover"
                      data-testid="img-footer-logo"
                    />
                  ) : (
                    <img
                      src={siteConfig.logoPath}
                      alt={siteConfig.brandName}
                      className="h-full w-full object-cover"
                      data-testid="img-footer-logo"
                    />
                  )}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold text-foreground"
                    data-testid="text-footer-name"
                  >
                    {siteConfig.brandName}
                  </div>
                  <div
                    className="text-xs text-black/60 dark:text-white/60"
                    data-testid="text-footer-tagline"
                  >
                    {siteConfig.brandTagline}
                  </div>
                </div>
              </div>
              <p
                className="mt-4 text-sm text-black/70 dark:text-white/70"
                data-testid="text-footer-desc"
              >
                Placeholder copy. Premium tone. Story-first layout.
              </p>
            </div>

            <div>
              <div
                className="text-xs font-medium text-black/60 dark:text-white/60"
                data-testid="text-footer-links-title"
              >
                Quick links
              </div>
              <div className="mt-4 grid gap-2" data-testid="footer-links">
                {navLinks.map((l: (typeof navLinks)[number]) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => scrollToId(l.id)}
                    className="text-left text-sm text-black/75 dark:text-white/75 hover:text-primary dark:hover:text-white"
                    data-testid={`link-footer-${l.id}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div
                className="text-xs font-medium text-black/60 dark:text-white/60"
                data-testid="text-footer-social-title"
              >
                Social
              </div>
              <div
                className="mt-4 flex items-center gap-2"
                data-testid="footer-social"
              >
                {[
                  { i: Linkedin, id: "linkedin" },
                  { i: Instagram, id: "instagram" },
                  { i: Github, id: "github" },
                ].map(({ i: Icon, id }) => (
                  <a
                    key={id}
                    href="#"
                    className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/8"
                    data-testid={`link-social-${id}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div
                className="mt-5 text-xs text-black/60 dark:text-white/60"
                data-testid="text-footer-copy"
              >
                © {new Date().getFullYear()} {siteConfig.brandName}. All rights
                reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const ids = useMemo(
    () => navLinks.map((l: (typeof navLinks)[number]) => l.id),
    [],
  );
  const active = useActiveSection(ids);

  return (
    <div className="relative min-h-screen bg-background">
      <TopProgress />
      <CursorGlow />
      <Navbar activeId={active} />

      <main className="relative z-10" data-testid="main">
        <Hero />
        <Story />
        <Expertise />
        <Work />
        <Team />
        <Testimonials />
        <Contact />
      </main>

      <Footer theme={theme} />
    </div>
  );
}
