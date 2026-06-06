// ============================================================================
// GURSHA — MEAL & NUTRIENT SCORING ENGINE
// ============================================================================

import type { NutrientProfile, NutrientScores, MealLog, HealthProfile } from './types';
import { DAILY_RECOMMENDED } from './types';

/** Clamp a value between 0 and 100 */
function clamp(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

/**
 * Score a single nutrient as a percentage of daily recommended.
 * Scoring: 100% of RDV = 100 points.  Going over is capped per nutrient.
 */
function nutrientPct(actual: number, recommended: number, capAt = 120): number {
  if (recommended === 0) return 100;
  return clamp((actual / recommended) * 100 * (100 / capAt));
}

// --- Meal Scoring ---

export function scoreMeal(nutrients: NutrientProfile, _profile?: HealthProfile | null): NutrientScores {
  const r = DAILY_RECOMMENDED;

  // Each meal is roughly 1/3 of daily needs (assuming 3 meals)
  const mealFraction = 0.33;

  const proteinScore = clamp((nutrients.protein / (r.protein * mealFraction)) * 100);
  const fiberScore = clamp((nutrients.fiber / (r.fiber * mealFraction)) * 100);

  const vitAScore = nutrients.vitaminA > 0 ? clamp((nutrients.vitaminA / (r.vitaminA * mealFraction)) * 100) : 0;
  const vitCScore = nutrients.vitaminC > 0 ? clamp((nutrients.vitaminC / (r.vitaminC * mealFraction)) * 100) : 0;
  const vitDScore = nutrients.vitaminD > 0 ? clamp((nutrients.vitaminD / (r.vitaminD * mealFraction)) * 100) : 0;
  const vitaminScore = clamp((vitAScore + vitCScore + vitDScore) / 3);

  const ironScore = clamp((nutrients.iron / (r.iron * mealFraction)) * 100);

  // Hydration is hard to measure from food alone — estimate from broth-y / water-rich foods
  // Use a heuristic: high-protein + low-calorie-density = hydrating (e.g. Kikil)
  const caloriesPerGram = nutrients.calories / Math.max(1, nutrients.protein + nutrients.carbs + nutrients.fat);
  const hydrationScore = clamp(caloriesPerGram < 3 ? 80 : caloriesPerGram < 5 ? 60 : 40);

  // Energy: balanced macros = good energy score
  const totalMacroG = nutrients.protein + nutrients.carbs + nutrients.fat;
  const carbPct = totalMacroG > 0 ? (nutrients.carbs / totalMacroG) * 100 : 0;
  const protPct = totalMacroG > 0 ? (nutrients.protein / totalMacroG) * 100 : 0;
  // Good energy: 40-60% carbs, 20-35% protein
  const energyScore = clamp(
    (carbPct >= 35 && carbPct <= 65 ? 50 : 25) +
    (protPct >= 15 && protPct <= 40 ? 50 : 25)
  );

  // Overall: weighted average
  const overall = clamp(
    proteinScore * 0.25 +
    fiberScore * 0.15 +
    vitaminScore * 0.15 +
    ironScore * 0.15 +
    hydrationScore * 0.10 +
    energyScore * 0.20
  );

  return { overall, protein: proteinScore, fiber: fiberScore, vitamin: vitaminScore, iron: ironScore, hydration: hydrationScore, energy: energyScore };
}

// --- Daily Scoring ---

export function scoreDailyNutrients(nutrients: NutrientProfile, _profile?: HealthProfile | null): NutrientScores {
  const r = DAILY_RECOMMENDED;

  const proteinScore = clamp((nutrients.protein / r.protein) * 100);
  const fiberScore = clamp((nutrients.fiber / r.fiber) * 100);

  const vitAScore = clamp((nutrients.vitaminA / r.vitaminA) * 100);
  const vitCScore = clamp((nutrients.vitaminC / r.vitaminC) * 100);
  const vitDScore = clamp((nutrients.vitaminD / r.vitaminD) * 100);
  const vitaminScore = clamp((vitAScore + vitCScore + vitDScore) / 3);

  const ironScore = clamp((nutrients.iron / r.iron) * 100);

  const hydrationScore = clamp(50); // Placeholder — could add water tracking later

  const totalMacroG = nutrients.protein + nutrients.carbs + nutrients.fat;
  const carbPct = totalMacroG > 0 ? (nutrients.carbs / totalMacroG) * 100 : 0;
  const protPct = totalMacroG > 0 ? (nutrients.protein / totalMacroG) * 100 : 0;
  const energyScore = clamp(
    (carbPct >= 35 && carbPct <= 65 ? 50 : 25) +
    (protPct >= 15 && protPct <= 40 ? 50 : 25)
  );

  const overall = clamp(
    proteinScore * 0.25 +
    fiberScore * 0.15 +
    vitaminScore * 0.15 +
    ironScore * 0.15 +
    hydrationScore * 0.10 +
    energyScore * 0.20
  );

  return { overall, protein: proteinScore, fiber: fiberScore, vitamin: vitaminScore, iron: ironScore, hydration: hydrationScore, energy: energyScore };
}

// --- Helpers ---

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Needs Work';
  return 'Poor';
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e'; // green
  if (score >= 70) return '#84cc16'; // lime
  if (score >= 50) return '#f59e0b'; // amber
  if (score >= 30) return '#f97316'; // orange
  return '#ef4444'; // red
}
