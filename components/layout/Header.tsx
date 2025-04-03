"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import { ModeToggle } from "../ModeToggle";
import { Zap } from "lucide-react"; 
import { motion } from "framer-motion";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? "border-border/60 bg-background/95 backdrop-blur-md shadow-sm" 
          : "border-transparent bg-background/80 backdrop-blur-sm"
      } supports-[backdrop-filter]:bg-background/60`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative"
            >
              <Zap className="h-7 w-7 text-primary drop-shadow-md" />
              <motion.div 
                className="absolute inset-0 bg-primary/20 rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
            <span className="font-bold text-lg inline-block group-hover:text-primary transition-colors duration-300">Pokédex</span>
          </Link>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ModeToggle />
        </motion.div>
      </div>
    </motion.header>
  );
} 