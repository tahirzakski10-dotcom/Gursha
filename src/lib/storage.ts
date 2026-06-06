// ============================================================================
// GURSHA — LOCAL STORAGE PERSISTENCE LAYER
// ============================================================================

import type { HealthProfile, MealLog, DailySummary } from './types';

const KEYS = {
  HEALTH_PROFILE: 'gursha_health_profile',
  MEAL_HISTORY: 'gursha_meal_history',
  DAILY_SUMMARIES: 'gursha_daily_summaries',
  ONBOARDING_DONE: 'gursha_onboarding_done',
  USER_CHALLENGES: 'gursha_user_challenges',
  USER_BADGES: 'gursha_user_badges',
  FAVORITE_RESTAURANTS: 'gursha_favorite_restaurants',
  RECENTLY_VISITED: 'gursha_recently_visited',
};

// --- Health Profile ---

export function saveHealthProfile(profile: HealthProfile): void {
  localStorage.setItem(KEYS.HEALTH_PROFILE, JSON.stringify(profile));
}

export function getHealthProfile(): HealthProfile | null {
  const data = localStorage.getItem(KEYS.HEALTH_PROFILE);
  return data ? JSON.parse(data) : null;
}

// --- Onboarding ---

export function setOnboardingDone(): void {
  localStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true';
}

// --- Meal History ---

export function saveMealLog(meal: MealLog): void {
  const history = getMealHistory();
  history.push(meal);
  localStorage.setItem(KEYS.MEAL_HISTORY, JSON.stringify(history));
}

export function getMealHistory(): MealLog[] {
  const data = localStorage.getItem(KEYS.MEAL_HISTORY);
  return data ? JSON.parse(data) : [];
}

export function deleteMealLog(id: string): void {
  const history = getMealHistory().filter((m) => m.id !== id);
  localStorage.setItem(KEYS.MEAL_HISTORY, JSON.stringify(history));
}

export function getTodaysMeals(): MealLog[] {
  const today = new Date().toISOString().slice(0, 10);
  return getMealHistory().filter((m) => m.timestamp.slice(0, 10) === today);
}

export function getMealsByDate(date: string): MealLog[] {
  return getMealHistory().filter((m) => m.timestamp.slice(0, 10) === date);
}

export function getLastNDaysMeals(n: number): MealLog[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - n);
  const cutoffISO = cutoff.toISOString();
  return getMealHistory().filter((m) => m.timestamp >= cutoffISO);
}

// --- Daily Summaries ---

export function saveDailySummary(summary: DailySummary): void {
  const summaries = getDailySummaries();
  const idx = summaries.findIndex((s) => s.date === summary.date);
  if (idx >= 0) {
    summaries[idx] = summary;
  } else {
    summaries.push(summary);
  }
  localStorage.setItem(KEYS.DAILY_SUMMARIES, JSON.stringify(summaries));
}

export function getDailySummaries(): DailySummary[] {
  const data = localStorage.getItem(KEYS.DAILY_SUMMARIES);
  return data ? JSON.parse(data) : [];
}

export function getTodaysSummary(): DailySummary | null {
  const today = new Date().toISOString().slice(0, 10);
  return getDailySummaries().find((s) => s.date === today) || null;
}

// --- Utility ---

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function clearAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

// --- Challenges & Gamification ---

import type { UserChallenge, Badge } from './types';

export function getUserChallenges(): UserChallenge[] {
  const data = localStorage.getItem(KEYS.USER_CHALLENGES);
  return data ? JSON.parse(data) : [];
}

export function saveUserChallenge(challenge: UserChallenge): void {
  const challenges = getUserChallenges();
  const idx = challenges.findIndex((c) => c.id === challenge.id);
  if (idx >= 0) {
    challenges[idx] = challenge;
  } else {
    challenges.push(challenge);
  }
  localStorage.setItem(KEYS.USER_CHALLENGES, JSON.stringify(challenges));
}

export function getUserBadges(): Badge[] {
  const data = localStorage.getItem(KEYS.USER_BADGES);
  return data ? JSON.parse(data) : [];
}

export function saveUserBadge(badge: Badge): void {
  const badges = getUserBadges();
  if (!badges.find((b) => b.id === badge.id)) {
    badges.push(badge);
    localStorage.setItem(KEYS.USER_BADGES, JSON.stringify(badges));
  }
}

export function addWellnessPoints(points: number): void {
  const profile = getHealthProfile();
  if (profile) {
    profile.totalPoints = (profile.totalPoints || 0) + points;
    
    // Level up logic (every 500 points)
    const newLevel = Math.floor(profile.totalPoints / 500) + 1;
    profile.level = newLevel;
    
    saveHealthProfile(profile);
  }
}

// --- Favorite Restaurants ---

export function getFavoriteRestaurants(): string[] {
  const data = localStorage.getItem(KEYS.FAVORITE_RESTAURANTS);
  return data ? JSON.parse(data) : [];
}

export function saveFavoriteRestaurant(id: string): void {
  const favs = getFavoriteRestaurants();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem(KEYS.FAVORITE_RESTAURANTS, JSON.stringify(favs));
  }
}

export function removeFavoriteRestaurant(id: string): void {
  const favs = getFavoriteRestaurants().filter((f) => f !== id);
  localStorage.setItem(KEYS.FAVORITE_RESTAURANTS, JSON.stringify(favs));
}

export function isFavoriteRestaurant(id: string): boolean {
  return getFavoriteRestaurants().includes(id);
}

// --- Recently Visited Restaurants ---

export function getRecentlyVisited(): string[] {
  const data = localStorage.getItem(KEYS.RECENTLY_VISITED);
  return data ? JSON.parse(data) : [];
}

export function addRecentlyVisited(id: string): void {
  let recent = getRecentlyVisited().filter((r) => r !== id);
  recent.unshift(id); // Most recent first
  recent = recent.slice(0, 10); // Keep last 10
  localStorage.setItem(KEYS.RECENTLY_VISITED, JSON.stringify(recent));
}

