// ============================================================================
// GURSHA — ETHIOPIAN FOOD NUTRITION DATABASE
// ============================================================================
// Comprehensive nutrition data for all 11 model-recognized foods plus extras.
// Values are per single serving (unit varies per food).

import { FoodItem, NutrientProfile } from './types';

// --- Helper to create a profile quickly ---
function np(
  cal: number, pro: number, carb: number, fat: number,
  iron: number, calcium: number, fiber: number,
  vitA: number, vitC: number, vitD: number
): NutrientProfile {
  return { calories: cal, protein: pro, carbs: carb, fat, iron, calcium, fiber, vitaminA: vitA, vitaminC: vitC, vitaminD: vitD };
}

// ---- The Database ----

export const FOOD_DATABASE: FoodItem[] = [
  {
    id: 'injera',
    displayName: 'Injera',
    backendName: 'injera',
    category: 'Bread / Base',
    defaultServing: 1,
    servingUnit: 'piece',
    quantityQuestion: 'How many pieces of Injera?',
    nutrientsPerServing: np(150, 5, 30, 1, 3.2, 50, 3, 0, 0, 0),
    tags: ['carbs', 'iron-source', 'teff'],
    description: 'Spongy teff flatbread — the base of almost every Ethiopian meal. Rich in iron and calcium from teff grain.',
  },
  {
    id: 'shiro_wat',
    displayName: 'Shiro Wat',
    backendName: 'shiro_wat',
    category: 'Stew / Wat',
    defaultServing: 1,
    servingUnit: 'cup',
    quantityQuestion: 'How many cups of Shiro Wat?',
    nutrientsPerServing: np(350, 15, 42, 12, 4.5, 80, 8, 15, 2, 0),
    tags: ['protein', 'fiber', 'vegan', 'chickpea'],
    description: 'Spiced chickpea flour stew. Excellent plant-based protein and fiber source.',
  },
  {
    id: 'doro_wat',
    displayName: 'Doro Wat',
    backendName: 'doro_wat',
    category: 'Stew / Wat',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Doro Wat (with egg)?',
    nutrientsPerServing: np(450, 35, 15, 28, 3.8, 45, 3, 120, 5, 0.5),
    tags: ['protein', 'vitamin-a', 'chicken', 'egg'],
    description: 'Spicy chicken stew with hard-boiled egg. High-quality protein with rich berbere spice blend.',
  },
  {
    id: 'kitfo',
    displayName: 'Kitfo',
    backendName: 'kitfo',
    category: 'Meat',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Kitfo?',
    nutrientsPerServing: np(500, 40, 2, 38, 5.2, 20, 0, 10, 1, 0.2),
    tags: ['protein', 'iron-rich', 'raw-meat'],
    description: 'Minced raw or lightly cooked beef with spiced butter. Extremely high in protein and iron.',
  },
  {
    id: 'beyaynetu',
    displayName: 'Beyaynetu',
    backendName: 'beyaynetu',
    category: 'Mixed Platter',
    defaultServing: 1,
    servingUnit: 'plate',
    quantityQuestion: 'How many plates of Beyaynetu?',
    nutrientsPerServing: np(600, 20, 85, 18, 6.5, 120, 15, 180, 12, 0),
    tags: ['balanced', 'vegan', 'fiber', 'vitamin-rich'],
    description: 'Fasting platter with assorted vegetable and legume dishes. The most nutritionally balanced Ethiopian meal.',
  },
  {
    id: 'firfir',
    displayName: 'Firfir',
    backendName: 'firfir',
    category: 'Breakfast',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Firfir?',
    nutrientsPerServing: np(400, 10, 55, 15, 3.0, 40, 4, 20, 3, 0),
    tags: ['carbs', 'breakfast'],
    description: 'Shredded injera sautéed with berbere sauce and spiced butter. Popular hearty breakfast.',
  },
  {
    id: 'genfo',
    displayName: 'Genfo',
    backendName: 'genfo',
    category: 'Breakfast / Porridge',
    defaultServing: 1,
    servingUnit: 'bowl',
    quantityQuestion: 'How many bowls of Genfo?',
    nutrientsPerServing: np(500, 12, 75, 18, 2.5, 30, 4, 5, 0, 0),
    tags: ['carbs', 'energy', 'breakfast'],
    description: 'Dense porridge of barley or wheat flour with spiced butter. Very calorie-dense and popular for energy.',
  },
  {
    id: 'kikil',
    displayName: 'Kikil',
    backendName: 'kikil',
    category: 'Stew / Broth',
    defaultServing: 1,
    servingUnit: 'bowl',
    quantityQuestion: 'How many bowls of Kikil?',
    nutrientsPerServing: np(300, 25, 10, 18, 2.8, 35, 1, 10, 3, 0.3),
    tags: ['protein', 'light', 'broth'],
    description: 'Mild lamb or beef broth stew with turmeric and garlic. Light and hydrating protein source.',
  },
  {
    id: 'shekla_tibs',
    displayName: 'Shekla Tibs',
    backendName: 'shekla_tibs',
    category: 'Meat',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Shekla Tibs?',
    nutrientsPerServing: np(550, 45, 5, 38, 4.5, 25, 1, 8, 4, 0.3),
    tags: ['protein', 'iron-rich', 'grilled'],
    description: 'Sizzling pan-fried beef or lamb served on a clay dish. Outstanding protein and iron.',
  },
  {
    id: 'tihlo',
    displayName: 'Tihlo',
    backendName: 'tihlo',
    category: 'Grain / Dough',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Tihlo?',
    nutrientsPerServing: np(350, 10, 60, 8, 2.0, 25, 5, 5, 1, 0),
    tags: ['carbs', 'fiber', 'barley'],
    description: 'Barley dough balls dipped in spicy meat sauce. High in complex carbs and fiber from barley.',
  },
  {
    id: 'tire_siga',
    displayName: 'Tire Siga',
    backendName: 'tire_siga',
    category: 'Meat',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Tire Siga?',
    nutrientsPerServing: np(400, 45, 0, 24, 5.5, 15, 0, 5, 0, 0.4),
    tags: ['protein', 'iron-rich', 'raw-meat'],
    description: 'Raw cubed beef served with mustard and chili. Pure protein and iron.',
  },
  {
    id: 'chechebsa',
    displayName: 'Chechebsa',
    backendName: 'chechebsa',
    category: 'Breakfast',
    defaultServing: 1,
    servingUnit: 'serving',
    quantityQuestion: 'How many servings of Chechebsa?',
    nutrientsPerServing: np(450, 8, 55, 22, 2.2, 40, 3, 25, 1, 0),
    tags: ['carbs', 'breakfast', 'buttery'],
    description: 'Shredded flatbread kneaded with berbere and spiced butter. Rich, buttery breakfast.',
  },
];

// --- Lookup helpers ---

/** Map backend names (e.g. "doro_wat") to display names */
export const BACKEND_TO_DISPLAY: Record<string, string> = {};
/** Map food ID to FoodItem */
export const FOOD_BY_ID: Record<string, FoodItem> = {};
/** Map backend name to FoodItem */
export const FOOD_BY_BACKEND: Record<string, FoodItem> = {};

FOOD_DATABASE.forEach((f) => {
  BACKEND_TO_DISPLAY[f.backendName] = f.displayName;
  FOOD_BY_ID[f.id] = f;
  FOOD_BY_BACKEND[f.backendName] = f;
});

/** Look up a food by backend name, id, or display name */
export function lookupFood(name: string): FoodItem | undefined {
  const lower = name.toLowerCase().replace(/[\s-]+/g, '_');
  return FOOD_BY_BACKEND[lower] || FOOD_BY_ID[lower] || FOOD_DATABASE.find(
    (f) => f.displayName.toLowerCase() === name.toLowerCase()
  );
}

/** Scale nutrients by quantity */
export function scaleNutrients(base: NutrientProfile, qty: number): NutrientProfile {
  return {
    calories: Math.round(base.calories * qty),
    protein: Math.round(base.protein * qty * 10) / 10,
    carbs: Math.round(base.carbs * qty * 10) / 10,
    fat: Math.round(base.fat * qty * 10) / 10,
    iron: Math.round(base.iron * qty * 10) / 10,
    calcium: Math.round(base.calcium * qty),
    fiber: Math.round(base.fiber * qty * 10) / 10,
    vitaminA: Math.round(base.vitaminA * qty),
    vitaminC: Math.round(base.vitaminC * qty * 10) / 10,
    vitaminD: Math.round(base.vitaminD * qty * 10) / 10,
  };
}

/** Sum multiple nutrient profiles */
export function sumNutrients(profiles: NutrientProfile[]): NutrientProfile {
  const zero: NutrientProfile = { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, calcium: 0, fiber: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0 };
  return profiles.reduce((acc, p) => ({
    calories: acc.calories + p.calories,
    protein: acc.protein + p.protein,
    carbs: acc.carbs + p.carbs,
    fat: acc.fat + p.fat,
    iron: acc.iron + p.iron,
    calcium: acc.calcium + p.calcium,
    fiber: acc.fiber + p.fiber,
    vitaminA: acc.vitaminA + p.vitaminA,
    vitaminC: acc.vitaminC + p.vitaminC,
    vitaminD: acc.vitaminD + p.vitaminD,
  }), zero);
}
