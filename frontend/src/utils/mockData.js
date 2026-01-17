// src/utils/mockData.js
const roles = ["Frontend Engineer", "Backend Developer", "Product Designer", "Full Stack Dev", "DevOps Engineer", "Data Scientist", "ML Engineer"];
const companies = ["Clarity", "Google", "Amazon", "Netflix", "Spotify", "Airbnb", "Stripe", "Linear"];
const locations = ["San Francisco", "New York", "London", "Remote", "Berlin", "Toronto"];
const types = ["Full-time", "Contract", "Part-time"];
const skillsList = ["React", "Node.js", "TypeScript", "Python", "AWS", "Figma", "Tailwind", "GraphQL"];

export const generateJobs = (count = 50) => {
  return Array.from({ length: count }, (_, i) => {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const matchScore = Math.floor(Math.random() * (99 - 60) + 60); // 60-99%
    
    return {
      id: `job-${i}`,
      title: role,
      company: companies[Math.floor(Math.random() * companies.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      type: Math.random() > 0.3 ? "Full-time" : (Math.random() > 0.5 ? "Contract" : "Part-time"),
      salary: Math.floor(Math.random() * (200 - 80) + 80) * 1000, // 80k - 200k
      experience: Math.floor(Math.random() * 8), // 0-8 years
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      matchScore: matchScore,
      skills: skillsList.sort(() => 0.5 - Math.random()).slice(0, 3), // Random 3 skills
      isRemote: Math.random() > 0.7,
      description: `We are looking for a talented ${role} to join our team. You will be responsible for building scalable systems...`
    };
  });
};