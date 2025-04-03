"use client"; 

import { useState, useEffect, useCallback } from 'react';
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton"; 
import { PokemonCard } from "@/components/PokemonCard"; 
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"; 
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 
import { motion, AnimatePresence } from "framer-motion"; 

interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}
  
interface PokemonApiResponse {
  pokemon: Pokemon[];
  totalCount: number;
}

const pokemonTypes = [ "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy" ];

export default function Home() { 
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;  

  const fetchPokemon = useCallback(async (page: number, query: string, type: string) => {
    console.log(`Fetching page ${page}, query: "${query}", type: "${type}"...`);
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (query) params.set('search', query);
      if (type) params.set('type', type);
      
      const response = await fetch(`/api/pokemon?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
      }
      const data: PokemonApiResponse = await response.json();
      
      setPokemonData(data.pokemon);
      setTotalPages(Math.ceil(data.totalCount / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPokemonData([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPokemon(currentPage, searchQuery, selectedType);
  }, [currentPage, searchQuery, selectedType, fetchPokemon]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const placeholders = [
    "Search by name... e.g., Pikachu",
    "Try 'Charizard'",
    "Find 'Eevee'",
    "Who is 'Mewtwo'?",
    "Looking for 'Bulbasaur'?",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 px-4 items-center">
        <div className="flex-grow w-full sm:w-auto"><PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        /></div>
        
        <Select onValueChange={handleTypeChange} value={selectedType || "all"}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {pokemonTypes.map(type => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
          <p className="font-semibold">Error loading Pokémon!</p>
          <p>{error}</p>
        </div>
      )}

      <motion.div 
        key={currentPage}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading &&
          Array.from({ length: limit }).map((_, index) => (
            <PokemonCardSkeleton key={`skeleton-${index}`} />
          ))}

        {!isLoading && !error && (
          <AnimatePresence>
            {pokemonData.length > 0 ? (
              pokemonData.map((pokemon) => (
                <motion.div key={pokemon.id} variants={itemVariants}>
                  <PokemonCard pokemon={pokemon} />
                </motion.div>
              ))
            ) : (
              <motion.p 
                className="col-span-full text-center text-muted-foreground py-10" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {(searchQuery || selectedType) ? `No Pokémon found matching your criteria.` : `No Pokémon found.`}
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center pt-4 pb-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  className={currentPage === 1 ? "pointer-events-none text-muted-foreground opacity-50" : undefined}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                 const pageNum = i + 1;
                 if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                    return (
                       <PaginationItem key={pageNum}>
                         <PaginationLink
                           href="#"
                           onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                           isActive={currentPage === pageNum}
                         >
                           {pageNum}
                         </PaginationLink>
                       </PaginationItem>
                    );
                 } else if (Math.abs(pageNum - currentPage) === 2) {
                    return <PaginationItem key={`ellipsis-${pageNum}`}><PaginationEllipsis /></PaginationItem>;
                 } 
                 return null;
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  className={currentPage === totalPages ? "pointer-events-none text-muted-foreground opacity-50" : undefined}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
