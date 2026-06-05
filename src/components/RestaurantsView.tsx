"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Filter, ArrowRight, Utensils, Navigation } from "lucide-react";

const restaurants = [
  {
    id: 1,
    name: "Addis Ababa Restaurant",
    distance: "0.8 km",
    rating: 4.8,
    reviews: 342,
    price: "$$",
    tags: ["Healthy Options", "Vegan Friendly"],
    recommendation: "Shiro Wat & Gomen",
    matchReason: "Perfect match for your goal to increase fiber and plant-based protein."
  },
  {
    id: 2,
    name: "Habesha Lounge",
    distance: "1.2 km",
    rating: 4.5,
    reviews: 128,
    price: "$$$",
    tags: ["Premium Meat", "Traditional"],
    recommendation: "Lean Tibs with side salad",
    matchReason: "High protein meal ideal for your post-workout recovery."
  },
  {
    id: 3,
    name: "Lucy Ethiopian Cafe",
    distance: "2.5 km",
    rating: 4.9,
    reviews: 512,
    price: "$",
    tags: ["Budget Friendly", "Student Favorite"],
    recommendation: "Misir Wat (Lentils)",
    matchReason: "Fits perfectly into your student budget while hitting iron goals."
  },
  {
    id: 4,
    name: "Zeni's Kitchen",
    distance: "3.1 km",
    rating: 4.3,
    reviews: 89,
    price: "$$",
    tags: ["Gluten-Free Injera", "Family Owned"],
    recommendation: "Pure Teff Injera with Beyaynetu",
    matchReason: "100% Teff option supports your blood sugar management goals."
  }
];

export default function RestaurantsView() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Budget Friendly", "Healthy Options", "Vegan Friendly"];

  const filteredRestaurants = activeFilter === "All" 
    ? restaurants 
    : restaurants.filter(r => r.tags.includes(activeFilter) || (activeFilter === "Budget Friendly" && r.price === "$"));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Nearby Recommended Eats</h2>
        <p className="text-neutral-400">Discover local Ethiopian restaurants that match your AI nutrition goals.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Side: List and Filters */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === filter
                  ? "bg-[var(--color-primary)] text-white shadow-glow"
                  : "bg-[var(--color-neutral-dark)] text-neutral-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Recommended Alert */}
          <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 p-4 rounded-xl shrink-0">
            <h4 className="font-bold text-[var(--color-secondary)] mb-1 flex items-center gap-2">
              <Utensils size={16} /> AI Goal Context
            </h4>
            <p className="text-sm text-neutral-300">
              Because your goal is <span className="text-white font-bold">High Protein & Iron</span>, we've highlighted menu items like Tibs and Lentils at nearby spots.
            </p>
          </div>

          {/* Restaurant List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant.id} className="glass p-5 rounded-2xl group hover:border-[var(--color-primary)] transition cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{restaurant.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-400 mt-1">
                      <span className="flex items-center gap-1 text-yellow-400 font-medium">
                        <Star size={14} fill="currentColor" /> {restaurant.rating}
                      </span>
                      <span>({restaurant.reviews})</span>
                      <span>•</span>
                      <span className="text-green-400 font-medium">{restaurant.price}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={14}/> {restaurant.distance}</span>
                    </div>
                  </div>
                </div>

                {/* AI Menu Recommendation inside Card */}
                <div className="bg-[var(--color-neutral-dark)] p-3 rounded-xl mt-4 border border-[var(--color-card-border)]">
                  <div className="text-xs font-bold text-[var(--color-primary)] mb-1 uppercase tracking-wider">Recommended For You</div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{restaurant.recommendation}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{restaurant.matchReason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Mock Google Map */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto rounded-3xl overflow-hidden relative border border-[var(--color-card-border)] shrink-0">
          {/* Faux Map Background (Grid styling to look like a premium dark map UI) */}
          <div className="absolute inset-0 bg-[#141414] bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
          
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-6 z-0">
            <MapPin size={48} className="text-[var(--color-primary)] mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-neutral-500 mb-2">Interactive Map Area</h3>
            <p className="text-sm text-neutral-600 max-w-xs">In production, this area connects directly to the Google Maps SDK to display live routing and locations.</p>
          </div>

          {/* Map Pins (Mock) */}
          <div className="absolute top-[30%] left-[40%] text-[var(--color-primary)] flex flex-col items-center group cursor-pointer">
            <div className="bg-background px-3 py-1 rounded-full text-xs font-bold border border-[var(--color-primary)] mb-1 shadow-glow group-hover:scale-110 transition">Addis Ababa Rest.</div>
            <MapPin size={24} fill="currentColor" />
          </div>

          <div className="absolute top-[60%] left-[20%] text-neutral-400 flex flex-col items-center group cursor-pointer">
            <MapPin size={20} fill="currentColor" className="group-hover:text-[var(--color-secondary)] transition" />
          </div>

          <div className="absolute top-[45%] left-[70%] text-neutral-400 flex flex-col items-center group cursor-pointer">
            <MapPin size={20} fill="currentColor" className="group-hover:text-[var(--color-secondary)] transition" />
          </div>

          {/* Floating User Location Pin */}
          <div className="absolute top-[50%] left-[50%] w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10" />

          {/* Floating UI on map */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="w-10 h-10 bg-[var(--color-card)] backdrop-blur-md border border-[var(--color-card-border)] rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] transition">
              <Navigation size={18} />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
