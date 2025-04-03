"use client";
import React from "react";
import Link from "next/link"; // Import Link for navigation
import { ModeToggle } from "../ModeToggle";
import { Zap } from "lucide-react"; // Using a different icon for branding

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Left side: Brand/Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">Pokédex</span>
        </Link>
        
        {/* Right side: Navigation/Actions (ModeToggle for now) */}
        <div className="flex items-center space-x-4">
          {/* Placeholder for future nav items if needed */}
          {/* <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
          </nav> */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
} 