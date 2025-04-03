"use client"; // Convert to Client Component

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import { PokemonCardSkeleton } from "@/components/PokemonCardSkeleton"; // Import Skeleton
import { PokemonCard } from "@/components/PokemonCard"; // Import PokemonCard
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"; // Import Search Input
import debounce from 'lodash.debounce'; // Import debounce

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

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // No need for isSearching state anymore if handled cleanly

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20; // Define limit for skeleton count

  // Combined fetch function
  const fetchPokemon = useCallback(async (query: string, page: number) => {
    console.log(`Fetching page ${page} with query: "${query}"`); // Debug log
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      // *** IMPORTANT: API needs to handle search query server-side for efficiency ***
      // For now, we ignore the query param in the fetch URL and filter client-side.
      const fetchUrl = `/api/pokemon?limit=${limit}&offset=${offset}`;
      const response = await fetch(fetchUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
      }
      const data: PokemonApiResponse = await response.json();

      // Client-side filtering (less efficient for large datasets)
      const filteredData = query
        ? data.pokemon.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : data.pokemon;

      setPokemonData(filteredData);
      setTotalCount(data.totalCount); // Total count from API (may not match filtered results)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPokemonData([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [limit]); // Removed debouncedFetchPokemon from dependencies

  // Debounced version specifically for search input changes
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setCurrentPage(1); // Reset to page 1 for new search
      fetchPokemon(query, 1); // Fetch page 1 with the new query
    }, 500), // 500ms debounce
    [fetchPokemon] // Depend on the main fetch function
  );

  // Effect for initial load and pagination changes
  useEffect(() => {
    // Fetch initial data or data for new page
    fetchPokemon(searchQuery, currentPage);
  }, [currentPage, fetchPokemon]); // Only run when currentPage or fetchPokemon changes

  // Effect for cleaning up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handler for the search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query); // Trigger the debounced search fetch
  };

  // Handler for immediate search on submit (optional)
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debouncedSearch.cancel(); // Cancel any pending debounce
    setCurrentPage(1); // Reset to page 1
    fetchPokemon(searchQuery, 1); // Trigger immediate fetch
    console.log("Search submitted immediately:", searchQuery);
  };

  // Placeholder values for the input
  const placeholders = [
    "Search by name... e.g., Pikachu",
    "Try 'Charizard'",
    "Find 'Eevee'",
    "Who is 'Mewtwo'?",
    "Looking for 'Bulbasaur'?",
  ];

  return (
    <div>
      {/* Title removed as it's part of the SearchInput demo style, adjust as needed */}
      {/* <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">Explore the Pokédex</h1> */}

      <div className="mb-8 px-4"> {/* Add padding for search bar */}
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          // Pass the current searchQuery to the input if it supports a value prop (check component impl)
          // value={searchQuery} // Example: if the component accepts a value prop
        />
      </div>

      {error && (
        <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
          <p className="font-semibold">Error loading Pokémon!</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading &&
          Array.from({ length: limit }).map((_, index) => (
            <PokemonCardSkeleton key={`skeleton-${index}`} />
          ))}

        {!isLoading && !error && (
          <>
            {pokemonData.length > 0 ? (
              pokemonData.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                {searchQuery ? `No Pokémon found matching "${searchQuery}".` : "No Pokémon found."}
              </p>
            )}
          </>
        )}
      </div>

      {/* Pagination controls will be added here later */}
    </div>
  );
}
