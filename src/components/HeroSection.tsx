"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Elevate Your Space with{" "}
            <span className="text-blue-600">Modern Frames</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg mb-8">
            Discover premium photo frames crafted to add elegance to every
            corner. Minimal design. Maximum impact.
          </p>

          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-lg">
              Shop Now
            </Button>
          </Link>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md bg-white">
            <Image
              src="/hero-frame-minimal.jpg"
              alt="Modern photo frame display"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -z-10 top-8 -right-8 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-60" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
