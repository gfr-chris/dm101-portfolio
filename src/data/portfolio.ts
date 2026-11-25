/**
 * ALL public portfolio text lives here.
 *
 * ⚠ Anything starting with "[EDIT]" is a placeholder that only YOU can write truthfully
 *   (goals, reflection, proficiency levels, your exact role). Run `npm run check:content`
 *   before deploying — it fails while any "[EDIT]" remains.
 *
 * Content accuracy rule (from the project plan): list only technologies you have actually used,
 * keep "learning" separate from "comfortable", and don't claim team work as individual work.
 */

export type Proficiency = "beginner" | "developing" | "familiar" | "comfortable";

export interface Skill {
  name: string;
  level: Proficiency;
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  kind: string;
  problem: string;
  purpose: string;
  role: string;
  contribution: string[];
  stack: string[];
  evidence: string;
  repoUrl?: string;
  demoUrl?: string;
  image?: string; // e.g. "/projects/e-sagip.png" placed in /public/projects
}

export const profile = {
  name: "Christian James A. Pineda",
  shortName: "Chris",
  tagline: "Software developer building mobile and web systems that solve practical problems.",
  email: "", // optional public contact email; the inquiry form is the primary channel
  intro:
    "I build Flutter mobile apps, web-based management tools and academic software projects. This site is both my portfolio and my DM101 Business Process Management project: the contact form is a real, tracked inquiry process.",
  education: [
    {
      school: "Quezon City University",
      detail: "Section SBCS 3A",
      period: "2024 – 2028",
    },
  ],
  interests: [
    "Flutter and mobile app development",
    "Inventory and management information systems",
    "Emergency-response and location-based technology",
    "AI persona and conversational design",
  ],
  direction:
    "I am interested in learning new skills and familiarize myself with data science, machine learning, and cybersecurity.",
};

export const technicalSkills: Skill[] = [
  // [EDIT] Confirm every level honestly. "developing" is a safe default until you change it.
  { name: "Flutter / Dart", level: "developing", note: "Nota AI chat app" },
  { name: "JavaScript (ES6+)", level: "developing", note: "CPU Scheduler, Soya inventory tools" },
  { name: "React", level: "developing", note: "Soya IMS, E-Sagip prototype" },
  { name: "HTML & CSS", level: "developing" },
  { name: "TypeScript, Next.js, Supabase", level: "beginner", note: "Currently learning — used in this project" },
];

export const toolSkills: string[] = [
  "Git & GitHub",
  "VS Code",
  "Canva, Figma",
];

export const softSkills: { name: string; example: string }[] = [
  {
    name: "Teamwork",
    example: "Member of SE101 Group 5 (SBCS 3A) developing the E-Sagip emergency alert system.",
  },
  { name: "Communication", example: "Presented the E-Sagip project to stakeholders and received feedback for improvements." },
  { name: "Problem-Solving", example: "Identified and resolved a critical bug in the CPU scheduler that was causing performance issues." },
];

export const projects: Project[] = [
  {
    slug: "e-sagip",
    title: "E-Sagip — Emergency Alert & Location-Based Routing",
    kind: "Group project · SE101 Software Engineering",
    problem:
      "Emergency reports (fire, medical, rescue) can be slow to reach the right responders when dispatch is centralized and hotlines are congested.",
    purpose:
      "Route citizen emergency reports automatically to registered responder units within a 5–10 km radius, with guest access so people in distress are not blocked by account creation.",
    role: "Group member, SE101 Group 5 (SBCS 3A). [EDIT] State exactly which parts you personally built or wrote.",
    contribution: [
      "Built working web prototypes of the citizen reporting flow and the responder dispatch dashboard.",
      "Implemented Haversine-based geofencing that filters responder units by an adjustable radius.",
      "Implemented the guest-first flow with device-based trust flagging for suspicious request patterns (flagged, never blocked).",
    ],
    stack: ["React", "JavaScript", "HTML/CSS", "Haversine geofencing"],
    evidence: "Client-side web prototype; the mobile client and backend are planned for a later phase.",
  },
  {
    slug: "soya-ims",
    title: "Soya Inventory Management System",
    kind: "Web application · capstone-specified modules",
    problem:
      "Tracking client balances, stock and restocks on paper or in loose spreadsheets makes balances hard to verify and reports slow to produce.",
    purpose:
      "A web inventory tool for tracking client balances, cup sizes, sugar and bottles with peso-denominated pricing, plus a fuller React version covering the specified capstone modules.",
    role: "Developer. [EDIT] Clarify whether this was solo or shared work.",
    contribution: [
      "Built a multi-file web app with a compact, scroll-free table layout and sticky headers.",
      "Added local auto-save, JSON export/import, a new-period workflow and print support.",
      "Built a React SPA implementing modules such as role-based authentication, dashboard, inventory CRUD, transactions, restock, audit logs, reports and user management.",
    ],
    stack: ["JavaScript", "React", "HTML/CSS", "localStorage"],
    evidence: "Working front-end application; data currently stored in the browser.",
  },
  {
    slug: "cpu-scheduler",
    title: "CPU Process Scheduling Simulator",
    kind: "Academic software · Operating Systems concepts",
    problem:
      "Scheduling algorithms are hard to compare from tables alone; students need to see how each one orders processes over time.",
    purpose:
      "Simulate six CPU scheduling algorithms and visualize the result with Gantt charts and turnaround / waiting-time computations.",
    role: "Developer. [EDIT] Confirm your role.",
    contribution: [
      "Implemented FCFS, SJF, SRTF, Round Robin and both Priority (preemptive / non-preemptive) algorithms.",
      "Refactored the app into a modular object-oriented structure (config, process, scheduler, renderers).",
      "Rendered inline Gantt charts, an arrival timeline and TAT / WT results with CPU-utilization breakdowns.",
    ],
    stack: ["JavaScript (OOP)", "SVG", "HTML/CSS"],
    evidence: "Modular front-end application with generated developer documentation.",
  },
  {
    slug: "nota-ai",
    title: "Nota AI (Project Dreadnought)",
    kind: "Personal project · Flutter",
    problem:
      "Most chat assistants have a generic voice; I wanted to explore how a consistent custom persona could be specified and kept stable across conversations.",
    purpose:
      "A Flutter chat app with a custom AI persona that falls back across multiple AI providers.",
    role: "Solo developer and persona designer.",
    contribution: [
      "Wrote the persona specification (Project Dreadnought).",
      "Built a provider fallback chain (Gemini → Groq → DeepSeek → Ollama Qwen).",
      "Moved the app from a Python backend to a self-contained Flutter app with local persistence for Android compatibility.",
    ],
    stack: ["Flutter", "Dart", "Gemini / Groq / DeepSeek APIs"],
    evidence: "Working Flutter application.",
    image: "/projects/nota-dashboard-img.png",
  },
];

export const goals = {
  shortTerm: [
    "Familiarize myself with the data science, machine learning, and cybersecurity fundamentals.",
    "A web and app developer that can build and maintain systems that solve practical problems.",
  ],
  mediumTerm: ["Be a full-stack developer that can build and maintain systems that solve practical problems."],
  longTerm: ["Remain a programmer while managing my own business and/or leading a team of developers."],
};

export const reflection = {
  journey: "I mostly discovered my passion for software development through personal projects and academic coursework, probably useful for business owners who want to hire developers.",
  challenges: "It's when things don't work as expected, and I have to debug and find the root cause of the problem.",
  achievements: "I have built several projects that I am proud of, and I have learned a lot from them. I have also improved my skills in programming, problem-solving, and teamwork. Although some of which are personal projects, I have also contributed to group projects and learned how to work effectively in a team.",
  improvements: "Get better at debugging and problem-solving, and learn new technologies and frameworks to stay up-to-date with the latest trends in software development, but also to build other skills that are meant for earning a living as a programmer also like in business and management skills.",
  bpmLearning:
    "This project about BPM taught me how to manage a project from start to finish, and how to work effectively in a team. I learned how to plan, execute, and monitor a project, and how to communicate effectively with team members and stakeholders. As well as understanding how a business process works, the challenges that comes and how to improve it.",
};
