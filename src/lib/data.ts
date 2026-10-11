// Single source of truth for all site text. Every string comes from the résumé
// (Kanchana Jayendran, 2 pages), unless noted. Components only read from here.

export type GroupId =
  | "frontend"
  | "backend"
  | "databases"
  | "cloud"
  | "architecture"
  | "data"
  | "search"
  | "source"
  | "tools";

export type ConceptId =
  | "api"
  | "micro"
  | "clean"
  | "ddd"
  | "cqrs"
  | "mvc"
  | "table"
  | "db"
  | "layers"
  | "cloud"
  | "pipeline";

export type ProjectId = "bubltown" | "pos" | "nl2sql" | "attendance" | "lawyer";

export const PROFILE = {
  name: "Kanchana Jayendran",
  firstName: "Kanchana",
  initials: "KJ",
  role: "Full-Stack Software Engineer",
  // Paraphrase of the summary, used as the hero lede.
  lede: "Full Stach Developer",
  // Verbatim from the résumé's PROFESSIONAL SUMMARY.
  resumeSummary:
    "Full-Stack Software Engineer with over 3 years of professional experience building scalable web applications and APIs using Angular, ReactJS, .NET Core, SQL, and modern cloud technologies. Proven track record in designing responsive front-end interfaces and secure backend services across e-commerce, POS, and microservices platforms. Strong collaborator with experience in Agile teams, CI/CD pipelines, and cloud deployment. Recently completed an MSc in Data Science and Computational Intelligence at Coventry University. Available for full-time Software Engineer or Full-Stack Developer roles in the UK (Graduate Visa).",
  // Verbatim short line from the résumé's AVAILABILITY section.
  availability: "Available for immediate full-time employment.",
  email: "kanchanajayendran@gmail.com",
  phoneDisplay: "07496 106407",
  // UK mobile 07496 106407 in international format.
  phoneHref: "+447496106407",
  location: "London, UK",
  github: "https://github.com/Kanchana19",
  githubHandle: "Kanchana19",
  linkedin: "https://linkedin.com/in/kanchana19",
  linkedinLabel: "linkedin.com/in/kanchana19",
  resumePath: "/resume.pdf",
  graduationYear: "2026",
  // Verbatim sentence from the résumé's professional summary, used as the About quote.
  quote:
    "Strong collaborator with experience in Agile teams, CI/CD pipelines, and cloud deployment.",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export const SKILL_GROUPS: { id: GroupId; label: string; heading: string }[] = [
  { id: "frontend", label: "Frontend", heading: "Frontend Development" },
  { id: "backend", label: "Backend", heading: "Backend Development" },
  { id: "databases", label: "Databases", heading: "Databases" },
  { id: "cloud", label: "Cloud & DevOps", heading: "Cloud & DevOps" },
  { id: "architecture", label: "Architecture", heading: "Architecture & Patterns" },
  { id: "data", label: "Data & Automation", heading: "Data & Automation" },
  { id: "search", label: "Search & Caching", heading: "Search & Caching" },
  { id: "source", label: "Source Control", heading: "Source Control" },
  { id: "tools", label: "Tools & Other", heading: "Tools & Other" },
];

export type Skill = {
  name: string;
  symbol: string; // two-letter tile symbol
  group: GroupId;
  logo?: string; // slug of a brand mark in public/logos
  concept?: ConceptId; // line icon for concepts and marks not available as brand SVGs
  detail?: string; // extra résumé detail shown in the inspector
  projects: ProjectId[];
};

// Every skill listed in the résumé's SKILLS section (41 items, same order).
export const SKILLS: Skill[] = [
  { name: "Angular", symbol: "An", group: "frontend", logo: "angular", projects: ["bubltown", "pos", "lawyer"] },
  { name: "React JS", symbol: "Re", group: "frontend", logo: "react", projects: [] },
  { name: "Bootstrap", symbol: "Bo", group: "frontend", logo: "bootstrap", projects: ["bubltown", "pos", "attendance"] },
  { name: "SCSS", symbol: "Sc", group: "frontend", logo: "sass", projects: ["bubltown"] },
  { name: "JavaScript", symbol: "Js", group: "frontend", logo: "javascript", projects: [] },
  { name: "TypeScript", symbol: "Ts", group: "frontend", logo: "typescript", projects: ["bubltown", "lawyer"] },
  { name: "jQuery", symbol: "jQ", group: "frontend", logo: "jquery", projects: [] },

  { name: ".NET Core", symbol: "Nc", group: "backend", logo: "dotnet", projects: ["bubltown", "pos"] },
  { name: "Laravel", symbol: "La", group: "backend", logo: "laravel", projects: ["lawyer"] },
  { name: "Spring Boot", symbol: "Sb", group: "backend", logo: "springboot", projects: ["attendance"] },
  { name: "PHP", symbol: "Ph", group: "backend", logo: "php", projects: ["lawyer"] },
  { name: "REST API", symbol: "Ap", group: "backend", concept: "api", projects: ["bubltown", "attendance"] },

  { name: "SQL Server", symbol: "Ss", group: "databases", concept: "db", projects: ["bubltown"] },
  { name: "MySQL", symbol: "My", group: "databases", logo: "mysql", projects: ["attendance", "lawyer"] },
  { name: "PostgreSQL", symbol: "Pg", group: "databases", logo: "postgresql", projects: [] },
  { name: "MongoDB", symbol: "Mo", group: "databases", logo: "mongodb", projects: [] },
  { name: "Firebase", symbol: "Fb", group: "databases", logo: "firebase", projects: [] },

  { name: "Azure DevOps", symbol: "Az", group: "cloud", concept: "pipeline", projects: ["bubltown"] },
  { name: "AWS", symbol: "Aw", group: "cloud", concept: "cloud", detail: "EMR, Redshift, Hadoop, Glue, S3", projects: [] },
  { name: "Docker", symbol: "Dk", group: "cloud", logo: "docker", projects: [] },
  { name: "Kubernetes", symbol: "Ku", group: "cloud", logo: "kubernetes", projects: [] },

  { name: "Microservices", symbol: "Mi", group: "architecture", concept: "micro", projects: ["bubltown"] },
  { name: "Clean Architecture", symbol: "Ca", group: "architecture", concept: "clean", projects: [] },
  { name: "Domain-Driven Design", symbol: "Dd", group: "architecture", concept: "ddd", projects: [] },
  { name: "CQRS", symbol: "Cq", group: "architecture", concept: "cqrs", projects: [] },
  { name: "MVC", symbol: "Mv", group: "architecture", concept: "mvc", projects: [] },

  { name: "Python", symbol: "Py", group: "data", logo: "python", projects: ["nl2sql"] },
  { name: "SQL", symbol: "Sq", group: "data", concept: "table", projects: ["nl2sql"] },
  { name: "R", symbol: "R", group: "data", logo: "r", projects: [] },
  { name: "Selenium", symbol: "Se", group: "data", logo: "selenium", projects: [] },
  { name: "Linux", symbol: "Li", group: "data", logo: "linux", projects: [] },

  { name: "Redis", symbol: "Rd", group: "search", logo: "redis", projects: [] },
  { name: "Elasticsearch", symbol: "El", group: "search", logo: "elasticsearch", projects: [] },

  { name: "Git", symbol: "Gi", group: "source", logo: "git", projects: [] },
  { name: "Bitbucket", symbol: "Bb", group: "source", logo: "bitbucket", projects: [] },

  { name: "RabbitMQ", symbol: "Rq", group: "tools", logo: "rabbitmq", projects: [] },
  { name: "Postman", symbol: "Pm", group: "tools", logo: "postman", projects: [] },
  { name: "Swagger", symbol: "Sw", group: "tools", logo: "swagger", projects: [] },
  { name: "JMeter", symbol: "Jm", group: "tools", logo: "jmeter", projects: [] },
  { name: "JWT", symbol: "Jw", group: "tools", logo: "jwt", projects: [] },
  { name: "Entity Framework Core", symbol: "Ef", group: "tools", concept: "layers", projects: ["bubltown"] },
];

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  kicker: string;
  description: string; // verbatim or near-verbatim from the résumé
  features: string[]; // condensed from the résumé's bullets
  tech: string[];
  github?: string; // no project repositories are linked in the résumé
  mock: "storefront" | "pos" | "query" | "attendance" | "cases";
};

export const PROJECTS: Project[] = [
  {
    id: "bubltown",
    index: "01",
    title: "Bubltown",
    kicker: "Local commerce platform · Unicom SD",
    description:
      "Built Angular front-end components for a high-traffic e-commerce and local commerce platform. Designed and maintained .NET Core RESTful APIs and a microservices architecture, integrated with the Angular front end to support local authorities and businesses.",
    features: [
      "Angular front-end components for a high-traffic platform",
      "RESTful APIs and microservices on .NET Core",
      "APIs and SQL Server queries optimised for high-concurrency traffic, helping onboard new business clients",
      "Unit tests for backend services; deployed to Azure with CI/CD and sprint workflows in Azure DevOps",
    ],
    tech: ["Angular", "TypeScript", "Bootstrap", "SCSS", ".NET Core", "Entity Framework Core", "SQL Server", "Azure DevOps"],
    mock: "storefront",
  },
  {
    id: "pos",
    index: "02",
    title: "Point-of-Sale System",
    kicker: "Retail POS · MoodForCode",
    description:
      "Assisted in developing a customisable Point-of-Sale (POS) system for retail businesses.",
    features: [
      "Backend features developed in .NET Core",
      "Front-end support with HTML5, CSS3, Bootstrap and Angular",
      "Requirements analysed and new features implemented iteratively with the team",
      "Code reviews and debugging sessions that improved system stability",
    ],
    tech: [".NET Core", "Angular", "Bootstrap", "HTML5", "CSS3"],
    mock: "pos",
  },
  {
    id: "nl2sql",
    index: "03",
    title: "Natural Language to SQL",
    kicker: "MSc research project · Coventry University",
    description:
      "MSc dissertation. Designed and benchmarked four prompting strategies (zero-shot, schema-aware, few-shot, contextual) for natural language-to-SQL generation on the WikiSQL dataset, using a locally hosted Llama model.",
    features: [
      "All experiments run on a locally hosted LLM rather than a cloud API",
      "Accuracy and SQL validity evaluated separately, showing the trade-off between strategies",
      "Few-shot prompting achieved the highest accuracy; schema-aware prompting significantly improved SQL validity",
      "A demo UI built to showcase the system end to end",
    ],
    tech: ["Python", "Llama", "WikiSQL", "SQL"],
    mock: "query",
  },
  {
    id: "attendance",
    index: "04",
    title: "Student Attendance System",
    kicker: "Web application · Java, Spring Boot",
    description: "Built a web application for recording and tracking student attendance.",
    features: [
      "Students and attendance records modelled in a relational MySQL database",
      "REST back end implemented with Spring Boot to serve the web front end",
      "User interface built with Bootstrap",
    ],
    tech: ["Java", "Spring Boot", "Bootstrap", "MySQL", "REST API"],
    mock: "attendance",
  },
  {
    id: "lawyer",
    index: "05",
    title: "Lawyer Web Application",
    kicker: "Web application · Laravel, MySQL, Angular",
    description: "Developed the web front end of a lawyer-focused application in Angular.",
    features: [
      "Angular front end integrated with a Laravel and MySQL back end",
      "Worked across front-end and back-end technologies",
    ],
    tech: ["Angular", "TypeScript", "Laravel", "PHP", "MySQL"],
    mock: "cases",
  },
];

export type TimelineEntry = {
  kind: "work" | "study";
  start: string;
  end: string;
  title: string;
  org: string;
  place?: string;
  points: string[]; // verbatim résumé bullets
};

// Chronological, oldest first. Verbatim from the résumé.
export const EXPERIENCE: TimelineEntry[] = [
  {
    kind: "study",
    start: "2019",
    end: "2023",
    title: "BSc in Information Technology",
    org: "University of Jaffna",
    place: "Sri Lanka",
    points: [],
  },
  {
    kind: "work",
    start: "07/2021",
    end: "07/2022",
    title: "Associate Software Engineer",
    org: "MoodForCode",
    points: [
      "Assisted in the development of a customisable Point-of-Sale (POS) system for retail businesses.",
      "Developed backend features using .NET Core and supported front-end development with HTML5, CSS3, Bootstrap, and Angular.",
      "Participated in code reviews and debugging sessions to identify and resolve defects, improving overall system stability.",
      "Collaborated with the development team to analyse requirements and implement new features iteratively.",
    ],
  },
  {
    kind: "work",
    start: "01/2023",
    end: "02/2025",
    title: "Software Engineer",
    org: "Unicom SD (Pvt) Ltd · Bubltown",
    place: "UK-based company, on-site in Sri Lanka",
    points: [
      "Developed modern front-end components using Angular, TypeScript, Bootstrap, and SCSS for a high-traffic e-commerce and local commerce platform.",
      "Built Angular front-end components for a high-traffic e-commerce and local commerce platform. Designed and maintained .NET Core RESTful APIs and a microservices architecture, integrated with the Angular front end to support local authorities and businesses.",
      "Optimised APIs and database queries to improve performance and support high-concurrency user traffic, contributing to scalable modules that helped onboard new business clients.",
      "Implemented unit testing for backend services, improving code reliability, maintainability, and overall software quality.",
      "Deployed and configured applications on Azure, leveraging cloud infrastructure for scalable, production-grade environments.",
      "Implemented CI/CD pipelines and sprint workflows using Azure DevOps, improving delivery efficiency.",
      "Collaborated with designers, developers, and project managers to deliver high-quality production software on schedule.",
    ],
  },
  {
    kind: "work",
    start: "03/2024",
    end: "01/2025",
    title: "Visiting Lecturer",
    org: "Unicom Tic",
    points: [
      "Delivered lectures on Programming Fundamentals, OOP, DSA, and Web Development (HTML, CSS, Bootstrap, JavaScript, Angular).",
      "Conducted practical sessions on API development with .NET Core and database design with SQL, bridging theory and real-world development.",
      "Mentored students on programming assignments, debugging techniques, and full-stack project development.",
    ],
  },
  {
    kind: "study",
    start: "2025",
    end: "2026",
    title: "MSc in Data Science and Computational Intelligence",
    org: "Coventry University",
    place: "UK",
    points: [
      "Applied machine learning, big data, and NLP techniques across coursework, gaining hands-on experience with AWS services including EMR, Redshift, Hadoop, Glue, and S3.",
      "Research Project: Designed and benchmarked four prompting strategies (zero-shot, schema-aware, few-shot, contextual) for natural language-to-SQL generation using a locally-hosted LLM (Llama), evaluated on the WikiSQL dataset; few-shot prompting achieved the highest accuracy, while schema-aware prompting significantly improved SQL validity; built a demo UI to showcase the system.",
    ],
  },
];

// Verbatim from the résumé's CERTIFICATIONS section. The résumé gives no issuer or dates.
export const CERTIFICATIONS: { title: string }[] = [
  { title: "Diploma in Information Technology" },
  { title: "Diploma in Graphics Designing" },
  { title: "Diploma in AutoCAD" },
  { title: "Diploma in English" },
];

// The résumé has no achievements, rankings or honours, so that section is not rendered.
export const ACHIEVEMENTS: { label: string; value: string }[] = [];

// Lines for the back of the ID card. Drawn from the résumé only.
export const CARD_BACK: string[] = [
  "Full-Stack Software Engineer, 3+ years building web apps and APIs.",
  "Angular and .NET Core, with CQRS, Clean Architecture and microservices.",
  "MSc Data Science & Computational Intelligence, Coventry University.",
  "Built Bubltown and a retail POS system; NL-to-SQL prompting research.",
  "Agile teams, CI/CD pipelines, Azure DevOps and cloud deployment.",
];

export const FACTS: { label: string; value: string; href?: string }[] = [
  { label: "Location", value: "London, UK" },
  { label: "Education", value: "MSc, Coventry University" },
  { label: "Last role", value: "Software Engineer, Unicom SD" },
  { label: "Status", value: "Available for immediate full-time employment" },
  { label: "Email", value: "kanchanajayendran@gmail.com", href: "mailto:kanchanajayendran@gmail.com" },
];

export const PROJECT_BY_ID = Object.fromEntries(PROJECTS.map((p) => [p.id, p])) as Record<ProjectId, Project>;
