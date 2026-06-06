"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Star, Filter, Navigation, Utensils, Heart,
  Phone, Clock, ChevronRight, ChevronLeft, X, Search,
  Locate, AlertCircle, Sparkles, Zap, Target, Flame,
  Leaf, Shield, ArrowUpRight, RefreshCw, SlidersHorizontal
} from "lucide-react";

import {
  matchRestaurants,
  generateWellnessMessage,
  RESTAURANTS,
  type Restaurant,
  type RestaurantMatch,
  type MenuItem,
  type DistanceFilter,
  type MealTypeFilter,
  type NutritionGoal,
  type RestaurantType,
} from "@/lib/restaurantRecommendationEngine";

import {
  getHealthProfile,
  getFavoriteRestaurants,
  saveFavoriteRestaurant,
  removeFavoriteRestaurant,
  isFavoriteRestaurant,
  addRecentlyVisited,
  getRecentlyVisited,
} from "@/lib/storage";

import type { HealthProfile } from "@/lib/types";

// ==========================================================================
// RESTAURANTS VIEW — PREMIUM NEARBY RESTAURANT FINDER
// ==========================================================================

type ListTab = 'all' | 'favorites' | 'recent';

export default function RestaurantsView() {
  // --- Location State ---
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const watchIdRef = useRef<number | null>(null);

  // --- Data State ---
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [matches, setMatches] = useState<RestaurantMatch[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyVisited, setRecentlyVisited] = useState<string[]>([]);

  // --- UI State ---
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantMatch | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [listTab, setListTab] = useState<ListTab>('all');
  const [mapFullscreen, setMapFullscreen] = useState(false);

  // --- Filter State ---
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter | undefined>(undefined);
  const [mealTypeFilter, setMealTypeFilter] = useState<MealTypeFilter | undefined>(undefined);
  const [nutritionGoalFilter, setNutritionGoalFilter] = useState<NutritionGoal | undefined>(undefined);
  const [restaurantTypeFilter, setRestaurantTypeFilter] = useState<RestaurantType | undefined>(undefined);

  // --- Load Profile & Favorites ---
  useEffect(() => {
    setProfile(getHealthProfile());
    setFavorites(getFavoriteRestaurants());
    setRecentlyVisited(getRecentlyVisited());
  }, []);

  // --- Geolocation ---
  const requestLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    // Clear any existing watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setLocationLoading(false);
        setLocationError(null);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access is required to find nearby restaurants.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
        }
        // Fallback: Addis Ababa center
        setUserLat(9.0150);
        setUserLng(38.7636);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [requestLocation]);

  // --- Match Restaurants When Location or Filters Change ---
  useEffect(() => {
    if (userLat === null || userLng === null) return;

    const results = matchRestaurants(userLat, userLng, profile, {
      distance: distanceFilter,
      mealType: mealTypeFilter,
      nutritionGoal: nutritionGoalFilter,
      restaurantType: restaurantTypeFilter,
    });

    setMatches(results);
  }, [userLat, userLng, profile, distanceFilter, mealTypeFilter, nutritionGoalFilter, restaurantTypeFilter]);

  // --- Filtered Display List ---
  const displayList = (() => {
    if (listTab === 'favorites') {
      return matches.filter(m => favorites.includes(m.restaurant.id));
    }
    if (listTab === 'recent') {
      return matches.filter(m => recentlyVisited.includes(m.restaurant.id));
    }
    return matches;
  })();

  // --- Toggle Favorite ---
  const toggleFavorite = (id: string) => {
    if (isFavoriteRestaurant(id)) {
      removeFavoriteRestaurant(id);
    } else {
      saveFavoriteRestaurant(id);
    }
    setFavorites(getFavoriteRestaurants());
  };

  // --- Select Restaurant ---
  const handleSelectRestaurant = (match: RestaurantMatch) => {
    setSelectedRestaurant(match);
    addRecentlyVisited(match.restaurant.id);
    setRecentlyVisited(getRecentlyVisited());
  };

  // --- Get Directions URL ---
  const getDirectionsUrl = (restaurant: Restaurant, mode: 'driving' | 'walking' | 'transit' = 'driving') => {
    const origin = userLat && userLng ? `${userLat},${userLng}` : '';
    const dest = `${restaurant.lat},${restaurant.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${mode}`;
  };

  // --- Map iframe URL ---
  const getMapUrl = () => {
    if (!userLat || !userLng) return '';
    const zoom = distanceFilter ? (distanceFilter <= 1 ? 16 : distanceFilter <= 3 ? 15 : distanceFilter <= 5 ? 14 : 13) : 14;
    if (selectedRestaurant) {
      const r = selectedRestaurant.restaurant;
      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLat},${userLng}&destination=${r.lat},${r.lng}&mode=walking&zoom=${zoom}`;
    }
    return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${userLat},${userLng}&zoom=${zoom}&maptype=roadmap`;
  };

  // --- Wellness Message ---
  const wellnessMessage = generateWellnessMessage(profile);

  const activeFilterCount = [distanceFilter, mealTypeFilter, nutritionGoalFilter, restaurantTypeFilter].filter(Boolean).length;

  const clearFilters = () => {
    setDistanceFilter(undefined);
    setMealTypeFilter(undefined);
    setNutritionGoalFilter(undefined);
    setRestaurantTypeFilter(undefined);
  };

  // ======================================================================
  // RENDER
  // ======================================================================

  // --- Location Permission Denied State ---
  if (locationError && userLat === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col items-center justify-center text-center p-8"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-6">
          <MapPin size={36} className="text-[var(--color-primary)]" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Location Required</h2>
        <p className="text-neutral-400 max-w-md mb-8">{locationError}</p>
        <button
          onClick={requestLocation}
          className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl font-bold transition shadow-glow flex items-center gap-2"
        >
          <Locate size={18} />
          Enable Location
        </button>
      </motion.div>
    );
  }

  // --- Loading State ---
  if (locationLoading && userLat === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center"
      >
        <div className="w-16 h-16 relative mb-6">
          <div className="absolute inset-0 border-4 border-[var(--color-neutral-dark)] border-t-[var(--color-primary)] rounded-full animate-spin" />
          <MapPin size={20} className="absolute inset-0 m-auto text-[var(--color-primary)]" />
        </div>
        <h3 className="text-xl font-bold">Finding Your Location...</h3>
        <p className="text-neutral-400 mt-2 text-sm">Detecting GPS coordinates</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-3">
            <span className="text-2xl">🍽</span> Nearby Restaurants
          </h2>
          <p className="text-neutral-400 text-sm">
            Find healthy meals near you based on your wellness goals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
              showFilters || activeFilterCount > 0
                ? "bg-[var(--color-primary)] text-white shadow-glow"
                : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-secondary)] rounded-full text-[10px] font-bold flex items-center justify-center text-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* AI Wellness Context Bar */}
      <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/5 border border-[var(--color-primary)]/20 p-3 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--color-secondary)] shrink-0" />
          <p className="text-xs text-neutral-300 leading-relaxed">{wellnessMessage}</p>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden shrink-0"
          >
            <div className="glass p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">Smart Filters</h4>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer">
                    Clear All
                  </button>
                )}
              </div>

              {/* Distance */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">📍 Distance</label>
                <div className="flex gap-2 flex-wrap">
                  {([1, 3, 5, 10] as DistanceFilter[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDistanceFilter(distanceFilter === d ? undefined : d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        distanceFilter === d
                          ? "bg-[var(--color-primary)] text-white shadow-glow"
                          : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
                      }`}
                    >
                      Within {d} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Type */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">🍴 Meal Type</label>
                <div className="flex gap-2 flex-wrap">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealTypeFilter[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMealTypeFilter(mealTypeFilter === m ? undefined : m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        mealTypeFilter === m
                          ? "bg-[var(--color-primary)] text-white shadow-glow"
                          : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition Goals */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">🎯 Nutrition Goals</label>
                <div className="flex gap-2 flex-wrap">
                  {(['High Protein', 'Weight Loss', 'Weight Gain', 'Energy Boost', 'Heart Healthy', 'Diabetic Friendly', 'High Iron', 'High Fiber'] as NutritionGoal[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setNutritionGoalFilter(nutritionGoalFilter === n ? undefined : n)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        nutritionGoalFilter === n
                          ? "bg-[var(--color-primary)] text-white shadow-glow"
                          : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restaurant Type */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">🏪 Restaurant Type</label>
                <div className="flex gap-2 flex-wrap">
                  {(['Ethiopian', 'Healthy Food', 'Cafe', 'Fast Casual', 'Fitness Focused'] as RestaurantType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRestaurantTypeFilter(restaurantTypeFilter === t ? undefined : t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        restaurantTypeFilter === t
                          ? "bg-[var(--color-primary)] text-white shadow-glow"
                          : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">

        {/* LEFT: Restaurant List */}
        <div className="w-full lg:w-1/2 flex flex-col gap-3 min-h-0">

          {/* List Tabs */}
          <div className="flex gap-1 bg-[var(--color-neutral-dark)] p-1 rounded-xl shrink-0">
            {([
              { key: 'all', label: 'All Results', icon: <Search size={13} /> },
              { key: 'favorites', label: 'Favorites', icon: <Heart size={13} /> },
              { key: 'recent', label: 'Recent', icon: <Clock size={13} /> },
            ] as { key: ListTab; label: string; icon: React.ReactNode }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setListTab(tab.key)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  listTab === tab.key
                    ? "bg-[var(--color-card)] text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Restaurant Cards */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {displayList.length > 0 ? displayList.map((match, i) => (
                <motion.div
                  key={match.restaurant.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleSelectRestaurant(match)}
                  className={`glass p-4 rounded-2xl cursor-pointer transition-all group ${
                    selectedRestaurant?.restaurant.id === match.restaurant.id
                      ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30"
                      : "hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm truncate">{match.restaurant.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold shrink-0">
                          {match.matchScore}% match
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
                        <span className="flex items-center gap-0.5 text-yellow-400 font-medium">
                          <Star size={11} fill="currentColor" /> {match.restaurant.rating}
                        </span>
                        <span>({match.restaurant.reviews})</span>
                        <span>•</span>
                        <span className="text-green-400 font-medium">{match.restaurant.priceLevel}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><MapPin size={11} /> {match.distance} km</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(match.restaurant.id); }}
                      className="p-1.5 rounded-full hover:bg-[var(--color-neutral-dark)] transition cursor-pointer shrink-0"
                    >
                      <Heart
                        size={16}
                        className={favorites.includes(match.restaurant.id) ? "text-red-400 fill-red-400" : "text-neutral-500"}
                      />
                    </button>
                  </div>

                  {/* Nutrition Tags */}
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {match.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Recommendation */}
                  {match.recommendedDish && (
                    <div className="bg-[var(--color-neutral-dark)] p-2.5 rounded-xl border border-[var(--color-card-border)]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Utensils size={10} className="text-[var(--color-primary)]" />
                        <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">Recommended For You</span>
                      </div>
                      <p className="text-xs font-medium text-white">{match.recommendedDish.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">{match.aiReason}</p>
                    </div>
                  )}
                </motion.div>
              )) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-neutral-dark)] flex items-center justify-center mb-4">
                    <Search size={24} className="text-neutral-500" />
                  </div>
                  <h4 className="font-bold mb-2 text-neutral-300">
                    {listTab === 'favorites' ? 'No Favorites Yet' : listTab === 'recent' ? 'No Recent Visits' : 'No Restaurants Found'}
                  </h4>
                  <p className="text-sm text-neutral-500 max-w-xs mb-4">
                    {listTab === 'favorites'
                      ? 'Tap the heart icon on any restaurant to save it here.'
                      : listTab === 'recent'
                        ? 'Restaurants you view will appear here.'
                        : 'Try increasing your search radius or changing filters.'
                    }
                  </p>
                  {listTab === 'all' && (
                    <div className="flex gap-2 flex-wrap justify-center">
                      {distanceFilter && distanceFilter < 10 && (
                        <button
                          onClick={() => setDistanceFilter(10)}
                          className="px-4 py-2 bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          Increase to 10 km
                        </button>
                      )}
                      <button
                        onClick={requestLocation}
                        className="px-4 py-2 bg-[var(--color-neutral-dark)] hover:bg-[var(--color-neutral-light)] rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={12} /> Refresh Location
                      </button>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Map + Detail */}
        <div className="w-full lg:w-1/2 flex flex-col gap-3 min-h-[400px] lg:min-h-0">

          {/* Google Map */}
          <div className={`relative rounded-2xl overflow-hidden border border-[var(--color-card-border)] ${mapFullscreen ? 'fixed inset-4 z-50' : 'h-[300px] lg:flex-1'} transition-all`}>
            {userLat && userLng ? (
              <iframe
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={getMapUrl()}
              />
            ) : (
              <div className="absolute inset-0 bg-[#141414] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={36} className="text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600">Loading map...</p>
                </div>
              </div>
            )}

            {/* Map Controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10">
              <button
                onClick={requestLocation}
                className="w-9 h-9 bg-[var(--color-card)]/90 backdrop-blur-md border border-[var(--color-card-border)] rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] transition cursor-pointer"
                title="Center on my location"
              >
                <Locate size={15} />
              </button>
            </div>

            {mapFullscreen && (
              <button
                onClick={() => setMapFullscreen(false)}
                className="absolute top-3 right-3 w-9 h-9 bg-[var(--color-card)]/90 backdrop-blur-md border border-[var(--color-card-border)] rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] transition z-10 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Restaurant Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedRestaurant && (
              <motion.div
                key={selectedRestaurant.restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="glass rounded-2xl overflow-hidden lg:flex-1 lg:min-h-0 lg:overflow-y-auto no-scrollbar"
              >
                {/* Detail Header */}
                <div className="p-5 border-b border-[var(--color-card-border)]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{selectedRestaurant.restaurant.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold">
                          {selectedRestaurant.restaurant.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-0.5 text-yellow-400 font-medium">
                          <Star size={12} fill="currentColor" /> {selectedRestaurant.restaurant.rating}
                        </span>
                        <span>({selectedRestaurant.restaurant.reviews} reviews)</span>
                        <span className="text-green-400">{selectedRestaurant.restaurant.priceLevel}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRestaurant(null)}
                      className="p-1.5 rounded-full hover:bg-[var(--color-neutral-dark)] transition cursor-pointer"
                    >
                      <X size={16} className="text-neutral-400" />
                    </button>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[var(--color-neutral-dark)] p-2.5 rounded-xl flex items-center gap-2">
                      <MapPin size={14} className="text-[var(--color-primary)] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-neutral-500">Distance</p>
                        <p className="text-xs font-bold">{selectedRestaurant.distance} km</p>
                      </div>
                    </div>
                    <div className="bg-[var(--color-neutral-dark)] p-2.5 rounded-xl flex items-center gap-2">
                      <Clock size={14} className="text-[var(--color-secondary)] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-neutral-500">Hours</p>
                        <p className="text-xs font-bold truncate">{selectedRestaurant.restaurant.hours}</p>
                      </div>
                    </div>
                    <div className="bg-[var(--color-neutral-dark)] p-2.5 rounded-xl flex items-center gap-2">
                      <Phone size={14} className="text-green-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-neutral-500">Contact</p>
                        <p className="text-xs font-bold truncate">{selectedRestaurant.restaurant.phone}</p>
                      </div>
                    </div>
                    <div className="bg-[var(--color-neutral-dark)] p-2.5 rounded-xl flex items-center gap-2">
                      <MapPin size={14} className="text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-neutral-500">Address</p>
                        <p className="text-xs font-bold truncate">{selectedRestaurant.restaurant.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Tags */}
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {selectedRestaurant.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium flex items-center gap-1">
                        <Shield size={8} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Menu Analysis */}
                {selectedRestaurant.recommendedDish && (
                  <div className="p-5 border-b border-[var(--color-card-border)]">
                    <h4 className="font-bold text-sm flex items-center gap-2 mb-3">
                      <Sparkles size={14} className="text-[var(--color-secondary)]" />
                      AI Menu Analysis
                    </h4>

                    <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/5 p-4 rounded-xl border border-[var(--color-primary)]/20 mb-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Utensils size={12} className="text-[var(--color-primary)]" />
                        <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">Recommended Meal</span>
                      </div>
                      <h5 className="font-bold text-white mb-1">{selectedRestaurant.recommendedDish.name}</h5>
                      <p className="text-xs text-neutral-300">{selectedRestaurant.recommendedDish.description}</p>
                    </div>

                    {/* Score Cards */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-[var(--color-neutral-dark)] p-3 rounded-xl text-center">
                        <div className="text-lg font-black text-[var(--color-primary)]">{selectedRestaurant.nutritionScore}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">Nutrition</div>
                      </div>
                      <div className="bg-[var(--color-neutral-dark)] p-3 rounded-xl text-center">
                        <div className="text-lg font-black text-blue-400">{selectedRestaurant.proteinScore}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">Protein</div>
                      </div>
                      <div className="bg-[var(--color-neutral-dark)] p-3 rounded-xl text-center">
                        <div className="text-lg font-black text-green-400">{selectedRestaurant.vitaminScore}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">Vitamin</div>
                      </div>
                    </div>

                    {/* Calorie + Macro Bar */}
                    <div className="bg-[var(--color-neutral-dark)] p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Flame size={14} className="text-orange-400 mx-auto mb-0.5" />
                          <p className="text-xs font-bold">{selectedRestaurant.recommendedDish.calories}</p>
                          <p className="text-[8px] text-neutral-500">CAL</p>
                        </div>
                        <div className="text-center">
                          <Target size={14} className="text-blue-400 mx-auto mb-0.5" />
                          <p className="text-xs font-bold">{selectedRestaurant.recommendedDish.protein}g</p>
                          <p className="text-[8px] text-neutral-500">PROTEIN</p>
                        </div>
                        <div className="text-center">
                          <Leaf size={14} className="text-green-400 mx-auto mb-0.5" />
                          <p className="text-xs font-bold">{selectedRestaurant.recommendedDish.fiber}g</p>
                          <p className="text-[8px] text-neutral-500">FIBER</p>
                        </div>
                        <div className="text-center">
                          <Zap size={14} className="text-red-400 mx-auto mb-0.5" />
                          <p className="text-xs font-bold">{selectedRestaurant.recommendedDish.iron}mg</p>
                          <p className="text-[8px] text-neutral-500">IRON</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Reason */}
                    <div className="mt-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 p-3 rounded-xl">
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        <span className="text-[var(--color-secondary)] font-bold">AI Insight: </span>
                        {selectedRestaurant.aiReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Menu Preview */}
                <div className="p-5 border-b border-[var(--color-card-border)]">
                  <h4 className="font-bold text-sm mb-3">Menu Preview</h4>
                  <div className="space-y-2">
                    {selectedRestaurant.restaurant.menu.map((item) => (
                      <div key={item.name} className="bg-[var(--color-neutral-dark)] p-3 rounded-xl flex items-center justify-between group">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 truncate">{item.description}</p>
                          <div className="flex gap-1 mt-1">
                            {item.tags.slice(0, 2).map((t) => (
                              <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-xs font-bold text-orange-400">{item.calories} cal</p>
                          <p className="text-[10px] text-neutral-500">{item.protein}g protein</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Directions Buttons */}
                <div className="p-5">
                  <h4 className="font-bold text-sm mb-3">🚗 Get Directions</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { mode: 'driving' as const, label: 'Drive', emoji: '🚗' },
                      { mode: 'walking' as const, label: 'Walk', emoji: '🚶' },
                      { mode: 'transit' as const, label: 'Transit', emoji: '🚌' },
                    ]).map(({ mode, label, emoji }) => (
                      <a
                        key={mode}
                        href={getDirectionsUrl(selectedRestaurant.restaurant, mode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[var(--color-neutral-dark)] hover:bg-[var(--color-primary)]/20 p-3 rounded-xl text-center transition group cursor-pointer"
                      >
                        <span className="text-lg block mb-1">{emoji}</span>
                        <span className="text-xs font-medium text-neutral-300 group-hover:text-[var(--color-primary)]">{label}</span>
                      </a>
                    ))}
                  </div>

                  {/* Save / Favorite Action */}
                  <button
                    onClick={() => toggleFavorite(selectedRestaurant.restaurant.id)}
                    className={`w-full mt-3 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                      favorites.includes(selectedRestaurant.restaurant.id)
                        ? "bg-red-500/15 text-red-400 border border-red-500/20"
                        : "bg-[var(--color-primary)] text-white shadow-glow hover:bg-[var(--color-primary-hover)]"
                    }`}
                  >
                    <Heart size={16} className={favorites.includes(selectedRestaurant.restaurant.id) ? "fill-red-400" : ""} />
                    {favorites.includes(selectedRestaurant.restaurant.id) ? "Saved to Favorites" : "Save to Favorites"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt to select when no detail is shown */}
          {!selectedRestaurant && (
            <div className="hidden lg:flex glass rounded-2xl flex-1 items-center justify-center flex-col text-center p-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-neutral-dark)] flex items-center justify-center mb-4">
                <Utensils size={22} className="text-neutral-500" />
              </div>
              <h4 className="font-bold text-neutral-400 mb-1">Select a Restaurant</h4>
              <p className="text-xs text-neutral-600 max-w-xs">Click on any restaurant card to view details, AI menu analysis, and directions.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
