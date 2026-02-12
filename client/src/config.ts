export const siteConfig = {
  brandName: "Scalaris",
  brandTagline: "Personal brands, beautifully presented.",
  logoPath: "/src/assets/light.png",
  darkLogoPath: "/src/assets/dark.png",
  whatsappNumber: "+971504486615",
  emailPlaceholder: "hello@yourbrand.com",
  primaryThemeColor: {
    olive: {
      50: "78 35% 88%",
      100: "78 35% 80%",
      200: "78 35% 70%",
      300: "78 35% 60%",
      400: "78 35% 52%",
      500: "78 35% 45%",
      600: "78 35% 38%",
      700: "78 35% 30%",
      800: "78 35% 22%",
      900: "78 35% 16%",
    },
  },
} as const;

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "story", label: "Story" },
  { id: "expertise", label: "Expertise" },
  { id: "work", label: "Work" },
  { id: "team", label: "Team" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
] as const;

export type NavLink = (typeof navLinks)[number];
