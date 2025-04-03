"use client"; // Convert to Client Component

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from "next/image";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton"; // Import Skeleton
import { PokemonCard } from "@/components/PokemonCard"; // Import PokemonCard
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"; // Import Search Input
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

// Define the type for a single Pokémon fetched from our API
interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

// Define the structure of the API response
interface PokemonApiResponse {
  pokemon: Pokemon[];
  totalCount: number;
}

// List of Pokémon types for filtering
const pokemonTypes = [ "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy" ];

export default function Home() {
  // Store the raw fetched data separately
  const [allPokemonData, setAllPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>(""); // State for type filter

  // Pagination state - We'll paginate the *filtered* results client-side
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;  

  // Fetch ALL Pokémon data ONCE on initial load (Inefficient! Needs API update ideally)
  useEffect(() => {
    const fetchAllPokemon = async () => {
      console.log("Fetching initial Pokémon data...");
      setIsLoading(true);
      setError(null);
      try {
        // *** Fetch a large number - TEMPORARY - Replace with better API/pagination ***
        const largeLimit = 151; // Fetch first 151 for demo purposes
        const response = await fetch(`/api/pokemon?limit=${largeLimit}&offset=0`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
        }
        const data: PokemonApiResponse = await response.json();
        setAllPokemonData(data.pokemon);
        // setTotalCount(data.totalCount); // Total count from API isn't used for client-side pagination
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setAllPokemonData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPokemon();
  }, []); // Empty dependency array - fetch only once

  // Filter Pokémon based on search query AND selected type
  const filteredPokemon = useMemo(() => {
    let filtered = allPokemonData;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(p =>
        p.types.includes(selectedType.toLowerCase())
      );
    }

    return filtered;
  }, [allPokemonData, searchQuery, selectedType]);

  // Calculate paginated data from filtered results
  const paginatedData = useMemo(() => {
    const offset = (currentPage - 1) * limit;
    return filteredPokemon.slice(offset, offset + limit);
  }, [filteredPokemon, currentPage, limit]);

  // Calculate total pages based on filtered results
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPokemon.length / limit);
  }, [filteredPokemon, limit]);

  // Handler for the search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value === "all" ? "" : value); // Set to empty string if 'all' is selected
    setCurrentPage(1); // Reset page when filter changes
  };

  // No need for separate submit handler if search updates instantly
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optional: Could add focus management or other actions here
    console.log("Search submitted (instant filter applied):", searchQuery);
  };

  // Placeholder values for the input
  const placeholders = [
    "Search by name... e.g., Pikachu",
    "Try 'Charizard'",
    "Find 'Eevee'",
    "Who is 'Mewtwo'?",
    "Looking for 'Bulbasaur'?",
  ];

  // Handler for pagination change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
  };

  return (
    <div className="space-y-8"> {/* Add spacing between elements */}
      {/* Control Bar: Search and Filter */}
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

      {/* Grid for Pokemon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4"> {/* Add padding */}
        {isLoading &&
          Array.from({ length: limit }).map((_, index) => (
            <PokemonCardSkeleton key={`skeleton-${index}`} />
          ))}

        {!isLoading && !error && (
          <>
            {paginatedData.length > 0 ? (
              paginatedData.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10"> {/* Add padding */}
                {searchQuery ? `No Pokémon found matching "${searchQuery}".` : "No Pokémon found."}
              </p>
            )}
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center pt-4 pb-8"> {/* Added padding bottom */}
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
              
              {/* Basic Page Number Logic (Needs improvement for many pages) */}
              {[...Array(totalPages)].map((_, i) => {
                 const pageNum = i + 1;
                 // Simple logic: Show first, last, current, and adjacent pages
                 // More complex logic needed for large number of pages with ellipsis
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
                    // Show ellipsis if pages are skipped
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
