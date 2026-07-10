/**
 * Portfolio content — the single source of truth for all copy.
 *
 * Keeping content here (separate from the scene) means reskinning or updating
 * the portfolio never touches the 3D engine. Overlays + modal read from this.
 */

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: readonly string[];
  url: string;
}

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  points: readonly string[];
}

export interface EducationEntry {
  school: string;
  detail: string;
  period: string;
}

export interface SkillGroup {
  label: string;
  items: readonly string[];
}

export const PROFILE = {
  name: "Darius Barda",
  role: "Software Engineer",
  tagline: "Software Engineer @ CG&GC HiTech · building web apps end to end.",
  about:
    "Software engineer based in Oradea, currently on an Erasmus traineeship at Universität der Bundeswehr München (Oct 2025 – Dec 2026). I like building full-stack web apps — from Laravel/NestJS backends to React frontends — and caring about how they look and feel.",
  email: "bardadarius6@gmail.com",
  github: "https://github.com/BardaK03",
} as const;

export const PROJECTS: readonly Project[] = [
  {
    id: "v-link",
    title: "V-Link",
    tagline: "Volunteering platform connecting volunteers with organizers.",
    description:
      "Discover events, get matched by skill, log hours, and earn points/badges redeemable in a marketplace. Organizers manage events, roles, and shifts. Includes push notifications, email, and an AI chatbot.",
    tech: ["Next.js 16", "React 19", "NestJS", "TypeORM", "Supabase/Postgres", "Tailwind"],
    url: "https://github.com/BardaK03/V-Link",
  },
  {
    id: "prioritizare-ati",
    title: "ICU Prioritization",
    tagline: "Clinical decision support for ICU discharge — Hackathon 2nd place.",
    description:
      "A React interface that helps medical staff prioritize which ICU patients can be discharged. Built at HACKATHUSO (March 2025), where it took 2nd place. I led the design and the interface implementation.",
    tech: ["React", "Vite", "JavaScript", "Figma"],
    url: "https://github.com/BardaK03/prioritizareAti-FRONTEND",
  },
  {
    id: "shop",
    title: "Shop",
    tagline: "Role-based e-commerce & inventory management.",
    description:
      "A Laravel sales-management system: browse and buy products, admin CRUD with stock control, cart, and order history. Prevents out-of-stock purchases and updates stock automatically on sale.",
    tech: ["Laravel 10", "PHP 8.2", "MySQL", "Tailwind", "Breeze"],
    url: "https://github.com/BardaK03/Shop",
  },
] as const;

export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    role: "Software Engineer",
    org: "CG&GC HiTech",
    period: "Jul 2025 – Present",
    points: ["Building production web applications as part of the engineering team."],
  },
  {
    role: "Erasmus Traineeship",
    org: "Universität der Bundeswehr München",
    period: "Oct 2025 – Dec 2026",
    points: ["International research/engineering traineeship in Munich, Germany."],
  },
  {
    role: "Frontend & UI Design Developer",
    org: "HACKATHUSO (Hackathon)",
    period: "Mar 2025",
    points: [
      "Won 2nd place with an ICU patient-prioritization web app.",
      "Responsible for the app design and building the interface in React.",
    ],
  },
  {
    role: "Backend Intern",
    org: "Neobyte, Oradea",
    period: "Jul 2024",
    points: [
      "Helped build a web app for managing and processing contract forms.",
      "Implemented backend features in Laravel.",
      "Collaborated with the team using Jira.",
    ],
  },
];

export const EDUCATION: readonly EducationEntry[] = [
  {
    school: "University of Oradea",
    detail: "Faculty of Electrical Engineering & Information Technology — Computers, Year III",
    period: "In progress",
  },
  {
    school: 'Colegiul Național "Onisifor Ghibu", Oradea',
    detail: "Natural Sciences",
    period: "Class of 2022",
  },
];

export const SKILLS: readonly SkillGroup[] = [
  { label: "Languages", items: ["C", "C++", "C#", "Java", "Python", "JavaScript"] },
  { label: "Frontend", items: ["HTML", "CSS", "React"] },
  { label: "Backend", items: ["Laravel (PHP)", "NestJS"] },
  { label: "Tools", items: ["Figma", "Postman", "AutoCAD", "Fritzing", "Photoshop", "MS Office"] },
];

export const CERTIFICATIONS: readonly string[] = ["Certiport IC3 GS5"];
