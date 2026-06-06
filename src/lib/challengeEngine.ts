import { ChallengeDefinition, UserChallenge, ChallengeTaskLog, Badge } from "./types";
import { generateId, saveUserBadge, addWellnessPoints, saveUserChallenge, getHealthProfile } from "./storage";

export const AVAILABLE_CHALLENGES: ChallengeDefinition[] = [
  {
    id: "c_hydration_7",
    title: "7-Day Hydration Challenge",
    goal: "Drink recommended daily water intake.",
    durationDays: 7,
    icon: "💧",
    gradient: "from-blue-500 to-cyan-600",
    difficulty: "Beginner",
    expectedBenefits: ["Better Skin", "Higher Energy", "Improved Digestion"],
    tasksDescription: "Upload a photo of your water bottle daily.",
    rewardBadge: "Hydration Hero",
    points: 100
  },
  {
    id: "c_protein_14",
    title: "14-Day Protein Challenge",
    goal: "Meet daily protein targets.",
    durationDays: 14,
    icon: "💪",
    gradient: "from-red-500 to-orange-600",
    difficulty: "Intermediate",
    expectedBenefits: ["Muscle Growth", "Faster Recovery", "Sustained Energy"],
    tasksDescription: "Log a high-protein meal photo daily.",
    rewardBadge: "Protein Master",
    points: 200
  },
  {
    id: "c_focus_7",
    title: "Student Focus Challenge",
    goal: "Improve nutrition, hydration, and sleep before exams.",
    durationDays: 7,
    icon: "🧠",
    gradient: "from-purple-500 to-indigo-600",
    difficulty: "Advanced",
    expectedBenefits: ["Laser Focus", "Memory Retention", "Reduced Stress"],
    tasksDescription: "Complete daily brain-food meals and 8h sleep checks.",
    rewardBadge: "Focus Champion",
    points: 150
  },
  {
    id: "c_plate_14",
    title: "Healthy Plate Challenge",
    goal: "Eat balanced meals for 14 days.",
    durationDays: 14,
    icon: "🥗",
    gradient: "from-emerald-500 to-green-600",
    difficulty: "Intermediate",
    expectedBenefits: ["Weight Management", "Better Mood", "Heart Health"],
    tasksDescription: "Upload a photo of a balanced Gursha plate.",
    rewardBadge: "Plate Master",
    points: 200
  },
  {
    id: "c_movement_30",
    title: "Daily Movement Challenge",
    goal: "Walk or exercise every day.",
    durationDays: 30,
    icon: "🚶",
    gradient: "from-yellow-400 to-orange-500",
    difficulty: "Beginner",
    expectedBenefits: ["Cardio Health", "Endurance", "Mental Clarity"],
    tasksDescription: "Upload a screenshot of your step count or a gym selfie.",
    rewardBadge: "Fitness Warrior",
    points: 500
  }
];

export function startChallenge(challengeId: string): UserChallenge {
  const def = AVAILABLE_CHALLENGES.find(c => c.id === challengeId);
  if (!def) throw new Error("Challenge not found");

  const startDate = new Date().toISOString().slice(0, 10);
  const end = new Date();
  end.setDate(end.getDate() + def.durationDays);

  const userChallenge: UserChallenge = {
    id: generateId(),
    challengeId,
    startDate,
    expectedEndDate: end.toISOString().slice(0, 10),
    currentStreak: 0,
    longestStreak: 0,
    completionPercentage: 0,
    status: 'Active',
    logs: {}
  };

  saveUserChallenge(userChallenge);
  return userChallenge;
}

// Simulated AI Verification
export async function verifyChallengeTask(photoBase64: string, challengeId: string): Promise<{ score: number, status: 'Completed' | 'Needs Review' }> {
  // Simulate AI latency
  await new Promise(r => setTimeout(r, 1500));
  
  // Fake AI confidence score between 80 and 99
  const score = Math.floor(Math.random() * 20) + 80;
  
  return {
    score,
    status: score > 85 ? 'Completed' : 'Needs Review'
  };
}

export function logDailyTask(userChallenge: UserChallenge, date: string, photoBase64: string, aiResult: {score: number, status: string}): UserChallenge {
  const def = AVAILABLE_CHALLENGES.find(c => c.id === userChallenge.challengeId);
  if (!def) return userChallenge;

  const log: ChallengeTaskLog = {
    date,
    photoUrl: photoBase64,
    aiVerificationScore: aiResult.score,
    status: aiResult.status as any
  };

  userChallenge.logs[date] = log;
  
  // Calculate streaks
  const logDates = Object.keys(userChallenge.logs).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  
  for (let i = 0; i < logDates.length; i++) {
    currentStreak++;
    if (currentStreak > longestStreak) longestStreak = currentStreak;
  }
  
  userChallenge.currentStreak = currentStreak;
  userChallenge.longestStreak = longestStreak;
  userChallenge.completionPercentage = Math.min(100, Math.round((logDates.length / def.durationDays) * 100));

  // Add Points
  addWellnessPoints(20); // 20 points per daily upload

  if (userChallenge.completionPercentage >= 100 && userChallenge.status === 'Active') {
    userChallenge.status = 'Completed';
    addWellnessPoints(def.points); // Completion points
    
    // Grant badge
    const badge: Badge = {
      id: `badge_${def.id}`,
      title: def.rewardBadge,
      description: `Completed the ${def.title}`,
      icon: def.icon,
      unlockedAt: new Date().toISOString()
    };
    saveUserBadge(badge);
  }

  saveUserChallenge(userChallenge);
  return userChallenge;
}

// AI Habit Predictor
export function predictChallengeSuccess(userChallenge: UserChallenge): { probability: number, insights: string[] } {
  const def = AVAILABLE_CHALLENGES.find(c => c.id === userChallenge.challengeId);
  const profile = getHealthProfile();
  
  let probability = 60; // Base probability
  const insights: string[] = [];

  if (userChallenge.currentStreak > 3) {
    probability += 20;
    insights.push("You're on a solid streak! Momentum is heavily in your favor.");
  } else if (userChallenge.currentStreak === 0 && Object.keys(userChallenge.logs).length > 0) {
    probability -= 15;
    insights.push("You missed a recent task. Don't let a gap break your habit forming process!");
  }

  if (profile?.activityLevel === 'active' || profile?.activityLevel === 'moderate') {
    probability += 10;
  }

  // Cap between 10 and 99
  probability = Math.min(99, Math.max(10, probability));

  if (probability > 85) {
    insights.push(`Your current consistency suggests a ${probability}% chance of completing the challenge.`);
  } else {
    insights.push("You tend to miss tasks on weekends. Consider setting an early morning reminder.");
  }

  return { probability, insights };
}
