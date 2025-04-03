"use client";
import React from "react";
import { LinkPreview } from "../ui/link-preview";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  // Assuming LinkPreview is imported or will be added by the user
  // const LinkPreviewComponent = LinkPreview ? LinkPreview : ({ url, children, className }: { url: string, children: React.ReactNode, className?: string }) => <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;

  return (
    <footer className="w-full mt-12 py-8 bg-background/80 backdrop-blur border-t border-border/40">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="mb-4 md:mb-0">
          <span>Developed by </span>
          {/* Use LinkPreview directly. Add component to ui/link-preview.tsx */}
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
          {/* Optional: Add Social Links */}
           <Link href="https://github.com/Ishaan-09/pokedex" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
             <Github className="h-5 w-5 hover:text-primary transition-colors duration-200" />
           </Link>
           {/* Add other social links as needed */}
           {/* <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
             <Linkedin className="h-5 w-5 hover:text-primary transition-colors duration-200" />
           </Link>
           <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
             <Twitter className="h-5 w-5 hover:text-primary transition-colors duration-200" />
           </Link> */}
        </div>
      </div>
    </footer>
  );
}
