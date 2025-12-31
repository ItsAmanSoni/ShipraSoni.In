import { baseURL, person, schema, sameAs } from "@/resources";

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    email: person.email,
    image: `${baseURL}${person.avatar}`,
    url: baseURL,
    sameAs: Object.values(sameAs).filter(Boolean),
    knowsAbout: [
      "Full Stack Development",
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Prompt Engineering",
      "AI Development",
      "Software Engineering",
    ],
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": schema.type,
    name: schema.name,
    description: schema.description,
    url: baseURL,
    email: schema.email,
    founder: {
      "@type": "Person",
      name: person.name,
    },
    sameAs: Object.values(sameAs).filter(Boolean),
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing work as a ${person.role}`,
    url: baseURL,
    author: {
      "@type": "Person",
      name: person.name,
    },
    publisher: {
      "@type": "Person",
      name: person.name,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseURL}${item.url}`,
    })),
  };
}

export function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: generatePersonSchema(),
    url: `${baseURL}/about`,
    name: `About ${person.name}`,
    description: `Learn more about ${person.name}, ${person.role}`,
  };
}
