import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  Check,
  Filter,
  Github,
  Instagram,
  Linkedin,
  MessageCircle,
  Sparkles,
  Star,
  Users,
  Wand2,
} from "lucide-react";
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
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.22, 0.3, 0.4],
        rootMargin: "-20% 0px -65% 0px",
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
  el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      className={cn(
        "mb-10",
        align === "center" ? "text-center" : "text-left",
      )}
      data-testid={testId}
    >
      {eyebrow ? (
        <div
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
          data-testid={`${testId}-eyebrow`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          <span>{eyebrow}</span>
        </div>
      ) : null}

      <h2
        className={cn(
          "mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl",
        )}
        data-testid={`${testId}-title`}
      >
        {title}
      </h2>
      {desc ? (
        <p
          className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
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
  testId,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
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
            : "bg-white/5 text-white hover:bg-white/8",
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
            "mt-4 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl",
            "transition-all",
            scrolled ? "py-1.5 shadow-lg" : "py-2",
          )}
          data-testid="nav-bar"
        >
          <div className="flex items-center justify-between gap-3 px-4">
            <button
              type="button"
              onClick={() => scrollToId("home")}
              className="group flex items-center gap-3"
              data-testid="link-home-logo"
            >
              <div className="h-9 w-9 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img
                  src={siteConfig.logoPath}
                  alt={siteConfig.brandName}
                  className="h-full w-full object-cover"
                  data-testid="img-logo"
                />
              </div>
              <div className="leading-tight">
                <div
                  className="text-sm font-semibold tracking-tight"
                  data-testid="text-brandName"
                >
                  {siteConfig.brandName}
                </div>
                <div className="text-xs text-white/60" data-testid="text-brandTagline">
                  {siteConfig.brandTagline}
                </div>
              </div>
            </button>

            <div className="hidden items-center gap-1 md:flex" data-testid="nav-links">
              {navLinks.map((l: (typeof navLinks)[number]) => {
                const active = activeId === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => scrollToId(l.id)}
                    className={cn(
                      "group relative rounded-2xl px-3 py-2 text-sm text-white/70 transition-colors",
                      "hover:text-white",
                      active ? "text-white" : "",
                    )}
                    data-testid={`link-nav-${l.id}`}
                  >
                    <span>{l.label}</span>
                    <span
                      className={cn(
                        "absolute bottom-1 left-3 right-3 h-px",
                        "bg-[hsl(var(--primary))]",
                        "origin-left scale-x-0 transition-transform",
                        active ? "scale-x-100" : "group-hover:scale-x-100",
                      )}
                    />
                    {active ? (
                      <span
                        className="absolute inset-0 -z-10 rounded-2xl bg-white/5"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2" data-testid="nav-ctas">
              <a
                href={buildWaLink(
                  `Hello ${siteConfig.brandName}, I want a personalized branding website.`,
                )}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80",
                  "transition-colors hover:bg-white/8 md:inline-flex",
                )}
                data-testid="button-whatsapp-nav"
              >
                <MessageCircle className="h-4 w-4 text-[hsl(var(--primary))]" />
                WhatsApp
              </a>
              <GradientButton
                testId="button-start-nav"
                onClick={() => scrollToId("contact")}
              >
                Start
                <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>
            </div>
          </div>

          <div
            className="mt-2 flex items-center gap-2 overflow-x-auto px-4 pb-3 md:hidden"
            data-testid="nav-mobile"
          >
            {navLinks.map((l: (typeof navLinks)[number]) => {
              const active = activeId === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => scrollToId(l.id)}
                  className={cn(
                    "shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs",
                    active ? "text-white" : "text-white/70",
                  )}
                  data-testid={`link-nav-mobile-${l.id}`}
                >
                  {l.label}
                </button>
              );
            })}
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
        <div className="absolute inset-0 -z-10 rounded-[36px] noise" aria-hidden />

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
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                data-testid="badge-hero"
              >
                <Wand2 className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                Dubai-based personalized web presence
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl"
              data-testid="text-hero-title"
            >
              Your story, distilled into a premium online identity.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base"
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
                View Work
              </GradientButton>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-3 text-xs text-white/60"
              data-testid="hero-meta"
            >
              {["Story-led", "Olive accents", "Glass UI", "Mobile-first"].map(
                (t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
                    data-testid={`pill-hero-${t}`}
                  >
                    <Check className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                    {t}
                  </span>
                ),
              )}
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
                <div
                  className="absolute inset-0 flex items-center justify-center text-xs text-white/60"
                  data-testid="img-hero-placeholder"
                >
                  Hero image placeholder
                </div>
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
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    data-testid={`stat-${s.k}`}
                  >
                    <div
                      className="text-xs text-white/60"
                      data-testid={`stat-key-${s.k}`}
                    >
                      {s.k}
                    </div>
                    <div
                      className="mt-1 text-sm font-semibold"
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
                    className="text-xs font-medium text-white/60"
                    data-testid={`text-story-step-${i}`}
                  >
                    Step {i + 1}
                  </div>
                  <div
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
                    data-testid={`badge-story-${i}`}
                  >
                    {s.title}
                  </div>
                </div>
                <div
                  className="mt-4 font-display text-2xl tracking-tight"
                  data-testid={`text-story-title-${i}`}
                >
                  {s.title}
                </div>
                <p
                  className="mt-2 text-sm leading-relaxed text-white/70"
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
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5"
                    data-testid={`iconwrap-expertise-${idx}`}
                  >
                    <Icon
                      className="h-5 w-5 text-[hsl(var(--primary))]"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <div
                      className="text-lg font-semibold tracking-tight"
                      data-testid={`text-expertise-title-${idx}`}
                    >
                      {it.title}
                    </div>
                    <div
                      className="mt-1 text-sm text-white/70"
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
};

function Work() {
  const projects: Project[] = useMemo(
    () => [
      {
        id: "p1",
        title: "Noor Portfolio",
        category: "Websites",
        line: "Minimal, cinematic landing.",
      },
      {
        id: "p2",
        title: "Desert Studio",
        category: "Branding",
        line: "Identity system + story page.",
      },
      {
        id: "p3",
        title: "Pulse App",
        category: "Apps",
        line: "Mobile UI with premium motion.",
      },
      {
        id: "p4",
        title: "Luma Consulting",
        category: "Websites",
        line: "Conversion-first services.",
      },
      {
        id: "p5",
        title: "Sable Identity",
        category: "Branding",
        line: "Olive + ivory aesthetic.",
      },
      {
        id: "p6",
        title: "Atlas Companion",
        category: "Apps",
        line: "App landing + product story.",
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

        <div className="flex flex-wrap items-center gap-2" data-testid="tabs-work">
          <div className="mr-1 inline-flex items-center gap-2 text-xs text-white/60">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </div>
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border border-white/10 px-4 py-2 text-xs transition-colors",
                tab === t
                  ? "bg-[hsl(var(--primary))]/15 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/8",
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
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/40"
                data-testid={`img-project-${p.id}`}
              >
                <div className="flex h-full items-center justify-center text-xs text-white/60">
                  Preview image placeholder
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div
                    className="text-sm font-semibold"
                    data-testid={`text-project-title-${p.id}`}
                  >
                    {p.title}
                  </div>
                  <div
                    className="mt-1 text-xs text-white/60"
                    data-testid={`text-project-cat-${p.id}`}
                  >
                    {p.category}
                  </div>
                </div>
                <div
                  className="rounded-full border border-white/10 bg-white/5 p-2"
                  data-testid={`button-project-open-${p.id}`}
                >
                  <ArrowRight className="h-4 w-4 text-[hsl(var(--primary))]" />
                </div>
              </div>
              <div
                className="mt-3 text-sm text-white/70"
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
  const people = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `t${i + 1}`,
        name: `Teammate ${i + 1}`,
        role: "Creative + Build",
      })),
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

          <div className="flex justify-start lg:justify-end" data-testid="team-cta">
            <GradientButton
              testId="button-meet-team"
              variant="ghost"
              onClick={() => toast("Team profiles coming soon.")}
            >
              Meet the Team
              <Users className="ml-2 h-4 w-4" />
            </GradientButton>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          data-testid="grid-team"
        >
          {people.map((p) => (
            <motion.div
              key={p.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="group"
              data-testid={`card-team-${p.id}`}
            >
              <div className="glass gradient-border relative overflow-hidden rounded-3xl p-3 transition-all group-hover:olive-glow">
                <div
                  className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/50"
                  data-testid={`img-team-${p.id}`}
                >
                  <div className="flex h-full items-center justify-center text-xs text-white/60">
                    Profile image
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <div
                    className="text-sm font-semibold"
                    data-testid={`text-team-name-${p.id}`}
                  >
                    {p.name}
                  </div>
                  <div
                    className="mt-0.5 text-xs text-white/60"
                    data-testid={`text-team-role-${p.id}`}
                  >
                    {p.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Testimonials() {
  const items = useMemo(
    () => [
      { id: "r1", name: "Client A", line: "It felt premium from the first scroll." },
      { id: "r2", name: "Client B", line: "Clean story. Strong conversion energy." },
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
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            >
              <GlassCard testId={`card-testimonial-${t.id}`}>
                <div className="flex items-center gap-1" data-testid={`stars-${t.id}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[hsl(var(--primary))]/30 text-[hsl(var(--primary))]"
                    />
                  ))}
                </div>
                <div
                  className="mt-4 text-sm text-white/80"
                  data-testid={`text-testimonial-line-${t.id}`}
                >
                  “{t.line}”
                </div>
                <div
                  className="mt-4 text-xs text-white/60"
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

    const msg = `Hello ${siteConfig.brandName}, I want a personalized branding website.
Name: ${name}
Contact: ${contact}
Message: ${message}`;
    const url = buildWaLink(msg);

    toast.success("Opening WhatsApp…");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="relative py-20" data-testid="section-contact">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Contact"
              title="Let’s build your presence"
              desc="Send a note — we’ll continue on WhatsApp."
              testId="header-contact"
            />

            <div className="glass rounded-3xl p-6" data-testid="card-contact-info">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <MessageCircle className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <div className="text-sm font-semibold" data-testid="text-contact-whatsTitle">
                    WhatsApp
                  </div>
                  <div className="mt-1 text-sm text-white/70" data-testid="text-contact-number">
                    {siteConfig.whatsappNumber}
                  </div>
                </div>
              </div>

              <a
                href={buildWaLink(
                  `Hello ${siteConfig.brandName}, I want a personalized branding website.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/8"
                data-testid="button-whatsapp-direct"
              >
                Open chat
                <ArrowRight className="h-4 w-4 text-[hsl(var(--primary))]" />
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
                <label className="text-xs text-white/60" data-testid="label-name">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "mt-2 h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35",
                    errors.name
                      ? "ring-1 ring-red-500/40"
                      : "focus-visible:ring-[hsl(var(--primary))]/40",
                  )}
                  placeholder="Your name"
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="text-xs text-white/60" data-testid="label-contact">
                  Email or phone
                </label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={cn(
                    "mt-2 h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35",
                    errors.contact
                      ? "ring-1 ring-red-500/40"
                      : "focus-visible:ring-[hsl(var(--primary))]/40",
                  )}
                  placeholder="you@email.com"
                  data-testid="input-contact"
                />
              </div>

              <div>
                <label className="text-xs text-white/60" data-testid="label-message">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={cn(
                    "mt-2 min-h-32 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35",
                    errors.message
                      ? "ring-1 ring-red-500/40"
                      : "focus-visible:ring-[hsl(var(--primary))]/40",
                  )}
                  placeholder="Tell us what you want to build"
                  data-testid="input-message"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white/60" data-testid="text-contact-note">
                  On submit, we’ll open a pre-filled WhatsApp message.
                </div>
                <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                  <Button
                    type="submit"
                    className="gradient-border h-11 rounded-2xl bg-[hsl(var(--primary))] px-5 text-[hsl(var(--primary-foreground))]"
                    data-testid="button-submit"
                  >
                    Send via WhatsApp
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-16 section-divider" aria-hidden />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative pb-14 pt-10" data-testid="footer">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-3xl p-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3" data-testid="footer-brand">
                <div className="h-9 w-9 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={siteConfig.logoPath}
                    alt={siteConfig.brandName}
                    className="h-full w-full object-cover"
                    data-testid="img-footer-logo"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold" data-testid="text-footer-name">
                    {siteConfig.brandName}
                  </div>
                  <div className="text-xs text-white/60" data-testid="text-footer-tagline">
                    {siteConfig.brandTagline}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/70" data-testid="text-footer-desc">
                Placeholder copy. Premium tone. Story-first layout.
              </p>
            </div>

            <div>
              <div
                className="text-xs font-medium text-white/60"
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
                    className="text-left text-sm text-white/75 hover:text-white"
                    data-testid={`link-footer-${l.id}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div
                className="text-xs font-medium text-white/60"
                data-testid="text-footer-social-title"
              >
                Social
              </div>
              <div className="mt-4 flex items-center gap-2" data-testid="footer-social">
                {[
                  { i: Linkedin, id: "linkedin" },
                  { i: Instagram, id: "instagram" },
                  { i: Github, id: "github" },
                ].map(({ i: Icon, id }) => (
                  <a
                    key={id}
                    href="#"
                    className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/8"
                    data-testid={`link-social-${id}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="mt-5 text-xs text-white/60" data-testid="text-footer-copy">
                © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const ids = useMemo(() => navLinks.map((l: (typeof navLinks)[number]) => l.id), []);
  const active = useActiveSection(ids);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(900px_500px_at_10%_0%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(800px_520px_at_90%_20%,hsl(210_100%_50%/0.08),transparent_60%),radial-gradient(900px_700px_at_50%_100%,hsl(222_30%_8%/1),hsl(var(--background)))]">
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

      <Footer />
    </div>
  );
}
