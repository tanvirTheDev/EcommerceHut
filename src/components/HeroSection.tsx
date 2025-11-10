"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Lamp,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Speaker,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const slides = [
  {
    id: "electronics",
    badge: "Cutting-edge Tech",
    title: "Next-gen Electronics",
    highlightLine: "Power your world with intelligent devices",
    description:
      "Stay ahead with noise-cancelling headphones, AI-powered home hubs, and ultra-bright displays that adapt to your lifestyle.",
    accent: "text-blue-600",
    gradient:
      "bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-blue-600/5 border border-blue-100",
    primaryCta: {
      label: "Shop Electronics",
      href: "/shop",
    },
    secondaryCta: {
      label: "View All Categories",
      href: "/categories",
    },
    features: [
      {
        label: "Smart Displays",
        value: "AuraView Home Hub",
        icon: MonitorSmartphone,
      },
      {
        label: "Wireless Audio",
        value: "Nimbus Noise Control",
        icon: Speaker,
      },
      {
        label: "Entertainment",
        value: "4K Ultra Vision TV",
        icon: Tv,
      },
    ],
  },
  {
    id: "home-decor",
    badge: "Curated Spaces",
    title: "Modern Home Decor",
    highlightLine: "Create an inviting sanctuary with statement pieces",
    description:
      "Layer textures, warm lighting, and artisan décor to transform every room into a calm, stylish retreat.",
    accent: "text-orange-500",
    gradient:
      "bg-gradient-to-br from-orange-400/15 via-orange-400/10 to-orange-500/5 border border-orange-100",
    primaryCta: {
      label: "Shop Home Decor",
      href: "/shop",
    },
    secondaryCta: {
      label: "Browse Collections",
      href: "/categories",
    },
    features: [
      {
        label: "Ambient Lighting",
        value: "Glowline Floor Lamps",
        icon: Lamp,
      },
      {
        label: "Accent Art",
        value: "Canvas Aura Sets",
        icon: Palette,
      },
      {
        label: "Luxe Finishes",
        value: "Velvet Cushion Trio",
        icon: Sparkles,
      },
    ],
  },
];

const AUTO_PLAY_DELAY = 6500;

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_DELAY);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-orange-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 w-56 h-56 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 text-blue-600 px-4 py-1 text-sm font-semibold">
                {activeSlide.badge}
              </span>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                {activeSlide.title}
              </h1>

              <p
                className={`text-lg md:text-xl font-medium ${activeSlide.accent}`}
              >
                {activeSlide.highlightLine}
              </p>

              <p className="text-gray-600 text-base md:text-lg">
                {activeSlide.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href={activeSlide.primaryCta.href}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base rounded-lg">
                    {activeSlide.primaryCta.label}
                  </Button>
                </Link>
                <Link href={activeSlide.secondaryCta.href}>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-3 text-base rounded-lg"
                  >
                    {activeSlide.secondaryCta.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls */}
          <div className="mt-8 flex items-center gap-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-2 rounded-full transition-all duration-300",
                  activeIndex === index
                    ? "w-12 bg-blue-600"
                    : "w-6 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`${slide.title} slide`}
              />
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`relative rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl ${activeSlide.gradient}`}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {activeSlide.features.map((feature) => (
                    <div
                      key={feature.label}
                      className="bg-white/80 backdrop-blur rounded-2xl border border-white/60 shadow-sm p-5 flex items-start gap-3"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                          {feature.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {feature.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 text-blue-700 px-6 py-5">
                  <p className="text-sm font-semibold mb-1">
                    Why customers love it
                  </p>
                  <p className="text-sm text-blue-800/90">
                    Crafted to balance design and performance, every bundle is
                    curated by our experts to match the latest lifestyle trends.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Hero;
