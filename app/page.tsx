"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
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
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PokemonDetailView from "@/src/components/PokemonDetailView";

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

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function Home() {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);
  const limit = 20;

  const fetchPokemon = useCallback(
    async (page: number, query: string, type: string) => {
      console.log(
        `Fetching page ${page}, query: "${query}", type: "${type}"...`
      );
      setIsLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(offset),
        });
        if (query) params.set("search", query);
        if (type) params.set("type", type);

        const response = await fetch(`/api/pokemon?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
        }
        const data: PokemonApiResponse = await response.json();

        setPokemonData(data.pokemon);
        setTotalPages(Math.ceil(data.totalCount / limit));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setPokemonData([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchPokemon(currentPage, submittedQuery, selectedType);
  }, [currentPage, submittedQuery, selectedType, fetchPokemon]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    setCurrentPage(1);
    console.log("Search submitted:", searchQuery);
  };

  const handleTypeChange = (value: string) => {
    const newType = value === "all" ? "" : value;
    setSelectedType(newType);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenDetailView = (pokemonName: string) => {
    setSelectedPokemonName(pokemonName);
  };

  const handleCloseDetailView = () => {
    setSelectedPokemonName(null);
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
        staggerChildren: 0.08,
        duration: 0.4,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24, 
        mass: 0.5, 
        duration: 0.5 
      } 
    },
    exit: { 
      y: 20, 
      opacity: 0, 
      transition: { 
        duration: 0.3 
      }
    },
  };

  const pageTransitionVariant = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 }},
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 }}
  };

  return (
    <Dialog open={!!selectedPokemonName} onOpenChange={(open: boolean) => !open && handleCloseDetailView()}>
      <motion.div 
        className="space-y-8"
        initial="initial"
        animate="animate"
        variants={pageTransitionVariant}
      >
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 px-4 items-center justify-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex-grow w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
            />
          </div>

          <Select onValueChange={handleTypeChange} value={selectedType || "all"}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {pokemonTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold">Error loading Pokémon!</p>
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${submittedQuery}-${selectedType}`}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            {isLoading &&
              Array.from({ length: limit }).map((_, index) => (
                <motion.div 
                  key={`skeleton-${index}`}
                  variants={itemVariants}
                >
                  <PokemonCardSkeleton />
                </motion.div>
              ))}

            {!isLoading && !error && (
              <>
                {pokemonData.length > 0 ? (
                  pokemonData.map((pokemon) => (
                    <motion.div
                      key={pokemon.id}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        onClick={() => handleOpenDetailView(pokemon.name)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    className="col-span-full text-center text-muted-foreground py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {searchQuery || selectedType
                      ? `No Pokémon found matching your criteria.`
                      : `No Pokémon found.`}
                  </motion.p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && !error && totalPages > 1 && (
            <motion.div 
              className="flex justify-center pt-4 pb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none text-muted-foreground opacity-50"
                          : undefined
                      }
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (Math.abs(pageNum - currentPage) === 2) {
                      return (
                        <PaginationItem key={`ellipsis-${pageNum}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none text-muted-foreground opacity-50"
                          : undefined
                      }
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        {selectedPokemonName && (
          <DialogHeader className="sr-only">
            <DialogTitle className="capitalize">{selectedPokemonName} Details</DialogTitle>
          </DialogHeader>
        )}
        {selectedPokemonName && (
          <PokemonDetailView pokemonName={selectedPokemonName} />
        )}
      </DialogContent>
    </Dialog>
  );
}
