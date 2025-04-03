"use client";
import React from "react";
import Link from "next/link"; 
import { ModeToggle } from "../ModeToggle";
import { Zap } from "lucide-react"; 

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">Pokédex</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
} 