import { About, Blog, Gallery, GameZone, Home, Lab, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Shipra",
  lastName: "Soni",
  name: `Shipra Soni`,
  role: "Business Development Manager",
  avatar: "/images/avatar.jpeg",
  email: "its.shiprasoni@gmail.com",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Hindi"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Insights about business development, growth strategies, and building meaningful business relationships</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/shipra-soni-9aa495394/",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/shipra5oni/",
    essential: true,
  },
  {
    name: "Threads",
    icon: "threads",
    link: "https://www.threads.com/@shipra5oni",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.png",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Connecting business goals with practical execution</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">DigiDelv</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/digidelv-client-onboarding",
  },
  subline: (
    <>
    Shipra is a Business Development Manager at <Text as="span" size="xl" weight="strong">DigiDelv</Text>, focusing on understanding business challenges <br /> and connecting them with the right digital solutions.
</>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Shipra works in business development, focusing on understanding people, problems, and possibilities before talking about solutions.
        Her strength lies in connecting business goals with practical execution. She enjoys working closely with founders, startups, and teams
        to understand how they operate, where they struggle, and what they need to grow sustainably. She approaches business development with
        a mix of structured thinking and empathy, helping stakeholders make confident decisions without complexity or pressure.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "DigiDelv",
        timeframe: "Dec 2025 - Present",
        role: "Business Development Manager",
        achievements: [
          <>
            Work closely with the internal team and external stakeholders to identify business needs and map them to the right technology solutions.
          </>,
          <>
            Engage with founders and decision-makers to understand workflows, pain points, and operational gaps, helping position DigiDelv's custom-built software, internal systems, and automation tools as long-term solutions.
          </>,
          <>
            Focus on clear communication, requirement discovery, and relationship building, ensuring clients see DigiDelv as a trusted technology partner, not just a service provider.
          </>,
          <>
            Involved in requirement discovery, solution positioning, and client communication, ensuring clarity from the first conversation.
          </>,
          <>
            Building long-term relationships based on trust, transparency, and value rather than transactional selling.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Vikram University, Ujjain",
        description: <>Master's degree in Entrepreneurship/Entrepreneurial Studies (May 2021 - Jun 2024). Grade: A</>,
      },
      {
        name: "Vikram University, Ujjain",
        description: <>Bachelor of Commerce (BCom) in Business/Commerce, General (Aug 2019 - Apr 2021). Grade: A</>,
      },
      {
        name: "Sefiyah Higher Secondary School, Ratangarh",
        description: <>Middle School Diploma. Grade: A</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Skills & Expertise",
    skills: [
      {
        title: "Business Development",
        description: (
          <>Expert in understanding business challenges and connecting them with the right digital solutions. Skilled in requirement discovery, solution positioning, and client communication. Focused on building long-term relationships based on trust, transparency, and value.</>
        ),
        tags: [],
        images: [],
      },
      {
        title: "Project Management",
        description: (
          <>Experienced in working closely with founders, startups, and teams to understand how they operate, where they struggle, and what they need to grow sustainably. Structured thinking combined with empathy to help stakeholders make confident decisions.</>
        ),
        tags: [],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpeg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpeg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpeg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

const gamezone: GameZone = {
  path: "/gamezone",
  label: "GameZone",
  title: `GameZone – ${person.name}`,
  description: `Play interactive games in ${person.name}'s portfolio`,
  image: "/images/og/gamezone.png",
};

const lab: Lab = {
  path: "/lab",
  label: "Lab",
  title: `Lab – ${person.name}`,
  description: `Visual experiments, coding experiments, animations, and creative learnings by ${person.name}`,
  experiments: [
    // First experiment - Redux Visualizer (Active)
    {
      id: "redux-visualizer",
      title: "Redux Pattern Visualizer",
      description: "Interactive step-by-step visualization of how Redux state management works",
      thumbnail: "/images/gallery/horizontal-1.jpeg",
      category: "learning",
      orientation: "horizontal",
      tags: ["Redux", "State Management", "React"],
      status: "in-progress",
    },
    {
      id: "canvas-animations",
      title: "Canvas Animations",
      description: "Creative coding with HTML5 Canvas API",
      thumbnail: "/images/gallery/vertical-4.jpeg",
      category: "visual",
      orientation: "vertical",
      tags: ["Canvas", "JavaScript"],
      status: "brewing",
    },
    {
      id: "threejs-particles",
      title: "3D Particle System",
      description: "Interactive particle animations with Three.js",
      thumbnail: "/images/gallery/horizontal-2.jpeg",
      category: "coding",
      orientation: "horizontal",
      tags: ["Three.js", "WebGL"],
      status: "brewing",
    },
    {
      id: "ai-prompt-engineering",
      title: "Prompt Engineering",
      description: "Experiments with AI prompts and Claude",
      thumbnail: "/images/gallery/horizontal-4.jpeg",
      category: "ai",
      orientation: "horizontal",
      tags: ["AI", "Claude"],
      status: "risky",
    },
    {
      id: "svg-morphing",
      title: "SVG Path Morphing",
      description: "Smooth shape transitions using SVG path animations",
      thumbnail: "/images/gallery/vertical-2.jpeg",
      category: "animation",
      orientation: "vertical",
      tags: ["SVG", "Animation"],
      status: "brewing",
    },
    {
      id: "css-grid-layouts",
      title: "Advanced CSS Grid",
      description: "Complex responsive layouts with CSS Grid",
      thumbnail: "/images/gallery/horizontal-3.jpeg",
      category: "learning",
      orientation: "horizontal",
      tags: ["CSS", "Layout"],
      status: "brewing",
    },
    {
      id: "react-hooks-patterns",
      title: "Custom React Hooks",
      description: "Building reusable hooks for common patterns",
      thumbnail: "/images/gallery/vertical-3.jpeg",
      category: "coding",
      orientation: "vertical",
      tags: ["React", "Hooks"],
      status: "brewing",
    },
    {
      id: "framer-motion-basics",
      title: "Framer Motion Animations",
      description: "Learning smooth animations with Framer Motion library",
      thumbnail: "/images/gallery/vertical-1.jpeg",
      category: "animation",
      orientation: "vertical",
      tags: ["React", "Animation"],
      status: "brewing",
    },
    {
      id: "css-glassmorphism",
      title: "Glassmorphism Effects",
      description: "Exploring glass-like UI effects with CSS backdrop filters",
      thumbnail: "/images/gallery/horizontal-1.jpeg",
      category: "visual",
      orientation: "horizontal",
      tags: ["CSS", "UI Design"],
      status: "destroyed",
    },
    {
      id: "webgl-shaders",
      title: "WebGL Shader Art",
      description: "Creating stunning visual effects with GLSL shaders",
      thumbnail: "/images/gallery/vertical-1.jpeg",
      category: "visual",
      orientation: "vertical",
      tags: ["WebGL", "GLSL", "Shaders"],
      status: "brewing",
    },
    {
      id: "gsap-scroll-animations",
      title: "GSAP Scroll Triggers",
      description: "Scroll-based animations with GreenSock Animation Platform",
      thumbnail: "/images/gallery/horizontal-1.jpeg",
      category: "animation",
      orientation: "horizontal",
      tags: ["GSAP", "Scroll", "Animation"],
      status: "brewing",
    },
    {
      id: "typescript-patterns",
      title: "TypeScript Design Patterns",
      description: "Implementing design patterns in TypeScript",
      thumbnail: "/images/gallery/vertical-2.jpeg",
      category: "learning",
      orientation: "vertical",
      tags: ["TypeScript", "Patterns"],
      status: "brewing",
    },
    {
      id: "ai-image-generation",
      title: "AI Image Generation",
      description: "Exploring Stable Diffusion and DALL-E APIs",
      thumbnail: "/images/gallery/horizontal-2.jpeg",
      category: "ai",
      orientation: "horizontal",
      tags: ["AI", "Image", "API"],
      status: "brewing",
    },
    {
      id: "react-spring-physics",
      title: "React Spring Physics",
      description: "Physics-based animations with react-spring library",
      thumbnail: "/images/gallery/vertical-3.jpeg",
      category: "animation",
      orientation: "vertical",
      tags: ["React", "Physics", "Animation"],
      status: "brewing",
    },
    {
      id: "css-houdini",
      title: "CSS Houdini Magic",
      description: "Extending CSS with Houdini Paint API",
      thumbnail: "/images/gallery/horizontal-3.jpeg",
      category: "visual",
      orientation: "horizontal",
      tags: ["CSS", "Houdini", "Paint API"],
      status: "destroyed",
    },
    {
      id: "node-streams",
      title: "Node.js Streams",
      description: "Understanding streams and buffers in Node.js",
      thumbnail: "/images/gallery/vertical-4.jpeg",
      category: "coding",
      orientation: "vertical",
      tags: ["Node.js", "Streams"],
      status: "brewing",
    },
    {
      id: "llm-fine-tuning",
      title: "LLM Fine-Tuning",
      description: "Fine-tuning language models for specific tasks",
      thumbnail: "/images/gallery/horizontal-4.jpeg",
      category: "ai",
      orientation: "horizontal",
      tags: ["AI", "LLM", "Fine-tuning"],
      status: "risky",
    },
    {
      id: "css-container-queries",
      title: "Container Queries",
      description: "Modern responsive design with CSS container queries",
      thumbnail: "/images/gallery/vertical-1.jpeg",
      category: "learning",
      orientation: "vertical",
      tags: ["CSS", "Responsive"],
      status: "brewing",
    },
    {
      id: "lottie-animations",
      title: "Lottie Animations",
      description: "Implementing After Effects animations on web",
      thumbnail: "/images/gallery/horizontal-1.jpeg",
      category: "animation",
      orientation: "horizontal",
      tags: ["Lottie", "After Effects"],
      status: "brewing",
    },
    {
      id: "rust-wasm",
      title: "Rust + WebAssembly",
      description: "High-performance web apps with Rust and WASM",
      thumbnail: "/images/gallery/vertical-2.jpeg",
      category: "coding",
      orientation: "vertical",
      tags: ["Rust", "WebAssembly"],
      status: "brewing",
    },
    {
      id: "rag-systems",
      title: "RAG Systems",
      description: "Building Retrieval-Augmented Generation pipelines",
      thumbnail: "/images/gallery/horizontal-2.jpeg",
      category: "ai",
      orientation: "horizontal",
      tags: ["AI", "RAG", "LLM"],
      status: "brewing",
    },
    {
      id: "svg-filters",
      title: "SVG Filter Effects",
      description: "Creating complex visual effects with SVG filters",
      thumbnail: "/images/gallery/vertical-3.jpeg",
      category: "visual",
      orientation: "vertical",
      tags: ["SVG", "Filters"],
      status: "brewing",
    },
    {
      id: "web-workers",
      title: "Web Workers Deep Dive",
      description: "Offloading heavy computations to background threads",
      thumbnail: "/images/gallery/horizontal-3.jpeg",
      category: "coding",
      orientation: "horizontal",
      tags: ["JavaScript", "Web Workers"],
      status: "brewing",
    },
    {
      id: "css-scroll-snap",
      title: "CSS Scroll Snap",
      description: "Creating smooth scrolling experiences",
      thumbnail: "/images/gallery/vertical-4.jpeg",
      category: "learning",
      orientation: "vertical",
      tags: ["CSS", "Scroll"],
      status: "brewing",
    },
    {
      id: "motion-one",
      title: "Motion One Library",
      description: "Lightweight animation library exploration",
      thumbnail: "/images/gallery/horizontal-4.jpeg",
      category: "animation",
      orientation: "horizontal",
      tags: ["Animation", "Motion One"],
      status: "brewing",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery, gamezone, lab };
