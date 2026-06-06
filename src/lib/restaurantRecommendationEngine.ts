// ============================================================================
// GURSHA — RESTAURANT RECOMMENDATION ENGINE
// ============================================================================
// AI-powered restaurant matching & menu analysis based on user health profile.
// Scores restaurants and menu items against user goals, conditions, and deficiencies.

import type { HealthProfile } from './types';

// --- Types ---

export interface MenuItem {
  name: string;
  description: string;
  calories: number;
  protein: number;
  iron: number;
  fiber: number;
  fat: number;
  carbs: number;
  vitaminC: number;
  tags: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  type: RestaurantType;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  priceLevel: '$' | '$$' | '$$$';
  phone: string;
  hours: string;
  address: string;
  description: string;
  photoUrl: string;
  nutritionTags: string[];
  mealTypes: MealTypeFilter[];
  nutritionGoals: NutritionGoal[];
  menu: MenuItem[];
  popularDishes: string[];
}

export interface RestaurantMatch {
  restaurant: Restaurant;
  distance: number; // km
  matchScore: number; // 0-100
  recommendedDish: MenuItem | null;
  nutritionScore: number;
  proteinScore: number;
  vitaminScore: number;
  aiReason: string;
  tags: string[];
}

export type DistanceFilter = 1 | 3 | 5 | 10;
export type MealTypeFilter = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export type NutritionGoal = 'High Protein' | 'Weight Loss' | 'Weight Gain' | 'Energy Boost' | 'Heart Healthy' | 'Diabetic Friendly' | 'High Iron' | 'High Fiber';
export type RestaurantType = 'Ethiopian' | 'Healthy Food' | 'Cafe' | 'Fast Casual' | 'Fitness Focused';

// --- Restaurant Dataset (Addis Ababa) ---

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Yod Abyssinia',
    type: 'Ethiopian',
    lat: 9.0127,
    lng: 38.7615,
    rating: 4.8,
    reviews: 1247,
    priceLevel: '$$$',
    phone: '+251-11-661-2985',
    hours: '11:00 AM – 11:00 PM',
    address: 'Bole Road, Addis Ababa',
    description: 'Premium traditional Ethiopian dining with cultural performances and organic, locally sourced ingredients.',
    photoUrl: '',
    nutritionTags: ['High Protein', 'Iron Rich', 'Traditional', 'Organic'],
    mealTypes: ['Lunch', 'Dinner'],
    nutritionGoals: ['High Protein', 'High Iron', 'Energy Boost'],
    popularDishes: ['Doro Wat', 'Kitfo', 'Beyaynetu'],
    menu: [
      { name: 'Doro Wat', description: 'Spicy chicken stew with hard-boiled eggs on injera', calories: 520, protein: 38, iron: 4.2, fiber: 3, fat: 18, carbs: 45, vitaminC: 12, tags: ['High Protein', 'Iron Rich'] },
      { name: 'Kitfo (Lean)', description: 'Minced raw beef with mitmita spice and herb butter', calories: 380, protein: 42, iron: 5.8, fiber: 1, fat: 22, carbs: 2, vitaminC: 4, tags: ['High Protein', 'Iron Rich', 'Low Carb'] },
      { name: 'Beyaynetu', description: 'Colorful vegan platter with 6 types of lentil & vegetable stews', calories: 420, protein: 18, iron: 6.1, fiber: 14, fat: 8, carbs: 65, vitaminC: 28, tags: ['High Fiber', 'Vegan', 'Iron Rich'] },
      { name: 'Tibs (Grilled)', description: 'Grilled beef strips with peppers and onions', calories: 440, protein: 36, iron: 4.5, fiber: 2, fat: 20, carbs: 18, vitaminC: 15, tags: ['High Protein', 'Athlete Friendly'] },
    ]
  },
  {
    id: 'r2',
    name: 'Habesha Lounge',
    type: 'Ethiopian',
    lat: 9.0055,
    lng: 38.7720,
    rating: 4.5,
    reviews: 832,
    priceLevel: '$$',
    phone: '+251-11-550-3200',
    hours: '10:00 AM – 10:00 PM',
    address: 'Kazanchis, Addis Ababa',
    description: 'Modern Ethiopian cuisine with a focus on lean protein dishes and fresh salads.',
    photoUrl: '',
    nutritionTags: ['Athlete Friendly', 'High Protein', 'Lean Meats'],
    mealTypes: ['Lunch', 'Dinner'],
    nutritionGoals: ['High Protein', 'Weight Loss', 'Energy Boost'],
    popularDishes: ['Lean Tibs', 'Shiro', 'Gomen'],
    menu: [
      { name: 'Lean Tibs + Salad', description: 'Tender beef strips with fresh garden salad', calories: 380, protein: 34, iron: 4.0, fiber: 4, fat: 14, carbs: 22, vitaminC: 20, tags: ['High Protein', 'Weight Loss'] },
      { name: 'Shiro Wat', description: 'Chickpea flour stew with berbere spice', calories: 310, protein: 16, iron: 3.8, fiber: 8, fat: 6, carbs: 48, vitaminC: 8, tags: ['High Fiber', 'Vegan', 'Budget Friendly'] },
      { name: 'Gomen (Collard Greens)', description: 'Sautéed Ethiopian collard greens with garlic', calories: 120, protein: 5, iron: 2.8, fiber: 6, fat: 4, carbs: 15, vitaminC: 35, tags: ['Low Calorie', 'High Fiber', 'Iron Rich'] },
      { name: 'Derek Tibs', description: 'Dry-fried beef with jalapeño and rosemary', calories: 460, protein: 40, iron: 5.2, fiber: 1, fat: 24, carbs: 12, vitaminC: 10, tags: ['High Protein', 'Athlete Friendly'] },
    ]
  },
  {
    id: 'r3',
    name: 'Lucy Ethiopian Cafe',
    type: 'Cafe',
    lat: 9.0182,
    lng: 38.7480,
    rating: 4.9,
    reviews: 2103,
    priceLevel: '$',
    phone: '+251-11-442-7890',
    hours: '7:00 AM – 9:00 PM',
    address: 'Piazza, Addis Ababa',
    description: 'Student-friendly café with affordable, iron-rich Ethiopian staples and fresh juices.',
    photoUrl: '',
    nutritionTags: ['Budget Friendly', 'Iron Rich', 'Student Favorite'],
    mealTypes: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    nutritionGoals: ['High Iron', 'Weight Loss', 'Diabetic Friendly'],
    popularDishes: ['Misir Wat', 'Kinche', 'Fresh Juice'],
    menu: [
      { name: 'Misir Wat (Red Lentils)', description: 'Spiced red lentil stew – iron powerhouse', calories: 280, protein: 18, iron: 6.5, fiber: 10, fat: 4, carbs: 42, vitaminC: 6, tags: ['High Iron', 'High Fiber', 'Vegan'] },
      { name: 'Kinche', description: 'Cracked wheat porridge with spiced butter', calories: 320, protein: 10, iron: 2.4, fiber: 6, fat: 8, carbs: 55, vitaminC: 2, tags: ['Energy Boost', 'Heart Healthy'] },
      { name: 'Teff Injera + Beyaynetu', description: '100% teff injera with mixed vegan stews', calories: 380, protein: 14, iron: 7.2, fiber: 12, fat: 6, carbs: 60, vitaminC: 22, tags: ['Iron Rich', 'Diabetic Friendly', 'High Fiber'] },
      { name: 'Avocado Juice', description: 'Fresh blended avocado with lime', calories: 220, protein: 3, iron: 0.8, fiber: 7, fat: 15, carbs: 18, vitaminC: 14, tags: ['Energy Boost', 'Heart Healthy'] },
    ]
  },
  {
    id: 'r4',
    name: "Zeni's Kitchen",
    type: 'Healthy Food',
    lat: 9.0230,
    lng: 38.7550,
    rating: 4.3,
    reviews: 467,
    priceLevel: '$$',
    phone: '+251-91-234-5678',
    hours: '8:00 AM – 8:00 PM',
    address: 'Sarbet, Addis Ababa',
    description: 'Health-focused restaurant specializing in gluten-free teff and organic vegetable dishes.',
    photoUrl: '',
    nutritionTags: ['Gluten-Free', 'Organic', 'Diabetic Friendly'],
    mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
    nutritionGoals: ['Diabetic Friendly', 'High Fiber', 'Heart Healthy', 'Weight Loss'],
    popularDishes: ['Pure Teff Injera', 'Organic Beyaynetu', 'Herbal Tea'],
    menu: [
      { name: 'Pure Teff Beyaynetu', description: '100% teff injera with 8 organic vegan stews', calories: 400, protein: 16, iron: 8.0, fiber: 15, fat: 5, carbs: 62, vitaminC: 30, tags: ['Diabetic Friendly', 'High Fiber', 'Iron Rich'] },
      { name: 'Grilled Fish + Greens', description: 'Lake fish with sautéed organic greens', calories: 340, protein: 32, iron: 3.0, fiber: 5, fat: 12, carbs: 18, vitaminC: 25, tags: ['Heart Healthy', 'High Protein', 'Weight Loss'] },
      { name: 'Quinoa Power Bowl', description: 'Ethiopian-spiced quinoa with roasted vegetables', calories: 380, protein: 14, iron: 4.2, fiber: 10, fat: 10, carbs: 52, vitaminC: 18, tags: ['High Fiber', 'Energy Boost'] },
      { name: 'Herbal Wellness Tea', description: 'Ethiopian herbs blend – anti-inflammatory', calories: 5, protein: 0, iron: 0.3, fiber: 0, fat: 0, carbs: 1, vitaminC: 8, tags: ['Heart Healthy'] },
    ]
  },
  {
    id: 'r5',
    name: 'FitBowl Addis',
    type: 'Fitness Focused',
    lat: 9.0090,
    lng: 38.7830,
    rating: 4.7,
    reviews: 623,
    priceLevel: '$$',
    phone: '+251-91-876-5432',
    hours: '6:00 AM – 9:00 PM',
    address: 'CMC, Addis Ababa',
    description: 'Gym-adjacent nutrition bar serving protein bowls, smoothies, and macro-counted meals.',
    photoUrl: '',
    nutritionTags: ['Athlete Friendly', 'High Protein', 'Macro Counted', 'Post-Workout'],
    mealTypes: ['Breakfast', 'Lunch', 'Snacks'],
    nutritionGoals: ['High Protein', 'Weight Loss', 'Weight Gain', 'Energy Boost'],
    popularDishes: ['Protein Power Bowl', 'Post-Workout Shake', 'Grilled Chicken Wrap'],
    menu: [
      { name: 'Protein Power Bowl', description: 'Grilled chicken, quinoa, egg, avocado, greens', calories: 520, protein: 45, iron: 4.5, fiber: 8, fat: 18, carbs: 38, vitaminC: 20, tags: ['High Protein', 'Athlete Friendly'] },
      { name: 'Post-Workout Shake', description: 'Banana, peanut butter, whey protein, oat milk', calories: 380, protein: 35, iron: 2.0, fiber: 4, fat: 12, carbs: 32, vitaminC: 10, tags: ['High Protein', 'Energy Boost'] },
      { name: 'Lean Grilled Wrap', description: 'Grilled chicken, hummus, lettuce, tomato in whole wheat', calories: 420, protein: 38, iron: 3.2, fiber: 6, fat: 14, carbs: 35, vitaminC: 15, tags: ['High Protein', 'Weight Loss'] },
      { name: 'Mass Gainer Plate', description: 'Double chicken, rice, sweet potato, egg', calories: 780, protein: 55, iron: 5.0, fiber: 5, fat: 22, carbs: 72, vitaminC: 8, tags: ['Weight Gain', 'High Protein'] },
    ]
  },
  {
    id: 'r6',
    name: 'Kaldi\'s Coffee',
    type: 'Cafe',
    lat: 9.0145,
    lng: 38.7680,
    rating: 4.4,
    reviews: 3421,
    priceLevel: '$',
    phone: '+251-11-550-1234',
    hours: '6:30 AM – 10:00 PM',
    address: 'Bole Medhanialem, Addis Ababa',
    description: 'Ethiopia\'s beloved coffee chain offering light healthy snacks and fresh juices alongside premium coffee.',
    photoUrl: '',
    nutritionTags: ['Light Bites', 'Fresh Juice', 'Coffee'],
    mealTypes: ['Breakfast', 'Snacks'],
    nutritionGoals: ['Energy Boost', 'Weight Loss'],
    popularDishes: ['Avocado Toast', 'Fresh Juice Combo', 'Egg Sandwich'],
    menu: [
      { name: 'Avocado Toast', description: 'Whole grain toast with smashed avocado and poached egg', calories: 320, protein: 14, iron: 2.0, fiber: 7, fat: 16, carbs: 28, vitaminC: 10, tags: ['Energy Boost', 'Heart Healthy'] },
      { name: 'Layer Juice Combo', description: 'Avocado, mango, papaya layered fresh juice', calories: 280, protein: 4, iron: 1.2, fiber: 8, fat: 10, carbs: 42, vitaminC: 45, tags: ['Energy Boost', 'High Fiber'] },
      { name: 'Egg & Veggie Sandwich', description: 'Scrambled eggs with tomato, pepper, onion on whole wheat', calories: 340, protein: 18, iron: 2.5, fiber: 4, fat: 12, carbs: 35, vitaminC: 18, tags: ['High Protein', 'Energy Boost'] },
      { name: 'Ethiopian Coffee Ceremony', description: 'Traditional Buna with popcorn (kolo)', calories: 80, protein: 2, iron: 0.5, fiber: 1, fat: 1, carbs: 14, vitaminC: 0, tags: ['Low Calorie'] },
    ]
  },
  {
    id: 'r7',
    name: 'Kategna Restaurant',
    type: 'Ethiopian',
    lat: 9.0200,
    lng: 38.7700,
    rating: 4.6,
    reviews: 1856,
    priceLevel: '$$',
    phone: '+251-11-663-4500',
    hours: '11:30 AM – 10:30 PM',
    address: 'Bole, Addis Ababa',
    description: 'Award-winning Ethiopian restaurant known for authentic recipes and generous portions of traditional stews.',
    photoUrl: '',
    nutritionTags: ['Traditional', 'Iron Rich', 'Generous Portions'],
    mealTypes: ['Lunch', 'Dinner'],
    nutritionGoals: ['High Protein', 'High Iron', 'Weight Gain', 'Energy Boost'],
    popularDishes: ['Special Kitfo', 'Doro Wat', 'Gored Gored'],
    menu: [
      { name: 'Special Kitfo', description: 'Premium minced beef with korerima and mitmita', calories: 420, protein: 44, iron: 6.2, fiber: 0, fat: 26, carbs: 3, vitaminC: 3, tags: ['High Protein', 'Iron Rich'] },
      { name: 'Siga Tibs', description: 'Cubed beef sautéed with rosemary and butter', calories: 480, protein: 38, iron: 4.8, fiber: 2, fat: 28, carbs: 15, vitaminC: 8, tags: ['High Protein', 'Energy Boost'] },
      { name: 'Gored Gored', description: 'Cubed raw beef with awaze sauce', calories: 350, protein: 40, iron: 5.5, fiber: 0, fat: 20, carbs: 2, vitaminC: 5, tags: ['High Protein', 'Iron Rich', 'Low Carb'] },
      { name: 'Genfo', description: 'Traditional barley porridge with spiced butter', calories: 450, protein: 8, iron: 3.0, fiber: 4, fat: 16, carbs: 68, vitaminC: 0, tags: ['Energy Boost', 'Weight Gain'] },
    ]
  },
  {
    id: 'r8',
    name: 'Avocado Village',
    type: 'Healthy Food',
    lat: 9.0060,
    lng: 38.7590,
    rating: 4.2,
    reviews: 298,
    priceLevel: '$',
    phone: '+251-92-345-6789',
    hours: '7:00 AM – 7:00 PM',
    address: 'Mexico Square, Addis Ababa',
    description: 'Plant-forward eatery specializing in avocado-based meals, smoothie bowls, and whole food nutrition.',
    photoUrl: '',
    nutritionTags: ['Vegan Friendly', 'Heart Healthy', 'Whole Foods'],
    mealTypes: ['Breakfast', 'Lunch', 'Snacks'],
    nutritionGoals: ['Heart Healthy', 'Weight Loss', 'High Fiber', 'Energy Boost'],
    popularDishes: ['Avo Bowl', 'Smoothie Bowl', 'Veggie Wrap'],
    menu: [
      { name: 'Avo Power Bowl', description: 'Avocado, chickpeas, roasted sweet potato, kale, tahini', calories: 420, protein: 15, iron: 4.0, fiber: 14, fat: 20, carbs: 48, vitaminC: 32, tags: ['Heart Healthy', 'High Fiber', 'Vegan'] },
      { name: 'Green Smoothie Bowl', description: 'Spinach, banana, chia seeds, granola topping', calories: 310, protein: 10, iron: 3.5, fiber: 9, fat: 8, carbs: 52, vitaminC: 28, tags: ['High Fiber', 'Energy Boost'] },
      { name: 'Whole Wheat Veggie Wrap', description: 'Hummus, grilled veggies, avocado in whole wheat', calories: 380, protein: 12, iron: 3.0, fiber: 10, fat: 16, carbs: 46, vitaminC: 20, tags: ['Heart Healthy', 'Weight Loss'] },
      { name: 'Detox Juice', description: 'Ginger, lemon, turmeric, carrot, apple', calories: 110, protein: 1, iron: 0.8, fiber: 2, fat: 0, carbs: 26, vitaminC: 40, tags: ['Low Calorie', 'Energy Boost'] },
    ]
  },
  {
    id: 'r9',
    name: 'Tomoca Coffee House',
    type: 'Cafe',
    lat: 9.0165,
    lng: 38.7530,
    rating: 4.6,
    reviews: 4200,
    priceLevel: '$',
    phone: '+251-11-111-2345',
    hours: '6:00 AM – 8:00 PM',
    address: 'Wavel Street, Piazza, Addis Ababa',
    description: 'Legendary Ethiopian coffee house since 1953. Light traditional snacks with authentic coffee experience.',
    photoUrl: '',
    nutritionTags: ['Heritage', 'Light Bites', 'Coffee Culture'],
    mealTypes: ['Breakfast', 'Snacks'],
    nutritionGoals: ['Energy Boost'],
    popularDishes: ['Macchiato', 'Kolo', 'Ambasha Bread'],
    menu: [
      { name: 'Tomoca Macchiato', description: 'Signature espresso macchiato – the original', calories: 45, protein: 2, iron: 0.3, fiber: 0, fat: 2, carbs: 4, vitaminC: 0, tags: ['Low Calorie', 'Energy Boost'] },
      { name: 'Kolo Mix', description: 'Roasted barley, peanuts, and chickpeas snack', calories: 280, protein: 12, iron: 2.5, fiber: 6, fat: 10, carbs: 36, vitaminC: 0, tags: ['High Fiber', 'Energy Boost'] },
      { name: 'Ambasha Bread', description: 'Traditional sweet bread with cardamom', calories: 320, protein: 6, iron: 1.8, fiber: 2, fat: 8, carbs: 56, vitaminC: 0, tags: ['Energy Boost'] },
      { name: 'Chechebsa', description: 'Flatbread torn and mixed with spiced butter and berbere', calories: 440, protein: 8, iron: 2.2, fiber: 3, fat: 18, carbs: 60, vitaminC: 2, tags: ['Energy Boost', 'Weight Gain'] },
    ]
  },
  {
    id: 'r10',
    name: 'Saro-Maria Hotel Restaurant',
    type: 'Ethiopian',
    lat: 9.0110,
    lng: 38.7750,
    rating: 4.4,
    reviews: 678,
    priceLevel: '$$$',
    phone: '+251-11-662-3300',
    hours: '6:00 AM – 11:00 PM',
    address: 'Bole Sub City, Addis Ababa',
    description: 'Hotel fine dining with health-conscious Ethiopian and international options. Chef-curated wellness menu.',
    photoUrl: '',
    nutritionTags: ['Chef Curated', 'Wellness Menu', 'Fine Dining'],
    mealTypes: ['Breakfast', 'Lunch', 'Dinner'],
    nutritionGoals: ['Heart Healthy', 'High Protein', 'Diabetic Friendly', 'Weight Loss'],
    popularDishes: ['Wellness Plate', 'Grilled Salmon', 'Detox Salad'],
    menu: [
      { name: 'Wellness Power Plate', description: 'Grilled chicken, quinoa, steamed broccoli, avocado', calories: 480, protein: 42, iron: 3.8, fiber: 8, fat: 16, carbs: 34, vitaminC: 35, tags: ['High Protein', 'Heart Healthy'] },
      { name: 'Grilled Nile Perch', description: 'Fresh lake fish with lemon butter sauce and salad', calories: 360, protein: 35, iron: 2.5, fiber: 3, fat: 14, carbs: 18, vitaminC: 22, tags: ['Heart Healthy', 'Weight Loss'] },
      { name: 'Detox Super Salad', description: 'Kale, beetroot, pomegranate, walnuts, lemon dressing', calories: 220, protein: 8, iron: 4.0, fiber: 10, fat: 10, carbs: 26, vitaminC: 45, tags: ['Weight Loss', 'High Fiber', 'Iron Rich'] },
      { name: 'Diabetic-Friendly Platter', description: 'Low-GI grain bowl with lean protein and vegetables', calories: 380, protein: 28, iron: 3.5, fiber: 12, fat: 10, carbs: 38, vitaminC: 20, tags: ['Diabetic Friendly', 'High Fiber'] },
    ]
  },
  {
    id: 'r11',
    name: 'Effoi Pizza & Salads',
    type: 'Fast Casual',
    lat: 9.0175,
    lng: 38.7620,
    rating: 4.1,
    reviews: 512,
    priceLevel: '$',
    phone: '+251-91-555-8888',
    hours: '10:00 AM – 10:00 PM',
    address: '4 Kilo, Addis Ababa',
    description: 'Fast casual dining with freshly made salads, wraps, and health-conscious pizza options.',
    photoUrl: '',
    nutritionTags: ['Fast Casual', 'Fresh Salads', 'Student Friendly'],
    mealTypes: ['Lunch', 'Dinner', 'Snacks'],
    nutritionGoals: ['Weight Loss', 'Energy Boost', 'High Fiber'],
    popularDishes: ['Garden Mega Salad', 'Veggie Wrap', 'Thin Crust Veggie Pizza'],
    menu: [
      { name: 'Garden Mega Salad', description: 'Mixed greens, grilled chicken, avocado, seeds, balsamic', calories: 320, protein: 24, iron: 3.0, fiber: 8, fat: 14, carbs: 22, vitaminC: 30, tags: ['Weight Loss', 'High Protein'] },
      { name: 'Mediterranean Wrap', description: 'Falafel, hummus, tabbouleh, pickled vegetables', calories: 400, protein: 14, iron: 3.5, fiber: 9, fat: 16, carbs: 48, vitaminC: 18, tags: ['High Fiber', 'Heart Healthy'] },
      { name: 'Thin Crust Veggie Pizza', description: 'Light pizza with mushrooms, peppers, olives, mozzarella', calories: 480, protein: 18, iron: 2.5, fiber: 4, fat: 16, carbs: 62, vitaminC: 15, tags: ['Energy Boost'] },
      { name: 'Protein Salad Bowl', description: 'Quinoa, boiled eggs, tuna, chickpeas, cherry tomatoes', calories: 420, protein: 35, iron: 4.2, fiber: 7, fat: 14, carbs: 32, vitaminC: 22, tags: ['High Protein', 'Weight Loss'] },
    ]
  },
  {
    id: 'r12',
    name: 'Makush Art Gallery & Restaurant',
    type: 'Ethiopian',
    lat: 9.0140,
    lng: 38.7660,
    rating: 4.5,
    reviews: 1034,
    priceLevel: '$$$',
    phone: '+251-11-550-9999',
    hours: '12:00 PM – 10:00 PM',
    address: 'Bole Atlas, Addis Ababa',
    description: 'Art gallery restaurant combining culture with cuisine. Ethiopian-fusion menu with wellness-friendly options.',
    photoUrl: '',
    nutritionTags: ['Fusion', 'Art Gallery', 'Premium Experience'],
    mealTypes: ['Lunch', 'Dinner'],
    nutritionGoals: ['High Protein', 'Heart Healthy', 'Energy Boost'],
    popularDishes: ['Fusion Tibs', 'Art Platter', 'Honey Wine'],
    menu: [
      { name: 'Fusion Tibs Platter', description: 'Beef tibs with Mediterranean herbs and roasted vegetables', calories: 460, protein: 36, iron: 4.5, fiber: 5, fat: 20, carbs: 28, vitaminC: 18, tags: ['High Protein', 'Athlete Friendly'] },
      { name: 'Art Gallery Beyaynetu', description: 'Beautifully plated 10-item vegan platter on teff injera', calories: 440, protein: 20, iron: 7.5, fiber: 16, fat: 7, carbs: 68, vitaminC: 35, tags: ['High Fiber', 'Iron Rich', 'Vegan'] },
      { name: 'Grilled Lamb Chops', description: 'Herb-crusted lamb with sweet potato mash', calories: 520, protein: 40, iron: 3.8, fiber: 3, fat: 28, carbs: 25, vitaminC: 12, tags: ['High Protein', 'Energy Boost'] },
      { name: 'Tej (Honey Wine)', description: 'Traditional Ethiopian honey wine', calories: 180, protein: 0, iron: 0.2, fiber: 0, fat: 0, carbs: 22, vitaminC: 2, tags: [] },
    ]
  },
];

// --- Distance Calculation (Haversine) ---

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal
}

// --- AI Restaurant Matching ---

export function matchRestaurants(
  userLat: number,
  userLng: number,
  profile: HealthProfile | null,
  filters: {
    distance?: DistanceFilter;
    mealType?: MealTypeFilter;
    nutritionGoal?: NutritionGoal;
    restaurantType?: RestaurantType;
  }
): RestaurantMatch[] {
  let results: RestaurantMatch[] = [];

  for (const restaurant of RESTAURANTS) {
    const dist = calculateDistance(userLat, userLng, restaurant.lat, restaurant.lng);

    // Distance filter
    if (filters.distance && dist > filters.distance) continue;

    // Meal type filter
    if (filters.mealType && !restaurant.mealTypes.includes(filters.mealType)) continue;

    // Restaurant type filter
    if (filters.restaurantType && restaurant.type !== filters.restaurantType) continue;

    // Nutrition goal filter
    if (filters.nutritionGoal && !restaurant.nutritionGoals.includes(filters.nutritionGoal)) continue;

    // AI scoring
    const { matchScore, recommendedDish, nutritionScore, proteinScore, vitaminScore, aiReason, tags } =
      scoreRestaurant(restaurant, profile);

    results.push({
      restaurant,
      distance: dist,
      matchScore,
      recommendedDish,
      nutritionScore,
      proteinScore,
      vitaminScore,
      aiReason,
      tags,
    });
  }

  // Sort by match score (descending), then distance (ascending)
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.distance - b.distance;
  });

  return results;
}

// --- AI Scoring Engine ---

function scoreRestaurant(
  restaurant: Restaurant,
  profile: HealthProfile | null
): {
  matchScore: number;
  recommendedDish: MenuItem | null;
  nutritionScore: number;
  proteinScore: number;
  vitaminScore: number;
  aiReason: string;
  tags: string[];
} {
  let matchScore = 50; // Base score
  const tags: string[] = [];
  const reasons: string[] = [];

  if (!profile) {
    // No profile — score by restaurant quality
    const bestDish = restaurant.menu.reduce((a, b) => (a.protein + a.fiber > b.protein + b.fiber ? a : b));
    return {
      matchScore: 50 + Math.round(restaurant.rating * 5),
      recommendedDish: bestDish,
      nutritionScore: 70,
      proteinScore: Math.min(100, Math.round((bestDish.protein / 40) * 100)),
      vitaminScore: Math.min(100, Math.round((bestDish.vitaminC / 30) * 100)),
      aiReason: `${bestDish.name} is a nutritious choice with ${bestDish.protein}g protein and ${bestDish.fiber}g fiber.`,
      tags: restaurant.nutritionTags.slice(0, 4),
    };
  }

  // Goal matching
  const goals = profile.goals || [];
  const conditions = profile.conditions || [];

  // Score menu items for user
  let bestDish: MenuItem | null = null;
  let bestDishScore = 0;

  for (const item of restaurant.menu) {
    let itemScore = 0;

    // Protein scoring
    if (goals.includes('Muscle Building') || goals.includes('Weight Gain')) {
      itemScore += item.protein * 2;
      if (item.protein > 30) { tags.push('High Protein'); }
    }

    // Weight loss scoring
    if (goals.includes('Weight Loss')) {
      itemScore += item.calories < 400 ? 30 : item.calories < 500 ? 15 : 0;
      itemScore += item.fiber * 2;
      if (item.calories < 400) tags.push('Low Calorie');
    }

    // Energy scoring
    if (goals.includes('Better Energy')) {
      itemScore += item.carbs > 30 ? 10 : 0;
      itemScore += item.iron * 3;
    }

    // Condition scoring
    if (conditions.includes('Anemia')) {
      itemScore += item.iron * 5;
      if (item.iron > 4) tags.push('Iron Rich');
    }
    if (conditions.includes('Diabetes')) {
      itemScore += item.carbs < 40 ? 20 : 0;
      itemScore += item.fiber * 3;
      if (item.fiber > 8) tags.push('Diabetic Friendly');
    }
    if (conditions.includes('Hypertension') || conditions.includes('Heart Disease')) {
      itemScore += item.fat < 15 ? 20 : 0;
      if (item.fat < 15) tags.push('Heart Healthy');
    }
    if (conditions.includes('High Cholesterol')) {
      itemScore += item.fat < 12 ? 25 : 0;
    }

    // General nutrition quality
    itemScore += item.protein * 1.5;
    itemScore += item.fiber * 1;
    itemScore += item.iron * 2;
    itemScore += item.vitaminC * 0.5;

    if (itemScore > bestDishScore) {
      bestDishScore = itemScore;
      bestDish = item;
    }
  }

  // Build match score from goals alignment
  for (const goal of goals) {
    if (restaurant.nutritionGoals.includes(goal as NutritionGoal)) {
      matchScore += 12;
    }
  }

  // Condition alignment bonus
  for (const cond of conditions) {
    if (cond === 'Anemia' && restaurant.nutritionTags.some(t => t.includes('Iron'))) matchScore += 10;
    if (cond === 'Diabetes' && restaurant.nutritionGoals.includes('Diabetic Friendly')) matchScore += 10;
    if (cond === 'Hypertension' && restaurant.nutritionGoals.includes('Heart Healthy')) matchScore += 10;
  }

  // Rating bonus
  matchScore += Math.round(restaurant.rating * 3);

  // Cap at 100
  matchScore = Math.min(100, matchScore);

  // Generate AI reason
  if (bestDish) {
    if (goals.includes('Muscle Building')) {
      reasons.push(`This meal aligns with your muscle-building goal with ${bestDish.protein}g protein`);
    }
    if (goals.includes('Weight Loss')) {
      reasons.push(`Only ${bestDish.calories} calories — fits your weight loss target`);
    }
    if (conditions.includes('Anemia') && bestDish.iron > 3) {
      reasons.push(`improves iron intake (${bestDish.iron}mg per serving)`);
    }
    if (conditions.includes('Diabetes') && bestDish.fiber > 6) {
      reasons.push(`high fiber (${bestDish.fiber}g) supports blood sugar management`);
    }
    if (goals.includes('Better Energy')) {
      reasons.push(`provides sustained energy from balanced macros`);
    }
  }

  const aiReason = reasons.length > 0
    ? reasons.join(' and ') + '.'
    : bestDish
      ? `${bestDish.name} offers ${bestDish.protein}g protein and ${bestDish.calories} cal — a solid nutritious choice.`
      : 'This restaurant offers nutritious meal options.';

  // Deduplicate tags
  const uniqueTags = [...new Set([...tags, ...restaurant.nutritionTags.slice(0, 2)])].slice(0, 5);

  const nutritionScore = bestDish
    ? Math.min(100, Math.round(
        (bestDish.protein / 40) * 25 +
        (bestDish.fiber / 12) * 20 +
        (bestDish.iron / 6) * 25 +
        (bestDish.vitaminC / 30) * 15 +
        (bestDish.calories < 600 ? 15 : 5)
      ))
    : 50;

  const proteinScore = bestDish
    ? Math.min(100, Math.round((bestDish.protein / 45) * 100))
    : 50;

  const vitaminScore = bestDish
    ? Math.min(100, Math.round((bestDish.vitaminC / 35) * 100))
    : 50;

  return {
    matchScore,
    recommendedDish: bestDish,
    nutritionScore,
    proteinScore,
    vitaminScore,
    aiReason: aiReason.charAt(0).toUpperCase() + aiReason.slice(1),
    tags: uniqueTags,
  };
}

// --- AI Wellness Recommendation Messages ---

export function generateWellnessMessage(profile: HealthProfile | null): string {
  if (!profile) return 'Complete your health profile to get personalized restaurant recommendations.';

  const goals = profile.goals || [];
  const conditions = profile.conditions || [];

  if (conditions.includes('Anemia')) {
    return 'Based on your low iron trend, try nearby restaurants offering iron-rich meals like Kitfo, Misir Wat, and Teff Injera.';
  }
  if (goals.includes('Muscle Building')) {
    return 'You are focused on muscle building. These restaurants offer high-protein meal options like Tibs, Doro Wat, and protein bowls.';
  }
  if (goals.includes('Weight Loss')) {
    return 'Your wellness goal is weight loss. These menu items better fit your calorie target with high fiber and lean protein.';
  }
  if (conditions.includes('Diabetes')) {
    return 'Based on your diabetes management profile, we highlight restaurants with low-GI, high-fiber meal options.';
  }
  if (goals.includes('Better Energy')) {
    return 'Need an energy boost? These restaurants offer balanced meals with complex carbs and iron for sustained energy.';
  }

  return 'Based on your health profile, we\'ve matched restaurants that align with your nutrition goals.';
}
