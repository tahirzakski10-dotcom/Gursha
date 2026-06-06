"use client";

import Image from "next/image";
import Link from "next/link";

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-[var(--color-primary)]">
        Partnership Opportunities
      </h1>
      <p className="text-lg text-neutral-300 mb-8 text-center max-w-2xl">
        We are excited to collaborate with leading gyms across Ethiopia. Below are our current partners:
      </p>
      {/* Logos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="flex flex-col items-center">
          <Image
            src="/alpha_sport_logo.png"
            alt="Alpha Sport"
            width={150}
            height={150}
            className="rounded-xl shadow-glow"
          />
          <p className="mt-4 font-medium text-neutral-200">Alpha Sport – Tigray EDF, Addis Ababa</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/EDF.png" alt="EDF Gym" width={150} height={150} className="rounded-xl shadow-glow" />
          <p className="mt-4 font-medium text-neutral-200">EDF Gym – Addis Ababa</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/olympia.png" alt="Olympia Gym" width={150} height={150} className="rounded-xl shadow-glow" />
          <p className="mt-4 font-medium text-neutral-200">Olympia Gym – Oromia</p>
        </div>
      </div>
      <Link href="/dashboard" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 px-6 rounded-full shadow-glow transition">
        Back to Dashboard
      </Link>
    </div>
  );
}
