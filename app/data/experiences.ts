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
    id: 2,
    title: "Software Engineer & Tech Lead",
    company: "PT Global Information Technology",
    date: "Dec 2023 - Present",
    description: `Tech Lead managing six key projects:
- Estatement (motorcycle parts management system)
- Kejar Tugas (internal project management tool)
- AI-powered Grafana monitoring system
- Tukerin (C2C marketplace MVP)
- Customer service chatbot (AI initiative)
- OCR system (AI initiative)

Demonstrated excellence in both technical leadership and hands-on development
using Waterfall methodology.`,
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
