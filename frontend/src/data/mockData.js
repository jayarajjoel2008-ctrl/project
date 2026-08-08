// ABTALKS 2.0 Mock Data Layer

export const INITIAL_USER_PROFILE = {
  name: "Arvind",
  role: "60-DAY BUILDER",
  avatar: "⚡",
  track: "Full Stack Development",
  college: "IIT Madras / Tech Student",
  currentDay: 12,
  totalDays: 60,
  completedDaysCount: 47,
  githubProofsCount: 44,
  linkedinPostsCount: 42,
  currentStreak: 11,
  bestStreak: 18,
  missedDay: 11, // Day 11 missed for Streak Rescue feature demo
  isStreakRescued: false,
  consistencyScore: 86,
  scoreBreakdown: {
    dailyBuilds: 92,
    githubProof: 88,
    linkedinProof: 79,
    challengeCompletion: 90
  },
  skills: ["React", "JavaScript", "Python", "APIs", "Git", "Problem Solving"]
};

export const ACHIEVEMENTS = [
  { id: 'milestone-15', icon: '⚡', title: '15 Day Milestone', desc: 'Complete 15 daily challenge builds', unlocked: false, rarity: 'RARE', points: 250, target: 15, type: 'days' },
  { id: 'milestone-30', icon: '🏆', title: '30 Day Milestone', desc: 'Cross the 50% challenge mark (30 Days)', unlocked: false, rarity: 'EPIC', points: 500, target: 30, type: 'days' },
  { id: 'milestone-45', icon: '💎', title: '45 Day Milestone', desc: 'Cross the 75% challenge milestone (45 Days)', unlocked: false, rarity: 'EPIC', points: 750, target: 45, type: 'days' },
  { id: 'mastery-60', icon: '👑', title: '60 Day Milestone', desc: 'Complete all 60 daily challenges', unlocked: false, rarity: 'LEGENDARY', points: 1000, target: 60, type: 'days' },
  { id: 'streak-7', icon: '🔥', title: '7 Day Streak', desc: 'Maintain 7 consecutive build days', unlocked: true, rarity: 'RARE', points: 150, target: 7, type: 'streak' },
  { id: 'builds-10', icon: '🏗️', title: '10 Builds Milestone', desc: 'Complete 10 full daily projects', unlocked: true, rarity: 'UNCOMMON', points: 100, target: 10, type: 'days' },
  { id: 'posts-10', icon: '📢', title: '10 Public Posts', desc: 'Share 10 proof posts on LinkedIn', unlocked: true, rarity: 'RARE', points: 200, target: 10, type: 'posts' },
  { id: 'github-builder', icon: '💻', title: 'GitHub Builder', desc: 'Push 40+ commits to public repos', unlocked: false, rarity: 'EPIC', points: 300, target: 40, type: 'github' }
];

export const CHALLENGES = Array.from({ length: 60 }, (_, i) => {
  const dayNum = i + 1;
  
  if (dayNum === 12) {
    return {
      day: 12,
      title: "Build an AI Weather Assistant",
      difficulty: "Intermediate",
      estimatedTime: "30 min",
      skills: ["React", "JavaScript", "API Integration", "UI Design"],
      objective: "Build a small weather application that retrieves weather information from an API and presents the result in a clean interface.",
      checklist: [
        { id: 1, text: "Search city by user input", completed: true },
        { id: 2, text: "Fetch weather data from OpenWeather API", completed: true },
        { id: 3, text: "Display temperature & weather condition", completed: false },
        { id: 4, text: "Display humidity & wind speed metrics", completed: false },
        { id: 5, text: "Add responsive UI with dark mode styling", completed: false }
      ],
      githubRepoUrl: "https://github.com/arvind/ai-weather-assistant",
      githubCommitUrl: "https://github.com/arvind/ai-weather-assistant/commit/8a72b",
      linkedinUrl: "https://linkedin.com/posts/arvind-day12-weather-ai-build",
      submitted: false
    };
  }

  return {
    day: dayNum,
    title: `Day ${dayNum}: ${getDayTitle(dayNum)}`,
    difficulty: dayNum < 15 ? "Beginner" : dayNum < 40 ? "Intermediate" : "Advanced",
    estimatedTime: `${15 + (dayNum % 3) * 10} min`,
    skills: getDaySkills(dayNum),
    objective: `Complete today's coding exercise for Day ${dayNum}. Build a working component or service and push your proof to GitHub and LinkedIn.`,
    checklist: [
      { id: 1, text: "Initialize repository & components", completed: dayNum < 12 },
      { id: 2, text: "Implement core business logic & functions", completed: dayNum < 12 },
      { id: 3, text: "Add error handling and UI polish", completed: dayNum < 12 }
    ],
    githubRepoUrl: dayNum < 12 ? `https://github.com/arvind/day-${dayNum}-project` : "",
    githubCommitUrl: dayNum < 12 ? `https://github.com/arvind/day-${dayNum}-project/commit/abc` : "",
    linkedinUrl: dayNum < 12 ? `https://linkedin.com/posts/arvind-day-${dayNum}-build` : "",
    submitted: dayNum < 12
  };
});

function getDayTitle(day) {
  const titles = [
    "Portfolio Setup & Personal Landing",
    "CSS Flexbox & Grid Masterclass",
    "Interactive JS Calculator",
    "DOM Manipulation Todo App",
    "Fetch API Weather Widget",
    "Async/Await Currency Converter",
    "Local Storage Note Taking App",
    "React Component Hierarchy",
    "React Hooks State Management",
    "Tailwind UI Dashboard Cards",
    "Express.js Server Setup",
    "Build an AI Weather Assistant",
    "REST API Endpoints & Postman",
    "MongoDB Database Schema",
    "JWT Auth & Session Cookies",
    "Socket.IO Live Chat Server",
    "Redux Toolkit Global State",
    "Framer Motion Page Animations",
    "Next.js Server Side Rendering",
    "TypeScript Interfaces & Types"
  ];
  return titles[(day - 1) % titles.length] || `Feature Module #${day}`;
}

function getDaySkills(day) {
  const skillSets = [
    ["HTML", "CSS", "Git"],
    ["JavaScript", "DOM", "CSS Grid"],
    ["React", "Hooks", "CSS Modules"],
    ["Node.js", "Express", "REST API"],
    ["MongoDB", "Mongoose", "Backend"],
    ["Python", "Pandas", "Analytics"],
    ["Docker", "DevOps", "CI/CD"]
  ];
  return skillSets[(day - 1) % skillSets.length];
}

export const FAQS = [
  {
    q: "What is ABTalks 2.0?",
    a: "ABTalks 2.0 is a 60-day coding challenge platform for Indian college students. You build a real project every day, submit GitHub & LinkedIn proof of work, and turn 60 days into a public builder portfolio recruiters can see."
  },
  {
    q: "Who can join?",
    a: "Any college student or self-taught developer! Whether you're a first-year beginner or a final-year student preparing for placements, the challenge progressively builds your skills."
  },
  {
    q: "How much time does a challenge take?",
    a: "Between 10 to 30 minutes per day. Tasks are designed to be bite-sized, high-impact, and easy to fit around your college schedule and semester exams."
  },
  {
    q: "What happens if I miss a day?",
    a: "You won't be punished! ABTalks 2.0 features 'Streak Rescue' — complete a quick recovery challenge to get right back on track without losing your momentum."
  },
  {
    q: "Why do I need GitHub proof?",
    a: "GitHub proof creates a verifiable commit history. Recruiters look for green contribution squares and public code to evaluate your real coding discipline."
  },
  {
    q: "Why do I need LinkedIn proof?",
    a: "LinkedIn posts build your personal brand in public. Documenting your 60-day journey publicly gets you noticed by hiring managers, founders, and recruiters."
  },
  {
    q: "Can beginners participate?",
    a: "Absolutely! Day 1 starts with basic setup and layout. Challenges gradually scale in complexity so you build confidence step-by-step."
  }
];

export const MOCK_BUILD_BUDDY_RESPONSES = {
  hint: "💡 **Build Buddy Hint**: Start by defining state for `city` and `weatherData`. Use `fetch()` inside a submit handler to request data from OpenWeather API when the user presses Enter.",
  explain: "📖 **Requirement Explanation**: You need to create an input box for the city name. When submitted, request current temperature, weather condition (e.g. Sunny/Rainy), and humidity, then render them in a styled card.",
  breakdown: "🧩 **Step-by-step Breakdown**:\n1. Identify input parameter (city name string).\n2. Perform fetch request to API endpoint.\n3. Extract temperature in Celsius.\n4. Render results cleanly in responsive card UI.",
  review: "🔍 **Approach Review**: Your approach looks great! Make sure to add a loading spinner while fetching and handle invalid city search errors gracefully."
};
