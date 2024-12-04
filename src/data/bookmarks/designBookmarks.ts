import { Bookmark } from "@/types/bookmark";

export const designBookmarks: Bookmark[] = [
  {
    id: "22",
    title: "UI/UX Design Principles",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    dateAdded: Date.now() - 15000000,
    category: "Design",
    description: "Design fundamentals",
    tags: ["design", "UI", "UX"],
    summary: "Essential principles and best practices for creating effective user interfaces.",
  },
  {
    id: "23",
    title: "Effective CSS",
    url: "https://images.unsplash.com/photo-1524504372235-e8f2a43eb2f7",
    dateAdded: Date.now() - 22000000,
    category: "Design",
    description: "CSS best practices",
    tags: ["css", "design", "web"],
    summary: "Learn the best practices for writing CSS that is maintainable and scalable.",
  },
  {
    id: "24",
    title: "The Art of SEO",
    url: "https://images.unsplash.com/photo-1519072031826-b9e5b60ead7e",
    dateAdded: Date.now() - 23000000,
    category: "Marketing",
    description: "Fundamentals of SEO",
    tags: ["seo", "marketing", "growth"],
    summary: "Comprehensive guide to search engine optimization strategies.",
  },
  {
    id: "25",
    title: "The Future of JavaScript",
    url: "https://images.unsplash.com/photo-1550791961-d0e6e3b08ce5",
    dateAdded: Date.now() - 24000000,
    category: "Development",
    description: "Trends and future in JavaScript",
    tags: ["javascript", "future", "development"],
    summary: "Explore the trends that are shaping the future of JavaScript.",
  }
];
