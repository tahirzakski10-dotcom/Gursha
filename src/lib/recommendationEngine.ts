// ============================================================================
// GURSHA — AI RECOMMENDATION ENGINE
// ============================================================================
// Generates personalized, Ethiopian-context-aware nutrition recommendations
// based on meal analysis, daily totals, and user health profile.

import type { NutrientProfile, HealthProfile, MealLog, Recommendation } from './types';
import { DAILY_RECOMMENDED } from './types';

// --- Meal-Level Recommendations ---

export function generateMealRecommendations(
  nutrients: NutrientProfile,
  foodNames: string[],
  profile?: HealthProfile | null
): string[] {
  const recs: string[] = [];
  const mealTarget = 0.33; // ~1/3 of daily

  // Protein check
  if (nutrients.protein < DAILY_RECOMMENDED.protein * mealTarget * 0.5) {
    recs.push('lowProtein');
  } else if (nutrients.protein > DAILY_RECOMMENDED.protein * mealTarget * 1.2) {
    recs.push('goodProtein');
  }

  // Iron check
  if (nutrients.iron < DAILY_RECOMMENDED.iron * mealTarget * 0.4) {
    recs.push('lowIron');
  }

  // Fiber check
  if (nutrients.fiber < DAILY_RECOMMENDED.fiber * mealTarget * 0.4) {
    recs.push('lowFiber');
  }

  // Vitamin A
  if (nutrients.vitaminA < DAILY_RECOMMENDED.vitaminA * mealTarget * 0.3) {
    recs.push('lowVitA');
  }

  // Vitamin C
  if (nutrients.vitaminC < 5) {
    recs.push('lowVitC');
  }

  // Fat check (too high)
  if (nutrients.fat > 40) {
    recs.push('highFat');
  }

  // Carb-heavy meal
  if (nutrients.carbs > 70 && nutrients.protein < 15) {
    recs.push('highCarbLowProtein');
  }

  // Health condition-specific
  if (profile?.conditions?.length) {
    if (profile.conditions.includes('Diabetes') && nutrients.carbs > 60) {
      recs.push('diabetesWarning');
    }
    if (profile.conditions.includes('Anemia') && nutrients.iron < 3) {
      recs.push('anemiaWarning');
    }
    if (profile.conditions.includes('Hypertension') && nutrients.fat > 35) {
      recs.push('hypertensionWarning');
    }
    if (profile.conditions.includes('High Cholesterol') && nutrients.fat > 30) {
      recs.push('cholesterolWarning');
    }
  }

  // Goal-specific
  if (profile?.goals?.length) {
    if (profile.goals.includes('Weight Loss') && nutrients.calories > 600) {
      recs.push('weightLossGoal');
    }
    if (profile.goals.includes('Muscle Building') && nutrients.protein < 25) {
      recs.push('muscleGoal');
    }
    if (profile.goals.includes('Better Energy') && nutrients.carbs < 20) {
      recs.push('energyGoal');
    }
  }

  // If nothing flagged, give a positive note
  if (recs.length === 0) {
    recs.push('wellBalanced');
  }

  return recs;
}

// --- Daily Recommendations ---

export function generateDailyRecommendations(
  totalNutrients: NutrientProfile,
  mealCount: number,
  profile?: HealthProfile | null
): { strengths: string[]; weaknesses: string[]; missingNutrients: string[]; recommendations: string[]; aiSummary: string } {
  const r = DAILY_RECOMMENDED;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missing: string[] = [];
  const recs: string[] = [];

  // Analyze each nutrient
  const checks: { name: string; actual: number; target: number; unit: string; food: string }[] = [
    { name: 'Protein', actual: totalNutrients.protein, target: r.protein, unit: 'g', food: 'eggs, lentils, or Doro Wat' },
    { name: 'Fiber', actual: totalNutrients.fiber, target: r.fiber, unit: 'g', food: 'vegetables, Beyaynetu, or whole-grain Injera' },
    { name: 'Iron', actual: totalNutrients.iron, target: r.iron, unit: 'mg', food: 'teff Injera, Kitfo, or leafy greens' },
    { name: 'Calcium', actual: totalNutrients.calcium, target: r.calcium, unit: 'mg', food: 'dairy, Ayib (cottage cheese), or collard greens' },
    { name: 'Vitamin A', actual: totalNutrients.vitaminA, target: r.vitaminA, unit: 'μg', food: 'carrots, sweet potatoes, or Doro Wat' },
    { name: 'Vitamin C', actual: totalNutrients.vitaminC, target: r.vitaminC, unit: 'mg', food: 'tomato salad, peppers, or citrus fruits' },
  ];

  checks.forEach(({ name, actual, target, unit, food }) => {
    const pct = (actual / target) * 100;
    if (pct >= 80) {
      strengths.push(`${name} intake is strong (${Math.round(actual)}${unit} of ${target}${unit} target)`);
    } else if (pct < 50) {
      missing.push(name);
      weaknesses.push(`${name} is significantly low (${Math.round(actual)}${unit} of ${target}${unit})`);
      recs.push(`Increase ${name.toLowerCase()} by adding ${food} to your next meal.`);
    } else {
      weaknesses.push(`${name} could be higher (${Math.round(actual)}${unit} of ${target}${unit})`);
    }
  });

  // Calorie analysis
  const calPct = (totalNutrients.calories / r.calories) * 100;
  if (calPct > 120) {
    weaknesses.push(`Calorie intake is high (${totalNutrients.calories} cal vs ${r.calories} target)`);
    recs.push('Consider lighter portions or more vegetable-based dishes tomorrow.');
  } else if (calPct < 60 && mealCount >= 3) {
    weaknesses.push(`Calorie intake is too low (${totalNutrients.calories} cal vs ${r.calories} target)`);
    recs.push('You may not be eating enough. Add energy-dense foods like Genfo or Injera with stews.');
  }

  if (mealCount < 3) {
    recs.push(`You've only logged ${mealCount} meal(s) today. Log all meals for accurate daily analysis.`);
  }

  // Generate AI Summary
  const summaryParts: string[] = [];
  if (strengths.length > 0) {
    summaryParts.push(`Today's meals were strong in ${strengths.slice(0, 2).map(s => s.split(' ')[0]).join(' and ').toLowerCase()}`);
  }
  if (missing.length > 0) {
    summaryParts.push(`but low in ${missing.join(', ').toLowerCase()}`);
  }
  if (recs.length > 0) {
    summaryParts.push(`Focus on ${missing[0]?.toLowerCase() || 'balanced nutrition'} in your next meal.`);
  }

  const aiSummary = summaryParts.join(', ') + (summaryParts.length > 0 ? '.' : 'Great nutrition day! Keep up the balanced eating habits.');

  return { strengths, weaknesses, missingNutrients: missing, recommendations: recs, aiSummary };
}

// --- AI Coach Responses ---

export function generateCoachResponse(
  question: string,
  totalNutrients: NutrientProfile | null,
  mealCount: number,
  profile?: HealthProfile | null
): string {
  const r = DAILY_RECOMMENDED;
  const q = question.toLowerCase();

  if (q.includes('what should i eat') || q.includes('suggest')) {
    if (!totalNutrients || mealCount === 0) {
      return 'Start your day with a protein-rich breakfast! Genfo with spiced butter, or Chechebsa with a boiled egg would be excellent. If you prefer lighter, try Kinche (cracked wheat porridge) with a glass of milk.';
    }
    const needs: string[] = [];
    if (totalNutrients.protein < r.protein * 0.6) needs.push('protein (try Doro Wat, Kitfo, or eggs)');
    if (totalNutrients.fiber < r.fiber * 0.6) needs.push('fiber (add Beyaynetu or lentil dishes)');
    if (totalNutrients.iron < r.iron * 0.6) needs.push('iron (choose teff Injera or leafy greens)');
    if (needs.length > 0) {
      return `Based on what you've eaten today, you need more ${needs.join(' and ')}. I suggest a balanced dinner with these nutrients in mind.`;
    }
    return 'You\'re doing well nutritionally today! A light dinner with Kikil (mild broth) and Injera would round out your day perfectly without overloading calories.';
  }

  if (q.includes('missing') || q.includes('deficien') || q.includes('lacking')) {
    if (!totalNutrients) return 'Log some meals first so I can analyze your nutritional gaps!';
    const gaps: string[] = [];
    if (totalNutrients.protein < r.protein * 0.5) gaps.push('Protein');
    if (totalNutrients.iron < r.iron * 0.5) gaps.push('Iron');
    if (totalNutrients.fiber < r.fiber * 0.5) gaps.push('Fiber');
    if (totalNutrients.vitaminA < r.vitaminA * 0.3) gaps.push('Vitamin A');
    if (totalNutrients.vitaminC < r.vitaminC * 0.3) gaps.push('Vitamin C');
    if (totalNutrients.calcium < r.calcium * 0.3) gaps.push('Calcium');
    if (gaps.length === 0) return 'Looking great! No major nutritional gaps detected today. Keep up the balanced eating!';
    return `You're currently low in: ${gaps.join(', ')}. Focus on these nutrients in your remaining meals today.`;
  }

  if (q.includes('energy') || q.includes('tired') || q.includes('fatigue')) {
    return 'For better energy throughout the day: Start with complex carbs (teff Injera, Genfo), add protein to every meal (eggs, lentils, chicken), stay hydrated with water between meals, and avoid sugar crashes by pairing carbs with fiber. Ethiopian foods like Beyaynetu are perfect for sustained energy!';
  }

  if (q.includes('focus') || q.includes('concentrat') || q.includes('brain')) {
    return 'Brain-boosting Ethiopian foods: Omega-3 from fish or flaxseed, iron from teff and red meat (Kitfo, Tire Siga), B-vitamins from lentils and chickpeas (Shiro). Eat breakfast! Skipping meals hurts focus. Try Kinche or eggs with Injera. Stay hydrated — even mild dehydration reduces concentration by 25%.';
  }

  if (q.includes('health condition') || q.includes('disease') || q.includes('condition')) {
    if (!profile?.conditions?.length) return 'You haven\'t set up health conditions in your profile yet. Go to Health Profile to add them, and I can give condition-specific advice!';
    const advice: string[] = ['Based on your conditions:'];
    if (profile.conditions.includes('Diabetes')) advice.push('• Diabetes: Favor low-glycemic foods, whole grains, Shiro, lentils. Avoid sugar-heavy drinks.');
    if (profile.conditions.includes('Anemia')) advice.push('• Anemia: Prioritize iron-rich teff, Kitfo, leafy greens. Pair with Vitamin C.');
    if (profile.conditions.includes('Hypertension')) advice.push('• Hypertension: Reduce salt & fatty meats. Eat more vegetables, Beyaynetu, and potassium-rich foods.');
    return advice.join('\n');
  }

  if (q.includes('weight loss') || q.includes('lose weight')) {
    return 'Ethiopian weight loss tips: Choose Beyaynetu (vegan platter) — high fiber, moderate calories. Limit Genfo and Chechebsa (calorie-dense). Use less Niter Kibbeh. Eat Kikil for a lighter protein source. Control Injera portions — 2-3 pieces max per meal. Drink water before meals.';
  }

  if (q.includes('weight gain') || q.includes('gain weight') || q.includes('bulk')) {
    return 'For healthy weight gain: Eat calorie-dense foods like Genfo with extra butter, Doro Wat with multiple eggs, and larger portions of Injera. Add Kitfo for high protein. Eat 4-5 meals/day instead of 3. Snack on roasted barley (Kolo) between meals.';
  }

  // Default response
  return 'I\'m your Gursha AI nutrition coach! Ask me about what to eat, nutritional gaps, energy tips, focus foods, or advice for your health conditions. I analyze your meal history and health profile to give personalized Ethiopian nutrition guidance.';
}
