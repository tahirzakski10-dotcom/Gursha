// ============================================================================
// GURSHA — PERFORMANCE+ TYPES
// ============================================================================

export interface FitnessProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: 'Muscle Gain' | 'Fat Loss' | 'Athletic Performance' | 'Strength' | 'Endurance' | 'General Fitness';
  frequency: '1-2 days/week' | '3-4 days/week' | '5-6 days/week' | 'Daily';
  duration: 'Less than 45 min' | '45-60 min' | '60-90 min' | '90+ min';
}

export interface SupplementProfile {
  usesSupplements: boolean;
  selectedSupplements: string[];
  
  // Protein specifics
  protein?: {
    brand: string;
    product: string;
    scoopsPerDay: number;
    scoopSize: number; // grams
    workoutGoal: string;
    trainingTime: string;
  };

  // Creatine specifics
  creatine?: {
    brand: string;
    gramsPerDay: number;
    isLoading: boolean;
    durationOfUse: string;
  };
}

export interface PerformanceScores {
  proteinEfficiency: number;
  creatineOptimization: number;
  muscleRecovery: number;
  strengthReadiness: number;
  hydration: number;
  overallPerformance: number;
  roiScore: number;
}
