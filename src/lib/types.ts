// ============================================================================
// GURSHA AI NUTRITION SYSTEM — TYPE DEFINITIONS
// ============================================================================

// --- Health Profile ---

export interface HealthProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg

  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  occupation: string;
  exerciseFrequency: 'none' | '1-2' | '3-4' | '5+';

  conditions: string[];
  goals: string[];

  // Gamification
  totalPoints?: number;
  level?: number;

  createdAt: string;
  updatedAt: string;
}

// --- Nutrient Profile ---

export interface NutrientProfile {
  calories: number;
  protein: number;   // g
  carbs: number;     // g
  fat: number;       // g
  iron: number;      // mg
  calcium: number;   // mg
  fiber: number;     // g
  vitaminA: number;  // μg RAE
  vitaminC: number;  // mg
  vitaminD: number;  // μg
}

// --- Food Database ---

export interface FoodItem {
  id: string;
  displayName: string;
  backendName: string;          // e.g. "doro_wat"
  category: string;
  defaultServing: number;
  servingUnit: string;
  quantityQuestion: string;     // e.g. "How many spoons of Shiro?"
  nutrientsPerServing: NutrientProfile;
  tags: string[];
  description: string;
}

// --- Meal Logging ---

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealFoodEntry {
  foodId: string;
  foodName: string;
  quantity: number;
  servingUnit: string;
  nutrients: NutrientProfile;
}

export interface NutrientScores {
  overall: number;   // 0-100
  protein: number;
  fiber: number;
  vitamin: number;
  iron: number;
  hydration: number;
  energy: number;
}

export interface MealLog {
  id: string;
  mealType: MealType;
  foods: MealFoodEntry[];
  totalNutrients: NutrientProfile;
  scores: NutrientScores;
  recommendations: string[];
  timestamp: string;
  imageData?: string;   // base64 thumbnail
  confidence: number;
}

// --- Reports ---

export interface DailySummary {
  date: string;
  meals: MealLog[];
  totalNutrients: NutrientProfile;
  scores: NutrientScores;
  strengths: string[];
  weaknesses: string[];
  missingNutrients: string[];
  recommendations: string[];
  aiSummary: string;
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  dailySummaries: DailySummary[];
  averageScores: NutrientScores;
  trends: Record<string, 'improving' | 'stable' | 'declining'>;
  mostCommonFoods: { name: string; count: number }[];
  repeatedDeficiencies: string[];
  riskPredictions: RiskPrediction[];
  aiCoachSummary: string;
}

// --- Predictions ---

export interface RiskPrediction {
  risk: string;
  level: 'low' | 'medium' | 'high';
  reason: string;
  suggestedAction: string;
}

// --- Recommendations ---

export interface Recommendation {
  text: string;
  category: 'protein' | 'vitamin' | 'iron' | 'fiber' | 'hydration' | 'general';
  priority: 'low' | 'medium' | 'high';
}

// --- API Response ---

export interface PredictionResponse {
  predicted_food: string;
  confidence: number;
  top_k_predictions: {
    rank: number;
    food: string;
    confidence: number;
  }[];
}

// --- Daily Recommended Values ---

export const DAILY_RECOMMENDED: NutrientProfile = {
  calories: 2200,
  protein: 56,
  carbs: 275,
  fat: 65,
  iron: 14,
  calcium: 1000,
  fiber: 28,
  vitaminA: 800,
  vitaminC: 82,
  vitaminD: 15,
};

// --- Constants ---

export const HEALTH_CONDITIONS = [
  'Diabetes', 'Anemia', 'Hypertension', 'Obesity',
  'High Cholesterol', 'Kidney Disease', 'Heart Disease',
  'Pregnancy', 'Lactation', 'Digestive Issues',
  'Food Allergies', 'Food Intolerances',
] as const;

export const HEALTH_GOALS = [
  'Weight Loss', 'Weight Gain', 'Muscle Building',
  'Better Energy', 'Better Focus', 'Better Sleep',
  'Healthy Lifestyle', 'Disease Management',
] as const;

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', desc: '1-2 days per week' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days per week' },
  { value: 'active', label: 'Active', desc: '6-7 days per week' },
] as const;

// --- Gamification & Challenges ---

export interface ChallengeDefinition {
  id: string;
  title: string;
  goal: string;
  durationDays: number;
  icon: string;
  gradient: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  expectedBenefits: string[];
  tasksDescription: string;
  rewardBadge: string;
  points: number;
}

export interface ChallengeTaskLog {
  date: string;
  photoUrl?: string;
  notes?: string;
  aiVerificationScore: number;
  status: 'Completed' | 'Needs Review' | 'Missed';
}

export interface UserChallenge {
  id: string;             // Unique ID for this instance
  challengeId: string;    // References ChallengeDefinition.id
  startDate: string;
  expectedEndDate: string;
  currentStreak: number;
  longestStreak: number;
  completionPercentage: number;
  status: 'Active' | 'Completed' | 'Abandoned';
  logs: Record<string, ChallengeTaskLog>; // date (YYYY-MM-DD) -> TaskLog
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}
