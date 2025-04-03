"use client";
import React from "react";
import { LinkPreview } from "../ui/link-preview";
import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-12 py-8 bg-background/80 backdrop-blur border-t border-border/40">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-4 md:mb-0">
          <span>Developed by </span>
          <LinkPreview
            url="https://medium.com/@ishaangupta1201"
            className="font-semibold hover:text-primary transition-colors duration-200 underline underline-offset-4"
          >
            Ishaan Gupta
          </LinkPreview>
          <span> © {new Date().getFullYear()}</span>
        </div>
        <div className="flex space-x-4 items-center">
          <span className="hidden sm:inline">Powered by PokeAPI</span>
          <Link
            href="https://github.com/ishaangupta-YB/pokedex-nextjs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5 hover:text-primary transition-colors duration-200" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
