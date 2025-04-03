"use client";
import React from "react";
import { LinkPreview } from "../ui/link-preview";
import { Github, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="w-full mt-12 py-10 bg-background/80 backdrop-blur-md border-t border-border/40"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <motion.div 
            className="flex flex-col items-center md:items-start space-y-2"
            variants={itemVariants}
          >
            <Link href="/" className="flex items-center space-x-2 mb-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Zap className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="font-bold group-hover:text-primary transition-colors duration-300">Pokédex</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your interactive guide to the world of Pokémon
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center space-y-2"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">Developed by </span>
              <LinkPreview
                url="https://medium.com/@ishaangupta1201"
                className="text-sm font-semibold hover:text-primary transition-colors duration-200 underline underline-offset-4"
              >
                Ishaan Gupta
              </LinkPreview>
            </div>
            <p className="text-sm text-muted-foreground">© {currentYear} All rights reserved</p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center md:items-end space-y-2"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  href="https://github.com/ishaangupta-YB/pokedex-nextjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  href="https://pokeapi.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PokeAPI Website"
                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Globe className="h-4 w-4" />
                  <span>PokeAPI</span>
                </Link>
              </motion.div>
            </div>
            {/* <p className="text-xs text-muted-foreground/70">Built with Next.js and TailwindCSS</p> */}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
