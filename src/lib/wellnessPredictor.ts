// ============================================================================
// GURSHA — PREDICTIVE WELLNESS ENGINE
// ============================================================================
// Analyzes multi-day eating patterns and predicts nutritional risks.

import type { MealLog, RiskPrediction, NutrientProfile } from './types';
import { DAILY_RECOMMENDED } from './types';
import { sumNutrients } from './nutritionDB';

export const WELLNESS_DISCLAIMER = 'This is not a medical diagnosis. This is an AI wellness insight based on your logged meals. Consult a healthcare professional for medical advice.';

/**
 * Analyze meal history and predict wellness risks.
 * Needs at least 3 days of data for meaningful predictions.
 */
export function predictRisks(meals: MealLog[]): RiskPrediction[] {
  if (meals.length < 3) return [];

  const risks: RiskPrediction[] = [];

  // Group meals by date
  const byDate = new Map<string, MealLog[]>();
  meals.forEach((m) => {
    const date = m.timestamp.slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(m);
  });

  const days = Array.from(byDate.values());
  const numDays = days.length;

  // Calculate daily totals
  const dailyTotals: NutrientProfile[] = days.map((dayMeals) =>
    sumNutrients(dayMeals.map((m) => m.totalNutrients))
  );

  const r = DAILY_RECOMMENDED;

  // --- Iron Deficiency Risk ---
  const lowIronDays = dailyTotals.filter((d) => d.iron < r.iron * 0.5).length;
  if (lowIronDays / numDays > 0.5) {
    risks.push({
      risk: 'Iron Deficiency Risk',
      level: lowIronDays / numDays > 0.75 ? 'high' : 'medium',
      reason: `${lowIronDays} of ${numDays} days had iron intake below 50% of the recommended daily value.`,
      suggestedAction: 'Include more teff-based Injera, red meat (Kitfo, Tire Siga), or leafy greens (Gomen). Pair with Vitamin C for better absorption.',
    });
  }

  // --- Protein Deficiency Risk ---
  const lowProteinDays = dailyTotals.filter((d) => d.protein < r.protein * 0.5).length;
  if (lowProteinDays / numDays > 0.5) {
    risks.push({
      risk: 'Protein Deficiency Risk',
      level: lowProteinDays / numDays > 0.75 ? 'high' : 'medium',
      reason: `${lowProteinDays} of ${numDays} days had protein intake below 50% of target.`,
      suggestedAction: 'Add protein-rich foods: eggs, lentils (Misir Wat), chicken (Doro Wat), or beef (Tibs) to every meal.',
    });
  }

  // --- Fiber Deficiency ---
  const lowFiberDays = dailyTotals.filter((d) => d.fiber < r.fiber * 0.4).length;
  if (lowFiberDays / numDays > 0.5) {
    risks.push({
      risk: 'Low Fiber Pattern',
      level: 'medium',
      reason: `${lowFiberDays} of ${numDays} days had very low fiber intake.`,
      suggestedAction: 'Eat more Beyaynetu (mixed vegetable platter), lentil dishes, and whole-grain Injera for better digestive health.',
    });
  }

  // --- Excess Calorie Pattern ---
  const highCalDays = dailyTotals.filter((d) => d.calories > r.calories * 1.3).length;
  if (highCalDays / numDays > 0.5) {
    risks.push({
      risk: 'Excess Calorie Consumption',
      level: highCalDays / numDays > 0.75 ? 'high' : 'medium',
      reason: `${highCalDays} of ${numDays} days exceeded 130% of recommended calorie intake.`,
      suggestedAction: 'Reduce portions of calorie-dense foods like Genfo and Chechebsa. Choose lighter options like Kikil and vegetable stews.',
    });
  }

  // --- High Fat Pattern ---
  const highFatDays = dailyTotals.filter((d) => d.fat > r.fat * 1.5).length;
  if (highFatDays / numDays > 0.4) {
    risks.push({
      risk: 'High Fat Consumption',
      level: 'medium',
      reason: `${highFatDays} of ${numDays} days had excessive fat intake, often from butter-heavy preparations.`,
      suggestedAction: 'Reduce Niter Kibbeh (spiced butter) usage. Choose grilled over fried preparations. Opt for Shiro or lentil dishes.',
    });
  }

  // --- Vitamin Deficiency ---
  const lowVitDays = dailyTotals.filter((d) => d.vitaminA < r.vitaminA * 0.3 && d.vitaminC < r.vitaminC * 0.3).length;
  if (lowVitDays / numDays > 0.5) {
    risks.push({
      risk: 'Vitamin Deficiency Pattern',
      level: 'medium',
      reason: `${lowVitDays} of ${numDays} days were very low in both Vitamin A and C.`,
      suggestedAction: 'Add colorful vegetables, tomatoes, peppers, and leafy greens to your meals. Include Beyaynetu at least twice per week.',
    });
  }

  // If no risks — positive feedback
  if (risks.length === 0) {
    risks.push({
      risk: 'No Significant Risks',
      level: 'low',
      reason: 'Your nutrition patterns look balanced across the analyzed period.',
      suggestedAction: 'Keep maintaining your current dietary habits! Continue logging meals for ongoing monitoring.',
    });
  }

  return risks;
}

/**
 * Generate a weekly AI coach summary from daily totals.
 */
export function generateWeeklySummary(dailyTotals: NutrientProfile[], commonFoods: { name: string; count: number }[]): string {
  if (dailyTotals.length === 0) return 'Not enough data yet. Keep logging meals for weekly insights!';

  const avg = sumNutrients(dailyTotals);
  const n = dailyTotals.length;
  const r = DAILY_RECOMMENDED;

  const parts: string[] = [];

  // Overall assessment
  const avgProtPct = ((avg.protein / n) / r.protein) * 100;
  const avgIronPct = ((avg.iron / n) / r.iron) * 100;
  const avgFiberPct = ((avg.fiber / n) / r.fiber) * 100;

  if (avgProtPct >= 80 && avgIronPct >= 80) {
    parts.push('Great week for protein and iron!');
  } else if (avgProtPct < 60) {
    parts.push('Protein was below target this week.');
  }

  if (avgFiberPct < 60) {
    parts.push('Fiber intake needs improvement — add more vegetables and legumes.');
  }

  // Most common foods
  if (commonFoods.length > 0) {
    const top = commonFoods.slice(0, 3).map(f => f.name).join(', ');
    parts.push(`Your most eaten foods were: ${top}.`);
  }

  // Variety check
  if (commonFoods.length < 4) {
    parts.push('Try more food variety next week for a broader nutrient profile.');
  }

  return parts.join(' ') || 'Keep logging meals for personalized weekly insights!';
}
