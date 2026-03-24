// experiences.ts
export type Experience = {
  id: number;
  title: string;
  company: string;
  date: string;
  description: string;
  skills?: { id: number; title: string }[];
  type: "work" | "education";
};

export const experiences: Experience[] = [
  {
    id: 4,
    title: "Software Engineer",
    company: "Sprout Digital Labs",
    date: "Feb 2025 - Present",
    description: `Currently working as a Software Engineer at Sprout, contributing to the development and maintenance of the platform.`,
    skills: [
      { id: 1, title: "Flutter" },
      { id: 2, title: "NestJS" },
      { id: 3, title: "Next.js" },
    ],
    type: "work",
  },
  {
    id: 2,
    title: "Software Engineer & Technical Leader",
    company: "PT Global Innovation Technology",
    date: "Dec 2023 - Feb 2025",
    description: `Led the end-to-end delivery of multiple web, mobile, and AI-driven products while contributing hands-on across architecture, development, and deployment. Worked on ERP and workshop management systems, SME applications with payment and inventory features, C2C marketplace development, internal project management tools, and AI solutions including monitoring, chatbot, and OCR initiatives.

Built scalable applications using React, Next.js, Express.js, Laravel, React Native, Flutter, and Kotlin, while also supporting DevOps workflows with Docker, Portainer, and GitHub-based CI/CD.`,
    skills: [
      { id: 1, title: "Spring Boot" },
      { id: 2, title: "Laravel" },
      { id: 3, title: "React.js" },
      { id: 4, title: "React Native" },
      { id: 5, title: "Golang" },
      { id: 6, title: "Python" },
      { id: 7, title: "Grafana" },
      { id: 8, title: "AI Integration" },
      { id: 9, title: "Faiss" },
      { id: 10, title: "Tech Leadership" },
      { id: 11, title: "Next.js" },
      { id: 12, title: "Express.js" },
    ],
    type: "work",
  },
  {
    id: 1,
    title: "IT Intern Mobile Developer",
    company: "PT Media Kreasi Abadi",
    date: "Feb 2022 - Jul 2022",
    description: `Developed EduFams, a mobile application serving the Balikpapan community,
from initial development to successful PlayStore publication.

Gained hands-on experience in the complete mobile app development lifecycle,
including requirement analysis, development, testing, and deployment.

Utilized Agile methodology with Kanban for efficient project management.`,
    skills: [
      { id: 1, title: "Android Studio" },
      { id: 2, title: "Kotlin" },
      { id: 3, title: "Kanban" },
    ],
    type: "work",
  },
  {
    id: 3,
    title: "Bachelors Degree in Informatics",
    company: "Universitas Budiluhur",
    date: "2019 - 2023",
    description: `Graduated with a degree in Informatics Engineering,
specializing in Expert Programming.

Gained comprehensive knowledge in:
- Game development
- Algorithms
- Mobile applications
- Web development
- Machine learning

Completed various hands-on projects across multiple programming domains.`,
    type: "education",
    skills: [
      { id: 1, title: "Algorithms" },
      { id: 2, title: "Mobile Applications" },
      { id: 3, title: "Web Development" },
      { id: 4, title: "Machine Learning" },
    ],
  },
];
