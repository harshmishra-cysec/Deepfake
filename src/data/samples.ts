import { SampleCandidate } from "../types";

export const SAMPLE_CANDIDATES: SampleCandidate[] = [
  {
    id: "sample-1",
    name: "Priya Sharma",
    title: "Frontend Developer",
    expectedRisk: "Low",
    description: "Genuine match — specific technical terms & practical context",
    resumeSkills: "3 years experience in React, JavaScript, REST APIs, Git",
    interviewAnswer: "I've built several React apps using hooks like useState and useEffect, and I've integrated REST APIs using Axios. I use Git for version control daily, including branching strategies for team projects."
  },
  {
    id: "sample-2",
    name: "Rahul Verma",
    title: "Senior ML Engineer",
    expectedRisk: "High",
    description: "Clear mismatch — generic definitions despite 5 years claimed senior ML experience",
    resumeSkills: "5 years Python, Machine Learning, TensorFlow, Deep Learning",
    interviewAnswer: "Python is a programming language. Machine learning is when computers learn things. I have used it in projects."
  },
  {
    id: "sample-3",
    name: "Ankit Mehta",
    title: "Backend Engineer",
    expectedRisk: "Medium",
    description: "Nuanced edge case — moderate depth, acknowledges reliance on team lead",
    resumeSkills: "4 years Java, Spring Boot, Microservices architecture",
    interviewAnswer: "I've worked with Java and Spring Boot on a few projects. We used microservices, though most of the architecture decisions were made by my team lead. I mainly worked on individual service modules."
  }
];
